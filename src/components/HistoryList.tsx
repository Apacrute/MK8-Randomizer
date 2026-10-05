// src/components/HistoryList.tsx
import { useState } from 'react'
import { RaceEntry, PlayerPlacement } from '../types'
import { BY_ID } from '../lib/catalog'
import GameImage from './GameImage'
import RecordRace, { ResultSummary } from './RecordRace'

interface Props {
  history: RaceEntry[]
  onRecord: (entryId: string, results: PlayerPlacement[] | null) => void
  onDelete: (entryId: string) => void
}

type Filter = 'all' | 'recorded' | 'open'
const PAGE = 40

function when(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ' · ' +
    d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

export default function HistoryList({ history, onRecord, onDelete }: Props) {
  const [filter, setFilter] = useState<Filter>('all')
  const [shown, setShown] = useState(PAGE)
  const [editing, setEditing] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const list = history.filter(e =>
    filter === 'all' ? true : filter === 'recorded' ? !!e.results : !e.results)

  if (history.length === 0) {
    return (
      <div className="stats-empty">
        <p>No races yet.</p>
        <p className="stats-empty-sub">Every roll shows up here.</p>
      </div>
    )
  }

  return (
    <div className="history">
      <div className="filter-row">
        {(['all', 'recorded', 'open'] as const).map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => { setFilter(f); setShown(PAGE) }}>
            {f === 'all' ? `All (${history.length})` : f === 'recorded' ? '✅ Recorded' : '⬜ No result'}
          </button>
        ))}
      </div>

      {list.slice(0, shown).map(e => {
        const map = e.map ? BY_ID.maps[e.map] : null
        const prix = e.prix ? BY_ID.prixes[e.prix] : null
        const extras = [
          prix?.name,
          e.mode ? BY_ID.modes[e.mode]?.name : null,
          e.items ? BY_ID.items[e.items]?.name : null,
          e.challenge ? BY_ID.challenges[e.challenge]?.name : null,
        ].filter(Boolean).join(' · ')

        return (
          <section className="hist-card" key={e.id}>
            <div className="hist-head">
              <GameImage src={map?.image ?? prix?.image} alt={map?.name ?? prix?.name ?? 'Race'}
                fallback={prix?.emblem ?? '🏁'} className="hist-img" />
              <div className="hist-info">
                <span className="hist-title">{map?.name ?? prix?.name ?? 'Loadout roll'}</span>
                {extras && <span className="hist-extras">{extras}</span>}
                <span className="hist-when">{when(e.ts)}</span>
              </div>
            </div>

            <div className="hist-players">
              {e.names.map((n, i) => {
                const l = e.loadouts[i]
                const bits = [
                  l?.character ? BY_ID.characters[l.character]?.name : null,
                  l?.kart ? BY_ID.karts[l.kart]?.name : null,
                ].filter(Boolean).join(' · ')
                return (
                  <span className="hist-player" key={i}>
                    <b>{n}</b>{bits ? ` — ${bits}` : ''}
                  </span>
                )
              })}
            </div>

            {editing === e.id ? (
              <RecordRace names={e.names} initial={e.results}
                onSave={r => { onRecord(e.id, r); setEditing(null) }}
                onCancel={() => setEditing(null)} />
            ) : (
              <>
                {e.results && <ResultSummary names={e.names} results={e.results} />}
                <div className="hist-actions">
                  <button className="link-btn" onClick={() => setEditing(e.id)}>
                    {e.results ? 'Edit result' : 'Record result'}
                  </button>
                  <button
                    className={`link-btn danger ${confirmDelete === e.id ? 'confirming' : ''}`}
                    onClick={() => {
                      if (confirmDelete === e.id) { onDelete(e.id); setConfirmDelete(null) }
                      else { setConfirmDelete(e.id); setTimeout(() => setConfirmDelete(null), 3000) }
                    }}>
                    {confirmDelete === e.id ? 'Tap again to delete' : 'Delete'}
                  </button>
                </div>
              </>
            )}
          </section>
        )
      })}

      {list.length > shown && (
        <button className="reset-btn" onClick={() => setShown(s => s + PAGE)}>
          Show more ({list.length - shown} left)
        </button>
      )}
      <p className="edit-hint">Deleting a race doesn't change map or cup counts — edit those in the Maps/Cups views.</p>
    </div>
  )
}
