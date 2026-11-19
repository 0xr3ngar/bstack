# Feature

## Resume

Use the named `Plan folder:` or existing `/bmode <slug>`. Reuse this thread's folder when the user asks for no new feature. Start a new feature at frame in a new folder. Read `state.md` and take the first matching rule.

| Recorded | Action |
| --- | --- |
| done | Return the PRs and scores. |
| handed-off | Read the build thread with `t3_thread_read` and return its link and state. A stopped build resumes there on the user's word. If the thread is gone, explain that removing the handoff entry allows a new handoff. |
| approved | Hand off from the recorded base. |
| Any earlier phase | Check the model, then resume after the last recorded step. At presented, wait for the user's decision. |

## Frame and research

Create the shared [plan folder](../references/documents.md). Preserve the user's words unchanged in request.md. Quote explicit USER DECISIONS. Record an assumption for each open point. Treat an ambiguous statement as an idea and raise it at presentation. Record `framed` before switching models.

Read the current model, effort and thread ID with `t3_thread_configure`. If needed, set the orchestrator model and effort with that tool. Say what changed. Queue the standard first message to the returned thread ID with `t3_thread_send`, mode `queue`, `Route: feature` and `Plan folder: <absolute path>`. End the turn. Resume on the new model. If the switch or queued continuation fails, state the failure and ask the user to select the configured model and continue this plan. Wait.

Write research.md with a checked code map, repository checks and real surface, parts to reuse here or elsewhere, decision history from [why](../../why/SKILL.md), and options. For wide scope, divide the areas. Announce the researcher model and effort. Use `delegate_task` in shared isolation with the configured model, effort and concurrency. Send a separate [research brief](../references/research-brief.md) to each. Verify their claims in the code. Record `researched`.

## Design and present

Use [user first](../../user-first/SKILL.md) to show the change from the user's side, [foundational thinking](../../foundational-thinking/SKILL.md) for data and contracts, and [exhaust the design space](../../exhaust-the-design-space/SKILL.md) for two or three concrete options in one table. Choose one. Probe choices that a run can settle. For a refactor apply [redesign from first principles](../../redesign-from-first-principles/SKILL.md). Use [type system](../../type-system/SKILL.md) for typed contracts. Carry unsettled design questions to presentation with the assumptions you took.

Write plan.md, plan-details.md, proposal.md and diagrams in the [document formats](../references/documents.md). Apply [unslop](../../unslop/SKILL.md). Record `drafted`. Run [council](../../council/SKILL.md) in plan mode to the target. Record each round. Render the plan and proposal with `html_preview` then `html_render`. Give each round's scores and number the open questions. Record `presented` and wait.

Edit on request. Review a changed design decision again and present it again. Only explicit approval, such as “approved”, “go” or “full send”, authorizes the build. Record `approved base=<branch>` using trunk or the first base specified by the plan.

## Hand off

Use `t3_thread_launch` with a worktree from the approved base and the orchestrator model. Start [full-send](../../full-send/SKILL.md) with the message `/full-send <absolute plan folder>`. If T3 Code does not interpret the command, send the explicit form to the build thread:

```text
Read <absolute installed path>/full-send/SKILL.md and follow it.
Plan folder: <absolute plan folder>
```

Return the thread link. The build thread records its own handoff.
