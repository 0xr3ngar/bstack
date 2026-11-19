# bStack

[![skills.sh](https://img.shields.io/badge/skills.sh-bStack-black)](https://skills.sh/0xr3ngar/bstack)

[Why bStack?](docs/why-bstack.md) · [Contributing](CONTRIBUTING.md) · [Releases](docs/releases.md) · [MIT license](LICENSE) · [Third-party notices](THIRD_PARTY_NOTICES.md)

Start a T3 Code thread with `/bmode`, describe the feature, and go do something else. Seriously, you can leave the tab. If you spend the next twenty minutes watching an agent type, I’ve built you a very elaborate loading screen.

The idea is that the agents can wait on you. The lead coordinates a swarm to plan, build, test, and review the change. You come back to a verified draft PR or a specific question that needs your input.

Want to read the plan first? Add “show me the plan before you build” to your request. The lead waits for your go-ahead before starting `/full-send`.

You can also give it a PR to review. It leads with a verdict, shows the code behind each finding and lets you choose which comments to post.

Set your preferred models with `/bmode-setup`. The same workflow applies across repositories.

Please steal this setup. Fork bStack, keep the skills you like, and rewrite the ones that annoy you. Your agents can learn your bad habits instead of mine.

## Install

```bash
bunx --bun skills add 0xr3ngar/bstack
```

Or use `npx skills add 0xr3ngar/bstack`. Choose the skills and agent when prompted. Add `--global` to install across projects, or `--skill unslop` to pick one skill.

## Skills

| Skill | What it does |
| --- | --- |
| [bmode](skills/bmode/SKILL.md) | Route each request. For a feature, plan, build, verify and return draft PRs in the same conversation. |
| [bmode-setup](skills/bmode-setup/SKILL.md) | Choose models and set workflow preferences. |
| [swarm](skills/swarm/SKILL.md) | Review a plan, code change or open question in rounds. |
| [full-send](skills/full-send/SKILL.md) | Build an internally reviewed feature plan and return draft PRs and proof to the originating thread. |
| [yeet](skills/yeet/SKILL.md) | Open a draft PR and work through your review comments. |
| [why](skills/why/SKILL.md) | Trace a decision through its history. |
| [coding-best-practices](skills/coding-best-practices/SKILL.md) | Deliver verified changes with small diffs and readable TypeScript. |
| [user-first](skills/user-first/SKILL.md) | Design from the user’s side of a change. |
| [exhaust-the-design-space](skills/exhaust-the-design-space/SKILL.md) | Compare concrete designs before choosing one. |
| [foundational-thinking](skills/foundational-thinking/SKILL.md) | Define data and contracts before writing logic. |
| [root-cause-fix](skills/root-cause-fix/SKILL.md) | Trace a failure to its first wrong decision. |
| [redesign-from-first-principles](skills/redesign-from-first-principles/SKILL.md) | Migrate every caller of a redesigned contract. |
| [type-system](skills/type-system/SKILL.md) | Represent valid states in types. |
| [unslop](skills/unslop/SKILL.md) | Cut filler and template language from prose. |
| [bro](skills/bro/SKILL.md) | Restate the last response in plain language. |
| [presentation](skills/presentation/SKILL.md) | Build a slide deck with hand-drawn diagrams and Clawd, by default about your last two weeks. |
| [time-report](skills/time-report/SKILL.md) | Estimate time spent on tickets from agent conversation history. |
