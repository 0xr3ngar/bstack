# Contributing to bStack

Keep each skill focused on one workflow. Explain when to use it, what it needs, and what it produces.

## Set up the repository

Install the Bun version in [.bun-version](.bun-version), then run:

```bash
bun install --frozen-lockfile
bun run typecheck
bun test
```

Bun runs the TypeScript directly. TypeScript checks types during development. Installed skills must not depend on this repository's `node_modules` directory.

## Add or change a skill

1. Create `skills/<name>/SKILL.md` using the [skill template](templates/skill.md).
2. Use a lowercase name with hyphens. Match the folder name to the frontmatter `name`.
3. Describe both the task and when the agent should use the skill.
4. Declare runtime requirements in `compatibility`. Keep supporting files inside the skill folder and link them with relative paths.
5. Add the skill to the [README catalog](readme.md#skills).
6. Try an example request in each agent you claim to support. Record the agent version and result in the PR.

For manual-only skills, set `disable-model-invocation: true` in `SKILL.md`. Add `agents/openai.yaml` with this Codex policy:

```yaml
policy:
  allow_implicit_invocation: false
```

Do not add an `openai.yaml` file when no Codex-specific setting is needed. Do not make one skill depend on another being installed.

## Write instructions

Use plain words and concrete steps. Keep facts, commands, and file paths accurate. Remove filler and unsupported claims. Follow the [unslop checklist](skills/unslop/SKILL.md) for prose. Preserve license text verbatim.

State what happens when a required tool is unavailable. Ask for authorization before a workflow sends messages or writes to an external service unless the user's request already authorizes that action.

## Check scripts

Use Bun and TypeScript for executable code. Prefer loops and explicit branches. Keep parsing at input boundaries and avoid type casts that hide unvalidated data.

Add tests for observable behavior when changing scripts. Use synthetic transcripts for time-report tests. Never commit personal conversations, access tokens, or local agent configuration.

Run the documented command from a copied skill folder outside this checkout. This catches dependencies on repository files that users will not install.

## Open a pull request

Explain the problem and the resulting behavior. Keep the PR description short. Mention testing limits only when they affect the reviewer's decision.

Keep unrelated changes in separate PRs. For a stack, base each PR on the preceding branch and merge from the bottom upward. Retarget the next PR to `main` after its parent merges. If the parent was squash-merged, rebase the remaining stack to remove the already merged commits.

## Credit upstream work

Link the original source for adapted skills and preserve its copyright and license notices in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Contributions use the repository's [MIT license](LICENSE).
