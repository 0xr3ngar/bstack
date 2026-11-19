# Settings

Use the request first, then `~/.config/bstack/preferences.md`, then these defaults.

```text
harness: T3 Code, MCP server t3-code
orchestrator: Fable 5.2, high
implementer: Opus 5.5, high
swarm: the members selected during setup
swarm effort: high for a plan, medium for code
researchers: Opus 5.5, medium, at most 3 at a time
build mode: threads
swarm target: 10
swarm round cap: 8
usage floor: 5% left on any limit
pull requests: draft, few and large, a native stack with gh stack when one builds on another
```

## Provider usage

At feature preflight, list the model and actual provider account selected for each role (lead, researchers, builders and swarm members), including request overrides. Check all assigned accounts. Before launching a batch or review round, refresh the accounts it will use. Route by the provider serving the model: a Claude model served by Cursor consumes Cursor usage. Read each shared account once per check and include any limits specific to its selected models.

| Provider | How to read the active account’s allowance |
| --- | --- |
| Claude | Run `claude -p "/usage"` for that account. Read the session, weekly and model-specific windows it reports. |
| Codex | Use the authenticated Codex app server’s `account/rateLimits/read` request after initialization, or `/status` in the matching CLI session. Check primary and secondary windows in the applicable model buckets and shared limits. |
| Cursor | Read included usage and limits from the signed-in account’s [usage dashboard](https://cursor.com/dashboard?tab=usage). An already configured CodexBar CLI can also report Cursor usage with `codexbar usage --provider cursor --format json`. |

Use a matching live provider report. Convert percent used to percent remaining; for an allowance shown as amounts, compare remaining and total in the same units and billing period. Spend alone, an auth status or a model listing cannot establish headroom. If an applicable limit is missing or unreadable, identify the account and missing reading and ask for that reading before using it. At or below the floor, finish in-flight work and hold new launches that rely on that limit. Never silently switch providers.

A feature request authorizes planning, implementation, verification and draft PRs. If the user asks to see the plan first, wait for their go-ahead before starting the build. The originating thread returns the results.

## T3 Code tools

| Need | Tool of `t3-code` |
| --- | --- |
| The models and their options | `orchestrator_capabilities` |
| Read or set a thread's model and effort | `t3_thread_configure` |
| A delegate: researcher, reviewer or builder | `delegate_task` with `isolation: "shared"`, the model in `target.model`, the effort in `target.options` |
| Read or stop a delegate | `task_status`, `task_cancel` |
| One thread in its own worktree | `t3_thread_launch` with `workspaceStrategy` and `modelSelection` |
| Wait for a thread and its delegates, then read its report | `t3_thread_wait` with `untilDelegatedWorkSettled: true`, then `t3_thread_read` |
| Send a fix or a question to a thread | `t3_thread_send`. A thread that sends to itself uses mode `queue`. |
| Stop a thread that a skill started | `t3_thread_send`, mode `restart`, with the stop message of the route stop rule. The thread stops every agent that it started. |
| Find and read an earlier thread | `t3_thread_search`, `t3_thread_read` |
| A page in the chat | `html_preview`, then `html_render` |
| Text that the user must read before the turn ends | `send_to_user` |
| Link a pull request | `link_pull_request` |
| Watch a pull request, the lead only | `watch_pull_request`, `unwatch_pull_request` |
| Usage | The selected accounts’ [provider usage reports](#provider-usage) |
