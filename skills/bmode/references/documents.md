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
  swarm/          plan-brief.md, plan-r<N>-<member>.md,
                    code-brief.md, code-r<N>-<area>.md
  build/            brief-<pr>.md, verify.md
  state.md          one dated line per completed phase or PR transition
```

Append `<date> <phase> <result>` to state.md. Use these entries in order as the work advances:

```text
framed origin=<thread>
researched
drafted
plan-swarm r<N> <scores>
plan-reviewed base=<branch>
handed-off <thread>
pr <n> <branch> <thread or inline> <started, handed-back or accepted>
built <prs>
verified
code-swarm r<N> <scores>
done
```

The originating thread records its ID at frame. Once handed off, the build thread owns build-state writes and relays reports through its parent. After internal plan review reaches the target, record plan-reviewed with the first PR base or trunk. A plan-first request in request.md requires an explicit build go-ahead for the current reviewed plan in state.md. Preserve this instruction across resumes and migration; a passing swarm review alone cannot release that handoff. Record an explicit user stop as paused, and append resumed when the user lifts it. Keep the original state history.

For older folders, recover the origin from the planning thread or launch record. Treat legacy `presented` and `approved base=<branch>` as historical progress. Inspect the plan and its latest swarm reports. If the current design passed, append plan-reviewed with the recorded or inferred base. Otherwise finish the internal review. Preserve existing handoffs, branches and PR progress. A later done or active build takes precedence. Honor any explicit user pause.

## Plan

Write about 1,100 words in three screens for the user and the builders. Start with one idea and one drawing. Show what the user writes and how one example moves through the system. Give one pseudocode block. Use tables for what changes by part and the PRs with their line estimates. Close with later work, limits and what to test first. End with a sentence naming `plan-details.md`.

Put exact contracts, pseudocode for each changed function, refusals and edge cases in the details. Assign files to build units. Give code and test line estimates per PR. Measure a comparable merged change in this repository with `git diff --shortstat`.

## Architecture proposal

Write about 1,300 words for managers and a senior reader new to the project. Write in the first person: “I propose”. Start with “In short”, then show one concrete example of the problem. Carry the same example through the proposal, how it works and the principles that explain the choices. Say when work can start. Number open questions and finish with limits.

Use connected prose except for the open questions and limits. Omit risks, rejected alternatives, earlier drafts, review history, PR counts, build order and the plan's name.

Follow the repository's writing rules and [unslop](../../unslop/SKILL.md). Draw figures as “Draw the diagram” in [yeet](../../yeet/SKILL.md) directs. Use short labels without sentences. Export each PNG at double size.
