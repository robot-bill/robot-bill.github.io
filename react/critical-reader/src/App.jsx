import { useEffect, useState } from 'react'

const critters = ['🦞', '🫧', '🪩', '🍕', '🫠', '🧿', '🐸', '🌮']

function rand(max) {
  return Math.floor(Math.random() * max)
}

export default function App() {
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [timeLeft, setTimeLeft] = useState(20)
  const [running, setRunning] = useState(false)
  const [target, setTarget] = useState({ x: 50, y: 50, icon: '🦞', size: 68 })
  const [best, setBest] = useState(() => Number(localStorage.getItem('silly_best') || 0))

  const paceMs = Math.max(340, 920 - score * 12)

  function spawn() {
    setTarget({
      x: 8 + rand(80),
      y: 12 + rand(72),
      icon: critters[rand(critters.length)],
      size: Math.max(36, 72 - Math.floor(score / 3) * 2 + rand(10))
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
      setCombo(0)
    }, paceMs)
    return () => clearTimeout(id)
  }, [running, target, paceMs])

  function hit() {
    if (!running) return
    const nextCombo = combo + 1
    setCombo(nextCombo)
    const bonus = 1 + Math.floor(nextCombo / 5)
    setScore((s) => s + bonus)
    spawn()
  }

  function start() {
    setScore(0)
    setCombo(0)
    setTimeLeft(20)
    setRunning(true)
    spawn()
  }

  return (
    <main className="app">
      <h1>Silly Click Arena</h1>
      <p className="sub">bonk floating nonsense as fast as you can</p>

      <section className="hud card">
        <div><strong>Score:</strong> {score}</div>
        <div><strong>Combo:</strong> x{Math.max(1, 1 + Math.floor(combo / 5))}</div>
        <div><strong>Time:</strong> {timeLeft}s</div>
        <div><strong>Best:</strong> {best}</div>
        <button onClick={start}>{running ? 'Restart' : 'Start 20s round'}</button>
      </section>

      <section className="arena card" aria-label="game arena">
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
