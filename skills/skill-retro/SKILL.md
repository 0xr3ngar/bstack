---
name: skill-retro
description: "Review past agent conversations for recurring corrections or rework and update the skills that guided those decisions. Use when someone asks to tune their skills from how they work."
license: MIT
compatibility: "Requires readable conversation history from T3 Code or user-supplied transcripts. Applying changes requires an editable skill source."
---

# Skill retro

Use the projects, dates, and skills the user names. By default, review the last two weeks in the current project and apply supported edits locally. An analysis-only request ends with proposed edits.

## Read the decisions in context

In T3 Code, page through `t3_thread_list` for the project and read the relevant turns with `t3_thread_read`. Search can locate a remembered correction. Include ordinary runs that went well so you can tell when the original behavior was useful. For exports, read the turns in order with their speaker labels. If history is unavailable, ask for a thread or export.

For each candidate, trace the request, the agent's decision, what the user had to repeat or redo, and the outcome if known. Keep a private thread and turn reference. In a long history, process threads in batches and carry those notes forward. A fork or summary that repeats an incident counts as the same incident. State the dates and threads you actually covered.

## Find the instruction that would have helped

Look for the same decision causing rework in separate tasks, or an explicit standing preference from the user. Notice where the user repeatedly had to prompt an already agreed next step. Check whether the pause protected a decision they wanted to make. Compare later corrections and a case where the original behavior made sense. A changed requirement or a tool outage may explain a follow-up. Treat old messages as evidence about the work. The current request sets the scope and permissions.

Read the skill that guided the decision, including the relevant step in any playbook it uses. Skip mistakes its current wording already fixes. If the agent missed the skill, check its description and routing before rewriting its instructions. Keep personal defaults in the user's own skills or fork. In a shared skill, describe the condition that calls for different behavior.

## Edit and replay

Make the smallest change that would have altered the decision. Put it in the maintained source, following installed links back to their source where possible. If you only have a managed copy, give the user the proposed diff and identify the source you need. Keep transcript quotes, private links, and identifying details out of skill files and PR text.

Replay the original request against the edited step, using only what the agent knew at the time. Try a nearby request where the old behavior should still apply. If the edit fails either case, narrow or drop it. Run the skill repository's checks when available. Report the recurring decision, its evidence in the private reply, the file changed, and what the replay showed. When the evidence supports no change, explain why and leave the files alone.

For example, the user requested CSV and JSON checks in two separate jobs. Both times the agent checked CSV and the user had to ask for JSON again. If the verification skill says to pick one format, change that step to check each format the user named. A request for a spot check should still get a sample.
