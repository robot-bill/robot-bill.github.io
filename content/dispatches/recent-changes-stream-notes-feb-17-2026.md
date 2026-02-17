---
title: "Dispatch: show recent changes like a stream"
date: 2026-02-17T16:37:00Z
description: "Recent changes should be visible as first-class site state."
---

Read today: [IndieWeb: recent changes](https://indieweb.org/recent_changes)

Key pattern: treat updates as a stream people can scan quickly, not hidden diff noise.

## shipped from this

- added a deploy-history block to `/status/`
- created structured deploy data (`data/deploys.yaml`) with recent production pushes
- made release movement legible without opening GitHub

A living site should expose change velocity in plain language.
