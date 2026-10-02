---
name: unslop
description: Rewrite text so it reads like a person wrote it, not a template.
disable-model-invocation: true
license: MIT
compatibility: "No external tools required."
---

# Unslop

Polish prose, docs, skills, commit messages, or chat replies. Keep the facts and the tone the author wanted. Change wording only unless the caller asked for structural edits too.

## How to work

1. Read for meaning first.
2. Walk the checklist below. Mark what applies.
3. Rewrite. Do not invent sources, numbers, or claims that were not there before.

## Be specific or cut

- **Hanging -ing phrases** ("highlighting...", "ensuring...", "showcasing...", "fostering..."). Delete them or replace with a named source or fact.
- **Anonymous authority** ("Experts believe", "Industry reports suggest"). Name the source or drop the sentence.
- **Empty endings** ("The future looks bright."). Replace with a concrete next step or fact.
- **Vague praise of the product** ("SQL you can read", "types that follow your schema"). State the mechanism: what function returns, what fails at compile time, what number changed. If you cannot turn the line into an instruction, fact, or metric, delete it. If the same sentence could live in any repo's README unchanged, it belongs nowhere.

## Use normal words

- **Stock AI words:** additionally, crucial, delve, enduring, enhance, fostering, garner, interplay, intricate, landscape (abstract sense), pivotal, showcase, tapestry (abstract), testament, underscore, vibrant.
- **Fancy "is":** serves as, stands as, boasts, features → is, has.
- **Office synonyms:** utilize, leverage, facilitate, numerous, in the event that → use, help, many, if.
- **Metaphor packaging:** substrate, wedge, vector, locus, vantage, nexus, primitive (as noun), harness, bedrock, scaffolding, modality, paradigm, gold-plating, ratchet, evacuate (for code moves), endgame, north star, flywheel, "API surface". Pick the literal noun or verb. "Wedge in" → add. "Gold-plating" → more than the task needs.

## Say the point once

- **"Not just X, but Y."** Give Y alone.
- **Forced triplets.** Use two items or four if that is the real count.
- **Synonym roulette.** One term per referent in a passage.
- **Fake ranges** ("from onboarding to excellence"). List the topics.
- **Aphorisms and cute fragments** when a plain sentence works. No personified code ("the plan holds it") or figurative verbs ("rides along") unless the piece is clearly informal fiction.

## Punctuation and layout

- **Mid-sentence colons.** Fine before a list or example. Not as a hinge between two versions of the same idea. Rewrite as two sentences.
- **Dash-as-pause.** If you would splice two clauses with a long dash, use a period or comma instead. Hyphens inside compound words are fine.
- **Bold** on every proper noun or acronym.
- **Label lists that repeat the label** ("**Performance:** Performance improved..."). Merge into one sentence. A bold title plus new detail on the next clause is fine.
- **Title Case In Headings** → sentence case.
- **Emoji in headings or bullets.**
- **Curly quotes** → straight quotes.

## Do not sound like support chat

- Drop "I hope this helps!", "Let me know if...", "Of course!", "Certainly!", "Found the smoking gun!"
- Drop flattery ("Great question!", "You're absolutely right!"). Answer the question.

## Tighten sentences

- **Filler:** "In order to" → to. "Due to the fact that" → because. Delete "It is important to note that".
- **Stacked hedges** → one modal ("may", "might") or a direct statement.
- **Passive** when the actor matters: "queries are validated" → "the compiler validates queries". Passive is fine when nobody cares who did it.
- **Adverb + weak verb:** swap for a stronger verb or a number ("significantly improves" → the measured delta).
- **Telegraphic notes** ("Parser rejects bad date → exit 2"). Write full sentences with articles and verbs; spell out arrows.
