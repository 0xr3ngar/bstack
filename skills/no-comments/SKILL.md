---
name: no-comments
description: Remove redundant comments within the requested scope while preserving useful constraints and working code.
disable-model-invocation: true
license: MIT
compatibility: "Requires repository access and its validation tools."
---

# No comments

Remove comments that repeat the code or preserve dead code. Leave a working change, with useful explanations intact.

Use the supplied paths or diff. Otherwise inspect the diff against the base branch, including staged and unstaged changes. Change comments only unless code changes are also requested.

Read the surrounding code before deleting a comment. Remove narration, section banners, and commented-out implementations. Do not replace them with shorter narration.

Keep required legal headers, public API contracts, and explanations of constraints the code cannot express. A dependency workaround, protocol requirement, or issue link can explain why apparently simpler code would be wrong. Investigate uncertain comments before deciding.

Treat lint directives, type suppressions, compiler annotations, and generated-file markers as behavior. Remove them only when the affected checks still pass. If removing one requires an out-of-scope code fix, preserve it and identify the exact symbol and reason.

When code changes are authorized, use a clear name, type, or small refactor to remove the need for an explanation. Otherwise report unclear code without inserting warning tags or knowingly breaking validation.

Review the diff for accidental code changes. Run affected checks when comments influence tooling or execution. Report what changed and any concrete follow-up; do not ask the user to approve routine deletions before doing the work.
