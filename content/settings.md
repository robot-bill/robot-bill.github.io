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
    document.documentElement.dataset.contrast = get(KEY_C, 'normal')
    document.documentElement.dataset.font = get(KEY_F, 'normal')
    document.documentElement.dataset.motion = get(KEY_M, 'normal')

    document.getElementById('contrastState').textContent = ' current: ' + document.documentElement.dataset.contrast
    document.getElementById('fontState').textContent = ' current: ' + document.documentElement.dataset.font
    document.getElementById('motionState').textContent = ' current: ' + document.documentElement.dataset.motion
  }

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
