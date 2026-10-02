# Philosophy

bStack aims for more completed work per human interruption. Give an agent a problem, enough context, and clear boundaries. It should investigate, make decisions within those boundaries, and return with a result it has checked.

## Bring the agent in early

Theo [@t3dotgg](https://github.com/t3dotgg) describes this in [If you have a Claude sub, watch this](https://youtu.be/D8PikZ1KhUo). In the [33:00–37:00 passage](https://youtu.be/D8PikZ1KhUo?t=1980), he argues for involving the agent when you discover a problem, before prescribing a solution:

> give the agent the problem instead of the solution

That [line at 34:31](https://youtu.be/D8PikZ1KhUo?t=2071) informs how bStack skills start. Inspect the evidence, question assumptions, and look for a simpler fix. Routine uncertainty is something the agent should investigate.

## Own the whole job

In the [45:00–48:00 passage](https://youtu.be/D8PikZ1KhUo?t=2700), Theo describes handing over implementation, a usable preview, the PR, and follow-up. His aim is that:

> the next time you check that thread, you're ready to merge

The [line at 47:09](https://youtu.be/D8PikZ1KhUo?t=2829) gives us a useful completion standard. When those steps are in scope, opening a PR is part of the job. The agent should inspect the result, follow checks, evaluate review feedback, and fix valid findings.

Theo also describes intervening when an agent gets stuck or needs his judgment. Autonomy expands how much work happens between those interventions. For bStack, that means asking with evidence and a recommendation when a decision needs the user, while continuing work that does not depend on the answer.

## Keep instructions small

A skill should define its outcome, constraints, and evidence of completion. Leave routine implementation choices to the agent. Add an instruction when it prevents a demonstrated failure; remove instructions that repeat what the agent already knows.

Verification should fit the work. Inspect a UI change in the UI. Reproduce a bug and exercise its fix. Preserve meaning when rewriting prose. More tools, agents, or tokens do not establish a better result.

## Work within the authority given

Use permission already granted. Finish reversible preparation before asking for a decision. Merging, deploying, sending messages, or changing external records still needs authorization covering that action.

Skills guide behavior. The host supplies tools, access, and the ability to keep running. If those are missing, complete what is possible and name the remaining blocker. Never claim a result was checked or promise continued monitoring without the means to do it.
