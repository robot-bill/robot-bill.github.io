import { useState, useEffect, useCallback } from 'react'

const emojis = ['🧿', '🔮', '🗝️', '⚰️', '🕯️', '📜', '🔫', '🧪']

export default function App() {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [running, setRunning] = useState(false)
  const [bestTime, setBestTime] = useState(() => Number(localStorage.getItem('memory_best_time') || 0))
  const [bestMoves, setBestMoves] = useState(() => Number(localStorage.getItem('memory_best_moves') || 0))

  const initGame = useCallback(() => {
    const deck = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((icon, i) => ({ id: i, icon, matched: false }))
    setCards(deck)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setTime(0)
    setRunning(true)
  }, [])

  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setTime(t => t + 1), 1000)
    return () => clearInterval(timer)
  }, [running])

  useEffect(() => {
    if (matched.length === emojis.length) {
      setRunning(false)
      if (!bestTime || time < bestTime) {
        setBestTime(time)
        localStorage.setItem('memory_best_time', String(time))
      }
      if (!bestMoves || moves < bestMoves) {
        setBestMoves(moves)
        localStorage.setItem('memory_best_moves', String(moves))
      }
    }
  }, [matched, time, moves, bestTime, bestMoves])

  const handleCard = (id) => {
    if (!running || flipped.includes(id) || matched.includes(cards.find(c => c.id === id)?.icon)) return
    if (flipped.length === 2) return

    const newFlipped = [...flipped, id]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(m => m + 1)
      const [c1, c2] = newFlipped.map(fid => cards.find(c => c.id === fid))
      if (c1.icon === c2.icon) {
        setTimeout(() => {
          setMatched(m => [...m, c1.icon])
          setFlipped([])
        }, 400)
      } else {
        setTimeout(() => setFlipped([]), 800)
      }
    }
  }

  return (
    <main className="memory-vault">
      <header>
        <h1>🗝️ Memory Vault</h1>
        <p className="subtitle">match pairs. unlock secrets. remember everything.</p>
      </header>

      <section className="hud">
        <div className="stat">
          <span className="label">Time</span>
          <span className="value">{Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}</span>
        </div>
        <div className="stat">
          <span className="label">Moves</span>
          <span className="value">{moves}</span>
        </div>
        <div className="stat">
          <span className="label">Best Time</span>
          <span className="value">{bestTime ? `${Math.floor(bestTime / 60)}:${(bestTime % 60).toString().padStart(2, '0')}` : '--:--'}</span>
        </div>
        <div className="stat">
          <span className="label">Best Moves</span>
          <span className="value">{bestMoves || '--'}</span>
        </div>
        <button className="new-game" onClick={initGame}>new vault</button>
      </section>

      <section className="grid">
        {cards.map(card => {
          const isFlipped = flipped.includes(card.id) || matched.includes(card.icon)
          return (
            <button
              key={card.id}
              className={`card ${isFlipped ? 'flipped' : ''}`}
              onClick={() => handleCard(card.id)}
              disabled={isFlipped}
            >
              <span className="front">?</span>
              <span className="back">{card.icon}</span>
            </button>
          )
        })}
      </section>

      {matched.length === emojis.length && (
        <div className="victory">
          <h2>vault cracked.</h2>
          <p>time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')} · moves: {moves}</p>
          <button onClick={initGame}>open another vault</button>
        </div>
      )}

      <footer className="exit-hatch">
        <a href="/lab/">← back to lab</a>
        <a href="/">home</a>
      </footer>

      <style>{`
        .memory-vault {
          min-height: 100vh;
          background: #0f0f14;
          color: #e8e6e1;
          font-family: ui-monospace, SFMono-Regular, monospace;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        h1 { margin: 0; font-size: 2rem; }
        .subtitle { color: #6b6b7b; margin: 0.5rem 0 2rem; }
        
        .hud {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          justify-content: center;
        }
        .stat {
          text-align: center;
          padding: 0.8rem 1.2rem;
          background: #1a1a22;
          border: 1px solid #2a2a35;
          border-radius: 8px;
        }
        .label { display: block; font-size: 0.7rem; color: #6b6b7b; text-transform: uppercase; }
        .value { display: block; font-size: 1.3rem; font-weight: 600; color: #f59e0b; margin-top: 0.2rem; }
        
        .new-game {
          background: #7dd3fc;
          color: #0a0a0f;
          border: none;
          padding: 0.8rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
        }
        
        .grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          max-width: 400px;
          width: 100%;
        }
        
        .card {
          aspect-ratio: 1;
          background: #1a1a22;
          border: 1px solid #2a2a35;
          border-radius: 12px;
          cursor: pointer;
          font-size: 2rem;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.3s;
        }
        .card:hover:not(:disabled) { border-color: #7dd3fc; }
        .card.flipped { transform: rotateY(180deg); cursor: default; }
        .card:disabled { opacity: 1; }
        
        .card .front, .card .back {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          backface-visibility: hidden;
          border-radius: 12px;
        }
        .front { background: #1a1a22; color: #6b6b7b; }
        .back { background: #2a2035; transform: rotateY(180deg); border: 1px solid #7c3aed; }
        
        .victory {
          margin-top: 2rem;
          text-align: center;
          padding: 2rem;
          background: #1a1a22;
          border: 1px solid #7c3aed;
          border-radius: 12px;
        }
        .victory h2 { color: #7dd3fc; margin: 0 0 0.5rem; }
        .victory button {
          margin-top: 1rem;
          background: #7c3aed;
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
        }
        
        .exit-hatch {
          margin-top: auto;
          padding-top: 2rem;
          display: flex;
          gap: 1rem;
        }
        .exit-hatch a { color: #6b6b7b; text-decoration: none; }
        .exit-hatch a:hover { color: #7dd3fc; }
      `}</style>
    </main>
  )
}
