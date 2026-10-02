#!/usr/bin/env python3
"""List Claude Code and Cursor conversations in a time range with their active time.

Usage: scan_sessions.py [--since 2026-10-01] [--until 2026-10-02] [--gap-minutes 15]
Defaults to yesterday (local time). Prints one JSON object per conversation.
"""

import argparse
import glob
import json
import os
import re
from datetime import datetime, timedelta, timezone

TICKET_PATTERN = re.compile(r"\b[A-Z][A-Z0-9]+-\d{2,}\b")
SYSTEM_REMINDER_PATTERN = re.compile(r"<system-reminder>.*?</system-reminder>", re.DOTALL)
PR_PATTERN = re.compile(r"github\.com/[\w.-]+/[\w.-]+/pull/\d+")
CURSOR_TIMESTAMP_PATTERN = re.compile(r"<timestamp>([^<]+)</timestamp>")


def parse_args():
    today = datetime.now().astimezone().replace(hour=0, minute=0, second=0, microsecond=0)
    parser = argparse.ArgumentParser()
    parser.add_argument("--since", default=(today - timedelta(days=1)).date().isoformat())
    parser.add_argument("--until", default=today.date().isoformat())
    parser.add_argument("--gap-minutes", type=int, default=15)
    return parser.parse_args()


def local_midnight(date_text):
    return datetime.fromisoformat(date_text).astimezone()


def parse_cursor_timestamp(text):
    # Example: "Wednesday, Sep 30, 2026, 10:36 AM (UTC+2)"
    match = re.match(r"\w+, (\w+ \d+, \d+, \d+:\d+ [AP]M) \(UTC([+-]\d+)\)", text)
    if match is None:
        return None
    naive = datetime.strptime(match.group(1), "%b %d, %Y, %I:%M %p")
    offset = timezone(timedelta(hours=int(match.group(2))))
    return naive.replace(tzinfo=offset)


def first_user_prompt(record):
    message = record.get("message", {})
    content = message.get("content")
    if isinstance(content, str):
        return content
    if not isinstance(content, list):
        return ""
    for part in content:
        if isinstance(part, dict) and part.get("type") == "text":
            return part.get("text", "")
    return ""


def conversation_text(record):
    # Only what the user typed and what the assistant wrote or ran.
    # Tool results and system context repeat ticket keys from git logs and memory.
    content = record.get("message", {}).get("content")
    if record.get("type") == "assistant":
        return json.dumps(content)
    if record.get("type") != "user":
        return ""
    if isinstance(content, str):
        return SYSTEM_REMINDER_PATTERN.sub("", content)
    if not isinstance(content, list):
        return ""
    texts = []
    for part in content:
        if isinstance(part, dict) and part.get("type") == "text":
            texts.append(SYSTEM_REMINDER_PATTERN.sub("", part.get("text", "")))
    return " ".join(texts)


def read_claude_session(path):
    times = []
    prompt = ""
    tickets = {}
    pull_requests = set()
    for line in open(path, errors="ignore"):
        try:
            record = json.loads(line)
        except json.JSONDecodeError:
            continue
        stamp = record.get("timestamp")
        if not stamp:
            continue
        moment = datetime.fromisoformat(stamp.replace("Z", "+00:00"))
        times.append(moment)
        is_user_text = record.get("type") == "user" and not prompt
        if is_user_text:
            text = first_user_prompt(record)
            if text and not text.startswith("<"):
                prompt = text
        searchable = conversation_text(record)
        for key in TICKET_PATTERN.findall(searchable):
            if key not in tickets:
                tickets[key] = moment
        for url in PR_PATTERN.findall(searchable):
            pull_requests.add(url)
    return times, prompt, tickets, pull_requests


def read_cursor_session(path):
    times = []
    prompt = ""
    tickets = {}
    pull_requests = set()
    last_moment = None
    for line in open(path, errors="ignore"):
        try:
            record = json.loads(line)
        except json.JSONDecodeError:
            continue
        if record.get("role") == "user":
            text = first_user_prompt(record)
            match = CURSOR_TIMESTAMP_PATTERN.search(text)
            if match is not None:
                moment = parse_cursor_timestamp(match.group(1))
                if moment is not None:
                    times.append(moment)
                    last_moment = moment
            if not prompt:
                prompt = re.sub(r"<timestamp>.*?</timestamp>\s*", "", text)
        for key in TICKET_PATTERN.findall(line):
            if key not in tickets and last_moment is not None:
                tickets[key] = last_moment
        for url in PR_PATTERN.findall(line):
            pull_requests.add(url)
    # Cursor only stamps user messages, so the file's creation and last write mark the edges.
    stat = os.stat(path)
    times.append(datetime.fromtimestamp(stat.st_birthtime).astimezone())
    times.append(datetime.fromtimestamp(stat.st_mtime).astimezone())
    return times, prompt, tickets, pull_requests


def active_seconds(times, since, until, gap_seconds):
    inside = []
    for moment in times:
        if since <= moment < until:
            inside.append(moment)
    inside.sort()
    total = 0.0
    for previous, current in zip(inside, inside[1:]):
        gap = (current - previous).total_seconds()
        if gap < gap_seconds:
            total += gap
    return total, inside


def main():
    args = parse_args()
    since = local_midnight(args.since)
    until = local_midnight(args.until)
    gap_seconds = args.gap_minutes * 60

    sources = []
    for path in glob.glob(os.path.expanduser("~/.claude/projects/*/*.jsonl")):
        # T3 Code spawns short sessions that only generate thread titles.
        if "claude-title" in path:
            continue
        sources.append(("claude", path))
    for path in glob.glob(os.path.expanduser("~/.cursor/projects/*/agent-transcripts/**/*.jsonl"), recursive=True):
        sources.append(("cursor", path))

    for source, path in sources:
        modified = datetime.fromtimestamp(os.path.getmtime(path)).astimezone()
        if modified < since:
            continue
        if source == "claude":
            times, prompt, tickets, pull_requests = read_claude_session(path)
        else:
            times, prompt, tickets, pull_requests = read_cursor_session(path)
        seconds, inside = active_seconds(times, since, until, gap_seconds)
        if seconds < 60:
            continue
        print(json.dumps({
            "source": source,
            "project": os.path.basename(os.path.dirname(path)) if source == "claude" else path.split("/projects/")[1].split("/")[0],
            "file": path,
            "start": inside[0].astimezone().isoformat(timespec="seconds"),
            "end": inside[-1].astimezone().isoformat(timespec="seconds"),
            "active_seconds": round(seconds),
            "first_prompt": prompt[:200].replace("\n", " "),
            "tickets": {key: moment.astimezone().isoformat(timespec="seconds") for key, moment in tickets.items()},
            "pull_requests": sorted(pull_requests),
        }))


if __name__ == "__main__":
    main()
