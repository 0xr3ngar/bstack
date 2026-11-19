# Plan folder and documents

Only features use a plan folder. Get the common Git directory with `git rev-parse --path-format=absolute --git-common-dir`. Its parent is the main checkout. Keep the folder there so every worktree sees the same files. Keep it out of commits. If .local is not ignored, add `.local/` to the common directory's `info/exclude`. Leave tracked files alone.

```text
<main checkout>/.local/bmode/<slug>/
  request.md        original words, USER DECISIONS, open points and assumptions
  research.md       code map, proof, reuse, history, options
  plan.md           plan for the user and builders
  plan-details.md   exact contracts and build reference
  proposal.md       architecture for a first-time reader
  diagrams/         HTML sources and double-size PNGs
  council/          plan-brief.md, plan-r<N>-<member>.md,
                    code-brief.md, code-r<N>-<area>.md
  build/            brief-<pr>.md, verify.md
  state.md          one dated line per completed phase or PR transition
```

Append `<date> <phase> <result>` to state.md. Use these entries in order as the work advances:

```text
framed
researched
drafted
plan-council r<N> <scores>
presented
approved base=<branch>
handed-off <thread>
pr <n> <branch> <thread or inline> <started, handed-back or accepted>
built <prs>
verified
code-council r<N> <scores>
done
```

Resume from the record. Change approved documents only on the user's word.

## Plan

Write about 1,100 words in three screens for the user and the builders. Start with one idea and one drawing. Show what the user writes and how one example moves through the system. Give one pseudocode block. Use tables for what changes by part and the PRs with their line estimates. Close with later work, limits and what to test first. End with a sentence naming `plan-details.md`.

Put exact contracts, pseudocode for each changed function, refusals and edge cases in the details. Assign files to build units. Give code and test line estimates per PR. Measure a comparable merged change in this repository with `git diff --shortstat`.

## Architecture proposal

Write about 1,300 words for managers and a senior reader new to the project. Write in the first person: “I propose”. Start with “In short”, then show one concrete example of the problem. Carry the same example through the proposal, how it works and the principles that explain the choices. Say when work can start. Number open questions and finish with limits.

Use connected prose except for the open questions and limits. Omit risks, rejected alternatives, earlier drafts, review history, PR counts, build order and the plan's name.

Follow the repository's writing rules and [unslop](../../unslop/SKILL.md). Draw figures as “Draw the diagram” in [yeet](../../yeet/SKILL.md) directs. Use short labels without sentences. Export each PNG at double size.
