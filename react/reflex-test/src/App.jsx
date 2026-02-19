import { useState, useEffect, useCallback, useRef } from 'react'

const TARGETS = 5

export default function App() {
  const [state, setState] = useState('idle') // idle, waiting, ready, reacting, finished
  const [times, setTimes] = useState([])
  const [currentTarget, setCurrentTarget] = useState(0)
  const [waitStart, setWaitStart] = useState(0)
  const [reactionStart, setReactionStart] = useState(0)
  const [tooEarly, setTooEarly] = useState(false)
  const [best, setBest] = useState(() => Number(localStorage.getItem('reflex_best') || 0))
  const [avgBest, setAvgBest] = useState(() => Number(localStorage.getItem('reflex_avg_best') || 0))
  const timeoutRef = useRef(null)

  const startRound = useCallback(() => {
    setState('waiting')
    setTooEarly(false)
    const delay = 1000 + Math.random() * 2000
    setWaitStart(Date.now())
    timeoutRef.current = setTimeout(() => {
      setState('ready')
      setReactionStart(Date.now())
    }, delay)
  }, [])

  const handleClick = useCallback(() => {
    if (state === 'idle') {
      setTimes([])
      setCurrentTarget(0)
      startRound()
    } else if (state === 'waiting') {
      clearTimeout(timeoutRef.current)
      setTooEarly(true)
      setState('idle')
    } else if (state === 'ready') {
      const reactionTime = Date.now() - reactionStart
      const newTimes = [...times, reactionTime]
      setTimes(newTimes)
      setCurrentTarget(newTimes.length)
      
      if (newTimes.length >= TARGETS) {
        const avg = Math.round(newTimes.reduce((a, b) => a + b, 0) / TARGETS)
        setState('finished')
        const min = Math.min(...newTimes)
        if (!best || min < best) {
          setBest(min)
          localStorage.setItem('reflex_best', String(min))
        }
        if (!avgBest || avg < avgBest) {
          setAvgBest(avg)
          localStorage.setItem('reflex_avg_best', String(avg))
        }
      } else {
        setState('reacting')
        setTimeout(startRound, 600)
      }
    } else if (state === 'finished') {
      setTimes([])
      setCurrentTarget(0)
      startRound()
    }
  }, [state, times, reactionStart, startRound, best, avgBest])

  const getBgColor = () => {
    switch (state) {
      case 'waiting': return '#1a1a22'
      case 'ready': return '#dc2626'
      case 'reacting': return '#16a34a'
      case 'finished': return '#7c3aed'
      default: return '#0f0f14'
    }
  }

  const getMessage = () => {
    switch (state) {
      case 'idle': return tooEarly ? 'too eager. wait for red.' : 'click to start'
      case 'waiting': return 'wait for red...'
      case 'ready': return 'CLICK NOW'
      case 'reacting': return `target ${currentTarget}/${TARGETS} done`
      case 'finished': return 'complete.'
      default: return ''
    }
  }

  return (
    <main className="reflex-test" style={{ background: getBgColor() }} onClick={handleClick}>
      <div className="content">
        <h1>⚡ Reflex Test</h1>
        <p className="subtitle">reaction is truth. hesitation is death.</p>

        <div className="stats">
          <div className="stat">
            <span className="label">Best Single</span>
            <span className="value">{best ? `${best}ms` : '--'}</span>
          </div>
          <div className="stat">
            <span className="label">Best Avg</span>
            <span className="value">{avgBest ? `${avgBest}ms` : '--'}</span>
          </div>
          <div className="stat">
            <span className="label">Round</span>
            <span className="value">{currentTarget}/{TARGETS}</span>
          </div>
        </div>

        <div className="arena">
          <p className="message">{getMessage()}</p>
          {state === 'finished' && (
            <div className="results">
              <h2>complete.</h2>
              <div className="times">
                {times.map((t, i) => (
                  <span key={i} className={t === Math.min(...times) ? 'best' : t === Math.max(...times) ? 'worst' : ''}>
                    {t}ms
                  </span>
                ))}
              </div>
              <p className="avg">avg: {Math.round(times.reduce((a,b) => a+b, 0)/TARGETS)}ms</p>
              <p className="prompt">click to restart</p>
            </div>
          )}
        </div>

        {times.length > 0 && state !== 'finished' && (
          <div className="history">
            {times.map((t, i) => <span key={i} className="time">{t}ms</span>)}
          </div>
        )}
      </div>

      <footer className="exit-hatch">
        <a href="/lab/" onClick={e => e.stopPropagation()}>← back to lab</a>
        <a href="/" onClick={e => e.stopPropagation()}>home</a>
      </footer>

      <style>{`
        .reflex-test {
          min-height: 100vh;
          color: #e8e6e1;
          font-family: ui-monospace, SFMono-Regular, monospace;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.1s;
          user-select: none;
        }
        
        .content {
          text-align: center;
          padding: 2rem;
        }
        h1 { margin: 0; font-size: 2.5rem; }
        .subtitle { color: rgba(255,255,255,0.6); margin: 0.5rem 0 2rem; }
        
        .stats {
          display: flex;
          gap: 2rem;
          justify-content: center;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }
        .stat {
          padding: 1rem 1.5rem;
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .label { display: block; font-size: 0.7rem; color: rgba(255,255,255,0.6); text-transform: uppercase; }
        .value { display: block; font-size: 1.5rem; font-weight: 600; margin-top: 0.2rem; }
        
        .arena {
          min-height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .message {
          font-size: 2rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          animation: pulse 1s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .results h2 {
          font-size: 3rem;
          margin: 0 0 1rem;
        }
        .times {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin: 1rem 0;
        }
        .times span {
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          font-size: 1.2rem;
        }
        .times .best { background: #22c55e; color: #000; }
        .times .worst { background: #ea580c; color: #fff; }
        .avg { font-size: 2rem; margin: 1rem 0; }
        .prompt { color: rgba(255,255,255,0.6); font-size: 0.9rem; }
        
        .history {
          margin-top: 2rem;
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .time {
          padding: 0.3rem 0.6rem;
          background: rgba(255,255,255,0.1);
          border-radius: 4px;
          font-size: 0.9rem;
        }
        
        .exit-hatch {
          position: fixed;
          bottom: 2rem;
          display: flex;
          gap: 1rem;
        }
        .exit-hatch a {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          font-size: 0.9rem;
        }
        .exit-hatch a:hover { color: #fff; }
      `}</style>
    </main>
  )
}
