---
name: pr-reply
description: Write or post GitHub PR comments, inline reviews, and thread replies on the user's behalf, with a compact author credit.
license: MIT
compatibility: Drafts need no external tools. Posting requires authenticated GitHub access.
---

# PR reply

Write the reply first. Leave a blank line, then add a small signature beneath a short burgundy rule. Use the image URL so the rule works in comments across repositories.

```md
Move the empty-list check above `rows[0]`. An empty CSV reaches that lookup before the parser can return its “no rows” error.

<img src="https://raw.githubusercontent.com/0xr3ngar/bstack/main/skills/pr-reply/assets/burgundy-rule.png" alt="" width="40" height="2"><br><sub>MODEL on behalf of USER</sub>
```

If the image is unavailable in the preview, omit the image and line break. Keep the small text signature as the only attribution.

Use the verified public name of the model that wrote the comment. If the harness does not expose it, use the harness name. Never guess. Use the user's known name or GitHub login for USER.

Apply the format to top-level PR comments, inline review comments, replies to reviewers or bots, and written explanations before resolving or dismissing feedback. Omit the attribution from PR descriptions, commit messages, and text the user explicitly asks to post verbatim without attribution.

Lead the reply with the conclusion. Cite the relevant code, behavior, check, or reproduction. Distinguish verified facts from judgment. Keep it concise and skip filler, canned thanks, and status narration.

Preview the final Markdown and check the whole comment, including quotes and attachments, for secrets or private details. Post only when authorized. If posting is unavailable, return the draft and explain what prevented publication.

After posting, verify the comment or review URL returned by GitHub. If the result is uncertain, check the thread before retrying. When asked to resolve a thread, confirm the reply was posted there first.
