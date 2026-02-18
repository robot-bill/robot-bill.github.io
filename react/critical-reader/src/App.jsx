import { useEffect, useRef, useState } from 'react'

const critters = ['🦞', '🫧', '🪩', '🍕', '🫠', '🧿', '🐸', '🌮']
const specials = ['💎', '🍀', '✨']

function rand(max) {
  return Math.floor(Math.random() * max)
}

export default function App() {
  const [mode, setMode] = useState('chill')
  const [theme, setTheme] = useState('night')
  const [sound, setSound] = useState(() => (localStorage.getItem('silly_sound') ?? 'on'))
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [running, setRunning] = useState(false)
  const [target, setTarget] = useState({ x: 50, y: 50, icon: '🦞', size: 68, special: false })
  const [toast, setToast] = useState('')
  const [best, setBest] = useState(() => Number(localStorage.getItem('silly_best') || 0))

  const modeCfg = mode === 'chaos'
    ? { duration: 18, minPace: 250, basePace: 760, decay: 16 }
    : { duration: 24, minPace: 420, basePace: 1020, decay: 9 }

  const audioRef = useRef(null)

  function beep(freq = 880, ms = 40, vol = 0.04) {
    if (sound !== 'on') return
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return
      if (!audioRef.current) audioRef.current = new Ctx()
      const ctx = audioRef.current
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'square'
      o.frequency.value = freq
      g.gain.value = vol
      o.connect(g)
      g.connect(ctx.destination)
      const t0 = ctx.currentTime
      o.start(t0)
      o.stop(t0 + ms / 1000)
    } catch (e) {}
  }

  useEffect(() => {
    localStorage.setItem('silly_sound', sound)
  }, [sound])

  const paceMs = Math.max(modeCfg.minPace, modeCfg.basePace - score * modeCfg.decay)

  function spawn(forceNormal = false) {
    const allowSpecial = !forceNormal && score > 6 && Math.random() < (mode === 'chaos' ? 0.16 : 0.10)
    const special = allowSpecial
    const icon = special ? specials[rand(specials.length)] : critters[rand(critters.length)]
    const sizeBase = special ? 78 : 72
    const sizeMin = special ? 44 : 36

    setTarget({
      x: 8 + rand(80),
      y: 12 + rand(72),
      icon,
      special,
      size: Math.max(sizeMin, sizeBase - Math.floor(score / 3) * 2 + rand(10))
    })
  }

  useEffect(() => {
    if (!running) return
    if (timeLeft <= 0) {
      setRunning(false)
      setBest((prev) => {
        const next = Math.max(prev, score)
        localStorage.setItem('silly_best', String(next))
        return next
      })
      return
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [running, timeLeft, score])

  useEffect(() => {
    if (!running) return
    const id = setTimeout(() => {
      spawn()
      setCombo((c) => {
        if (c > 0) beep(196, 65, 0.03)
        return 0
      })
    }, paceMs)
    return () => clearTimeout(id)
  }, [running, target, paceMs])

  function hit() {
    if (!running) return

    const wasSpecial = target.special
    beep(wasSpecial ? 1320 : 988, wasSpecial ? 45 : 32, wasSpecial ? 0.06 : 0.05)

    const nextCombo = combo + 1
    setCombo(nextCombo)

    const comboBonus = 1 + Math.floor(nextCombo / 5)
    const specialBonus = wasSpecial ? (mode === 'chaos' ? 10 : 7) : 0

    setScore((s) => s + comboBonus + specialBonus)

    if (wasSpecial) {
      setTimeLeft((t) => Math.min(t + 2, modeCfg.duration + 6))
      setToast(`+${specialBonus}  +2s`)
      setTimeout(() => setToast(''), 650)
    }

    spawn(wasSpecial)
  }

  function start() {
    setScore(0)
    setCombo(0)
    setTimeLeft(modeCfg.duration)
    setRunning(true)
    spawn()
  }

  return (
    <main className={`app theme-${theme}`}>
      <h1>Silly Click Arena</h1>
      <p className="sub">click the emoji. don’t miss. fast feedback only.</p>

      <section className="hud card">
        <div><strong>Score:</strong> {score}</div>
        <div><strong>Combo:</strong> x{Math.max(1, 1 + Math.floor(combo / 5))}</div>
        <div><strong>Time:</strong> {timeLeft}s</div>
        <div><strong>Best:</strong> {best}</div>
        <div className="mode-pills" aria-label="difficulty mode">
          <button className={mode === 'chill' ? 'pill active' : 'pill'} onClick={() => !running && setMode('chill')}>chill</button>
          <button className={mode === 'chaos' ? 'pill active' : 'pill'} onClick={() => !running && setMode('chaos')}>chaos</button>
        </div>
        <div className="mode-pills" aria-label="theme mode">
          <button className={theme === 'night' ? 'pill active' : 'pill'} onClick={() => !running && setTheme('night')}>night</button>
          <button className={theme === 'candy' ? 'pill active' : 'pill'} onClick={() => !running && setTheme('candy')}>candy</button>
        </div>
        <div className="mode-pills" aria-label="sound toggle">
          <button className={sound === 'on' ? 'pill active' : 'pill'} onClick={() => !running && setSound('on')}>sound on</button>
          <button className={sound === 'off' ? 'pill active' : 'pill'} onClick={() => !running && setSound('off')}>sound off</button>
        </div>
        <button onClick={start}>{running ? 'Restart' : `Start ${modeCfg.duration}s round`}</button>
      </section>

      <section className="arena card" aria-label="game arena">
        {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
        <button
          className="target"
          onClick={hit}
          style={{ left: `${target.x}%`, top: `${target.y}%`, fontSize: `${target.size}px` }}
          aria-label="bonk target"
        >
          {target.icon}
        </button>
        {!running && <p className="overlay">press start and bonk the chaos</p>}
      </section>
    </main>
  )
}
