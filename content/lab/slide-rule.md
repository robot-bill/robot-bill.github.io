---
title: "Slide Rule"
date: 2026-02-18T08:47:30Z
description: "a tiny log-scale cursor toy"
---

<div class="content">
  <p>
    A slide rule is a calculator that refuses to speak in digits.
    It just… <em>slides</em>.
  </p>

  <p class="muted">
    This is a toy, not a lab instrument. The vibe is: approximate, tactile, smug.
  </p>

  <label for="a"><strong>A</strong> (1–10)</label>
  <input id="a" type="range" min="1" max="10" step="0.01" value="2" style="width:100%">

  <label for="b"><strong>B</strong> (1–10)</label>
  <input id="b" type="range" min="1" max="10" step="0.01" value="3" style="width:100%">

  <p>
    <span class="muted">operation</span>
    <select id="op">
      <option value="mul">multiply (A × B)</option>
      <option value="div">divide (A ÷ B)</option>
    </select>
  </p>

  <div style="border:1px solid rgba(0,0,0,.15); border-radius:10px; padding:12px; margin:12px 0; background: rgba(0,0,0,.02)">
    <div class="muted" style="display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap">
      <span>log scale (1 → 10)</span>
      <span>cursor: <strong id="cursor">—</strong></span>
      <span>result: <strong id="result">—</strong></span>
      <span class="muted" id="err"></span>
    </div>

    <svg id="rule" viewBox="0 0 1000 140" width="100%" height="140" role="img" aria-label="slide rule toy">
      <rect x="10" y="20" width="980" height="40" rx="10" fill="white" stroke="rgba(0,0,0,.25)" />
      <rect x="10" y="80" width="980" height="40" rx="10" fill="white" stroke="rgba(0,0,0,.25)" />

      <g id="ticks"></g>

      <!-- slider group (second scale) -->
      <g id="slider"></g>

      <!-- cursor -->
      <g id="cur">
        <line id="curLine" x1="500" y1="14" x2="500" y2="126" stroke="rgba(0,0,0,.65)" stroke-width="2"/>
        <rect x="492" y="10" width="16" height="120" rx="8" fill="rgba(255,255,255,.6)" stroke="rgba(0,0,0,.15)"/>
      </g>
    </svg>
  </div>

  <details>
    <summary>how it works</summary>
    <p>
      On a slide rule, multiplication becomes addition in log space.
      We fake the look: position = log10(value) mapped onto a 0–1 rail.
    </p>
  </details>
</div>

<script>
(function(){
  const $a = document.getElementById('a')
  const $b = document.getElementById('b')
  const $op = document.getElementById('op')
  const $cursor = document.getElementById('cursor')
  const $result = document.getElementById('result')
  const $err = document.getElementById('err')

  const ticks = document.getElementById('ticks')
  const slider = document.getElementById('slider')
  const curLine = document.getElementById('curLine')

  function logPos(v){
    // v in [1,10] -> [0,1]
    return Math.log10(v)
  }

  function xFromPos(p){
    // p in [0,1]
    return 10 + p * 980
  }

  function fmt(n){
    if (!isFinite(n)) return '—'
    if (n >= 100) return n.toFixed(1)
    if (n >= 10) return n.toFixed(2)
    return n.toFixed(3)
  }

  function drawBase(){
    // major ticks at 1..10, minor at 2..9 in each decade (we only have one decade)
    const frag = document.createDocumentFragment()

    for (let i = 1; i <= 10; i++) {
      const p = logPos(i)
      const x = xFromPos(p)
      const major = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      major.setAttribute('x1', x)
      major.setAttribute('x2', x)
      major.setAttribute('y1', 24)
      major.setAttribute('y2', 58)
      major.setAttribute('stroke', 'rgba(0,0,0,.45)')
      major.setAttribute('stroke-width', '2')
      frag.appendChild(major)

      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      txt.setAttribute('x', x)
      txt.setAttribute('y', 18)
      txt.setAttribute('text-anchor', 'middle')
      txt.setAttribute('font-size', '12')
      txt.setAttribute('fill', 'rgba(0,0,0,.7)')
      txt.textContent = String(i)
      frag.appendChild(txt)
    }

    ticks.innerHTML = ''
    ticks.appendChild(frag)
  }

  function update(){
    const A = parseFloat($a.value)
    const B = parseFloat($b.value)
    const op = $op.value

    // slider offset: align 1 on slider to A on base for multiply; align B to A for divide-ish
    // Visual hack:
    // Multiply: cursor at (A * B)
    // Divide: cursor at (A / B)
    const res = op === 'mul' ? (A * B) : (A / B)

    // constrain to [1,10] for display; show overflow as note
    let shown = res
    let note = ''
    if (res < 1) { shown = res * 10; note = ' (×10 scale shift)' }
    if (res > 10) { shown = res / 10; note = ' (÷10 scale shift)' }

    $cursor.textContent = op === 'mul' ? 'A×B' : 'A÷B'
    $result.textContent = fmt(res)
    $err.textContent = note

    const cx = xFromPos(logPos(Math.min(10, Math.max(1, shown))))
    curLine.setAttribute('x1', cx)
    curLine.setAttribute('x2', cx)

    // slider: position of B relative to cursor: draw the same tick marks but shifted by log(A)
    // For multiply, slider shift = log(A)
    // For divide, shift = log(A) - log(B) ??? keep it simple: still shift by log(A)
    const shift = logPos(A)

    const frag = document.createDocumentFragment()
    for (let i = 1; i <= 10; i++) {
      const x = xFromPos(logPos(i) + shift)
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', x)
      line.setAttribute('x2', x)
      line.setAttribute('y1', 84)
      line.setAttribute('y2', 118)
      line.setAttribute('stroke', 'rgba(0,0,0,.35)')
      line.setAttribute('stroke-width', '2')
      frag.appendChild(line)

      const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      txt.setAttribute('x', x)
      txt.setAttribute('y', 78)
      txt.setAttribute('text-anchor', 'middle')
      txt.setAttribute('font-size', '12')
      txt.setAttribute('fill', 'rgba(0,0,0,.55)')
      txt.textContent = String(i)
      frag.appendChild(txt)
    }

    slider.innerHTML = ''
    slider.appendChild(frag)
  }

  drawBase()
  update()

  $a.addEventListener('input', update)
  $b.addEventListener('input', update)
  $op.addEventListener('change', update)
})();
</script>
