import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function validateSkills(root: string): Promise<string[]> {
  const errors: string[] = [];
  const readme = await readFile(join(root, "readme.md"), "utf8");
  const names = new Set<string>();
  const folders = await readdir(join(root, "skills"), { withFileTypes: true });

  for (const folder of folders) {
    if (!folder.isDirectory()) {
      continue;
    }
    const path = `skills/${folder.name}/SKILL.md`;
    try {
      const text = await readFile(join(root, path), "utf8");
      const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(text)?.[1];
      if (!frontmatter) {
        throw new Error("Missing YAML frontmatter.");
      }
      const metadata: unknown = Bun.YAML.parse(frontmatter);
      if (!isRecord(metadata)) {
        throw new Error("Frontmatter must be a mapping.");
      }
      const name = metadata.name;
      if (typeof name !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) || name.length > 64) {
        throw new Error("Name must use lowercase letters, digits, and single hyphens, with at most 64 characters.");
      }
      if (name !== folder.name || names.has(name)) {
        throw new Error("Name must be unique and match its folder.");
      }
      names.add(name);
      if (typeof metadata.description !== "string" || !metadata.description.trim() || metadata.description.length > 1024) {
        throw new Error("Description must contain 1 to 1024 characters.");
      }
      if (metadata.license !== "MIT") {
        throw new Error("Declare license: MIT and retain upstream notices.");
      }
      if (typeof metadata.compatibility !== "string" || !metadata.compatibility.trim() || metadata.compatibility.length > 500) {
        throw new Error("Declare compatibility requirements in 1 to 500 characters.");
      }
      const manual = metadata["disable-model-invocation"];
      if (manual !== undefined && typeof manual !== "boolean") {
        throw new Error("disable-model-invocation must be a boolean.");
      }
      if (manual === true) {
        const policyPath = join(root, "skills", folder.name, "agents/openai.yaml");
        const config: unknown = Bun.YAML.parse(await readFile(policyPath, "utf8"));
        if (!isRecord(config) || !isRecord(config.policy) || config.policy.allow_implicit_invocation !== false) {
          throw new Error("Manual skills need policy.allow_implicit_invocation: false in agents/openai.yaml.");
        }
      }
      if (!readme.includes(`](${path})`)) {
        throw new Error("Add this skill to the README catalog.");
      }
    } catch (error) {
      errors.push(`${path}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (names.size === 0) {
    errors.push("No valid skills found.");
  }

  const markdownFiles = new Bun.Glob("**/*.md").scan({ cwd: root, dot: true });
  for await (const file of markdownFiles) {
    const path = file.replaceAll("\\", "/");
    const directory = path.split("/")[0];
    if (directory === "node_modules" || directory === ".git") {
      continue;
    }
    const text = await readFile(join(root, path), "utf8");
    for (const match of text.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
      const href = match[1];
      if (!href || /^(?:[a-z]+:|#|\/)/i.test(href)) {
        continue;
      }
      const target = href.split("#")[0];
      if (!target) {
        continue;
      }
      try {
        await access(resolve(root, dirname(path), decodeURIComponent(target)));
      } catch {
        errors.push(`${path}: Missing linked file ${target}.`);
      }
    }
  }
  return errors;
}

if (import.meta.main) {
  const errors = await validateSkills(process.cwd());
  if (errors.length > 0) {
    process.stderr.write(`${errors.join("\n")}\n`);
    process.exitCode = 1;
  } else {
    process.stdout.write("Skill metadata, invocation policies, catalog entries, and local links are valid.\n");
  }
}
