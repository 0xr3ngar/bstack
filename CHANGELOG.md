# bStack

## 0.2.0

### Minor Changes

- a20a84e: Rewrite skills around completing and checking the requested outcome. Coding guidance resolves routine uncertainty before asking for help. Implementation work opens a draft PR and follows the requesting user's comments through verified fixes and resolved threads. Once the user marks the PR ready, review feedback is explained with a recommendation and changes wait for their decision. Agents discover and use host PR event subscriptions first, with polling as a fallback. Comment cleanup preserves functional directives unless their removal passes checks. Time reports leave uncertain ticket allocations unattributed and reuse approved logging details.

## 0.1.1

### Patch Changes

- a09bfb9: Group the skills.sh listing by workflow and refresh it after releases. Simplify the README.

## 0.1.0

### Minor Changes

- 9d2312a: Package the six bStack skills for installation through skills.sh. Replace the Python time-report scanner with Bun TypeScript, keep manual invocation consistent across supported agents, and separate active work estimates from PR waiting time.
