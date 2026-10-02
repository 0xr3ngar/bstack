import type { z } from "zod";
import { claudeSchema, contentSchema, codexSchema, cursorSchema, piSchema, textBlockSchema } from "./schemas.ts";

export type TranscriptSource = "claude" | "cursor" | "codex" | "pi";

type Message = Readonly<{
  role: "user" | "assistant" | "other";
  timestamp: number | null;
  text: string;
  searchableText: string;
}>;

type Entry = Readonly<{ project: string }> | Message;

function readText(content: z.infer<typeof contentSchema> | undefined): string {
  if (typeof content === "string") {
    return content;
  }
  const parts: string[] = [];
  for (const block of content ?? []) {
    const result = textBlockSchema.safeParse(block);
    if (result.success) {
      parts.push(result.data.text);
    }
  }
  return parts.join("\n");
}

function cursorTimestamp(text: string): number | null {
  const stamp = /<timestamp>([^<]+)<\/timestamp>/.exec(text)?.[1];
  if (!stamp) {
    return null;
  }

  const normalized = stamp.replace(/\(UTC([+-]\d{1,2})(?::(\d{2}))?\)/, (_, hours: string, minutes: string | undefined) => {
    const sign = hours.startsWith("-") ? "-" : "+";
    const offsetHours = String(Math.abs(Number(hours))).padStart(2, "0");
    return `GMT${sign}${offsetHours}${minutes ?? "00"}`;
  });
  const timestamp = Date.parse(normalized);
  return Number.isFinite(timestamp) ? timestamp : null;
}

function messageEntry(options: Readonly<{
  role: string;
  timestamp: string | undefined;
  content: z.infer<typeof contentSchema> | undefined;
}>): Message {
  const text = readText(options.content).replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "");
  const stamp = Date.parse(options.timestamp ?? "");
  const timestamp = Number.isFinite(stamp) ? stamp : null;
  if (options.role === "user") {
    return { role: "user", timestamp, text, searchableText: text };
  }
  if (options.role === "assistant") {
    return { role: "assistant", timestamp, text, searchableText: JSON.stringify(options.content) ?? "" };
  }
  return { role: "other", timestamp, text: "", searchableText: "" };
}

function parseClaude(record: unknown): Entry | null {
  const result = claudeSchema.safeParse(record);
  if (!result.success) {
    return null;
  }
  const { type, timestamp, message, content } = result.data;
  return messageEntry({ role: type, timestamp, content: message?.content ?? content });
}

function parseCursor(record: unknown): Entry | null {
  const result = cursorSchema.safeParse(record);
  if (!result.success) {
    return null;
  }
  const { role, timestamp, message, content } = result.data;
  const entry = messageEntry({ role, timestamp, content: message?.content ?? content });
  if (role === "user") {
    const query = /<user_query>([\s\S]*?)<\/user_query>/.exec(entry.text)?.[1];
    return {
      ...entry,
      text: query?.trim() ?? entry.text,
      searchableText: query ?? entry.searchableText,
      timestamp: cursorTimestamp(entry.text) ?? entry.timestamp,
    };
  }
  return entry;
}

function parsePi(record: unknown): Entry | null {
  const result = piSchema.safeParse(record);
  if (!result.success) {
    return null;
  }
  const entry = result.data;
  if (entry.type === "session") {
    return { project: entry.cwd };
  }
  return messageEntry({ ...entry.message, timestamp: entry.timestamp });
}

