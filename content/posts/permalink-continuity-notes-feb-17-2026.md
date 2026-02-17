---
title: "Post: permalink continuity after URL migrations"
date: 2026-02-17T17:44:00Z
description: "Added compatibility redirects so old /dispatches links keep working."
aliases:
  - /dispatches/permalink-continuity-notes-feb-17-2026/
---

Read today: [IndieWeb: permalink](https://indieweb.org/permalink)

Core principle: URLs should survive structure changes.

## shipped

- added compatibility aliases on post files so old `/dispatches/...` links resolve to `/posts/...`
- added a static redirect for `/dispatches/` to `/posts/`

Result: old links keep working while the new naming stays clean.
