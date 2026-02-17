import { useMemo, useState } from 'react'

const prompts = {
  evidence: [
    'What would have to be true for this claim to hold?',
    'Which part is observation vs interpretation?',
    'What is missing that would change your conclusion?'
  ],
  novelty: [
    'Is this actually new, or newly packaged?',
    'What does this contradict from prior experience?',
    'What old idea is being rediscovered here?'
  ],
  clarity: [
    'Where does the argument become fuzzy?',
    'Can you restate this in one sharp sentence?',
    'What term is doing too much work?'
  ]
}

function scoreLabel(score) {
  if (score >= 8) return 'strong'
  if (score >= 5) return 'mixed'
  return 'weak'
}

export default function App() {
  const [title, setTitle] = useState('')
  const [claim, setClaim] = useState('')
  const [evidence, setEvidence] = useState(5)
  const [novelty, setNovelty] = useState(5)
  const [clarity, setClarity] = useState(5)

  const avg = useMemo(() => Number(((evidence + novelty + clarity) / 3).toFixed(1)), [evidence, novelty, clarity])

  const weakest = useMemo(() => {
    const pairs = [
      ['evidence', evidence],
      ['novelty', novelty],
      ['clarity', clarity]
    ].sort((a, b) => a[1] - b[1])
    return pairs[0][0]
  }, [evidence, novelty, clarity])

  const quickQuestions = prompts[weakest]

  return (
    <main className="app">
      <h1>Critical Reader Lab</h1>
      <p className="sub">Read less passively. Pressure-test claims before they become beliefs.</p>

      <section className="card">
        <label>
          Piece title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article / essay / post" />
        </label>

        <label>
          Core claim (your summary)
          <textarea value={claim} onChange={(e) => setClaim(e.target.value)} rows={4} placeholder="What is this trying to convince you of?" />
        </label>
      </section>

      <section className="card grid">
        <Score label="Evidence" value={evidence} onChange={setEvidence} />
        <Score label="Novelty" value={novelty} onChange={setNovelty} />
        <Score label="Clarity" value={clarity} onChange={setClarity} />
      </section>

      <section className="card result">
        <h2>Reading verdict: <span>{scoreLabel(avg)}</span> ({avg}/10)</h2>
        <p>Weakest axis right now: <strong>{weakest}</strong></p>
        <h3>Counter-questions</h3>
        <ul>
          {quickQuestions.map((q) => <li key={q}>{q}</li>)}
        </ul>
        {claim && <blockquote>"{claim}"</blockquote>}
        {title && <p className="meta">Notes for: {title}</p>}
      </section>
    </main>
  )
}

function Score({ label, value, onChange }) {
  return (
    <label className="score">
      <span>{label}: <strong>{value}</strong></span>
      <input type="range" min="0" max="10" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  )
}
