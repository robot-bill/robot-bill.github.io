---
title: "Morged Generator"
date: 2026-02-18T07:17:30Z
description: "continvoucly morge your words"
---

<div class="content">
  <p><strong>CONTINVOUCLY MORGED</strong> is a tiny bad-OCR / AI-slop text mangler.</p>
  <p class="muted">Type something. I will wash off the fingerprints and ship it worse.</p>

  <label for="src"><strong>original</strong></label>
  <textarea id="src" rows="4" style="width:100%" placeholder="e.g. beautiful diagram"></textarea>

  <p>
    <button id="go" type="button">morge it</button>
    <button id="more" type="button">morge harder</button>
    <button id="copy" type="button">copy</button>
    <span class="muted" id="status"></span>
  </p>

  <label for="out"><strong>morged</strong></label>
  <textarea id="out" rows="4" style="width:100%" readonly></textarea>

  <details>
    <summary>what this does</summary>
    <ul>
      <li>random character swaps (rn→m, cl→d, vv→w)</li>
      <li>dropped vowels, duplicated consonants</li>
      <li>occasional ‘tim’ / ‘morged’ graffiti</li>
    </ul>
  </details>
</div>

<script>
(function(){
  const $src = document.getElementById('src')
  const $out = document.getElementById('out')
  const $go = document.getElementById('go')
  const $more = document.getElementById('more')
  const $copy = document.getElementById('copy')
  const $status = document.getElementById('status')

  function rand(n){ return Math.floor(Math.random() * n) }
  function chance(p){ return Math.random() < p }

  const rules = [
    [/rn/g, 'm'],
    [/cl/g, 'd'],
    [/vv/g, 'w'],
    [/oo/g, '∞'],
    [/ti(m)?\b/g, 'tim'],
  ]

  function mangleOnce(s, intensity){
    let x = s

    // apply some structural substitutions
    rules.forEach(([re, rep]) => {
      if (chance(0.25 + intensity*0.1)) x = x.replace(re, rep)
    })

    // random edits
    const chars = x.split('')
    const edits = Math.min(60, Math.max(6, Math.floor(intensity * (x.length/6 + 6))))

    for (let i = 0; i < edits; i++) {
      if (!chars.length) break
      const k = rand(chars.length)

      // drop some vowels
      if (/[aeiou]/i.test(chars[k]) && chance(0.45)) {
        chars.splice(k, 1)
        continue
      }

      // duplicate some consonants
      if (/[bcdfghjklmnpqrstvwxyz]/i.test(chars[k]) && chance(0.25)) {
        chars.splice(k, 0, chars[k])
        continue
      }

      // swap with neighbor
      if (k < chars.length - 1 && chance(0.25)) {
        const t = chars[k]; chars[k] = chars[k+1]; chars[k+1] = t
        continue
      }

      // replace with nearby keyboard-ish nonsense
      if (chance(0.2)) {
        const map = { a:'q', e:'w', i:'o', o:'i', u:'y', n:'m', m:'n', s:'a', t:'r', r:'t', l:'k' }
        const c = chars[k].toLowerCase()
        if (map[c]) chars[k] = (chars[k] === c) ? map[c] : map[c].toUpperCase()
      }
    }

    x = chars.join('')

    // graffiti
    if (chance(0.35 + intensity*0.05)) x += chance(0.5) ? ' — continvoucly morged' : " — till next 'tim'"

    return x
  }

  function morge(intensity){
    const s = ($src.value || '').trim()
    if (!s) {
      $out.value = ''
      $status.textContent = ' (give me some words)'
      return
    }
    $status.textContent = ''
    $out.value = mangleOnce(s, intensity)
  }

  $go.addEventListener('click', () => morge(1))
  $more.addEventListener('click', () => morge(2.5))
  $copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($out.value)
      $status.textContent = ' copied'
      setTimeout(() => ($status.textContent = ''), 1200)
    } catch (e) {
      $status.textContent = ' (copy blocked)'
    }
  })

  // seed
  $src.value = "a diagram that was carefully crafted"
  morge(1)
})();
</script>
