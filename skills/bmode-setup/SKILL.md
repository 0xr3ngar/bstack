---
name: bmode-setup
description: "Configure models and preferences for T3 Code when the user requests setup or starts a first run."
license: MIT
compatibility: "Requires T3 Code and its MCP server `t3-code`, Git, and an authenticated GitHub CLI."
---

# Bmode-setup

Read the [defaults and T3 Code tools](references/defaults.md). Stop if the t3-code MCP server is unavailable. Read existing preferences before changing them.

Before asking the model setup questions, check the [three provider catalogs](references/defaults.md#swarm-presets) and their release notes for the latest models, including providers disabled locally. Show what's current for each provider and link the source. If a lookup fails, say which provider's latest releases you could not verify. Offer newer models as alternatives. Keep the listed defaults and the user's saved choices until they choose a change.

Check local availability with `orchestrator_capabilities`. Use its `search` option for models missing from the shortlist. Match each model to its serving provider and use the effort options that provider exposes. Show disabled providers and missing models as unavailable. If the user requests an unavailable model, let them choose a replacement.

When the user explicitly requests setup, ask the four questions together. During feature work, apply requested values, saved preferences and defaults without a setup interview. If a required model choice has no value, ask only for that choice when the phase needs it.

1. Which model should orchestrate features? Suggest Fable 5.2 at high effort.
2. Which model should implement changes? Suggest Opus 5.5 at high effort.
3. Which reviewers should a plain `/swarm` use by default? Show the user's saved lineup first and let them keep it. They can combine any [provider presets](references/defaults.md#swarm-presets), choose **All recommended** across all three, or pick individual models. Show **Claude Code + Cursor** and **Claude Code + Codex** as shortcuts when available. Expand each choice into its available reviewers, flag any missing models, and let the user add or remove members before saving. A lineup needs at least two models.
4. Which other settings should change? Show each current value. Build mode accepts `threads` or `inline`.

Write one line per override in `~/.config/bstack/preferences.md`. Always save each selected member's provider instance and model ID on the swarm line. Omit other values that match a default. Keep the workflow fixed.

Before launching delegates, announce their models and effort. Start each message with `Read <absolute path>/delegates.md before anything else.` Use the absolute path of the [delegate instructions](references/delegates.md). Check claims before using them. Start fresh delegates for a new round and pass earlier reports as files.
