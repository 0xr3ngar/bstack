---
name: pr-debate
description: "Review a PR with three subagents that argue over 2-3 rounds. A reviewer proposes comments, a skeptic argues they are noise, and a judge rules on each one. Use for /pr-debate, 'debate this PR', or an adversarial PR review."
disable-model-invocation: true
license: MIT
compatibility: "Requires Git, an authenticated GitHub CLI, and subagents. Works best when the host can send follow-up messages to a running subagent."
---

# PR debate

Three subagents review one diff. The reviewer proposes comments. The skeptic argues against each one. The judge rules on every comment after each round. The user sees only the comments the judge keeps.

The agents cannot message each other. You pass each reply to the next agent. In rounds 2 and 3, continue the same three agents (SendMessage in Claude Code) so each one remembers its earlier arguments. If the host cannot continue an agent, start a fresh one and give it the paths of its earlier replies.

## Setup

1. Find the target. With a PR number or URL, run `gh pr view` and `gh pr diff`. Pass `-R owner/repo` when the PR is in another repository. With no argument, use the diff of the current branch against its base.
2. Make a folder per PR at `<scratchpad>/pr-debate/<pr>/`. Save the diff to `diff.patch` and the PR title and description to `pr.md`.
3. Fetch the PR's head and base commits and record their SHAs. The agents read code at the head with `git show <sha>:<path>` and `git grep <pattern> <sha>`. Do not change the user's checkout. The local branch is often not the PR head, and several agents may share it.
4. List the repo docs that define the rules, such as `AGENTS.md`, `CONVENTIONS.md` and `CLAUDE.md`.

Give every agent the PR folder, both SHAs, the rule docs, and any context the user gave for the review. Tell each agent to only read the diff and the repo. It never edits files, changes the checkout, posts anything, or starts its own subagents.

All three run on the same model as the current session. Leave the model unset on the agent call so they inherit it.

With several PRs, such as a stack, run one debate per PR on that PR's own diff against its base. Run the debates in parallel and start each PR's next agent as soon as the previous one returns.

## Pass replies as files

Save every reply to the PR folder as `round-<n>-<role>.md` before you pass it on. Give the next agent that path, or paste the reply unchanged. Do not summarize one agent's reply for another. The judge must rule on what the reviewer wrote, not on your paraphrase of it.

## Round 1

1. Spawn the reviewer. Tell it to read the diff and the code around it, then list review comments. Each comment has an id (R1, R2, and so on), a `file:line` in the head version of the file, the problem, a concrete failure scenario or the repo rule it breaks, and the text it would post on the PR. The posted text follows the repo's writing rules. Tell it to prefer a few strong comments over many weak ones.
2. When the reviewer returns, spawn the skeptic with the reviewer's reply. Tell it to argue against every comment. For each id, it explains why the comment is wrong, handled elsewhere, speculative, a style preference with no written repo rule, or out of scope for this PR. It checks the code before it argues. It concedes a comment only when it finds no real counterargument.
3. When the skeptic returns, spawn the judge with both replies. Tell it to rule `keep`, `drop` or `unsure` on each id, with one sentence of reasoning. A comment stays only if it names a real failure or a written repo rule, and the skeptic's argument fails when checked against the code. The judge verifies disputed facts in the code itself. When only part of a comment holds, the judge keeps it narrowed and states the narrowed scope. For each `unsure`, the judge says what evidence would decide it.
4. Show the user the judge's ruling as a short table.

## Round 2

1. Send the reviewer the skeptic's arguments and the judge's ruling. The reviewer can defend `drop` and `unsure` comments with new evidence from the code, concede them, revise the text of narrowed comments, or add at most two comments it missed.
2. Send the skeptic the reviewer's reply. It argues against the defenses and the new comments.
3. Send the judge both replies. It rules again on every open id.
4. Show the user the judge's ruling for the round.

## Round 3

Run round 3 the same way as round 2, but only if the judge still has `unsure` comments. Otherwise stop. After round 3, every remaining `unsure` becomes `drop`.

## Output

Give the user, per PR:

1. The comments the judge kept, each with its `file:line` and the final PR comment text. For a narrowed comment, use the narrowed text.
2. One line per dropped comment with the judge's reason, so the user can restore one they disagree with.

Post nothing to the PR. The user decides what to post.

## Example

The user runs `/pr-debate 2658 2671 -R acme/api` with a note about a related PR. You save both diffs, fetch both heads, and run two debates in parallel. Each debate ends with its kept comments and draft text, plus the dropped comments and the judge's reasons.
