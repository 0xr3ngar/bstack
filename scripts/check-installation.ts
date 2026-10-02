import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const cli = join(root, "node_modules/skills/bin/cli.mjs");
const skills = await readdir(join(root, "skills"));

async function run(command: readonly string[], cwd: string) {
  const child = Bun.spawn([...command], {
    cwd,
    env: { ...process.env, DISABLE_TELEMETRY: "1", DO_NOT_TRACK: "1" },
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, status] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]);
  assert.equal(status, 0, `${command.join(" ")}\n${stdout}\n${stderr}`);
  return stdout;
}

for (const agent of ["codex", "cursor", "claude-code"]) {
  const project = await mkdtemp(join(tmpdir(), "bstack-install-"));
  try {
    await run([process.execPath, cli, "add", root, "--skill", "*", "--agent", agent, "--copy", "--yes"], project);
    const container = agent === "claude-code" ? ".claude/skills" : ".agents/skills";
    for (const skill of skills) {
      const source = join(root, "skills", skill);
      for await (const relative of new Bun.Glob("**/*").scan({ cwd: source, onlyFiles: true })) {
        const installed = await readFile(join(project, container, skill, relative));
        assert.deepEqual(installed, await readFile(join(source, relative)));
      }
    }
    const scanner = join(project, container, "time-report/scripts/scan-sessions.ts");
    const output = await run([process.execPath, scanner, "--home", project], project);
    assert.equal(output, "");
    process.stdout.write(`Installed all skills for ${agent}; supporting files match and the scanner runs.\n`);
  } finally {
    await rm(project, { recursive: true, force: true });
  }
}

const project = await mkdtemp(join(tmpdir(), "bstack-single-install-"));
try {
  await run([process.execPath, cli, "add", root, "--skill", "unslop", "--agent", "codex", "--copy", "--yes"], project);
  assert.deepEqual(await readdir(join(project, ".agents/skills")), ["unslop"]);
  await run([process.execPath, cli, "remove", "unslop", "--yes"], project);
  assert.equal(await Bun.file(join(project, ".agents/skills/unslop/SKILL.md")).exists(), false);
  process.stdout.write("Single-skill installation and removal passed.\n");
} finally {
  await rm(project, { recursive: true, force: true });
}
