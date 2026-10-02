# bStack

[![skills.sh](https://img.shields.io/badge/skills.sh-bStack-black)](https://skills.sh/0xr3ngar/bstack)

Minimal, opinionated skills for AI agents.

## Skills

| Skill | What it does |
| --- | --- |
| [unslop](skills/unslop/SKILL.md) | Cut filler and template language from prose. |
| [bro](skills/bro/SKILL.md) | Restate the last response in plain language. |
| [coding-best-practices](skills/coding-best-practices/SKILL.md) | Keep changes small and TypeScript readable. |
| [no-comments](skills/no-comments/SKILL.md) | Remove redundant comments and flag unclear code. |
| [yeet](skills/yeet/SKILL.md) | Push a branch and open a draft PR. |
| [time-report](skills/time-report/SKILL.md) | Estimate time spent on tickets from agent conversation history. |

## Install

```bash
bunx --bun skills add 0xr3ngar/bstack
```

Or use `npx skills add 0xr3ngar/bstack`. Choose the skills and agent when prompted. Add `--global` to install across projects, or `--skill unslop` to pick one skill.

[Contributing](CONTRIBUTING.md) · [Releases](docs/releases.md) · [MIT license](LICENSE) · [Third-party notices](THIRD_PARTY_NOTICES.md)
