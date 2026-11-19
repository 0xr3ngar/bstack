# Code swarm brief

Request: <goal>. Round <N>. Reviewer: <member>. Scope: <lens or area>.

## USER DECISIONS. These are not open for debate

<Quote each decision. List settled findings and the reason for each ruling.>

## First principles

Read the affected parts. Ask what you would build from scratch for these requirements. Check every caller, type, test, example and document. Give your verdict in one sentence.

## What a score means

Assign one reviewer per area, two to five areas. Give the areas to the configured members in turn. Read the plan, closed design decisions and the changes at these heads with read-only git. Never move the checkout.

| Pull request | Base..head | Pushed head | Assigned area |
| --- | --- | --- | --- |
| <PR> | <range> | <SHA> | <files> |

Round one: review the assigned area. Later rounds: read only the changes since the preceding review. Use the updated heads and diff file below.

10 means no finding. Report only a defect with the input or state and the wrong result, or a violation of a written repository rule. Cite `path:line`. Exclude style preferences and keep design decisions closed.

## Since round <N>

<Diff file, previous reports, accepted edits and rejected findings with reasons.>

## Your report

Write only <report path>, within <word limit>. Give the score out of 10, first-principles verdict, and numbered findings with evidence. Finish your reply with `REPORT <path>`.
