# Upkeep

Fetch and rebase only the user's commits onto the base. Push with `--force-with-lease`. Restack dependent PRs lowest first with `gh stack`. If another thread holds the branch, send it the rebase with `t3_thread_send`.

Read each whole thread and the code. Fix what the user calls valid. For each other comment, give a verdict, the reason and a draft reply in the user's voice. Post or resolve only on the user's instruction.

Reproduce a red check and check whether the base fails. Fix and push. The lead watches with `watch_pull_request` and releases the watch with `unwatch_pull_request` at handback. Merge only on the user's word for that PR.
