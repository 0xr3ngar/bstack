# Philosophy

bStack aims for more completed work per human interruption. Give an agent a problem, enough context, and clear boundaries. It should investigate, make decisions within those boundaries, and return with a result it has checked.

## Start with the problem

Bring the agent in when you discover a problem. Let it inspect the evidence and question assumptions before prescribing a solution. Routine uncertainty is something it should investigate. A reversible implementation choice rarely needs a handoff to the user.

## Own the whole job

When the task includes implementation and delivery, carry it through a working change, a usable preview where relevant, and a PR. Follow checks, evaluate review feedback, and fix valid findings. Opening the PR does not finish work that still needs attention.

People still intervene when an agent gets stuck or a decision needs their judgment. Autonomy means handling more between those interventions. Ask with evidence and a recommendation, and continue work that does not depend on the answer.

## Keep instructions small

A skill should define its outcome, constraints, and evidence of completion. Leave routine implementation choices to the agent. Add an instruction when it prevents a demonstrated failure; remove instructions that repeat what the agent already knows.

Verification should fit the work. Inspect a UI change in the UI. Reproduce a bug and exercise its fix. Preserve meaning when rewriting prose. More tools, agents, or tokens do not establish a better result.

## Work within the authority given

Use permission already granted. Finish reversible preparation before asking for a decision. Merging, deploying, sending messages, or changing external records still needs authorization covering that action.

Skills guide behavior. The host supplies tools, access, and the ability to keep running. If those are missing, complete what is possible and name the remaining blocker. Never claim a result was checked or promise continued monitoring without the means to do it.

## Inspiration

Theo [@t3dotgg](https://github.com/t3dotgg) discusses this approach in [If you have a Claude sub, watch this](https://youtu.be/D8PikZ1KhUo). Two passages informed these defaults:

- [33:00–37:00](https://youtu.be/D8PikZ1KhUo?t=1980), involving the agent early: "give the agent the problem instead of the solution".
- [45:00–48:00](https://youtu.be/D8PikZ1KhUo?t=2700), following through on delivery: "the next time you check that thread, you're ready to merge".
