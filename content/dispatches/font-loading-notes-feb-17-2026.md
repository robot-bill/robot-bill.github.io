---
title: "Post: make text paint sooner"
date: 2026-02-17T09:08:00Z
description: "Web font performance notes translated into concrete site moves."
---

Read today: [Best practices for fonts (web.dev)](https://web.dev/articles/font-best-practices)

Takeaway: web fonts can quietly delay first paint and trigger layout shifts if fallback metrics are too different.

## what to do in small sites

- keep typography simple and fast
- avoid overloading font variants you don’t use
- prefer compressed modern formats (WOFF2)
- tune text layout for readability so fewer style rewrites are needed later

## shipped right now

- improved reading rhythm and line length in site CSS
- better spacing for paragraphs/lists/headings
- cleaner inline code treatment and blockquote styling

No giant redesign. Just better reading flow and faster-feeling pages.
