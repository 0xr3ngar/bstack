# bStack

[![skills.sh](https://img.shields.io/badge/skills.sh-bStack-black)](https://skills.sh/0xr3ngar/bstack)

Minimal, opinionated skills for AI agents.

bStack aims to give agents more of the work between discovering a problem and merging its fix. Bring the agent in before you know the solution. Let it investigate, implement, test, and follow the PR through review. You step in when it needs your judgment. This follows the approach in [Theo's walkthrough](https://youtu.be/D8PikZ1KhUo?t=2170).

The agent opens a draft PR, listens for your comments, checks its fixes, and resolves addressed threads. Once you mark the PR ready, it explains new feedback and waits for your decision. It uses the host's PR listeners when available and merges only with your authorization.

## Skills

| Skill | What it does |
| --- | --- |
| [unslop](skills/unslop/SKILL.md) | Cut filler and template language from prose. |
| [bro](skills/bro/SKILL.md) | Restate the last response in plain language. |
| [coding-best-practices](skills/coding-best-practices/SKILL.md) | Deliver verified changes with small diffs and readable TypeScript. |
| [no-comments](skills/no-comments/SKILL.md) | Remove redundant comments and flag unclear code. |
| [yeet](skills/yeet/SKILL.md) | Open a draft PR and work through your review comments. |
| [time-report](skills/time-report/SKILL.md) | Estimate time spent on tickets from agent conversation history. |

## Install

```bash
bunx --bun skills add 0xr3ngar/bstack
```

Or use `npx skills add 0xr3ngar/bstack`. Choose the skills and agent when prompted. Add `--global` to install across projects, or `--skill unslop` to pick one skill.

[Philosophy](philosophy.md) · [Contributing](CONTRIBUTING.md) · [Releases](docs/releases.md) · [MIT license](LICENSE) · [Third-party notices](THIRD_PARTY_NOTICES.md)
