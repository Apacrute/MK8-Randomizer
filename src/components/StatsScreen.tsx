// src/components/StatsScreen.tsx
import { useState } from 'react'
import { MapStats } from '../types'
import { MAPS } from '../data/maps'
import './StatsScreen.css'

interface Props {
  stats: MapStats
  onResetPlayed: () => void
  onResetAll: () => void
}

type SortMode = 'count' | 'name' | 'unplayed'

export default function StatsScreen({ stats, onResetPlayed, onResetAll }: Props) {
  const [sortMode, setSortMode] = useState<SortMode>('count')
  const [confirmReset, setConfirmReset] = useState<'played' | 'all' | null>(null)
  const [filter, setFilter] = useState<'all' | 'played' | 'unplayed'>('all')

  const totalPlayed = stats.played.length
  const totalMaps = MAPS.length
  const totalRaces = Object.values(stats.counts).reduce((a, b) => a + b, 0)
  const mostPlayedId = Object.entries(stats.counts).sort((a, b) => b[1] - a[1])[0]?.[0]
  const mostPlayedMap = MAPS.find(m => m.id === mostPlayedId)

  const mapsWithStats = MAPS.map(m => ({
    ...m,
    count: stats.counts[m.id] || 0,
    played: stats.played.includes(m.id),
  }))

  const filtered = mapsWithStats.filter(m => {
    if (filter === 'played') return m.played
    if (filter === 'unplayed') return !m.played
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortMode === 'count') return b.count - a.count
    if (sortMode === 'name') return a.name.localeCompare(b.name)
    if (sortMode === 'unplayed') return (a.played ? 1 : 0) - (b.played ? 1 : 0)
    return 0
  })

  const handleReset = (type: 'played' | 'all') => {
    if (confirmReset === type) {
      type === 'played' ? onResetPlayed() : onResetAll()
      setConfirmReset(null)
    } else {
      setConfirmReset(type)
      setTimeout(() => setConfirmReset(null), 3000)
    }
  }

  return (
    <div className="stats-screen">

      {/* Summary Cards */}
      <div className="stats-summary">
        <div className="stat-card">
          <span className="stat-value">{totalRaces}</span>
          <span className="stat-label">Total Races</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{totalPlayed}<span className="stat-denom">/{totalMaps}</span></span>
          <span className="stat-label">Maps Played</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{totalMaps - totalPlayed}</span>
          <span className="stat-label">Unplayed</span>
        </div>
      </div>

      {/* Most played */}
      {mostPlayedMap && (
        <div className="most-played-card">
          <div className="mp-img-wrap">
            <img src={mostPlayedMap.image} alt={mostPlayedMap.name} className="mp-img"
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3' }} />
          </div>
          <div className="mp-info">
            <span className="mp-label">⭐ Most Played</span>
            <span className="mp-name">{mostPlayedMap.name}</span>
            <span className="mp-count">{stats.counts[mostPlayedId]} times</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="stats-controls">
        <div className="filter-row">
          {(['all', 'played', 'unplayed'] as const).map(f => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f === 'played' ? '✅ Played' : '⬜ Unplayed'}
            </button>
          ))}
        </div>
        <div className="sort-row">
          <span className="sort-label">Sort:</span>
          {(['count', 'name', 'unplayed'] as const).map(s => (
            <button
              key={s}
              className={`sort-btn ${sortMode === s ? 'active' : ''}`}
              onClick={() => setSortMode(s)}
            >
              {s === 'count' ? '🔢 Count' : s === 'name' ? '🔤 Name' : '⬜ Unplayed'}
            </button>
          ))}
        </div>
      </div>

      {/* Map List */}
      <div className="stats-map-list">
        {sorted.map(m => (
          <div key={m.id} className={`stats-map-row ${m.played ? 'played' : 'unplayed'}`}>
            <div className="stats-map-img-wrap">
              <img src={m.image} alt={m.name} className="stats-map-img"
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3' }} />
              {!m.played && <div className="unplayed-overlay" />}
            </div>
            <div className="stats-map-info">
              <span className="stats-map-name">{m.name}</span>
              <span className="stats-map-cat">{m.category}</span>
            </div>
            <div className="stats-map-count">
              {m.count > 0
                ? <span className="count-badge">{m.count}×</span>
                : <span className="unplayed-badge">–</span>
              }
            </div>
          </div>
        ))}
      </div>

      {/* Reset Buttons */}
      <div className="reset-section">
        <button
          className={`reset-btn ${confirmReset === 'played' ? 'confirming' : ''}`}
          onClick={() => handleReset('played')}
        >
          {confirmReset === 'played' ? '⚠️ Tap again to confirm' : '🔄 Reset No-Repeat List'}
        </button>
        <button
          className={`reset-btn danger ${confirmReset === 'all' ? 'confirming' : ''}`}
          onClick={() => handleReset('all')}
        >
          {confirmReset === 'all' ? '⚠️ Tap again to confirm' : '🗑️ Reset All Stats'}
        </button>
      </div>
    </div>
  )
}
