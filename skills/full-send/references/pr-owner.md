# Own one pull request

Follow the PR brief as written. Use this procedure in either build mode or as directed by a bug or change playbook.

1. For multiple units, fix the shared contracts first. Write the names and shapes in build/brief-<pr>.md, or a scratch brief for a bug or change. Give each unit a disjoint set of files.
2. If there is only one unit, build it yourself. Otherwise announce the model and effort for the builders, using the requested model or the configured implementer. Resolve them with `orchestrator_capabilities`. Respect the usage floor. Launch one builder per unit in parallel with `delegate_task`, shared isolation, `target.model` and the effort in `target.options`. Begin each task with `Read <absolute path>/delegates.md before anything else.` Use the installed [delegate rules](../../bmode-setup/references/delegates.md), then give the brief path and unit name. Include [coding best practices](../../coding-best-practices/SKILL.md) and [type system](../../type-system/SKILL.md) for typed code. Builders edit only their files and use read-only git. Check the resulting changes against the brief. Reject a unit that copies the old design or misses the plan. Send a fresh builder the brief and reason. After two failures, build the unit yourself.
3. Run the repository checks. Follow the plan's test table. Keep tests that can fail for a real defect. Diagnose failures with [root cause fix](../../root-cause-fix/SKILL.md).
4. Commit by purpose in a few commits and push the branch.
5. Follow “Prepare the change”, “Open the draft” and “Write the description” in [yeet](../../yeet/SKILL.md). Stop before its later sections. Call `link_pull_request`. For a dependent PR, run `gh stack link <lower> <this>`. Use plain base branches only if the extension is absent.
6. Prove the behavior on the repository's real surface. Record the cases and results.
7. Return the PR, head, checks, proof and gaps to the calling playbook. In a PR owner thread, deliver this as the last message.
