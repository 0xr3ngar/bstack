# Skill template

Copy the block below into `skills/<name>/SKILL.md`. Replace the name, description, requirements, and workflow before opening a PR.

```markdown
---
name: skill-name
description: Describe what the skill does and the requests that should trigger it.
license: MIT
compatibility: State required tools, runtimes, and external access.
---

# Skill name

State the outcome in one sentence.

## Scope

State the default scope and how to find missing context. Name the decisions or actions that need authority beyond the request.

## Work

Describe the task-specific steps the agent needs. Let it resolve routine uncertainty and recover from failures within scope.

## Completion

Define the evidence that proves the result. State what to deliver if a required tool or decision is unavailable. Finish independent work before handing back a blocker.

## Example

Show a realistic request and describe the expected result.
```

For a manual-only skill, add `disable-model-invocation: true` and the Codex policy described in [CONTRIBUTING.md](../CONTRIBUTING.md).
