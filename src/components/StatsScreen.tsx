// src/components/StatsScreen.tsx
import { useState } from 'react'
import { MapStats, RaceEntry, PlayerPlacement } from '../types'
import { MAPS, PRIXES } from '../lib/catalog'
import { mapChampions } from '../lib/playerStats'
import GameImage from './GameImage'
import PlayerStats from './PlayerStats'
import HistoryList from './HistoryList'
import BackupPanel from './BackupPanel'
import type { ToastState } from './Toast'
import './StatsScreen.css'

interface Props {
  stats: MapStats
  history: RaceEntry[]
  onAdjustMap: (id: string, delta: number) => void
  onSetMap: (id: string, value: number) => void
  onAdjustPrix: (id: string, delta: number) => void
  onSetPrix: (id: string, value: number) => void
  onResetCounts: () => void
  onResetPrix: () => void
  onResetHistory: () => void
  onResetAll: () => void
  onRecord: (entryId: string, results: PlayerPlacement[] | null) => void
  onDelete: (entryId: string) => void
  onRestored: () => void
  onToast: (t: ToastState) => void
  roster: string[]
  groupNames: Record<string, string>
  onNameGroup: (key: string, name: string) => void
}

type View = 'maps' | 'prixes' | 'players' | 'history'
type SortMode = 'count' | 'name' | 'least'
type ResetKind = 'counts' | 'prix' | 'history' | 'all'

