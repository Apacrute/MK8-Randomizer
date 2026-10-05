// src/components/PlayerStats.tsx
import { RaceEntry } from '../types'
import { buildPlayerStats } from '../lib/playerStats'
import { BY_ID } from '../lib/catalog'
import { ordinal } from './RecordRace'

export default function PlayerStats({ history }: { history: RaceEntry[] }) {
  const players = buildPlayerStats(history)

  if (players.length === 0) {
    return (
      <div className="stats-empty">
        <p>No recorded races yet.</p>
        <p className="stats-empty-sub">After a race, tap <b>Record placements</b> on the Results screen.</p>
      </div>
    )
  }

  return (
    <div className="player-stats">
      {players.map((p, rank) => (
        <section className="pstat-card" key={p.name}>
          <div className="pstat-head">
            <span className="pstat-rank">{rank === 0 && p.groupWins > 0 ? '👑' : `#${rank + 1}`}</span>
            <span className="pstat-name">{p.name}</span>
            <span className="pstat-races">{p.races} race{p.races === 1 ? '' : 's'}</span>
          </div>
          <div className="pstat-grid">
            <div className="pstat"><b>{p.groupWins}</b><span>Group wins</span></div>
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
      <p className="edit-hint">Group wins = beat everyone else in the group. Ties share the win.</p>
    </div>
  )
}
