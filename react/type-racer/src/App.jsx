import { useState, useEffect, useRef, useCallback } from 'react'

const phrases = [
  "the small web is a conspiracy of kindness",
  "every link is a portal to another mind",
  "build toys not products",
  "chaos is a feature not a bug",
  "the museum never closes but it always changes",
  "click with intention or dont click at all",
  "shrines are obsessions given form",
  "every page is a trapdoor or it is nothing",
  "noise is signal if you listen right",
  "the ghost in the machine is the point",
]

export default function App() {
  const [gameState, setGameState] = useState('idle') // idle, playing, finished
  const [targetText, setTargetText] = useState('')
  const [input, setInput] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [bestWpm, setBestWpm] = useState(() => Number(localStorage.getItem('typer_best_wpm') || 0))
  const [streak, setStreak] = useState(0)
  const inputRef = useRef(null)

  const startGame = useCallback(() => {
    const phrase = phrases[Math.floor(Math.random() * phrases.length)]
    setTargetText(phrase)
    setInput('')
    setGameState('playing')
    setStartTime(Date.now())
    setWpm(0)
    setAccuracy(100)
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  useEffect(() => {
    if (gameState !== 'playing' || !startTime) return

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000 / 60 // minutes
      const words = input.trim().split(/\s+/).length
      if (elapsed > 0) {
        setWpm(Math.round(words / elapsed))
      }
    }, 100)

    return () => clearInterval(interval)
  }, [gameState, startTime, input])

  useEffect(() => {
    if (targetText && input.length > 0) {
      let correct = 0
      for (let i = 0; i < Math.min(input.length, targetText.length); i++) {
        if (input[i] === targetText[i]) correct++
      }
      setAccuracy(Math.round((correct / input.length) * 100))
    }
  }, [input, targetText])

  useEffect(() => {
    if (gameState === 'playing' && input === targetText) {
      const finalWpm = wpm
      setGameState('finished')
      setStreak(s => s + 1)
      if (finalWpm > bestWpm) {
        setBestWpm(finalWpm)
        localStorage.setItem('typer_best_wpm', String(finalWpm))
      }
    }
  }, [input, targetText, gameState, wpm, bestWpm])

  const handleInput = (e) => {
    if (gameState !== 'playing') return
    setInput(e.target.value)
  }

  const renderText = () => {
    return targetText.split('').map((char, i) => {
      let className = 'char-pending'
      if (i < input.length) {
        className = input[i] === char ? 'char-correct' : 'char-wrong'
      } else if (i === input.length && gameState === 'playing') {
        className = 'char-cursor'
      }
      return (
        <span key={i} className={className}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      )
    })
  }

  return (
    <main className="type-racer">
      <header>
        <h1>⌨️ Type Racer</h1>
        <p className="subtitle">speed is worship. accuracy is prayer.</p>
      </header>

      <section className="stats-bar">
        <div className="stat">
          <span className="stat-label">WPM</span>
          <span className="stat-value">{wpm}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Accuracy</span>
          <span className="stat-value">{accuracy}%</span>
        </div>
        <div className="stat">
          <span className="stat-label">Best</span>
          <span className="stat-value">{bestWpm}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Streak</span>
          <span className="stat-value">{streak}</span>
        </div>
      </section>

      {gameState === 'idle' && (
        <div className="start-screen">
          <p className="prompt">type the phrase as fast as you can.</p>
          <button className="start-btn" onClick={startGame}>start racing</button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-area">
          <div className="target-text">{renderText()}</div>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInput}
            className="type-input"
            placeholder="type here..."
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
        </div>
      )}

      {gameState === 'finished' && (
        <div className="finish-screen">
          <div className="results">
            <h2>finished.</h2>
            <div className="final-stats">
              <div className="final-stat">
                <span className="label">final wpm</span>
                <span className="value">{wpm}</span>
              </div>
              <div className="final-stat">
                <span className="label">accuracy</span>
                <span className="value">{accuracy}%</span>
              </div>
            </div>
            {wpm === bestWpm && <p className="new-record">🔥 new personal best!</p>}
          </div>
          <button className="start-btn" onClick={startGame}>race again</button>
        </div>
      )}

      <footer className="exit-hatch">
        <a href="/lab/">← back to lab</a>
        <a href="/">home</a>
      </footer>

      <style>{`
        .type-racer {
          min-height: 100vh;
          background: #0a0a0f;
          color: #e8e6e1;
          font-family: 'IBM Plex Mono', monospace;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        header { text-align: center; margin-bottom: 2rem; }
        h1 { margin: 0; font-size: 2.5rem; }
        .subtitle { color: #6b6b7b; margin-top: 0.5rem; }
        
        .stats-bar {
          display: flex;
          gap: 2rem;
          margin-bottom: 3rem;
        }
        .stat {
          text-align: center;
          padding: 1rem 1.5rem;
          background: #14141a;
          border: 1px solid #2a2a35;
          border-radius: 8px;
        }
        .stat-label {
          display: block;
          font-size: 0.7rem;
          text-transform: uppercase;
          color: #6b6b7b;
          margin-bottom: 0.25rem;
        }
        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 600;
          color: #7dd3fc;
        }
        
        .start-screen, .finish-screen {
          text-align: center;
          padding: 3rem;
        }
        .prompt { color: #6b6b7b; margin-bottom: 2rem; }
        .start-btn {
          background: #7dd3fc;
          color: #0a0a0f;
          border: none;
          padding: 1rem 2rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 8px;
          cursor: pointer;
          font-family: inherit;
        }
        .start-btn:hover { background: #a7dff7; }
        
        .game-area {
          width: min(800px, 90vw);
        }
        .target-text {
          font-size: 1.5rem;
          line-height: 1.8;
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          background: #14141a;
          border: 1px solid #2a2a35;
          border-radius: 8px;
          min-height: 120px;
        }
        .char-correct { color: #4ade80; }
        .char-wrong { color: #f87171; background: rgba(248, 113, 113, 0.2); }
        .char-pending { color: #6b6b7b; }
        .char-cursor { 
          background: #7dd3fc; 
          color: #0a0a0f;
          animation: blink 1s infinite;
        }
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .type-input {
          width: 100%;
          padding: 1rem;
          font-size: 1.2rem;
          font-family: inherit;
          background: #14141a;
          border: 1px solid #2a2a35;
          border-radius: 8px;
          color: #e8e6e1;
          outline: none;
        }
        .type-input:focus { border-color: #7dd3fc; }
        
        .results h2 { margin-bottom: 1rem; }
        .final-stats {
          display: flex;
          gap: 3rem;
          justify-content: center;
          margin: 2rem 0;
        }
        .final-stat {
          text-align: center;
        }
        .final-stat .label {
          display: block;
          font-size: 0.8rem;
          color: #6b6b7b;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .final-stat .value {
          display: block;
          font-size: 3rem;
          font-weight: 600;
          color: #7dd3fc;
        }
        .new-record {
          color: #fbbf24;
          font-size: 1.2rem;
          margin: 1rem 0 2rem;
        }
        
        .exit-hatch {
          margin-top: auto;
          padding-top: 2rem;
          display: flex;
          gap: 1rem;
        }
        .exit-hatch a {
          color: #6b6b7b;
          text-decoration: none;
        }
        .exit-hatch a:hover { color: #7dd3fc; }
      `}</style>
    </main>
  )
}
