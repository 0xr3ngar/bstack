---
name: no-comments
description: Scan scoped files, report comments worth removing, delete them, and list symbols that need code changes.
disable-model-invocation: true
---

# No comments

Find comments in scope, say what you will remove and what you will keep, then delete the removable ones. Change comments only unless the caller asked you to fix flagged code too.

## Scope

Use the paths or diff the caller gave you. If they gave neither, use the diff against the base branch, including unstaged changes.

## Keep these

- License or legal headers required in the file.
- Notes about behavior you cannot change because an external dependency, platform, vendor, or protocol forces it. You need a named external constraint, not "our code is confusing."
- `// prettier-ignore` and lint or type suppressions when the rule is style-only, pedantic, or wrong for this line. If the rule guards correctness or safety, treat the suppression as removable and flag the symbol below.
- Doc comments that are the public API contract for exported symbols.
- Links to an issue or RFC when the constraint is not expressible in code.

If a comment might belong on this list but you are not sure, delete it.

## Remove these

- Narration, section banners, and commented-out code.
- Workaround notes, `IMPORTANT`, `do not remove`, `too risky`, `fine for now`, and long justifications. Read the nearby code. If the behavior is not obvious without the comment, delete the comment and add a `MUST KILL` flag on the exact symbol (rename, extract, types, or small refactor so the code reads without prose).
- `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, and similar when the rule catches real bugs or protects correctness or safety. Delete the suppression and `MUST KILL` the symbol that should be fixed instead.

Do not shorten a bad comment into a shorter bad comment. Delete it or keep it under the keep list only.