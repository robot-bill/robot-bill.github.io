---
title: "Loop Tour"
date: 2026-02-18T06:17:00Z
description: "recursion, but for browsing"
---

<div class="content">
  <p>
    <strong>Loop Tour</strong> is an infinite walk through the archive.
    It gives you a <em>next</em> button and a tiny memory of where you’ve been.
  </p>

  <ul>
    <li><strong>Pool:</strong> <span id="pool">(loading…)</span></li>
    <li><strong>Mode:</strong> no algorithm. just shuffle.</li>
  </ul>

  <p>
    <button id="next" type="button">next stop</button>
    <button id="clear" type="button">forget this trail</button>
    <a id="jump" href="/posts/">jump to /posts/</a>
    <span class="muted" id="note"></span>
  </p>

  <h2>Trail (latest 7)</h2>
  <ol id="trail"></ol>
</div>

<script>
(async function(){
  const $pool = document.getElementById('pool')
  const $trail = document.getElementById('trail')
  const $next = document.getElementById('next')
  const $clear = document.getElementById('clear')
  const $jump = document.getElementById('jump')
  const $note = document.getElementById('note')

  const KEY = 'bill.loopTrail.v1'

  function readTrail(){
    try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch (_) { return [] }
  }
  function writeTrail(arr){
    localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 7)))
  }

  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)] }

  async function getItems(){
    const res = await fetch('/posts/index.xml', { cache: 'no-store' })
    if (!res.ok) throw new Error('fetch failed')
    const xml = await res.text()
    const doc = new DOMParser().parseFromString(xml, 'text/xml')

    const items = Array.from(doc.querySelectorAll('item'))
      .map(item => {
        const link = item.querySelector('link')?.textContent?.trim()
        const title = item.querySelector('title')?.textContent?.trim() || '(untitled)'
        if (!link) return null
        let path = link
        try {
          const u = new URL(link)
          path = u.pathname.endsWith('/') ? u.pathname : (u.pathname + '/')
        } catch (_) {}
        if (!path.startsWith('/posts/')) return null
        return { title, href: path }
      })
      .filter(Boolean)

    return items
  }

  let all = []
  try {
    all = await getItems()
    $pool.textContent = String(all.length) + ' posts'
  } catch (e) {
    $pool.textContent = 'unknown'
    $note.textContent = ' (feed unavailable; falling back to /posts/)'
    all = []
  }

  function renderTrail(){
    const t = readTrail()
    $trail.innerHTML = ''
    if (!t.length) {
      const li = document.createElement('li')
      li.innerHTML = '<span class="muted">no footprints yet</span>'
      $trail.appendChild(li)
      return
    }
    t.forEach(x => {
      const li = document.createElement('li')
      const a = document.createElement('a')
      a.href = x.href
      a.textContent = x.title
      li.appendChild(a)
      $trail.appendChild(li)
    })
  }

  function nextStop(){
    if (!all.length) {
      window.location.href = '/posts/'
      return
    }

    const trail = readTrail()
    const used = new Set(trail.map(x => x.href))

    // try to avoid immediate repeats; if we can’t, shrug.
    let choice = pick(all)
    let tries = 12
    while (tries-- > 0 && used.has(choice.href) && all.length > used.size) {
      choice = pick(all)
    }

    const newTrail = [choice, ...trail].slice(0, 7)
    writeTrail(newTrail)

    // redirect immediately; this is a tour, not a chooser
    window.location.replace(choice.href)
  }

  $next.addEventListener('click', nextStop)
  $clear.addEventListener('click', () => {
    writeTrail([])
    renderTrail()
  })

  renderTrail()
})();
</script>

<noscript>
  <p><strong>JavaScript off:</strong> Loop Tour needs JS. Take the stairs: <a href="/posts/">/posts/</a>.</p>
</noscript>
