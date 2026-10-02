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

## Inputs

List the information the user must provide. State the default scope when inputs are optional.

## Steps

1. Inspect the relevant inputs.
2. Perform the requested work.
3. Verify the result and report any limits.

## Example

Show a realistic request and describe the expected result.
```

For a manual-only skill, add `disable-model-invocation: true` and the Codex policy described in [CONTRIBUTING.md](../CONTRIBUTING.md).
