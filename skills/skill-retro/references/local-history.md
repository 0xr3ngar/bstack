# Local conversation history

Look for existing sessions on disk even when T3 has results. Use the user's configured history locations first. Resolve the requested repository and its worktrees before reading turns. For an all-time review, include archived sessions and old project folders. When dates are specified, filter by turn timestamps. A resumed session can contain turns from several dates.

| Source | Where to look | How to read it |
| --- | --- | --- |
| Claude Code | `projects/*/*.jsonl` under `CLAUDE_CONFIG_DIR` or `~/.claude` | Match the recorded `cwd` to the project. Read user and assistant text from `message.content` in file order. A tool result inside a user record is tool output. |
| Cursor | `~/.cursor/projects/<project>/agent-transcripts/`, including nested directories | Match the project folder to the workspace. For JSONL, use `role` and the text in `message.content`. When present, `<user_query>` marks the user's words. Read older text transcripts by their speaker labels. |
| Codex | `sessions/` and `archived_sessions/` under `CODEX_HOME` or `~/.codex`, recursively | Match `session_meta.payload.cwd` to the project. Read `response_item` messages by `payload.role` and their text blocks. Skip duplicate event summaries and distinguish injected context from the user's request. |

Cursor can also store chats in its desktop application data. Match `User/workspaceStorage/<workspaceId>/workspace.json` to the requested workspace. Open `User/globalStorage/state.vscdb` read-only and select `composerId` from `composerHeaders` for that `workspaceId`, including archived rows. Older layouts list composer IDs in the workspace database's `ItemTable` under `composer.composerData`.

For each matching composer ID, read its `composerData:<id>` and `bubbleId:<id>:…` entries from the global database's `cursorDiskKV` table. Follow the conversation's message order. If the installed version uses a different layout, use its history viewer or a supplied export.

Keep tool calls and outputs as context for what happened. Attribute a correction only to a user turn. When you cannot establish the project or a requested date from the records, report the coverage gap.
