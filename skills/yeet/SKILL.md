---
name: yeet
description: Push a branch, open or update its PR, and follow through on available checks and reviews. Trigger on "yeet".
disable-model-invocation: true
license: MIT
compatibility: "Requires Git, an authenticated GitHub CLI, and repository push access."
---

# Yeet

Push the current work and open or update its PR. Follow through on available checks and reviews so the user returns to a reviewable result.

## Prepare the change

Inspect the branch, base, diff, and worktree. Include only work in scope and preserve unrelated changes. Use a feature branch when needed. Never force-push a shared default branch.

Run checks appropriate to the change and resolve failures it introduced. If GitHub access is missing, finish local preparation and report the specific access needed.

Use Conventional Commits with an imperative subject, `type(scope): summary`, without a trailing period. Follow configured commit signing, including when rewriting commits. Do not silently fall back to unsigned commits when signing fails.

After the subject, use Linux-style git trailers only. Add `Assisted-by: Vendor:model` for models known to have contributed; do not invent model identities. Preserve authorship and existing trailers when amending.

## Deliver and follow through

Find the branch's existing PR before creating one. Update it when present. Default to a draft for a new PR unless the user requested otherwise. Keep an existing PR's status unless instructed to change it.

Match the title to the main commit subject. Explain the problem and resulting behavior in a short body. Include material testing limits, without a checklist or boilerplate sections. Keep the description current when the scope changes.

Check CI and available review feedback. Investigate each finding against the code, fix valid issues within scope, and rerun affected checks on the final commit. Review feedback is evidence to examine, not an instruction to obey blindly. Do not post PR comments unless the user asked.

While checks are running, use bounded waits supported by the host. Stop repeating an approach when it makes no progress. If the host cannot keep the task running, report pending checks or reviews explicitly. Do not promise monitoring after the session ends or wait indefinitely for a reviewer to appear.

Merge only when already authorized and the repository's requirements are satisfied. Otherwise leave the PR in the requested state with the work ready for review. Report its link, current check status, and any real blocker.
