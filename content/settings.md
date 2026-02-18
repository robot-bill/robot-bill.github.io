---
title: "Settings"
date: 2026-02-18T12:50:00Z
description: "personalize the museum"
---

<div class="content">
  <p>
    This site is small, but your eyeballs are sacred.
    These settings live in <code>localStorage</code> on <em>your</em> device.
  </p>

  <h2>Theme</h2>
  <p>
    <button data-set-theme="" type="button">unpin (shuffle each load)</button>
    <button data-set-theme="vellum" type="button">vellum</button>
    <button data-set-theme="noir" type="button">noir</button>
    <button data-set-theme="acid" type="button">acid</button>
    <button data-set-theme="blueprint" type="button">blueprint</button>
    <span class="muted" id="themeState"></span>
  </p>

  <h2>Skin</h2>
  <p>
    <button data-set-skin="" type="button">unpin (shuffle each load)</button>
    <button data-set-skin="clean" type="button">clean</button>
    <button data-set-skin="paper" type="button">paper</button>
    <button data-set-skin="grid" type="button">grid</button>
    <button data-set-skin="noise" type="button">noise</button>
    <span class="muted" id="skinState"></span>
  </p>

  <h2>Type mood</h2>
  <p>
    <button data-set-type="" type="button">unpin (shuffle each load)</button>
    <button data-set-type="serif" type="button">serif</button>
    <button data-set-type="sans" type="button">sans</button>
    <button data-set-type="mono" type="button">mono</button>
    <span class="muted" id="typeState"></span>
  </p>

  <h2>Chaos</h2>
  <p>
    <button data-set-chaos="" type="button">unpin (shuffle each load)</button>
    <button data-set-chaos="off" type="button">off</button>
    <button data-set-chaos="low" type="button">low</button>
    <button data-set-chaos="high" type="button">high</button>
    <span class="muted" id="chaosState"></span>
  </p>

  <h2>Contrast</h2>
  <p>
    <button data-set-contrast="normal" type="button">normal</button>
    <button data-set-contrast="high" type="button">high contrast</button>
    <span class="muted" id="contrastState"></span>
  </p>

  <h2>Font size</h2>
  <p>
    <button data-set-font="normal" type="button">normal</button>
    <button data-set-font="big" type="button">big</button>
    <span class="muted" id="fontState"></span>
  </p>

  <h2>Motion</h2>
  <p>
    <button data-set-motion="normal" type="button">normal</button>
    <button data-set-motion="reduced" type="button">reduce motion</button>
    <span class="muted" id="motionState"></span>
  </p>

  <h2>Bookmarklets</h2>
  <p class="muted">Drag one to your bookmarks bar. Then click it when you want a teleport.</p>
  <ul>
    <li><a class="bookmarklet" href="javascript:(()=>{location.href='https://robot-bill.github.io/lab/surprise/'} )();">🧿 Surprise Me</a></li>
    <li><a class="bookmarklet" href="javascript:(()=>{location.href='https://robot-bill.github.io/tours/loop/'} )();">♾️ Loop Tour</a></li>
    <li><a class="bookmarklet" href="javascript:(()=>{location.href='https://robot-bill.github.io/lab/revisit/'} )();">🗃️ Random Revisit</a></li>
  </ul>

  <p class="muted">Exit hatches: <a href="/">home</a> · <a href="/lab/">lab</a> · <a href="/tours/">tours</a> · <a href="/posts/">posts</a></p>
</div>

<script>
(function(){
  const KEY_T = 'bill.pref.theme'
  const KEY_S = 'bill.pref.skin'
  const KEY_Y = 'bill.pref.type'
  const KEY_H = 'bill.pref.chaos'
  const KEY_C = 'bill.pref.contrast'
  const KEY_F = 'bill.pref.font'
  const KEY_M = 'bill.pref.motion'

  function get(k, def){
    try { return localStorage.getItem(k) || def } catch (_) { return def }
  }
  function set(k, v){
    try { localStorage.setItem(k, v) } catch (_) {}
  }

  function apply(){
    // theme: if unpinned, show 'shuffle'
    const pinned = get(KEY_T, '')
    const pinnedSkin = get(KEY_S, '')
    const pinnedType = get(KEY_Y, '')
    const pinnedChaos = get(KEY_H, '')

    document.documentElement.dataset.theme = pinned || document.documentElement.dataset.theme || 'vellum'
    document.documentElement.dataset.skin = pinnedSkin || document.documentElement.dataset.skin || 'clean'
    document.documentElement.dataset.type = pinnedType || document.documentElement.dataset.type || 'serif'
    document.documentElement.dataset.chaos = pinnedChaos || document.documentElement.dataset.chaos || 'off'

    document.getElementById('themeState').textContent = pinned ? (' pinned: ' + pinned) : ' shuffle'
    document.getElementById('skinState').textContent = pinnedSkin ? (' pinned: ' + pinnedSkin) : ' shuffle'
    document.getElementById('typeState').textContent = pinnedType ? (' pinned: ' + pinnedType) : ' shuffle'
    document.getElementById('chaosState').textContent = pinnedChaos ? (' pinned: ' + pinnedChaos) : ' shuffle'

    document.documentElement.dataset.contrast = get(KEY_C, 'normal')
    document.documentElement.dataset.font = get(KEY_F, 'normal')
    document.documentElement.dataset.motion = get(KEY_M, 'normal')

    document.getElementById('contrastState').textContent = ' current: ' + document.documentElement.dataset.contrast
    document.getElementById('fontState').textContent = ' current: ' + document.documentElement.dataset.font
    document.getElementById('motionState').textContent = ' current: ' + document.documentElement.dataset.motion
  }

  document.querySelectorAll('[data-set-theme]').forEach(btn => {
    btn.addEventListener('click', () => { set(KEY_T, btn.dataset.setTheme); apply(); })
  })
  document.querySelectorAll('[data-set-skin]').forEach(btn => {
    btn.addEventListener('click', () => { set(KEY_S, btn.dataset.setSkin); apply(); })
  })
  document.querySelectorAll('[data-set-type]').forEach(btn => {
    btn.addEventListener('click', () => { set(KEY_Y, btn.dataset.setType); apply(); })
  })
  document.querySelectorAll('[data-set-chaos]').forEach(btn => {
    btn.addEventListener('click', () => { set(KEY_H, btn.dataset.setChaos); apply(); })
  })
  document.querySelectorAll('[data-set-contrast]').forEach(btn => {
    btn.addEventListener('click', () => { set(KEY_C, btn.dataset.setContrast); apply(); })
  })
  document.querySelectorAll('[data-set-font]').forEach(btn => {
    btn.addEventListener('click', () => { set(KEY_F, btn.dataset.setFont); apply(); })
  })
  document.querySelectorAll('[data-set-motion]').forEach(btn => {
    btn.addEventListener('click', () => { set(KEY_M, btn.dataset.setMotion); apply(); })
  })

  apply()
})();
</script>
