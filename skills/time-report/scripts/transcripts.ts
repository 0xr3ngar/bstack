export type TranscriptSource = "claude" | "cursor";

type Entry = Readonly<{
  role: "user" | "assistant" | "other";
  timestamp: number | null;
  text: string;
  searchableText: string;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(content: unknown): string {
  if (typeof content === "string") {
    return content;
  }
  if (!Array.isArray(content)) {
    return "";
  }

  const parts: string[] = [];
  for (const part of content) {
    if (isRecord(part) && part.type === "text" && typeof part.text === "string") {
      parts.push(part.text);
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

function parseEntry(line: string, source: TranscriptSource): Entry | null {
  let record: unknown;
  try {
    record = JSON.parse(line);
  } catch {
    return null;
  }
  if (!isRecord(record)) {
    return null;
  }

  const role = source === "claude" ? record.type : record.role;
  const content: unknown = isRecord(record.message) ? record.message.content : record.content;
  const text = readText(content).replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "");
  const stamp = typeof record.timestamp === "string" ? Date.parse(record.timestamp) : NaN;
  let timestamp = Number.isFinite(stamp) ? stamp : null;

  if (source === "cursor" && role === "user") {
    timestamp = cursorTimestamp(text) ?? timestamp;
  }
  if (role === "user") {
    return { role, timestamp, text, searchableText: text };
  }
  if (role === "assistant") {
    return { role, timestamp, text, searchableText: JSON.stringify(content) ?? "" };
  }
  return { role: "other", timestamp, text: "", searchableText: "" };
}

export function readTranscript(options: Readonly<{
  text: string;
  source: TranscriptSource;
  modifiedAt: number;
}>) {
  const timestamps: number[] = [];
  const tickets = new Map<string, string>();
  const pullRequests = new Set<string>();
  let firstPrompt = "";
  let lastTimestamp: number | null = null;
  let latestTimestamp: number | null = null;

  for (const line of options.text.split(/\r?\n/)) {
    const entry = parseEntry(line, options.source);
    if (!entry) {
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
  return { timestamps, firstPrompt, tickets: Object.fromEntries(tickets), pullRequests: [...pullRequests].sort() };
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
