import { afterEach, expect, test } from "bun:test";
import { mkdtemp, mkdir, rm, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { measureActivity, readTranscript } from "../skills/time-report/scripts/transcripts.ts";

const temporaryDirectories: string[] = [];
const scanner = new URL("../skills/time-report/scripts/scan-sessions.ts", import.meta.url).pathname;
const since = Date.parse("2026-10-01T00:00:00Z");
const until = Date.parse("2026-10-02T00:00:00Z");

afterEach(async () => {
  for (const directory of temporaryDirectories.splice(0)) {
    await rm(directory, { recursive: true, force: true });
  }
});

async function fixtureHome() {
  const directory = await mkdtemp(join(tmpdir(), "bstack-test-"));
  temporaryDirectories.push(directory);
  return directory;
}

async function writeTranscript(home: string, path: string, lines: readonly unknown[]) {
  const file = join(home, path);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, lines.map((line) => JSON.stringify(line)).join("\n"));
  return file;
}

async function runScanner(home: string, args: readonly string[] = []) {
  const child = Bun.spawn([process.execPath, scanner, "--home", home, ...args], {
    env: { ...process.env, TZ: "UTC" },
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  return { stdout, stderr, exitCode };
}

test("CLI reports Claude activity, tickets, and PRs without counting idle gaps", async () => {
  const home = await fixtureHome();
  const file = await writeTranscript(home, ".claude/projects/demo/session.jsonl", [
    { type: "user", timestamp: "2026-10-01T10:00:00Z", message: { content: "Fix APP-7" } },
    { type: "assistant", timestamp: "2026-10-01T10:05:00Z", message: { content: "Opened https://github.com/acme/demo/pull/12" } },
    { type: "user", timestamp: "2026-10-01T11:00:00Z", message: { content: "Continue" } },
    { type: "assistant", timestamp: "2026-10-01T11:02:00Z", message: { content: "Done" } },
  ]);
  const result = await runScanner(home, ["--since", "2026-10-01", "--until", "2026-10-02"]);
  expect(result.exitCode).toBe(0);
  expect(result.stderr).toBe("");
  expect(JSON.parse(result.stdout)).toEqual({
    source: "claude",
    project: "demo",
    file,
    start: "2026-10-01T10:00:00.000Z",
    end: "2026-10-01T11:02:00.000Z",
    active_seconds: 420,
    first_prompt: "Fix APP-7",
    tickets: { "APP-7": "2026-10-01T10:00:00.000Z" },
    pull_requests: ["github.com/acme/demo/pull/12"],
  });
});

test("CLI reads nested Cursor transcripts using message timestamps and modification time", async () => {
  const home = await fixtureHome();
  const file = await writeTranscript(home, ".cursor/projects/demo/agent-transcripts/session/thread.jsonl", [
    { role: "user", message: { content: "<timestamp>Thursday, Oct 1, 2026, 10:00 AM (UTC+2)</timestamp>\nFix APP-12" } },
    { role: "user", message: { content: "<timestamp>Thursday, Oct 1, 2026, 10:05 AM (UTC+2)</timestamp>\nContinue" } },
  ]);
  const modified = new Date("2026-10-01T08:06:00Z");
  await utimes(file, modified, modified);
  const result = await runScanner(home, ["--since", "2026-10-01", "--until", "2026-10-02"]);
  expect(result.exitCode).toBe(0);
  expect(result.stderr).toBe("");
  expect(JSON.parse(result.stdout)).toEqual({
    source: "cursor",
    project: "demo",
    file,
    start: "2026-10-01T08:00:00.000Z",
    end: "2026-10-01T08:06:00.000Z",
    active_seconds: 360,
    first_prompt: "Fix APP-12",
    tickets: { "APP-12": "2026-10-01T08:00:00.000Z" },
    pull_requests: [],
  });
});

test("malformed lines and injected context do not become ticket attribution", () => {
  const text = [
    "{broken",
    "null",
    JSON.stringify({ type: "user", timestamp: "2026-10-01T10:00:00Z", message: { content: [
      { type: "tool_result", content: "NOISE-99" },
      { type: "text", text: "<system-reminder>HIDDEN-22</system-reminder>Fix APP-1" },
    ] } }),
  ].join("\n");
  const transcript = readTranscript({ text, source: "claude", modifiedAt: 0 });
  expect(transcript.firstPrompt).toBe("Fix APP-1");
  expect(transcript.tickets).toEqual({ "APP-1": "2026-10-01T10:00:00.000Z" });
});

test("activity excludes the end boundary and gaps of exactly fifteen minutes", () => {
  const result = measureActivity({
    timestamps: [since - 60_000, since, since + 60_000, since + 960_000, until, until + 60_000],
    since,
    until,
    gapMinutes: 15,
  });
  expect(result).toEqual({ start: "2026-10-01T00:00:00.000Z", end: "2026-10-01T00:16:00.000Z", active_seconds: 60 });
});

test("activity shorter than one minute produces no report", () => {
  expect(measureActivity({ timestamps: [since, since + 59_000], since, until, gapMinutes: 15 })).toBeNull();
});

test("an empty transcript directory produces no output", async () => {
  const result = await runScanner(await fixtureHome(), ["--since", "2026-10-01", "--until", "2026-10-02"]);
  expect(result).toEqual({ exitCode: 0, stdout: "", stderr: "" });
});

for (const args of [
  ["--since", "2026-02-30"],
  ["--since", "2026-10-02", "--until", "2026-10-01"],
  ["--gap-minutes", "0"],
  ["--gap-minutes", "nope"],
  ["--unknown"],
]) {
  test(`CLI rejects invalid arguments: ${args.join(" ")}`, async () => {
    const result = await runScanner(await fixtureHome(), args);
    expect(result.exitCode).toBe(1);
    expect(result.stdout).toBe("");
    expect(result.stderr.length).toBeGreaterThan(0);
  });
}

for (const directory of ["sessions/2026/10/01", "archived_sessions"]) {
  test(`CLI reads Codex ${directory} without attributing injected context or tool output`, async () => {
    const home = await fixtureHome();
    const file = await writeTranscript(home, `.codex/${directory}/rollout.jsonl`, [
      { type: "session_meta", timestamp: "2026-10-01T09:00:00Z", payload: { cwd: "/work/demo" } },
      { type: "response_item", timestamp: "2026-10-01T09:01:00Z", payload: { type: "message", role: "developer", content: [{ type: "input_text", text: "HIDDEN-1" }] } },
      { type: "response_item", timestamp: "2026-10-01T09:02:00Z", payload: { type: "message", role: "user", content: [{ type: "input_text", text: "# AGENTS.md instructions\nHIDDEN-2" }] } },
      { type: "response_item", timestamp: "2026-10-01T10:00:00Z", payload: { type: "message", role: "user", content: [{ type: "input_text", text: "Fix APP-7" }] } },
      { type: "event_msg", timestamp: "2026-10-01T10:01:00Z", payload: { type: "user_message", message: "Fix APP-7" } },
      { type: "response_item", timestamp: "2026-10-01T10:02:00Z", payload: { type: "function_call", arguments: '{"command":"git show APP-8"}' } },
      { type: "response_item", timestamp: "2026-10-01T10:03:00Z", payload: { type: "custom_tool_call", input: "git show APP-9" } },
      { type: "response_item", timestamp: "2026-10-01T10:04:00Z", payload: { type: "function_call_output", output: "NOISE-99" } },
      { type: "response_item", timestamp: "2026-10-01T10:05:00Z", payload: { type: "message", role: "assistant", content: [{ type: "output_text", text: "Opened https://github.com/acme/demo/pull/12" }] } },
      { type: "event_msg", timestamp: "2026-10-01T10:14:00Z", payload: { type: "token_count" } },
    ]);
    const result = await runScanner(home, ["--since", "2026-10-01", "--until", "2026-10-02"]);
    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(JSON.parse(result.stdout)).toEqual({
      source: "codex", project: "/work/demo", file,
      start: "2026-10-01T10:00:00.000Z", end: "2026-10-01T10:05:00.000Z", active_seconds: 300,
      first_prompt: "Fix APP-7",
      tickets: { "APP-7": "2026-10-01T10:00:00.000Z", "APP-8": "2026-10-01T10:02:00.000Z", "APP-9": "2026-10-01T10:03:00.000Z" },
      pull_requests: ["github.com/acme/demo/pull/12"],
    });
  });
}

test("CLI reads Pi messages and tool calls without attributing summaries or tool output", async () => {
  const home = await fixtureHome();
  const file = await writeTranscript(home, ".pi/agent/sessions/--work-demo--/session.jsonl", [
    { type: "session", version: 3, timestamp: "2026-10-01T09:00:00Z", cwd: "/work/demo" },
    { type: "message", timestamp: "2026-10-01T09:01:00Z", message: { role: "system", content: "HIDDEN-1" } },
    { type: "message", timestamp: "2026-10-01T10:00:00Z", message: { role: "user", content: "Fix APP-7" } },
    { type: "message", timestamp: "2026-10-01T10:02:00Z", message: { role: "assistant", content: [{ type: "toolCall", name: "bash", arguments: { command: "git show APP-8" } }] } },
    { type: "message", timestamp: "2026-10-01T10:03:00Z", message: { role: "toolResult", content: [{ type: "text", text: "NOISE-99" }] } },
    { type: "message", timestamp: "2026-10-01T10:05:00Z", message: { role: "assistant", content: [{ type: "text", text: "Opened https://github.com/acme/demo/pull/12" }] } },
    { type: "compaction", timestamp: "2026-10-01T10:14:00Z", summary: "NOISE-88" },
  ]);
  const result = await runScanner(home, ["--since", "2026-10-01", "--until", "2026-10-02"]);
  expect(result.exitCode).toBe(0);
  expect(result.stderr).toBe("");
  expect(JSON.parse(result.stdout)).toEqual({
    source: "pi", project: "/work/demo", file,
    start: "2026-10-01T10:00:00.000Z", end: "2026-10-01T10:05:00.000Z", active_seconds: 300,
    first_prompt: "Fix APP-7",
    tickets: { "APP-7": "2026-10-01T10:00:00.000Z", "APP-8": "2026-10-01T10:02:00.000Z" },
    pull_requests: ["github.com/acme/demo/pull/12"],
  });
});
