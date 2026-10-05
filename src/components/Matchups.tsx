// src/components/Matchups.tsx
// Head-to-head records for each exact group of players.
import { useState } from 'react'
import { RaceEntry } from '../types'
import { buildMatchups } from '../lib/playerStats'
import { ordinal } from './RecordRace'

export default function Matchups({ history }: { history: RaceEntry[] }) {
  const all = buildMatchups(history)
  const people = Array.from(new Set(all.flatMap(m => m.names))).sort((a, b) => a.localeCompare(b))
  const [who, setWho] = useState('')
  const list = who ? all.filter(m => m.names.includes(who)) : all

  if (all.length === 0) {
    return (
      <div className="stats-empty">
        <p>No head-to-head races yet.</p>
        <p className="stats-empty-sub">Record placements for a race with 2 or more players and the group shows up here.</p>
      </div>
    )
  }

  return (
    <div className="matchups">
      <label className="matchup-filter">
        <span>Groups with</span>
        <select value={who} onChange={e => setWho(e.target.value)}>
          <option value="">Everyone</option>
          {people.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </label>

      {list.map(m => {
        const top = m.members[0]
        const leader = top && top.wins > 0 && (m.members[1]?.wins ?? -1) < top.wins ? top.name : null
        return (
          <section className="matchup-card" key={m.key}>
            <div className="matchup-head">
              <span className="matchup-title">{m.names.join(' vs ')}</span>
              <span className="matchup-races">{m.races} race{m.races === 1 ? '' : 's'}</span>
            </div>
            {m.members.map(p => {
              const pct = m.races ? Math.round((p.wins / m.races) * 100) : 0
              return (
                <div className="matchup-row" key={p.name}>
                  <span className="matchup-name">{p.name === leader ? '👑 ' : ''}{p.name}</span>
                  <div className="matchup-bar"><div className="matchup-fill" style={{ width: `${pct}%` }} /></div>
                  <span className="matchup-wins">{p.wins} win{p.wins === 1 ? '' : 's'}</span>
                  <span className="matchup-extra">
                    {p.avgPlace ? `avg ${ordinal(Math.round(p.avgPlace))}` : ''}
                    {p.great ? ` · 🔥${p.great}` : ''}{p.rough ? ` · 💀${p.rough}` : ''}
                  </span>
                </div>
              )
            })}
          </section>
        )
      })}
      <p className="edit-hint">A win = best placement among that group in a race (doesn't have to be 1st). Ties count as a win for each.</p>
    </div>
  )
}
