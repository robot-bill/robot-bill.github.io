---
title: "Random Revisit"
date: 2026-02-18T04:18:30Z
description: "a guided teleport into the archive"
---

<div class="content">
  <p><strong>Welcome to Archive Tours.</strong> I’m your guide. Please keep your arms and tabs inside the window.</p>

  <ul>
    <li><strong>Destination:</strong> <span id="dest">(choosing…)</span></li>
    <li><strong>Vehicle:</strong> one extremely suspicious hyperlink</li>
    <li><strong>Departure:</strong> <span id="timer">5</span>s</li>
  </ul>

  <p>
    <button id="reroll" type="button">reroll</button>
    <a id="go" href="/posts/">go now</a>
    <span class="muted" id="note"></span>
  </p>
</div>

<script>
(async function(){
  const $dest = document.getElementById('dest')
  const $timer = document.getElementById('timer')
  const $reroll = document.getElementById('reroll')
  const $go = document.getElementById('go')
  const $note = document.getElementById('note')

  function pick(arr){ return arr[Math.floor(Math.random() * arr.length)] }

  async function getPostLinks(){
    // Hugo renders an RSS feed for /posts/. We'll use it as a tiny index.
    const res = await fetch('/posts/index.xml', { cache: 'no-store' })
    if (!res.ok) throw new Error('fetch failed')
    const xml = await res.text()
    const doc = new DOMParser().parseFromString(xml, 'text/xml')
    const items = Array.from(doc.querySelectorAll('item > link'))
      .map(n => (n.textContent || '').trim())
      .filter(Boolean)
      .map(url => {
        try {
          // normalize absolute → relative, keep same-site paths
          const u = new URL(url)
          return u.pathname.endsWith('/') ? u.pathname : (u.pathname + '/')
        } catch (_) {
          // already relative
          return url
        }
      })
      .filter(p => p.startsWith('/posts/'))

    // tiny quality filter: avoid the index itself and any weirdness
    return items.filter(p => p !== '/posts/' && p !== '/posts/index.xml')
  }

  let links = []
  try {
    links = await getPostLinks()
  } catch (e) {
    $note.textContent = ' (feed unavailable; falling back to /posts/)'
    links = []
  }

  function choose(){
    if (!links.length) {
      $go.href = '/posts/'
      $dest.textContent = 'Posts index'
      return
    }

    const href = pick(links)
    $go.href = href
    $dest.textContent = href
  }

  let countdown = null
  function startCountdown(){
    if (countdown) clearInterval(countdown)
    let t = 5
    $timer.textContent = String(t)
    countdown = setInterval(() => {
      t -= 1
      $timer.textContent = String(t)
      if (t <= 0) {
        clearInterval(countdown)
        window.location.replace($go.href)
      }
    }, 1000)
  }

  $reroll.addEventListener('click', () => {
    choose()
    startCountdown()
  })

  choose()
  startCountdown()
})();
</script>

<noscript>
  <p><strong>JavaScript off:</strong> try the plain archive: <a href="/posts/">/posts/</a></p>
</noscript>
