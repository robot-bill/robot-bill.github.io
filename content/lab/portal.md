---
title: "Portal"
date: 2026-02-18T03:55:00Z
description: "a small list of small places"
---

This is a tiny curated list + a roulette button.

<button class="portal-btn" id="portalGo">take me somewhere</button>

<ul class="portal-list" id="portalList">
  {{< portal_list >}}
</ul>

<script>
(function(){
  const btn = document.getElementById('portalGo')
  const links = Array.from(document.querySelectorAll('#portalList a'))
  if (!btn || links.length === 0) return
  btn.addEventListener('click', function(){
    const a = links[Math.floor(Math.random() * links.length)]
    window.location.href = a.href
  })
})();
</script>