function parseCodex(record: unknown): Entry | null {
  const result = codexSchema.safeParse(record);
  if (!result.success) {
    return null;
  }
  const entry = result.data;
  if (entry.type === "session_meta") {
    return { project: entry.payload.cwd };
  }
  const { payload, timestamp } = entry;
  switch (payload.type) {
    case "message":
      if (payload.role === "user" && /^(?:<|# AGENTS\.md)/.test(readText(payload.content).trim())) {
        return null;
      }
      return messageEntry({ ...payload, timestamp });
    case "function_call":
      return messageEntry({ role: "assistant", content: payload.arguments, timestamp });
    case "custom_tool_call":
      return messageEntry({ role: "assistant", content: payload.input, timestamp });
    case "function_call_output":
    case "custom_tool_call_output":
      return messageEntry({ role: "other", content: undefined, timestamp });
  }
}

function transcriptParser(source: TranscriptSource): (record: unknown) => Entry | null {
  switch (source) {
    case "claude":
      return parseClaude;
    case "cursor":
      return parseCursor;
    case "codex":
      return parseCodex;
    case "pi":
      return parsePi;
  }
}

function parseJson(line: string): unknown {
  try {
    return JSON.parse(line);
  } catch {
    return null;
  }
}

function firstPrompt(messages: readonly Message[]): string {
  for (const message of messages) {
    if (message.role !== "user") {
      continue;
    }
    const prompt = message.text.replace(/<timestamp>[^<]*<\/timestamp>\s*/g, "").trim();
    if (prompt && !prompt.startsWith("<")) {
      return prompt;
    }
  }
  return "";
}

function conversationTimestamps(options: Readonly<{
  messages: readonly Message[];
  source: TranscriptSource;
  modifiedAt: number;
}>): number[] {
  const timestamps = options.messages.map((message) => message.timestamp).filter((stamp) => stamp !== null);
  const latest = timestamps.reduce((maximum, stamp) => Math.max(maximum, stamp), -Infinity);
  if (options.source === "cursor" && timestamps.length > 0 && options.modifiedAt >= latest) {
    return [...timestamps, options.modifiedAt];
  }
  return timestamps;
}

function conversationTickets(messages: readonly Message[]): Record<string, string> {
  const tickets = new Map<string, string>();
  messages.reduce<number | null>((previousTimestamp, message) => {
    const timestamp = message.timestamp ?? previousTimestamp;
    if (timestamp === null) {
      return null;
    }
    for (const match of message.searchableText.matchAll(/\b[A-Z][A-Z0-9]+-\d+\b/g)) {
      if (!tickets.has(match[0])) {
        tickets.set(match[0], new Date(timestamp).toISOString());
      }
    }
    return timestamp;
  }, null);
  return Object.fromEntries(tickets);
}

function conversationPullRequests(messages: readonly Message[]): string[] {
  const links = messages.flatMap((message) =>
    Array.from(message.searchableText.matchAll(/github\.com\/[\w.-]+\/[\w.-]+\/pull\/\d+/g), (match) => match[0]),
  );
  return [...new Set(links)].sort();
}

export function readTranscript(options: Readonly<{
  text: string;
  source: TranscriptSource;
  modifiedAt: number;
}>) {
  const parse = transcriptParser(options.source);
  const entries = options.text.split(/\r?\n/).map((line) => parse(parseJson(line))).filter((entry) => entry !== null);
  const messages = entries.filter((entry) => "role" in entry);
  return {
    project: entries.find((entry) => "project" in entry)?.project ?? null,
    timestamps: conversationTimestamps({ messages, source: options.source, modifiedAt: options.modifiedAt }),
    firstPrompt: firstPrompt(messages),
    tickets: conversationTickets(messages),
    pullRequests: conversationPullRequests(messages),
  };
}

export function measureActivity(options: Readonly<{
  timestamps: readonly number[];
  since: number;
  until: number;
  gapMinutes: number;
}>) {
  const timestamps = options.timestamps
    .filter((timestamp) => timestamp >= options.since && timestamp < options.until)
    .toSorted((a, b) => a - b);
  const milliseconds = timestamps.reduce((total, timestamp, index) => {
    const previous = timestamps[index - 1];
    if (previous === undefined) {
      return total;
    }
    const gap = timestamp - previous;
    return gap < options.gapMinutes * 60_000 ? total + gap : total;
  }, 0);

  const start = timestamps.at(0);
  const end = timestamps.at(-1);
  if (milliseconds < 60_000 || start === undefined || end === undefined) {
    return null;
  }
  return {
    start: new Date(start).toISOString(),
    end: new Date(end).toISOString(),
    active_seconds: Math.round(milliseconds / 1000),
  };
}
