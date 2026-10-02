import { z } from "zod";
import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

const metadataSchema = z.object({
  name: z.string().max(64).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().min(1).max(1024),
  license: z.literal("MIT"),
  compatibility: z.string().trim().min(1).max(500),
  "disable-model-invocation": z.boolean().optional(),
});
const policySchema = z.object({
  policy: z.object({ allow_implicit_invocation: z.literal(false) }),
});

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
      const metadata = metadataSchema.parse(Bun.YAML.parse(frontmatter));
      const { name } = metadata;
      if (name !== folder.name || names.has(name)) {
        throw new Error("Name must be unique and match its folder.");
      }
      names.add(name);
      if (metadata["disable-model-invocation"] === true) {
        const policyPath = join(root, "skills", folder.name, "agents/openai.yaml");
        const config: unknown = Bun.YAML.parse(await readFile(policyPath, "utf8"));
        if (!policySchema.safeParse(config).success) {
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
