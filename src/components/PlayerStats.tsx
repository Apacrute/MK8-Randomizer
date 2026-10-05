// src/components/PlayerStats.tsx
import { useState } from 'react'
import { RaceEntry } from '../types'
import { buildPlayerStats } from '../lib/playerStats'
import { BY_ID } from '../lib/catalog'
import { ordinal } from './RecordRace'
import Matchups from './Matchups'

type Range = 'today' | 'month' | 'all'

function since(range: Range): number {
  const d = new Date()
  if (range === 'today') { d.setHours(0, 0, 0, 0); return d.getTime() }
  if (range === 'month') return Date.now() - 30 * 24 * 60 * 60 * 1000
  return 0
}

interface Props {
  history: RaceEntry[]
  roster: string[]
  groupNames: Record<string, string>
  onNameGroup: (key: string, name: string) => void
}

export default function PlayerStats({ history, roster, groupNames, onNameGroup }: Props) {
  const [range, setRange] = useState<Range>('all')
  const [mode, setMode] = useState<'players' | 'matchups'>('players')
  const start = since(range)
  const inRange = history.filter(e => e.ts >= start)
  const players = buildPlayerStats(inRange)

  const rangeSwitch = (
    <>
    <div className="sub-switch">
      <button className={`sub-btn ${mode === 'players' ? 'active' : ''}`} onClick={() => setMode('players')}>Each player</button>
      <button className={`sub-btn ${mode === 'matchups' ? 'active' : ''}`} onClick={() => setMode('matchups')}>Matchups</button>
    </div>
    <div className="filter-row">
      {([['today', 'Today'], ['month', 'Last 30 days'], ['all', 'All time']] as const).map(([r, label]) => (
        <button key={r} className={`filter-btn ${range === r ? 'active' : ''}`} onClick={() => setRange(r)}>{label}</button>
      ))}
    </div>
    </>
  )

  if (mode === 'matchups') {
    return <div className="player-stats">{rangeSwitch}<Matchups history={inRange} roster={roster} groupNames={groupNames} onNameGroup={onNameGroup} /></div>
  }

  if (players.length === 0) {
    return (
      <div className="player-stats">
      {rangeSwitch}
      <div className="stats-empty">
        <p>No recorded races yet.</p>
        <p className="stats-empty-sub">After a race, tap <b>Record placements</b> on the Results screen.</p>
      </div>
      </div>
    )
  }

  return (
    <div className="player-stats">
      {rangeSwitch}
      {players.map((p, rank) => (
        <section className="pstat-card" key={p.name}>
          <div className="pstat-head">
            <span className="pstat-rank">{rank === 0 && p.groupWins > 0 ? '👑' : `#${rank + 1}`}</span>
            <span className="pstat-name">{p.name}</span>
            <span className="pstat-races"><b className="pstat-pts">{p.points}</b> pts · {p.races} race{p.races === 1 ? '' : 's'}</span>
          </div>
          <div className="pstat-grid">
            <div className="pstat"><b>{p.groupWins}</b><span>Race wins</span></div>
            <div className="pstat"><b>{p.firsts}</b><span>1st place</span></div>
            <div className="pstat"><b>{p.podiums}</b><span>Podiums</span></div>
            <div className="pstat"><b>{p.avgPlace ? ordinal(Math.round(p.avgPlace)) : '–'}</b><span>Avg place</span></div>
            <div className="pstat"><b>{p.great}</b><span>🔥 Great</span></div>
            <div className="pstat"><b>{p.rough}</b><span>💀 Rough</span></div>
          </div>
          {p.bestMaps.length > 0 && (
            <div className="pstat-maps">
              <span className="pstat-maps-label">Best tracks</span>
              {p.bestMaps.map(m => (
                <span className="pstat-map" key={m.mapId}>
                  {BY_ID.maps[m.mapId]?.name ?? m.mapId} <b>{m.wins}×</b>
                </span>
              ))}
            </div>
          )}
        </section>
      ))}
      <p className="edit-hint">Race win = best placement among the players in that race, even if it wasn't 1st. Ties count for each. Solo races don't count.</p>
    </div>
  )
}
