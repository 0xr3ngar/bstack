---
name: coding-best-practices
description: Implement or review code through a verified result. Keep changes small and TypeScript readable.
disable-model-invocation: true
license: MIT
compatibility: "Requires access to the code under review."
---

# Coding best practices

Own the requested change through a working, verified result. Start with the problem and inspect the relevant code before choosing a solution.

## Resolve what you can

Use the repository, existing behavior, logs, and a reproduction to fill gaps. Make routine, reversible choices and state assumptions that affect the result. A short plan helps when the work has dependencies; a small fix does not need a planning ceremony.

Ask when missing information changes the intended outcome or exceeds your authority. Explain what you found and recommend a choice. Keep working on independent parts while waiting.

## Keep the change small

Implement the simplest solution that satisfies the request. Follow the repository's conventions. Avoid speculative options, one-use abstractions, and unrelated cleanup. Remove code your change makes obsolete and preserve other people's work.

A bug fix should address the cause. Reproduce the failure when possible, trace it, and check that the fix changes the observed behavior. Do not hide failures with fallback values or guards that make the symptom disappear.

## Write readable TypeScript

- Use named functions, clear values, and early returns. Prefer `const`; return a computed value instead of declaring a variable and assigning it across branches.
- Let a `switch` return the result or handler for each case. Use a lookup object for fixed data mappings.
- Use loops when they make a transformation easier to follow. Avoid dense chains and nested ternaries; do not turn a simple expression into a framework.
- Parse external data at input boundaries with the project's schema tools. Trust validated internal types. Do not scatter generic record guards through business logic.
- Model distinct states with types. Do not use casts, non-null assertions, or `any` to conceal missing validation.
- Keep inputs unchanged unless mutation is part of the function's contract. Keep mutable state local and small.

## Finish the job

Choose checks that could expose a wrong result. Run the changed behavior and the relevant repository checks. Add a focused test when it protects meaningful behavior; avoid tests that merely repeat the implementation. For a UI change, inspect the UI. A type check alone does not prove the feature works.

Investigate failures caused by the change, fix them, and rerun affected checks. If an approach keeps failing, revisit the cause instead of repeating it. For a blocker outside your control, finish the work you can and report the evidence and the specific missing input or access.

For implementation tasks in a repository that uses PRs, deliver a draft PR and tell the user it is ready for their comments. While it is a draft, follow comments attributable to the requesting user, fix and verify the changes, and resolve addressed threads. Present other reviewers' feedback with a recommendation. Once the user marks the PR ready, explain all new feedback and wait for their decision before making review changes or resolving threads. Recheck the PR state before publishing a fix.

Inspect the host's PR event tools and use an existing subscription or register one for the PR. Confirm it is active. Prefer subscriptions or listeners; poll only when event delivery is unavailable. Check the available tools before reporting a monitoring limitation, and preserve enough context to avoid repeating completed work.

Continue through the delivery steps the user authorized. Merge, deployment, and messages require authority from the request or an applicable project policy. Do not ask for permission already given. Report the result, how you checked it, and any remaining limitation.
