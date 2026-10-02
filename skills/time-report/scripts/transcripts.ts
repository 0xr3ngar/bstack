import type { z } from "zod";
import { claudeSchema, contentSchema, codexSchema, cursorSchema, piSchema, textBlockSchema } from "./schemas.ts";

export type TranscriptSource = "claude" | "cursor" | "codex" | "pi";

type Entry = Readonly<{ project: string }> | Readonly<{
  role: "user" | "assistant" | "other";
  timestamp: number | null;
  text: string;
  searchableText: string;
}>;

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
}>): Exclude<Entry, { project: string }> {
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

export function readTranscript(options: Readonly<{
  text: string;
  source: TranscriptSource;
  modifiedAt: number;
}>) {
  const parse = transcriptParser(options.source);
  const timestamps: number[] = [];
  const tickets = new Map<string, string>();
  const pullRequests = new Set<string>();
  let firstPrompt = "";
  let project: string | null = null;
  let lastTimestamp: number | null = null;
  let latestTimestamp: number | null = null;

  for (const line of options.text.split(/\r?\n/)) {
    let record: unknown;
    try {
      record = JSON.parse(line);
    } catch {
      continue;
    }
    const entry = parse(record);
    if (!entry) {
      continue;
    }
    if ("project" in entry) {
      project ??= entry.project;
      continue;
    }
    if (entry.timestamp !== null) {
      timestamps.push(entry.timestamp);
      lastTimestamp = entry.timestamp;
      latestTimestamp = Math.max(latestTimestamp ?? entry.timestamp, entry.timestamp);
    }
    if (entry.role === "user" && !firstPrompt) {
      const prompt = entry.text.replace(/<timestamp>[^<]*<\/timestamp>\s*/g, "").trim();
      if (!prompt.startsWith("<")) {
        firstPrompt = prompt;
      }
    }
    if (lastTimestamp !== null) {
      for (const match of entry.searchableText.matchAll(/\b[A-Z][A-Z0-9]+-\d+\b/g)) {
        if (!tickets.has(match[0])) {
          tickets.set(match[0], new Date(lastTimestamp).toISOString());
        }
      }
    }
    for (const match of entry.searchableText.matchAll(/github\.com\/[\w.-]+\/[\w.-]+\/pull\/\d+/g)) {
      pullRequests.add(match[0]);
    }
  }

  if (options.source === "cursor" && latestTimestamp !== null && options.modifiedAt >= latestTimestamp) {
    timestamps.push(options.modifiedAt);
  }
  return { project, timestamps, firstPrompt, tickets: Object.fromEntries(tickets), pullRequests: [...pullRequests].sort() };
}

export function measureActivity(options: Readonly<{
  timestamps: readonly number[];
  since: number;
  until: number;
  gapMinutes: number;
}>) {
  const timestamps: number[] = [];
  for (const timestamp of options.timestamps) {
    if (timestamp >= options.since && timestamp < options.until) {
      timestamps.push(timestamp);
    }
  }
  timestamps.sort((a, b) => a - b);

  let milliseconds = 0;
  let previous: number | undefined;
  for (const timestamp of timestamps) {
    if (previous !== undefined) {
      const gap = timestamp - previous;
      if (gap < options.gapMinutes * 60_000) {
        milliseconds += gap;
      }
    }
    previous = timestamp;
  }

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
