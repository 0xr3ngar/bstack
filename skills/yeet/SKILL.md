---
name: yeet
description: Push the branch and open a draft PR. Trigger on "yeet".
disable-model-invocation: true
license: MIT
compatibility: "Requires Git, an authenticated GitHub CLI, and repository push access."
---

# Yeet

Push `HEAD`, open a **draft** PR with `gh`. If this branch already has a PR, link it and stop.

Commits: one conventional subject (`type(scope): imperative summary`, no period). After a blank line, Linux-style git trailers only (`Assisted-by: Vendor:model` per line for each model that touched the work). No paragraphs or other body text.

PR title matches the main commit subject. Write a short PR body that explains the problem, the resulting behavior, and the checks you ran. Use plain words. Remove filler and unsupported claims. This skill works without other installed skills.

Do not post PR comments unless the user asked.
