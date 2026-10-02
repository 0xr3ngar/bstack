import { afterEach, expect, test } from "bun:test";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { validateSkills } from "../scripts/validate-skills.ts";

const directories: string[] = [];

afterEach(async () => {
  for (const directory of directories.splice(0)) {
    await rm(directory, { recursive: true, force: true });
  }
});

async function fixture(body = "# Example\n", extra = "") {
  const root = await mkdtemp(join(tmpdir(), "bstack-validation-"));
  directories.push(root);
  await mkdir(join(root, "skills/example"), { recursive: true });
  await writeFile(join(root, "readme.md"), "[example](skills/example/SKILL.md)\n");
  await writeFile(join(root, "skills/example/SKILL.md"), `---\nname: example\ndescription: Explain an example when asked.\nlicense: MIT\ncompatibility: No external tools required.\n${extra}---\n${body}`);
  return root;
}

test("valid standalone skill passes validation", async () => {
  expect(await validateSkills(await fixture())).toEqual([]);
});

test("missing support files fail validation", async () => {
  expect(await validateSkills(await fixture("Run [the script](scripts/missing.ts).\n"))).toEqual([
    "skills/example/SKILL.md: Missing linked file scripts/missing.ts.",
  ]);
});

test("manual-only skills must use the same Codex invocation policy", async () => {
  const root = await fixture("# Example\n", "disable-model-invocation: true\n");
  await mkdir(join(root, "skills/example/agents"));
  await writeFile(join(root, "skills/example/agents/openai.yaml"), "policy:\n  allow_implicit_invocation: true\n");
  expect(await validateSkills(root)).toEqual([
    "skills/example/SKILL.md: Manual skills need policy.allow_implicit_invocation: false in agents/openai.yaml.",
  ]);
});

test("README omissions fail validation", async () => {
  const root = await fixture();
  await writeFile(join(root, "readme.md"), "# Skills\n");
  expect(await validateSkills(root)).toEqual(["skills/example/SKILL.md: Add this skill to the README catalog."]);
});
