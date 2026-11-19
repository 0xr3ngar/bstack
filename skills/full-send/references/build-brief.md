# Build brief for <pull request>

## Work

Build <outcome>. Read <absolute paths to plan.md and plan-details.md>. Follow <repository instructions>. Keep <explicit exclusions> outside this PR.

Originating thread: <thread>. Return draft PRs and proof there. The feature request covers implementation and verification. For a blocker, give the evidence, recovery attempted and specific input needed.

## Branch and contracts

Work in <checkout>, on <branch>, from <base or lower PR link>. Use these shared contracts across the units:

| Name | Inputs or stored shape | Result | Callers |
| --- | --- | --- | --- |
| <contract> | <example> | <example> | <units> |

## Units

| Unit | Owned files | Required behavior | Proof |
| --- | --- | --- | --- |
| <name> | <disjoint paths> | <change> | <test or real-surface case> |

## Rules

Follow the plan's design and test table. Builders work alone, edit only assigned files, run no git command that changes the tree and publish nothing. Report evidence if a design decision fails. Leave changes to another unit's files to the PR owner.

## Builder report

Give the files and behavior changed, checks run, existing tests that broke and how you fixed them. Identify any change needed in another unit's file. Return the report in your last message.
