# bstack

My personal AI agent skills. I use most of them almost every day. Each one is a short workflow you invoke by name or attach to a message.

## Skills

- **unslop**: rewrite text so it does not read like a template.
- **no-comments**: list comments in scope, delete the removable ones, flag symbols that need code fixes.
- **coding-best-practices**: plan work, keep diffs small, write readable TypeScript.
- **yeet**: push the branch and open a draft PR with `gh`, conventional commits, and an unslop PR body.
- **bro**: restate the last reply in plain language, no jargon.
- **time-report**: find your Claude Code and Cursor conversations for a day, measure how long each took per ticket, and optionally log the hours to Jira.

## Install

Copy or symlink `skills/*` into wherever your agent loads skills (for example `.cursor/skills` or a personal skills directory). Each skill is one folder with a `SKILL.md` file.

## Credits

Some skills started from [pstack](https://github.com/cursor/plugins/tree/main/pstack) by [poteto](https://github.com/poteto). This repo trims and rewrites them for bstack.
