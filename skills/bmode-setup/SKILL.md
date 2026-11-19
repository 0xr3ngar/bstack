---
name: bmode-setup
description: "Configure models and preferences for T3 Code when the user requests setup or starts a first run."
license: MIT
compatibility: "Requires T3 Code and its MCP server `t3-code`, Git, and an authenticated GitHub CLI."
---

# Bmode-setup

Read the [defaults and T3 Code tools](references/defaults.md). Stop if the t3-code MCP server is unavailable. Read existing preferences before changing them.

List Claude, Codex and Cursor models with `orchestrator_capabilities`. Show disabled providers as unavailable. Use the effort option each provider exposes. Report a missing model and wait for the user to choose one.

When the user explicitly requests setup, ask the four questions together. During feature work, apply requested values, saved preferences and defaults without a setup interview. If a required model choice has no value, ask only for that choice when the phase needs it.

1. Which model should orchestrate features? Suggest Fable 5.2 at high effort.
2. Which model should implement changes? Suggest Opus 5.5 at high effort.
3. Which two or more models should review together? Offer Claude models and mark models from other providers as preferred for an independent review. Suggest Opus 5.5, Fable 5.2 and one strong model from each other enabled provider.
4. Which other settings should change? Show each current value. Build mode accepts `threads` or `inline`.

Write one line per override in `~/.config/bstack/preferences.md`. Always save the selected council members. Omit values that match a default. Keep the workflow fixed.

Before launching delegates, announce their models and effort. Start each message with `Read <absolute path>/delegates.md before anything else.` Use the absolute path of the [delegate instructions](references/delegates.md). Check claims before using them. Start fresh delegates for a new round and pass earlier reports as files.
