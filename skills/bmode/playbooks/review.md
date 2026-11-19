# Review

Read the PR, description and diff at its head with read-only git and gh. Read the surrounding code. Review only this PR's changes.

Lead the review with “sign off”, “look at these points first” or “do not merge”. Give the gist in at most three lines.

Number findings, worst first. Check each in the code and state your confidence. Report a defect with the input or state and wrong result, a pattern that breaks a written repository rule, or code that fails to do what the description promises. Exclude unwritten style preferences, mixed versions during deployment and work another PR owns.

Check each point the user supplied and say whether it holds. Make one careful pass by default. On “be extra careful”, “find bugs” or “swarm”, run [swarm](../../swarm/SKILL.md) on this PR for the rounds requested.

For each finding the user wants to raise, show one short draft comment in the user's voice. Use a question for an uncertain point. Skip the summary comment. Post only the specific comments the user approves, on instruction to post. Approve the PR only on separate instruction.
