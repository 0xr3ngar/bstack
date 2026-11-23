---
name: scout
description: "Use for \"how does X work\", \"walk me through this repository\", \"where does Y happen\", and before work in code the user does not know."
disable-model-invocation: true
license: MIT
compatibility: "Requires read access to the repository. Uses Git, the GitHub CLI, subagents and T3 Code's HTML preview when they are present."
---

# Scout

Research how a repository or a feature works. Explain it so the user can act without reading the code.

## Scope

`/scout <prompt>` names a feature, a flow, a folder or a whole repository. With no prompt, scout the current repository. For a repository that is not checked out, clone it into a scratch folder.

Read only. Leave files, tickets and pull requests alone. If the prompt fits two subjects, pick the likelier one and name it in the first line.

## Research

- Read the repository's instructions, readme and documents first.
- For a repository, find what it is for, how it runs, its main parts, how they connect and where to start reading.
- For a feature, find its entry point: a route, a command, an event or a user action. Trace one real request from there to its effect, such as a stored record, an outside call or a response. Note the shape of the data at each boundary.
- Read the tests. They show the behavior the authors meant.
- Open every file you cite. Run the code or its tests when a run can settle what reading cannot.
- For a broad subject, give each part to a read-only subagent. Check its `path:line` references before you use them.
- For the reason behind a decision, use [why](../why/SKILL.md). Without it, read the commits and pull requests that introduced the code.

## Explain

1. Answer first, in two or three sentences.
2. Draw one diagram of the flow or the structure, as "Draw the diagram" in [yeet](../yeet/SKILL.md) describes. Without yeet, draw it in HTML with about ten shapes and short labels. In T3 Code, show it in the chat with `html_preview` and then `html_render`. In another harness, give the path of the screenshot. If you cannot draw, write the flow as a numbered list.
3. Walk the path in order. Give each step one short sentence and a `path:line` link.
4. Name the three to five files to read first.
5. Say what would surprise a newcomer: hidden coupling, a misleading name, dead code, a rule that lives in one place only.
6. Say what you could not find out, and mark each inference as an inference.

Follow [unslop](../unslop/SKILL.md). Without it, use plain words and short, whole sentences. Keep the explanation to about one screen. Go deeper only on the part the user asks about next.

## Completion

Every claim has a reference that you opened. The diagram is on the screen, or the reply says why it is missing.

## Example

`/scout how does a release get published` returns a short answer, a diagram from the merged pull request to the published version, the steps with links into the workflow and the release script, the files to read first, and the manual step that no document mentions.
