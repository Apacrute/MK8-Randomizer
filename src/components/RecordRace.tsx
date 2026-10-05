// src/components/RecordRace.tsx
// Enter each player's finishing place and whether it was a great or rough run.
import { useState } from 'react'
import { PlayerPlacement, RunRating } from '../types'
import './RecordRace.css'

interface Props {
  names: string[]
  initial: PlayerPlacement[] | null
  onSave: (results: PlayerPlacement[] | null) => void
  onCancel?: () => void
}

const PLACES = Array.from({ length: 12 }, (_, i) => i + 1)

export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export default function RecordRace({ names, initial, onSave, onCancel }: Props) {
  const [rows, setRows] = useState<PlayerPlacement[]>(
    names.map((_, i) => initial?.[i] ?? { place: null, rating: null }))

  const update = (i: number, patch: Partial<PlayerPlacement>) =>
    setRows(r => r.map((row, j) => (j === i ? { ...row, ...patch } : row)))

  const toggleRating = (i: number, rating: RunRating) =>
    update(i, { rating: rows[i].rating === rating ? null : rating })

  const anyEntered = rows.some(r => r.place !== null || r.rating !== null)

  return (
    <div className="record">
      {names.map((name, i) => (
        <div className="record-row" key={i}>
          <span className="record-name">{name}</span>
          <select
            className="record-place"
            value={rows[i].place ?? ''}
            onChange={e => update(i, { place: e.target.value ? Number(e.target.value) : null })}
          >
            <option value="">Place</option>
            {PLACES.map(p => <option key={p} value={p}>{ordinal(p)}</option>)}
          </select>
          <button
            className={`record-rate great ${rows[i].rating === 'great' ? 'on' : ''}`}
            onClick={() => toggleRating(i, 'great')}
            aria-label="Great run"
          >🔥</button>
          <button
            className={`record-rate rough ${rows[i].rating === 'rough' ? 'on' : ''}`}
            onClick={() => toggleRating(i, 'rough')}
            aria-label="Rough run"
          >💀</button>
        </div>
      ))}
      <p className="record-hint">🔥 great run for their skill level · 💀 rough run</p>
      <div className="record-actions">
        {onCancel && <button className="record-btn ghost" onClick={onCancel}>Cancel</button>}
        {initial && (
          <button className="record-btn ghost" onClick={() => onSave(null)}>Clear result</button>
        )}
        <button className="record-btn" disabled={!anyEntered} onClick={() => onSave(rows)}>
          Save result
        </button>
      </div>
    </div>
  )
}

// Compact read-only summary used on results + history
export function ResultSummary({ names, results }: { names: string[]; results: PlayerPlacement[] }) {
  const placed = results.map(r => r.place).filter((p): p is number => p !== null)
  const best = placed.length ? Math.min(...placed) : null
  return (
    <div className="result-summary">
      {names.map((n, i) => {
        const r = results[i]
        if (!r) return null
        return (
          <span key={i} className={`result-chip ${best !== null && r.place === best ? 'best' : ''}`}>
            {best !== null && r.place === best && names.length > 1 ? '👑 ' : ''}
            <b>{n}</b>{r.place ? ` ${ordinal(r.place)}` : ''}
            {r.rating === 'great' ? ' 🔥' : r.rating === 'rough' ? ' 💀' : ''}
          </span>
        )
      })}
    </div>
  )
}
