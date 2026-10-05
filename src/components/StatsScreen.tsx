// src/components/StatsScreen.tsx
import { useState } from 'react'
import { MapStats } from '../types'
import { MAPS } from '../data/maps'
import { PRIXES } from '../data/prixes'
import './StatsScreen.css'

interface Props {
  stats: MapStats
  onAdjustMap: (id: string, delta: number) => void
  onSetMap: (id: string, value: number) => void
  onAdjustPrix: (id: string, delta: number) => void
  onSetPrix: (id: string, value: number) => void
  onResetCounts: () => void
  onResetPrix: () => void
  onResetAll: () => void
}

type View = 'maps' | 'prixes'
type SortMode = 'count' | 'name' | 'unplayed'

// A small reusable stepper: [–] [number input] [+]
function CountStepper({
  count, onAdjust, onSet, color,
}: {
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
      <button
        className="stepper-btn minus"
        onClick={() => onAdjust(-1)}
        disabled={count <= 0}
        aria-label="decrease"
      >−</button>

      {editing ? (
        <input
          className="stepper-input"
          type="number"
          inputMode="numeric"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => { if (e.key === 'Enter') commit() }}
        />
      ) : (
        <button
          className="stepper-value"
          style={color ? { color } : undefined}
          onClick={() => { setDraft(String(count)); setEditing(true) }}
        >
          {count}
        </button>
      )}

      <button
        className="stepper-btn plus"
        onClick={() => onAdjust(1)}
        aria-label="increase"
      >+</button>
    </div>
  )
}

