// src/components/PlayerPicker.tsx
// Dropdowns for each player slot, filled from your saved players, plus a
// small manager to add, rename and remove saved players.
import { useState } from 'react'
import './PlayerPicker.css'

const NEW = '__new__'
const PLAYER_COLORS = ['#e8001c', '#0057b8', '#00a651', '#ff6b00']

interface Props {
  count: number
  slots: string[]                 // current name in each slot ('' = unpicked)
  roster: string[]
  onPick: (slot: number, name: string) => void
  onAdd: (name: string, slot: number) => void
  onRename: (from: string, to: string) => void
  onRemove: (name: string) => void
}

export default function PlayerPicker({ count, slots, roster, onPick, onAdd, onRename, onRemove }: Props) {
  const [adding, setAdding] = useState<number | null>(null)   // slot showing the "new player" box
  const [draft, setDraft] = useState('')
  const [managing, setManaging] = useState(false)
  const [editing, setEditing] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState('')
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null)

  const sorted = [...roster].sort((a, b) => a.localeCompare(b))

  const saveNew = (slot: number) => {
    const name = draft.trim()
    if (!name) return
    onAdd(name, slot)
    setAdding(null)
    setDraft('')
  }

  return (
    <div className="picker">
      {Array.from({ length: count }, (_, i) => {
        const taken = slots.filter((n, j) => j !== i && j < count && n)
        return (
          <div className="picker-slot" key={i} style={{ '--player-color': PLAYER_COLORS[i] } as React.CSSProperties}>
            <span className="picker-tag">P{i + 1}</span>
            {adding === i ? (
              <div className="picker-new">
                <input
                  className="picker-input"
                  value={draft}
                  autoFocus
                  maxLength={20}
                  placeholder="New player's name"
                  onChange={e => setDraft(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveNew(i); if (e.key === 'Escape') setAdding(null) }}
                />
                <button className="picker-mini" onClick={() => saveNew(i)} disabled={!draft.trim()}>Add</button>
                <button className="picker-mini ghost" onClick={() => setAdding(null)}>✕</button>
              </div>
            ) : (
              <select
                className="picker-select"
                value={slots[i] || ''}
                onChange={e => {
                  if (e.target.value === NEW) { setAdding(i); setDraft('') }
                  else onPick(i, e.target.value)
                }}
              >
                <option value="">Player {i + 1}</option>
                {sorted.map(n => (
                  <option key={n} value={n} disabled={taken.includes(n)}>
                    {n}{taken.includes(n) ? ' (picked)' : ''}
                  </option>
                ))}
                <option value={NEW}>＋ New player…</option>
              </select>
            )}
          </div>
        )
      })}

      <button className="picker-manage-toggle" onClick={() => setManaging(m => !m)}>
        {managing ? 'Done' : `Saved players (${roster.length}) ›`}
      </button>

      {managing && (
        <div className="picker-manage">
          {sorted.length === 0 && <p className="picker-empty">No saved players yet. Pick "＋ New player…" above.</p>}
          {sorted.map(n => (
            <div className="picker-row" key={n}>
              {editing === n ? (
                <>
                  <input className="picker-input" value={editDraft} autoFocus maxLength={20}
                    onChange={e => setEditDraft(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') { onRename(n, editDraft); setEditing(null) }
                      if (e.key === 'Escape') setEditing(null)
                    }} />
                  <button className="picker-mini" disabled={!editDraft.trim()}
                    onClick={() => { onRename(n, editDraft); setEditing(null) }}>Save</button>
                  <button className="picker-mini ghost" onClick={() => setEditing(null)}>✕</button>
                </>
              ) : (
                <>
                  <span className="picker-name">{n}</span>
                  <button className="picker-link" onClick={() => { setEditing(n); setEditDraft(n) }}>Rename</button>
                  <button
                    className={`picker-link danger ${confirmRemove === n ? 'confirming' : ''}`}
                    onClick={() => {
                      if (confirmRemove === n) { onRemove(n); setConfirmRemove(null) }
                      else { setConfirmRemove(n); setTimeout(() => setConfirmRemove(c => (c === n ? null : c)), 3000) }
                    }}>
                    {confirmRemove === n ? 'Sure?' : 'Remove'}
                  </button>
                </>
              )}
            </div>
          ))}
          <p className="picker-empty">
            Renaming also updates their past races. Renaming to an existing name merges the two.
            Removing only hides them from the list — their history and stats stay.
          </p>
        </div>
      )}
    </div>
  )
}
