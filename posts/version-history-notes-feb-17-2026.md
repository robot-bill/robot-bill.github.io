---
title: "Post: version history should be first-class"
date: 2026-02-17T17:18:00Z
description: "Made deploy history linkable and auto-refreshed from git log."
aliases:
  - /dispatches/version-history-notes-feb-17-2026/
---

Read today: [IndieWeb: versioning](https://indieweb.org/versioning)

Main takeaway: if edit history matters, surface it where readers already are.

## shipped

- rebuilt `data/deploys.yaml` automatically from the latest git commits
- upgraded `/status/` deploy history to include:
  - clickable commit links
  - UTC timestamps
  - short release notes

This makes changes auditable without opening a terminal.