export default function StatsScreen({
  stats, onAdjustMap, onSetMap, onAdjustPrix, onSetPrix,
  onResetCounts, onResetPrix, onResetAll,
}: Props) {
  const [view, setView] = useState<View>('maps')
  const [sortMode, setSortMode] = useState<SortMode>('count')
  const [confirmReset, setConfirmReset] = useState<'counts' | 'prix' | 'all' | null>(null)
  const [filter, setFilter] = useState<'all' | 'played' | 'unplayed'>('all')

  // ── Map aggregates ──
  const mapsWithStats = MAPS.map(m => ({
    ...m,
    count: stats.counts[m.id] || 0,
  }))
  const totalRaces = Object.values(stats.counts).reduce((a, b) => a + b, 0)
  const mapsPlayed = mapsWithStats.filter(m => m.count > 0).length

  const filteredMaps = mapsWithStats.filter(m => {
    if (filter === 'played') return m.count > 0
    if (filter === 'unplayed') return m.count === 0
    return true
  })
  const sortedMaps = [...filteredMaps].sort((a, b) => {
    if (sortMode === 'count') return b.count - a.count
    if (sortMode === 'name') return a.name.localeCompare(b.name)
    if (sortMode === 'unplayed') return a.count - b.count
    return 0
  })

  // ── Prix aggregates ──
  const prixesWithStats = PRIXES.map(p => ({
    ...p,
    count: stats.prixCounts[p.id] || 0,
  }))
  const totalPrixRaces = Object.values(stats.prixCounts).reduce((a, b) => a + b, 0)
  const sortedPrixes = [...prixesWithStats].sort((a, b) => {
    if (sortMode === 'count') return b.count - a.count
    if (sortMode === 'name') return a.name.localeCompare(b.name)
    if (sortMode === 'unplayed') return a.count - b.count
    return 0
  })

  const handleReset = (type: 'counts' | 'prix' | 'all') => {
    if (confirmReset === type) {
      if (type === 'counts') onResetCounts()
      else if (type === 'prix') onResetPrix()
      else onResetAll()
      setConfirmReset(null)
    } else {
      setConfirmReset(type)
      setTimeout(() => setConfirmReset(null), 3000)
    }
  }

  return (
    <div className="stats-screen">

      {/* View switch: Maps / Cups */}
      <div className="view-switch">
        <button className={`view-btn ${view === 'maps' ? 'active' : ''}`} onClick={() => setView('maps')}>
          🗺️ Maps
        </button>
        <button className={`view-btn ${view === 'prixes' ? 'active' : ''}`} onClick={() => setView('prixes')}>
          🏆 Cups
        </button>
      </div>

      {/* Summary */}
      <div className="stats-summary">
        {view === 'maps' ? (
          <>
            <div className="stat-card">
              <span className="stat-value">{totalRaces}</span>
              <span className="stat-label">Map Races</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{mapsPlayed}<span className="stat-denom">/{MAPS.length}</span></span>
              <span className="stat-label">Maps Played</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{MAPS.length - mapsPlayed}</span>
              <span className="stat-label">Unplayed</span>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card">
              <span className="stat-value">{totalPrixRaces}</span>
              <span className="stat-label">Cup Races</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{prixesWithStats.filter(p => p.count > 0).length}<span className="stat-denom">/{PRIXES.length}</span></span>
              <span className="stat-label">Cups Played</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{PRIXES.filter(p => (stats.prixCounts[p.id] || 0) === 0).length}</span>
              <span className="stat-label">Unplayed</span>
            </div>
          </>
        )}
      </div>

      <p className="edit-hint">💡 Tap a number to type an exact value, or use − / + to adjust.</p>

      {/* Controls */}
      <div className="stats-controls">
        {view === 'maps' && (
          <div className="filter-row">
            {(['all', 'played', 'unplayed'] as const).map(f => (
              <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'played' ? '✅ Played' : '⬜ Unplayed'}
              </button>
            ))}
          </div>
        )}
        <div className="sort-row">
          <span className="sort-label">Sort:</span>
          {(['count', 'name', 'unplayed'] as const).map(s => (
            <button key={s} className={`sort-btn ${sortMode === s ? 'active' : ''}`} onClick={() => setSortMode(s)}>
              {s === 'count' ? '🔢 Count' : s === 'name' ? '🔤 Name' : '⬜ Least' }
            </button>
          ))}
        </div>
      </div>

      {/* ── Maps list ── */}
      {view === 'maps' && (
        <div className="stats-map-list">
          {sortedMaps.map(m => (
            <div key={m.id} className={`stats-map-row ${m.count > 0 ? 'played' : 'unplayed'}`}>
              <div className="stats-map-img-wrap">
                <img src={m.image} alt={m.name} className="stats-map-img"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3' }} />
                {m.count === 0 && <div className="unplayed-overlay" />}
              </div>
              <div className="stats-map-info">
                <span className="stats-map-name">{m.name}</span>
                <span className="stats-map-cat">{m.category}</span>
              </div>
              <CountStepper
                count={m.count}
                onAdjust={(d) => onAdjustMap(m.id, d)}
                onSet={(v) => onSetMap(m.id, v)}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Prix list ── */}
      {view === 'prixes' && (
        <div className="stats-map-list">
          {sortedPrixes.map(p => (
            <div key={p.id} className={`stats-map-row ${p.count > 0 ? 'played' : 'unplayed'}`}>
              <div className="stats-prix-emblem" style={{ background: `${p.color}22`, color: p.color }}>
                {p.emblem}
              </div>
              <div className="stats-map-info">
                <span className="stats-map-name">{p.name}</span>
                <span className="stats-map-cat">{p.category === 'base' ? 'Base Game' : 'Booster Pass'}</span>
              </div>
              <CountStepper
                count={p.count}
                color={p.color}
                onAdjust={(d) => onAdjustPrix(p.id, d)}
                onSet={(v) => onSetPrix(p.id, v)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Resets */}
      <div className="reset-section">
        {view === 'maps' ? (
          <button
            className={`reset-btn ${confirmReset === 'counts' ? 'confirming' : ''}`}
            onClick={() => handleReset('counts')}
          >
            {confirmReset === 'counts' ? '⚠️ Tap again to confirm' : '🔄 Reset All Map Counts'}
          </button>
        ) : (
          <button
            className={`reset-btn ${confirmReset === 'prix' ? 'confirming' : ''}`}
            onClick={() => handleReset('prix')}
          >
            {confirmReset === 'prix' ? '⚠️ Tap again to confirm' : '🔄 Reset All Cup Counts'}
          </button>
        )}
        <button
          className={`reset-btn danger ${confirmReset === 'all' ? 'confirming' : ''}`}
          onClick={() => handleReset('all')}
        >
          {confirmReset === 'all' ? '⚠️ Tap again to confirm' : '🗑️ Reset Everything'}
        </button>
      </div>
    </div>
  )
}