// [−] [value] [+], tap the value to type an exact number
function CountStepper({ count, onAdjust, onSet, color }: {
  count: number
  onAdjust: (delta: number) => void
  onSet: (value: number) => void
  color?: string
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(String(count))
  const commit = () => {
    const n = parseInt(draft, 10)
    onSet(isNaN(n) ? 0 : n)
    setEditing(false)
  }
  return (
    <div className="stepper">
      <button className="stepper-btn minus" onClick={() => onAdjust(-1)} disabled={count <= 0} aria-label="decrease">−</button>
      {editing ? (
        <input className="stepper-input" type="number" inputMode="numeric" value={draft} autoFocus
          onChange={e => setDraft(e.target.value)} onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') commit() }} />
      ) : (
        <button className="stepper-value" style={color ? { color } : undefined}
          onClick={() => { setDraft(String(count)); setEditing(true) }}>{count}</button>
      )}
      <button className="stepper-btn plus" onClick={() => onAdjust(1)} aria-label="increase">+</button>
    </div>
  )
}

function sortBy<T extends { name: string; count: number }>(list: T[], mode: SortMode): T[] {
  return [...list].sort((a, b) =>
    mode === 'count' ? b.count - a.count :
    mode === 'least' ? a.count - b.count :
    a.name.localeCompare(b.name))
}

export default function StatsScreen(props: Props) {
  const { stats, history } = props
  const [view, setView] = useState<View>('maps')
  const [sortMode, setSortMode] = useState<SortMode>('count')
  const [filter, setFilter] = useState<'all' | 'played' | 'unplayed'>('all')
  const [confirmReset, setConfirmReset] = useState<ResetKind | null>(null)

  const maps = MAPS.map(m => ({ ...m, count: stats.counts[m.id] || 0 }))
  const prixes = PRIXES.map(p => ({ ...p, count: stats.prixCounts[p.id] || 0 }))
  const champs = mapChampions(history)
  const mapRolls = maps.reduce((n, m) => n + m.count, 0)
  const mapsPlayed = maps.filter(m => m.count > 0).length
  const cupRolls = prixes.reduce((n, p) => n + p.count, 0)
  const cupsPlayed = prixes.filter(p => p.count > 0).length
  const recorded = history.filter(h => h.results).length

  const handleReset = (kind: ResetKind) => {
    if (confirmReset !== kind) {
      setConfirmReset(kind)
      setTimeout(() => setConfirmReset(c => (c === kind ? null : c)), 3000)
      return
    }
    if (kind === 'counts') props.onResetCounts()
    if (kind === 'prix') props.onResetPrix()
    if (kind === 'history') props.onResetHistory()
    if (kind === 'all') props.onResetAll()
    setConfirmReset(null)
  }

  const resetButton = (kind: ResetKind, label: string, danger = false) => (
    <button className={`reset-btn ${danger ? 'danger' : ''} ${confirmReset === kind ? 'confirming' : ''}`}
      onClick={() => handleReset(kind)}>
      {confirmReset === kind ? '⚠️ Tap again to confirm' : label}
    </button>
  )

  const sortControls = (
    <div className="stats-controls">
      {view === 'maps' && (
        <div className="filter-row">
          {(['all', 'played', 'unplayed'] as const).map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'played' ? '✅ Rolled' : '⬜ Never rolled'}
            </button>
          ))}
        </div>
      )}
      <div className="sort-row">
        <span className="sort-label">Sort:</span>
        {(['count', 'name', 'least'] as const).map(s => (
          <button key={s} className={`sort-btn ${sortMode === s ? 'active' : ''}`} onClick={() => setSortMode(s)}>
            {s === 'count' ? '🔢 Most' : s === 'name' ? '🔤 Name' : '⬇️ Least'}
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="stats-screen">
      <div className="view-switch">
        {([['maps', '🗺️ Maps'], ['prixes', '🏆 Cups'], ['players', '👥 Players'], ['history', '📜 History']] as const)
          .map(([v, label]) => (
            <button key={v} className={`view-btn ${view === v ? 'active' : ''}`} onClick={() => setView(v)}>{label}</button>
          ))}
      </div>

      <div className="stats-summary">
        {view === 'maps' && <>
          <div className="stat-card"><span className="stat-value">{mapRolls}</span><span className="stat-label">Map rolls</span></div>
          <div className="stat-card"><span className="stat-value">{mapsPlayed}<span className="stat-denom">/{MAPS.length}</span></span><span className="stat-label">Maps rolled</span></div>
          <div className="stat-card"><span className="stat-value">{MAPS.length - mapsPlayed}</span><span className="stat-label">Never rolled</span></div>
        </>}
        {view === 'prixes' && <>
          <div className="stat-card"><span className="stat-value">{cupRolls}</span><span className="stat-label">Cup rolls</span></div>
          <div className="stat-card"><span className="stat-value">{cupsPlayed}<span className="stat-denom">/{PRIXES.length}</span></span><span className="stat-label">Cups rolled</span></div>
          <div className="stat-card"><span className="stat-value">{PRIXES.length - cupsPlayed}</span><span className="stat-label">Never rolled</span></div>
        </>}
        {(view === 'players' || view === 'history') && <>
          <div className="stat-card"><span className="stat-value">{history.length}</span><span className="stat-label">Rolls</span></div>
          <div className="stat-card"><span className="stat-value">{recorded}</span><span className="stat-label">Recorded</span></div>
          <div className="stat-card"><span className="stat-value">{history.length - recorded}</span><span className="stat-label">No result</span></div>
        </>}
      </div>

      {view === 'maps' && <>
        <p className="edit-hint">💡 Tap a number to type an exact value, or use − / + to adjust.</p>
        {sortControls}
        <div className="stats-map-list">
          {sortBy(maps.filter(m => filter === 'all' ? true : filter === 'played' ? m.count > 0 : m.count === 0), sortMode)
            .map(m => (
              <div key={m.id} className={`stats-map-row ${m.count > 0 ? 'played' : 'unplayed'}`}>
                <div className="stats-map-img-wrap">
                  <GameImage src={m.image} alt={m.name} className="stats-map-img" />
                  {m.count === 0 && <div className="unplayed-overlay" />}
                </div>
                <div className="stats-map-info">
                  <span className="stats-map-name">{m.name}</span>
                  <span className="stats-map-cat">
                    {champs[m.id] ? `👑 ${champs[m.id].name} ×${champs[m.id].wins}` : m.category}
                  </span>
                </div>
                <CountStepper count={m.count} onAdjust={d => props.onAdjustMap(m.id, d)} onSet={v => props.onSetMap(m.id, v)} />
              </div>
            ))}
        </div>
        <div className="reset-section">{resetButton('counts', '🔄 Reset all map counts')}</div>
      </>}

      {view === 'prixes' && <>
        <p className="edit-hint">💡 Tap a number to type an exact value, or use − / + to adjust.</p>
        {sortControls}
        <div className="stats-map-list">
          {sortBy(prixes, sortMode).map(p => (
            <div key={p.id} className={`stats-map-row ${p.count > 0 ? 'played' : 'unplayed'}`}>
              <div className="stats-prix-emblem" style={{ background: `${p.color}22` }}>
                <GameImage src={p.image} alt={p.name} fallback={p.emblem} className="stats-prix-img" />
              </div>
              <div className="stats-map-info">
                <span className="stats-map-name">{p.name}</span>
                <span className="stats-map-cat">{p.category === 'base' ? 'Base Game' : 'Booster Pass'}</span>
              </div>
              <CountStepper count={p.count} color={p.color} onAdjust={d => props.onAdjustPrix(p.id, d)} onSet={v => props.onSetPrix(p.id, v)} />
            </div>
          ))}
        </div>
        <div className="reset-section">{resetButton('prix', '🔄 Reset all cup counts')}</div>
      </>}

      {view === 'players' && <PlayerStats history={history} roster={props.roster} groupNames={props.groupNames} onNameGroup={props.onNameGroup} />}

      {view === 'history' && <>
        <HistoryList history={history} onRecord={props.onRecord} onDelete={props.onDelete} />
        {history.length > 0 && <div className="reset-section">{resetButton('history', '🗑️ Clear race history')}</div>}
      </>}

      <BackupPanel onRestored={props.onRestored} onToast={props.onToast} />

      <div className="reset-section">
        {resetButton('all', '🗑️ Reset everything (counts + history)', true)}
      </div>
    </div>
  )
}
