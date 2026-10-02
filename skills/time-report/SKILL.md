---
name: time-report
description: "Find every Claude Code and Cursor conversation in a time range, measure how long each one took, and attribute the time to tickets and PRs. Optionally log the hours to Jira. Use for 'how much time did I spend yesterday', 'find my conversations and how long they took', 'log my hours', morning time reports."
---

# Time report

Measure how long the user worked, per ticket, from their conversation history. The default range is yesterday.

## 1. Scan the conversations

Run [the scanner](scripts/scan-sessions.ts) with Bun 1.4 or newer:

```bash
bun <skill-dir>/scripts/scan-sessions.ts --since YYYY-MM-DD --until YYYY-MM-DD
```

Both dates are local midnights and `--until` is exclusive. With no flags it scans yesterday. Pick the range from what the user asked, and if yesterday was a weekend day, ask whether they meant the last working day.

The script reads `~/.claude/projects/*/*.jsonl` and `~/.cursor/projects/*/agent-transcripts/**/*.jsonl`. It prints UTC timestamps in one JSON line per conversation with `source`, `project`, `file`, `start`, `end`, `active_seconds`, `first_prompt`, `tickets` (key and the time it was first mentioned), and `pull_requests`.

Conversations with less than one minute of estimated activity are omitted. Use `--home PATH` to scan another transcript directory and `--gap-minutes N` to change the idle threshold. No package installation is needed to run the scanner.

Active time is the sum of the gaps between messages that are shorter than 15 minutes. Longer gaps count as time away. Cursor timestamps user messages to the minute. The scanner uses the last write time as the final edge when it follows those messages. It does not use filesystem creation times.

## 2. Attribute time to tickets

- A conversation lists every ticket key it mentions, including keys it only read about. Open the transcript near each key's first mention and keep only the tickets the user actually worked on in that conversation (planned, implemented, opened or fixed a PR).
- When one conversation covers several tickets, split its active time by the stretch spent on each ticket if the transcript makes that clear. Otherwise split it evenly, and say so.
- Short conversations that another conversation started (security reviews, Cursor subagents, `/tmp` worktrees) overlap their parent. Don't add them on top of the parent's time.
- If a ticket has no conversation, say so. Don't invent time.

## 3. Add review time for merged PRs

For each ticket with a PR, get the open and merge times:

```bash
gh pr view <number> --repo <owner/repo> --json createdAt,mergedAt,state
```

Review time is from PR open to merge. Count only working hours (09:00 to 18:00 local), so nights and weekends are left out. Implementation time is the conversation time before the PR was opened.

## 4. Show the report

Show one table: ticket, PR and state, implementation time, review time, total. Give exact times down to the second. Then list conversations that matched no ticket, with their first prompt and active time, so the user can assign them.

Stop here unless the user asked to log the hours.

## 5. Log to Jira (only when asked)

Confirm the table with the user before writing anything. Then, for each ticket:

- Log the total as a worklog, with `started` set to the first activity. Jira only takes whole minutes, so round to the nearest minute.
- Add a comment with the exact breakdown: implementation time and where it came from, the PR open and merge times, and the rounding note.
- Move a ticket to Done only if its PR is merged and the user asked for it. The Done transition may accept the worklog in the same call.

If a ticket already has a worklog for the same work, update it instead of adding a second one.
