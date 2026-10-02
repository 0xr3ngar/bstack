# Release bStack

bStack versions the skill collection as one package. `package.json` stays private. Skills install from GitHub, and releases create GitHub tags and release notes without publishing to npm.

## Record a change

Run:

```bash
bun run changeset
```

Select `bstack` and choose a bump:

- Use patch for fixes that preserve the existing workflow.
- Use minor for new skills or capabilities.
- Use major for incompatible changes to names, requirements, or behavior.

Write the summary as a short description of what changes for the user. Commit the generated file in `.changeset/` with the change. Documentation and CI changes can omit a changeset when they do not affect installed skills.

## Release a version

1. Merge skill changes and their changesets into `main`.
2. The Release workflow opens or updates a version PR ready for review. Changesets updates `package.json`, `bun.lock`, and `CHANGELOG.md` and consumes the pending changesets.
3. Review the version and changelog. Mark the PR ready and merge it when you want to release.
4. The workflow checks the repository and creates `v<version>` at the merged commit, with that version's changelog entry as the release notes.

The first pending changeset prepares version `0.1.0`. Installing from the default branch can include changes before their tagged release. GitHub releases do not gate skills.sh updates.

The workflow uses the repository's `GITHUB_TOKEN`. In GitHub's Actions settings, enable **Allow GitHub Actions to create and approve pull requests**. The workflow grants `contents: write` and `pull-requests: write`. It does not need an npm token.

GitHub does not normally run PR workflows for PRs opened with `GITHUB_TOKEN`. The release workflow runs the checks itself. If branch protection requires a PR check, configure a GitHub App token for Changesets or trigger the required checks through your repository's approved process.

## Preview locally

Use a temporary branch or checkout because versioning modifies files:

```bash
bun run version:skills
bun run release --dry-run
```

The preview prints the version and notes without contacting GitHub. Do not run the version command on the feature branch just to create a changeset.

## Retry a release

Run the Release workflow manually on `main`. It creates the release when pending changesets have been consumed and skips a version whose release already exists. GitHub errors fail the run instead of being treated as a missing release.

Do not edit or reuse a published tag. Correct the skill with a new changeset and release a new version.

## Install a tagged version

After the version exists, install from its GitHub tree URL:

```bash
bunx --bun skills add https://github.com/0xr3ngar/bstack/tree/v0.1.0
```

Replace `v0.1.0` with the desired tag. The regular `bunx --bun skills add 0xr3ngar/bstack` command uses the default branch.
