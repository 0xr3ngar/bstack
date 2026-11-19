---
name: full-send
description: "Build an approved plan from its shared folder, prove the draft pull requests and run code review."
disable-model-invocation: true
license: MIT
compatibility: "Requires T3 Code and its MCP server `t3-code`, Git, and an authenticated GitHub CLI."
---

# Full-send

Read the [rules of every route](../bmode/SKILL.md) and apply them throughout. Use the status line after each phase. Take all build context from the plan folder. For a different request in the build thread, use the route selection in the linked skill.

## Preflight

Stop if the t3-code MCP tools are absent. Check the sibling paths linked by this skill and its references. If one is missing, stop and print `bunx --bun skills add 0xr3ngar/bstack`. Load the [setup](../bmode-setup/SKILL.md) settings in order: the request, `~/.config/bstack/preferences.md`, then the [defaults and tool table](../bmode-setup/references/defaults.md). Use `orchestrator_capabilities` for each named model and effort. Report an unavailable model and wait for the user.

Require request.md, plan.md, plan-details.md and an approved entry in state.md. Report anything missing and stop. Get this thread's ID with `t3_thread_configure`. If handed-off names another thread, return its link and start nothing. Otherwise write `handed-off <this thread>` if absent. Resume after the last recorded phase. After a stop, continue only on the user's word in this build thread.

Read the plan documents, repository agent, contributing and writing rules, and the proof procedure in research.md. Split by the plan's PR table, preserving order and bases. Write one [build brief](references/build-brief.md) per PR in build/.

## Build

Use the [PR owner procedure](references/pr-owner.md) in both modes. Check `claude -p "/usage"` before starting builders. Below the configured floor on any limit, start no new builder. If a design decision fails in the code, stop the build, write evidence in build/ and return to the user. Diagnose failures with [root cause fix](../root-cause-fix/SKILL.md).

Record each transition as `pr <n> <branch> <thread or inline> <state>`. Use the newest line for each PR.

**Threads.** Start independent trunk PRs at once. For a dependent PR, wait for acceptance of the one below, then add its link to the brief. Use `t3_thread_launch` with a worktree from the assigned base and the implementer model. Send the first message from the route rules with `Route: change` and `Brief: <absolute path>`. Record started. Wait with `t3_thread_wait`, including delegated work. Read the report with `t3_thread_read`.

Record handed-back. Check the diff against the plan and, for a stacked PR, verify the branch sits on the current head below. Record accepted if both hold. Otherwise record started and send the correction with `t3_thread_send`, prefixed with `Route: change`. Wait again. Send fixes or restacks only after handback.

**Inline.** Build each PR yourself, in order, following the same procedure. Write the same state transitions. Check the diff and ancestry before accepting it.

**Restack.** After a lower head changes, restack each dependent PR lowest first. Record started before sending the instruction or running `gh stack`. In threads mode each PR owner rebases onto the new lower head, checks, pushes with `--force-with-lease` and hands back. In inline mode run the restack yourself and repeat the checks and handback.

**Resume.** Skip accepted PRs if the lower head is still their ancestor. Restack otherwise. For handed-back PRs inspect the diff. For started PRs in threads mode, send “continue” with the route line once the thread is idle and wait. In inline mode check out the recorded branch and resume at the first incomplete PR owner step. Record `built <prs>` once accepted.

## Verify and review

For each stack, verify its top. In threads mode fetch and detach the lead checkout at the pushed head. In inline mode check out the top branch. Run every planned case on the real surface from research.md. Record the runs and gaps in build/verify.md. Record verified only for demonstrated behavior. If the repository has no real surface, say what remains unproved.

Run [council](../council/SKILL.md) in code mode on the whole change. Give the exact head and commit range per PR. Reviewers use read-only git. Fetch and update the brief with new heads before each later round. Return accepted fixes to the PR owner, mark started, restack dependents after handback and verify affected behavior again. Record each round's scores in state.md.

Report the PRs, every round's scores, the real-surface results and what remains unproved. Record done when complete. Leave the PRs in draft. Leave merges, ready state, reviews, posts and resolutions to the user. Later PR feedback follows the upkeep route.
