# Feature

## Resume

Use the named `Plan folder:` or existing `/bmode <slug>`. Reuse this thread's folder when the user asks for no new feature. Start a new feature at frame in a new folder. Read `state.md` and take the first matching rule.

| Recorded | Action |
| --- | --- |
| Explicit user pause still in effect | Keep the work stopped until the user resumes. |
| done | Return draft PR links, checks, proof, scores and gaps to the originating user thread. |
| handed-off | Rejoin the recorded build and collect its result as below. |
| plan-reviewed | Hand off from the recorded base. |
| Legacy presented or approved | Apply the [state migration](../references/documents.md) and continue. |
| Any earlier phase | Check the model and finish the next incomplete phase. |

## Frame and research

Create the shared [plan folder](../references/documents.md). Preserve the user's words unchanged in request.md. Quote explicit USER DECISIONS. Record an assumption for each open point. Treat an ambiguous statement as an idea. Record `framed origin=<thread>` with the originating thread ID from `t3_thread_configure` before switching models.

Read the current model, effort and thread ID with `t3_thread_configure`. If needed, set the orchestrator model and effort with that tool. Say what changed. Queue the standard first message to the returned thread ID with `t3_thread_send`, mode `queue`, `Route: feature` and `Plan folder: <absolute path>`. End the turn. Resume on the new model. If T3 Code refuses the switch, check the available models and retry a recoverable failure. If manual selection is required, give the error and ask for that specific change.

Write research.md with a checked code map, repository checks and real surface, parts to reuse here or elsewhere, decision history from [why](../../why/SKILL.md), and options. For wide scope, divide the areas. Announce the researcher model and effort. Use `delegate_task` in shared isolation with the configured model, effort and concurrency. Send a separate [research brief](../references/research-brief.md) to each. Verify their claims in the code. Record `researched`.

## Design and review

Use [user first](../../user-first/SKILL.md) to show the change from the user's side, [foundational thinking](../../foundational-thinking/SKILL.md) for data and contracts, and [exhaust the design space](../../exhaust-the-design-space/SKILL.md) for two or three concrete options in one table. Choose one. Probe choices that a run can settle. For a refactor apply [redesign from first principles](../../redesign-from-first-principles/SKILL.md). Use [type system](../../type-system/SKILL.md) for typed contracts. Record inferred choices. Ask a focused question only when a consequential choice remains after checking the evidence.

Write plan.md, plan-details.md, proposal.md and diagrams in the [document formats](../references/documents.md). Apply [unslop](../../unslop/SKILL.md). Record `drafted`. Run [council](../../council/SKILL.md) in plan mode to the target. Record each round. Render the plan and proposal with `html_preview` then `html_render`. Record the scores and assumptions. When the plan reaches the target, write `plan-reviewed base=<branch>` with the first PR base or trunk. Hand off in the same turn. If the user changes a design decision, update the documents and review the changed decision again.

## Hand off

Use `t3_thread_launch` with a worktree from the recorded base and the orchestrator model. Start [full-send](../../full-send/SKILL.md) with the message `/full-send <absolute plan folder>`. If T3 Code does not interpret the command, send the explicit form to the build thread:

```text
Read <absolute installed path>/full-send/SKILL.md and follow it.
Plan folder: <absolute plan folder>
```

Keep the returned thread ID. The build thread writes its own handed-off entry. On restart, check the launch record for this folder before creating a thread. Reuse an existing build, including one that started before its ID was saved. If the thread is gone, inspect the pushed branches, PRs and remaining worktrees. Recover the build from the first unfinished step and record the replacement thread. Preserve recoverable edits.

Wait with `t3_thread_wait` and `untilDelegatedWorkSettled: true`. Wait again after a timeout. Read the build report with `t3_thread_read`. Address recoverable problems and send the build the information it needs. For a genuine blocker, bring the specific question to the originating thread and relay the answer. Return the draft PR links, heads, checks, real-surface proof, council scores and remaining gaps in the originating user thread.
