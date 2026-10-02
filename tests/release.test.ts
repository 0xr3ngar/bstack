import { expect, test } from "bun:test";
import { publishRelease, releaseNotes } from "../scripts/release.ts";

test("release notes contain only the requested version", () => {
  const changelog = "# bStack\n\n## 0.2.0\n\n### Minor Changes\n\n- Add a skill.\n\n## 0.1.0\n\n- First release.\n";
  expect(releaseNotes(changelog, "0.2.0")).toBe("### Minor Changes\n\n- Add a skill.");
  expect(() => releaseNotes(changelog, "0.3.0")).toThrow("CHANGELOG.md has no entry for 0.3.0.");
});

test("release creation uses the version, exact commit, and changelog, then skips retries", async () => {
  let exists = false;
  const posted: unknown[] = [];
  const server = Bun.serve({
    port: 0,
    hostname: "127.0.0.1",
    async fetch(request) {
      expect(request.headers.get("Authorization")).toBe("Bearer fixture-token");
      if (request.method === "GET") {
        expect(new URL(request.url).pathname).toBe("/repos/test/bstack/releases/tags/v0.1.0");
        return Response.json({}, { status: exists ? 200 : 404 });
      }
      expect(new URL(request.url).pathname).toBe("/repos/test/bstack/releases");
      posted.push(await request.json());
      exists = true;
      return Response.json({}, { status: 201 });
    },
  });
  try {
    const options = {
      apiUrl: server.url.origin,
      repository: "test/bstack",
      token: "fixture-token",
      commit: "abc123",
      version: "0.1.0",
      notes: "First release.",
    };
    expect(await publishRelease(options)).toBe("Created v0.1.0.");
    expect(await publishRelease(options)).toBe("v0.1.0 already exists.");
    expect(posted).toEqual([{
      tag_name: "v0.1.0",
      target_commitish: "abc123",
      name: "bStack v0.1.0",
      body: "First release.",
      draft: false,
      prerelease: false,
    }]);
  } finally {
    await server.stop(true);
  }
});

test("GitHub lookup failures do not create a release", async () => {
  const methods: string[] = [];
  const server = Bun.serve({
    port: 0,
    hostname: "127.0.0.1",
    fetch(request) {
      methods.push(request.method);
      return new Response("Unavailable", { status: 503 });
    },
  });
  try {
    await expect(publishRelease({
      apiUrl: server.url.origin,
      repository: "test/bstack",
      token: "fixture-token",
      commit: "abc123",
      version: "0.1.0",
      notes: "First release.",
    })).rejects.toThrow("GitHub returned 503");
    expect(methods).toEqual(["GET"]);
  } finally {
    await server.stop(true);
  }
});
