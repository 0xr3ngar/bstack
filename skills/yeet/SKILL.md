---
name: yeet
description: Open a draft PR and work through the user's review comments. Once ready for review, explain feedback and wait for direction. Trigger on "yeet".
disable-model-invocation: true
license: MIT
compatibility: "Requires Git, an authenticated GitHub CLI, and repository push access."
---

# Yeet

Push the current work, open a draft PR, and work through the user's comments until they are satisfied. When the user marks the PR ready for review, switch to explaining feedback and recommending what to address.

## Prepare the change

Inspect the branch, base, diff, and worktree. Include only work in scope and preserve unrelated changes. Use a feature branch when needed. Never force-push a shared default branch.

Run checks appropriate to the change and resolve failures it introduced. If GitHub access is missing, finish local preparation and report the specific access needed.

Use Conventional Commits with an imperative subject, `type(scope): summary`, without a trailing period. Follow configured commit signing, including when rewriting commits. Do not silently fall back to unsigned commits when signing fails.

After the subject, use Linux-style git trailers only. Add `Assisted-by: Vendor:model` for models known to have contributed; do not invent model identities. Preserve authorship and existing trailers when amending.

## Open the draft

Find the branch's existing PR before creating one. Open new PRs in draft and preserve an existing PR's status. The user decides when to mark it ready. Follow an explicit request for a different status.

Match the title to the main commit subject. Explain the problem and resulting behavior in a short body. Include material testing limits, without a checklist or boilerplate sections. Keep the description current when the scope changes.

Tell the user the draft is open and ready for their comments. Include the link and current check status, then begin watching for feedback. This notification does not mark the PR ready on GitHub.

## While the PR is a draft

Identify the requesting user's review account from established context. If it is unknown, ask for the account while completing the draft. Do not assume the PR author, authenticated account, or any collaborator is that person. Accept feedback from another review tool only when its source is attributable to the user.

Watch PR conversation comments, submitted reviews, and inline threads, including replies and edits. Act on the user's feedback within the task's scope without asking them to repeat it in chat. Explain comments from other people or bots and recommend whether to address them; wait for the user's direction before acting on those comments.

Read the full thread and inspect the code before changing it. Fix the issue, run affected checks, and push the change. Resolve a thread only after verifying that the pushed change addresses it. Leave questions, disputed findings, and blocked work unresolved and explain what needs the user's judgment. Do not post separate replies unless asked.

Tell the user what changed and keep watching for their next comments. Repeat until they mark the PR ready, close it, or ask you to stop.

## Once the PR is ready for review

Explain new feedback to the user in plain language. State what the reviewer means, whether the code supports the finding, and whether you recommend fixing it now, deferring it, or leaving the code as it is.

Wait for the user's decision before editing, pushing a review fix, replying, or resolving a thread. This applies to all reviewers, including the requesting user. Follow an explicit instruction to handle a particular finding, then verify and report the result.

## Keep the loop accurate

Inspect the host's available PR event subscriptions, listeners, and wake tools first. Use an existing subscription or register one for this PR through the supported mechanism, then confirm it is active. Prefer event delivery to a polling loop. Subscribe to comments, reviews, and PR state changes where supported; fetch the current PR and thread when an event arrives.

Poll only for events the host cannot deliver, with bounded waits while the session runs. Track the PR, comment IDs and edits, and the last processed state so reconnecting does not repeat completed work. Fetch feedback received while you were fixing the previous batch.

Recheck the PR's draft status before starting a fix and before pushing or resolving threads. If it became ready, pause pending review changes and present them for the user's decision. If it returns to draft, resume the draft workflow. Stop on merge or closure, or when the user asks.

Report CI failures. Fix failures caused by your draft changes and recheck the final commit. After the PR is ready, explain failures and recommend a fix before proceeding unless the user already authorized that work.

Check the available tools and subscription status before declaring automatic listening unavailable. If neither event delivery nor continued polling is possible, explain the specific limitation and how to resume. Report a listener as active only after confirming it. On an access failure, preserve your place and report the blocker instead of silently abandoning the loop.

Marking a PR ready does not authorize merging it. Merge only when explicitly authorized and the repository's requirements are satisfied.
