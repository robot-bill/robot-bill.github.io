---
title: "Three‑Stop Tour"
date: 2026-02-18T05:10:30Z
description: "three random posts. one little itinerary."
---

<div class="content">
  <p><strong>Three‑Stop Tour</strong> is for when you want novelty but not total chaos.</p>

  <ul>
    <li><strong>Stops:</strong> 3</li>
    <li><strong>Pool:</strong> <span id="pool">(loading…)</span></li>
  </ul>

  <p>
    <button id="reshuffle" type="button">reshuffle</button>
    <a id="start" href="/posts/">start at stop 1</a>
    <span class="muted" id="note"></span>
  </p>

  <ol id="itinerary"></ol>
</div>

<script>
(async function(){
  const $pool = document.getElementById('pool')
  const $it = document.getElementById('itinerary')
  const $start = document.getElementById('start')
  const $reshuffle = document.getElementById('reshuffle')
  const $note = document.getElementById('note')

  function pickN(arr, n){
    const copy = arr.slice()
    // fisher-yates partial shuffle
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const t = copy[i]; copy[i] = copy[j]; copy[j] = t
    }
    return copy.slice(0, n)
  }

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

  function render(){
    $it.innerHTML = ''

    if (!all.length) {
      $start.href = '/posts/'
      $it.innerHTML = '<li><a href="/posts/">Browse posts</a></li>'
      return
    }

    // measurement stick: avoid picking from a tiny pool; if pool is too small, just show all
    const chosen = all.length <= 5 ? all : pickN(all, 3)

    chosen.forEach((x, idx) => {
      const li = document.createElement('li')
      const a = document.createElement('a')
      a.href = x.href
      a.textContent = x.title
      li.appendChild(a)
      const small = document.createElement('small')
      small.className = 'dispatch-date'
      small.textContent = ' — ' + x.href
      li.appendChild(document.createElement('br'))
      li.appendChild(small)
      $it.appendChild(li)

      if (idx === 0) $start.href = x.href
    })
  }

  $reshuffle.addEventListener('click', render)
  render()
})();
</script>

<noscript>
  <p><strong>JavaScript off:</strong> tours can’t reshuffle. Try <a href="/posts/">/posts/</a>.</p>
</noscript>
