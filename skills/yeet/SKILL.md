---
name: yeet
description: Push the branch and open a draft PR. Trigger on "yeet".
disable-model-invocation: true
---

# Yeet

Push `HEAD`, open a **draft** PR with `gh`. If this branch already has a PR, link it and stop.

Commits: one conventional subject (`type(scope): imperative summary`, no period). After a blank line, Linux-style git trailers only (`Assisted-by: Vendor:model` per line for each model that touched the work). No paragraphs or other body text.

PR title matches the main commit subject. PR body explains the change, written with **unslop**. Do not post PR comments unless the user asked.
