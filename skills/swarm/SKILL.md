---
name: swarm
description: "Trigger this if the user says 'swarm'."
license: MIT
compatibility: "Requires T3 Code and its MCP server `t3-code`, Git, and an authenticated GitHub CLI."
---

# Swarm

Stop if the t3-code MCP server is unavailable.

Before an audit, address outstanding PR comments, fix known issues, and run
relevant checks. Give the swarm the updated implementation; do not defer known
fixes until reviews return. If the user wants to discard the implementation
and explore new ideas, skip fixes to code being replaced.

Use the members named in the request, then the swarm line from [setup](../bmode-setup/SKILL.md). If setup is missing, use the requested members. Ask only for missing membership when a review needs it. Use the [settings](../bmode-setup/references/defaults.md) for effort, target, cap and usage floor. Without that file, use high effort for plans, medium for code, a target of 10, eight rounds and a 5% floor on each usage limit.

Use `orchestrator_capabilities` to resolve named models and effort options. If a member is unavailable, report it and wait. Announce members, effort and cap in one line.

## Write the brief

Use a [plan brief](references/plan-brief.md) or [code brief](references/code-brief.md). For an open question, give each member the request, evidence and scope. Ask for a score in open mode only if requested.

Put the brief and one report per member or code area per round in the plan folder's `swarm/`, or in a scratch folder. List USER DECISIONS as “not open for debate”. Include the method of [redesign from first principles](../redesign-from-first-principles/SKILL.md). If it is missing, ask whether this is what one would build from scratch and whether every reference reflects it. Require a one-sentence verdict.

## Run a round

Use `delegate_task` with shared isolation, `target.model` and the provider effort option in `target.options`. Launch fresh read-only reviewers in parallel. Begin each task with `Read <absolute path>/delegates.md before anything else.` Use the [delegate rules](../bmode-setup/references/delegates.md). If unavailable, include the rules in the task: work alone within scope, verify claims against files, write only the assigned report, run read-only git, post nothing and finish with `REPORT <path>`.

Do not wait idle. When a result arrives, check its findings against the code
at once and decide what to fix while the other delegates run. Do not edit
files while a delegate still reviews the same checkout. If the user's
instructions mark a delegate as non-blocking, do not wait for it; treat a
late result as feedback and do not record its score.

For a code review, ask each delegate for a score out of 10.
Count each full review pass as one round.
A fresh review after fixes starts a new round.

Check each finding against the files. Accept or reject it with a reason. Settle disagreements from the code. Reject any finding that drops a USER DECISION and record it in the brief as settled.

After all blocking reviews return, apply accepted edits. Add “since round N” with the diff file, settled findings and earlier report paths to the next brief. Record a missing score as `no score`; that round cannot pass a score target.

Stop when every required score reaches the target and that round produced no accepted findings. For unscored open reviews, stop when reviewers are satisfied. At the cap, show scores and open findings. If a required target is still unmet, report the specific blocker and the decision needed. A passing plan round releases the plan to the build immediately. Below the usage floor, finish the running round and start no new one.

Keep scores in the reply and the plan folder only. Summarize findings, disagreements and next steps. Keep the work within scope.
