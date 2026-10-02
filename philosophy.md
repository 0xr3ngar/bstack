# Philosophy

bStack aims for more completed work per human interruption. Give an agent a problem, enough context, and clear boundaries. It should investigate, make decisions within those boundaries, and return with a result it has checked.

## Start with the problem

Give the agent a chance to solve the problem before spending your own time designing the solution. Let it inspect the evidence and try a simple approach. If it solves the problem, review the result. If it struggles, put on your thinking hat and help it work out why. Save your attention for the parts that need your judgment.

Routine uncertainty is something the agent should investigate. A reversible implementation choice rarely needs a handoff to the user.

## Own the whole job

For an implementation task, produce a working change, a usable preview where relevant, and a draft PR. Tell the user the draft is open and ready for their comments. They can review on GitHub or in their review tool of choice.

While the PR is a draft, listen for the user's comments, fix the issues, check the changes, and resolve the addressed threads. Keep that back-and-forth going without requiring the user to copy comments into chat. Bring feedback from other reviewers to the user with a recommendation.

The user decides when to mark the PR ready for review. From then on, explain incoming feedback and recommend whether to address it. Wait for their decision before changing code or resolving threads. The PR's state determines how the agent handles feedback; making it ready does not authorize a merge.

People still intervene when an agent gets stuck or a decision needs their judgment. Autonomy means handling more between those interventions. Ask with evidence and a recommendation, and continue work that does not depend on the answer.

## Keep instructions small

A skill should define its outcome, constraints, and evidence of completion. Leave routine implementation choices to the agent. Add an instruction when it prevents a demonstrated failure; remove instructions that repeat what the agent already knows.

Verification should fit the work. Inspect a UI change in the UI. Reproduce a bug and exercise its fix. Preserve meaning when rewriting prose. More tools, agents, or tokens do not establish a better result.

## Work within the authority given

Use permission already granted. Finish reversible preparation before asking for a decision. Merging, deploying, sending messages, or changing external records still needs authorization covering that action.

Use the host's PR event subscriptions or listeners to continue when feedback arrives. Discover and use that support before falling back to polling or asking the user to resume the task. Confirm the listener is active. If access or event support is missing, finish what is possible and name the specific blocker.

## Inspiration

Theo [@t3dotgg](https://github.com/t3dotgg) discusses this approach in [If you have a Claude sub, watch this](https://youtu.be/D8PikZ1KhUo). Two passages informed these defaults:

- [33:00–37:00](https://youtu.be/D8PikZ1KhUo?t=1980), involving the agent early: "give the agent the problem instead of the solution".
- [45:00–48:00](https://youtu.be/D8PikZ1KhUo?t=2700), following through on delivery: "the next time you check that thread, you're ready to merge".
