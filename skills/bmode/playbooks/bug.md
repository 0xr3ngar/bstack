# Bug

Reproduce the failure on the real surface when possible. Read the actual state. Check the base first. If broken, explain it and fix the base in a separate draft PR.

Use [root cause fix](../../root-cause-fix/SKILL.md). State the cause in one sentence. If the behavior is correct, report the evidence and change nothing. If the fix needs a behavior choice or a design, stop and present the options.

Make the smallest change at the cause. When cheap, include a test that fails before the fix. Run steps 3 to 7 of the [PR owner procedure](../../full-send/references/pr-owner.md). Run [council](../../council/SKILL.md) in code mode to the target. After a fix, prove the affected behavior again. Report the cause, fix, real-surface run and scores.

## Batch

Check the base once. Read every bug. Fix a broken base first. Use `t3_thread_launch` with a worktree and the implementer model for each bug. Send the assigned bug route, ticket and findings. Branch from the base fix when present, otherwise from trunk. Base each bug PR on that branch without a native stack.

A batch bug thread skips the base check and the review round. When the base fix changes, send each child a rebase with `t3_thread_send` after handback. Wait with `t3_thread_wait`, read each report with `t3_thread_read`, inspect each diff and proof, and report one table.
