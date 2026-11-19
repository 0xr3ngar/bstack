# bStack

## 1.0.0

### Major Changes

- Release bStack 1.0. Start with `/bmode` to take a feature request through swarm review, implementation, and verification to a draft pull request. Configure models with `/bmode-setup` or run a review directly with `/swarm`.

## 0.6.0

### Minor Changes

- 3f9b013: Add configurable swarm reviews and seven design and investigation skills. Retire pr-debate and no-comments. Ask before posting replies or resolving review threads.
- 6a12817: Route requests through nine playbooks. Hand internally reviewed feature plans to a fresh build thread. Return verified draft pull requests to the originating conversation.

## 0.5.0

### Minor Changes

- 4913f11: Change how yeet writes a PR description. The description is now one or two sentences, a hand-drawn diagram of the change with a short explanation under it, and before and after screenshots for visible changes. Images are uploaded with `gh pr edit --attach`.

## 0.4.0

### Minor Changes

- 95a8366: Add the presentation skill. It builds an HTML slide deck with hand-drawn diagrams and an animated Clawd, about a topic you give or about your merged work of the last two weeks.

## 0.3.0

### Minor Changes

- 0dbcf7b: Add the pr-debate skill. A reviewer, a skeptic, and a judge argue over each review comment for up to three rounds, and you get only the comments the judge keeps.

## 0.2.0

### Minor Changes

- a20a84e: Rewrite skills around completing and checking the requested outcome. Coding guidance resolves routine uncertainty before asking for help. Implementation work opens a draft PR and follows the requesting user's comments through verified fixes and resolved threads. Once the user marks the PR ready, review feedback is explained with a recommendation and changes wait for their decision. Agents discover and use host PR event subscriptions first, with polling as a fallback. Comment cleanup preserves functional directives unless their removal passes checks. Time reports leave uncertain ticket allocations unattributed and reuse approved logging details.

## 0.1.1

### Patch Changes

- a09bfb9: Group the skills.sh listing by workflow and refresh it after releases. Simplify the README.

## 0.1.0

### Minor Changes

- 9d2312a: Package the six bStack skills for installation through skills.sh. Replace the Python time-report scanner with Bun TypeScript, keep manual invocation consistent across supported agents, and separate active work estimates from PR waiting time.
