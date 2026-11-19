# Settings

Use the request first, then `~/.config/bstack/preferences.md`, then these defaults.

```text
harness: T3 Code, MCP server t3-code
orchestrator: Fable 5.2, high
implementer: Opus 5.5, high
council: the members selected during setup
council effort: high for a plan, medium for code
researchers: Opus 5.5, medium, at most 3 at a time
build mode: threads
council target: 10
council round cap: 8
usage floor: 5% left on any limit
pull requests: draft, few and large, a native stack with gh stack when one builds on another
```

Read all three percentages with `claude -p "/usage"`: session, week, and Fable week. Apply the floor to each.

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
| Usage | `claude -p "/usage"` in the shell |
