import { appendFile, readFile, readdir } from "node:fs/promises";
import { parseArgs } from "node:util";

export function releaseNotes(changelog: string, version: string): string {
  const lines = changelog.split(/\r?\n/);
  const start = lines.indexOf(`## ${version}`);
  if (start === -1) {
    throw new Error(`CHANGELOG.md has no entry for ${version}.`);
  }
  const notes: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith("## ")) {
      break;
    }
    notes.push(line);
  }
  const body = notes.join("\n").trim();
  if (!body) {
    throw new Error(`CHANGELOG.md has no release notes for ${version}.`);
  }
  return body;
}

export async function publishRelease(options: Readonly<{
  apiUrl: string;
  repository: string;
  token: string;
  commit: string;
  version: string;
  notes: string;
}>) {
  const url = `${options.apiUrl}/repos/${options.repository}/releases`;
  const tag = `v${options.version}`;
  const headers = {
    Authorization: `Bearer ${options.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const existing = await fetch(`${url}/tags/${tag}`, { headers });
  if (existing.ok) {
    return { created: false, message: `${tag} already exists.` };
  }
  if (existing.status !== 404) {
    throw new Error(`Cannot check release ${tag}: GitHub returned ${existing.status}.`);
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      tag_name: tag,
      target_commitish: options.commit,
      name: `bStack ${tag}`,
      body: options.notes,
      draft: false,
      prerelease: false,
    }),
  });
  if (!response.ok) {
    throw new Error(`Cannot create release ${tag}: GitHub returned ${response.status}.`);
  }
  return { created: true, message: `Created ${tag}.` };
}

async function main() {
  const { values } = parseArgs({ options: { "dry-run": { type: "boolean" } } });
  const manifest: unknown = JSON.parse(await readFile("package.json", "utf8"));
  if (typeof manifest !== "object" || manifest === null || !("version" in manifest) ||
      typeof manifest.version !== "string" || !/^\d+\.\d+\.\d+$/.test(manifest.version)) {
    throw new Error("package.json must contain a stable semantic version.");
  }
  const pending = await readdir(".changeset");
  if (pending.some((file) => file.endsWith(".md") && file !== "README.md")) {
    throw new Error("Run the Changesets version step before releasing.");
  }
  const notes = releaseNotes(await readFile("CHANGELOG.md", "utf8"), manifest.version);
  if (values["dry-run"]) {
    process.stdout.write(`bStack v${manifest.version}\n\n${notes}\n`);
    return;
  }
  const token = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;
  const commit = process.env.GITHUB_SHA;
  if (!token || !repository || !commit || process.env.GITHUB_REF !== "refs/heads/main") {
    throw new Error("Run releases from the main-branch GitHub Actions workflow.");
  }
  const result = await publishRelease({
    apiUrl: process.env.GITHUB_API_URL ?? "https://api.github.com",
    repository,
    token,
    commit,
    version: manifest.version,
    notes,
  });
  if (process.env.GITHUB_OUTPUT) {
    await appendFile(process.env.GITHUB_OUTPUT, `created=${result.created}\n`);
  }
  process.stdout.write(`${result.message}\n`);
}

if (import.meta.main) {
  try {
    await main();
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}
