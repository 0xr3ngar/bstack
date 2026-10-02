#!/usr/bin/env bun
import { readFile, stat } from "node:fs/promises";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { measureActivity, readTranscript } from "./transcripts.ts";
import type { TranscriptSource } from "./transcripts.ts";

function dateText(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function localMidnight(value: string): number {
  const date = new Date(`${value}T00:00:00`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(date.getTime()) || dateText(date) !== value) {
    throw new Error(`Invalid date: ${value}. Use YYYY-MM-DD with a valid calendar date.`);
  }
  return date.getTime();
}

async function main() {
  const { values } = parseArgs({
    args: process.argv.slice(2),
    options: {
      since: { type: "string" },
      until: { type: "string" },
      "gap-minutes": { type: "string", default: "15" },
      home: { type: "string", default: homedir() },
      help: { type: "boolean", short: "h" },
    },
  });
  if (values.help) {
    process.stdout.write([
      "Usage: bun scan-sessions.ts [--since YYYY-MM-DD] [--until YYYY-MM-DD] [--gap-minutes 15] [--home PATH]",
      "Dates use local midnight. --until is exclusive. The default range is yesterday.",
      "Output is one JSON object per conversation with at least one minute of estimated activity.",
      "",
    ].join("\n"));
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const since = localMidnight(values.since ?? dateText(yesterday));
  const until = localMidnight(values.until ?? dateText(today));
  const gapMinutes = Number(values["gap-minutes"]);
  if (until <= since) {
    throw new Error("--until must be later than --since.");
  }
  if (!Number.isFinite(gapMinutes) || gapMinutes <= 0) {
    throw new Error("--gap-minutes must be a positive number.");
  }

  const root = resolve(values.home);
  const sources: ReadonlyArray<Readonly<{ source: TranscriptSource; pattern: string }>> = [
    { source: "claude", pattern: ".claude/projects/*/*.jsonl" },
    { source: "codex", pattern: ".codex/sessions/**/*.jsonl" },
    { source: "codex", pattern: ".codex/archived_sessions/**/*.jsonl" },
    { source: "pi", pattern: ".pi/agent/sessions/**/*.jsonl" },
    { source: "cursor", pattern: ".cursor/projects/*/agent-transcripts/**/*.jsonl" },
  ];
  for (const { source, pattern } of sources) {
    const files = await Array.fromAsync(new Bun.Glob(pattern).scan({ cwd: root, dot: true }));
    for (const relative of files.sort()) {
      if (source === "claude" && relative.includes("claude-title")) {
        continue;
      }
      const file = join(root, relative);
      const text = await readFile(file, "utf8");
      const modifiedAt = (await stat(file)).mtimeMs;
      const transcript = readTranscript({ text, source, modifiedAt });
      const activity = measureActivity({ timestamps: transcript.timestamps, since, until, gapMinutes });
      if (!activity) {
        continue;
      }
      process.stdout.write(`${JSON.stringify({
        source,
        project: transcript.project ?? relative.split(/[\\/]/)[2],
        file,
        ...activity,
        first_prompt: transcript.firstPrompt.slice(0, 200).replace(/\r?\n/g, " "),
        tickets: transcript.tickets,
        pull_requests: transcript.pullRequests,
      })}\n`);
    }
  }
}

try {
  await main();
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
