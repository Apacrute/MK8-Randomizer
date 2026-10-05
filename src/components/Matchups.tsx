// src/components/Matchups.tsx
// Head-to-head records for groups of players. Pick a group from the dropdown,
// or build one by tapping players. Groups can be given a name.
import { useState, useEffect } from 'react'
import { RaceEntry } from '../types'
import { buildMatchups, groupKey, groupMembers, Matchup } from '../lib/playerStats'
import { BY_ID } from '../lib/catalog'
import { ordinal, ResultSummary } from './RecordRace'

interface Props {
  history: RaceEntry[]
  roster: string[]
  groupNames: Record<string, string>
  onNameGroup: (key: string, name: string) => void
}

const ALL = '__all__'
const PICK = '__pick__'

export function groupLabel(key: string, groupNames: Record<string, string>): string {
  return groupNames[key] || groupMembers(key).join(' · ')
}

function when(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function GroupCard({ m, title, subtitle }: { m: Matchup; title: string; subtitle?: string }) {
  const top = m.members[0]
  const leader = top && top.points > 0 && (m.members[1]?.points ?? -1) < top.points ? top.name : null
  const maxPts = Math.max(1, ...m.members.map(x => x.points))
  return (
    <section className="matchup-card">
      <div className="matchup-head">
        <div className="matchup-titles">
          <span className="matchup-title">{title}</span>
          {subtitle && <span className="matchup-sub">{subtitle}</span>}
        </div>
        <span className="matchup-races">{m.races} race{m.races === 1 ? '' : 's'}</span>
      </div>
      {m.members.map(p => {
        const places = Object.entries(p.places)
          .sort((a, b) => Number(a[0]) - Number(b[0]))
          .map(([place, n]) => `${ordinal(Number(place))}${n > 1 ? ` ×${n}` : ''}`)
          .join(' · ')
        return (
          <div className="matchup-row" key={p.name}>
            <span className="matchup-name">{p.name === leader ? '👑 ' : ''}{p.name}</span>
            <div className="matchup-bar"><div className="matchup-fill" style={{ width: `${(p.points / maxPts) * 100}%` }} /></div>
            <span className="matchup-pts">{p.points}<small> pts</small></span>
            <span className="matchup-extra">
              <b>{p.wins}W–{p.losses}L</b>
              {places ? ` · ${places}` : ''}
              {p.great ? ` · 🔥${p.great}` : ''}{p.rough ? ` · 💀${p.rough}` : ''}
            </span>
          </div>
        )
      })}
    </section>
  )
}

export default function Matchups({ history, roster, groupNames, onNameGroup }: Props) {
  const matchups = buildMatchups(history)
  const byKey = Object.fromEntries(matchups.map(m => [m.key, m]))

  // Every group: ones that have raced, plus named ones that haven't yet
  const keys = Array.from(new Set([...matchups.map(m => m.key), ...Object.keys(groupNames)]))
    .filter(k => groupMembers(k).length >= 2)
    .sort((a, b) => (byKey[b]?.races ?? 0) - (byKey[a]?.races ?? 0) || groupLabel(a, groupNames).localeCompare(groupLabel(b, groupNames)))

  const people = Array.from(new Set([...roster, ...matchups.flatMap(m => m.names)])).sort((a, b) => a.localeCompare(b))

  const [selected, setSelected] = useState<string>(ALL)
  const [picked, setPicked] = useState<string[]>([])
  const [nameDraft, setNameDraft] = useState('')

  const activeKey = selected === PICK ? groupKey(picked) : selected === ALL ? '' : selected
  useEffect(() => { setNameDraft(activeKey ? groupNames[activeKey] ?? '' : '') }, [activeKey, groupNames[activeKey]])

  const togglePick = (n: string) =>
    setPicked(p => (p.includes(n) ? p.filter(x => x !== n) : [...p, n]))

  const emptyMatchup = (key: string): Matchup => ({
    key, names: groupMembers(key), races: 0,
    members: groupMembers(key).map(name => ({ name, points: 0, wins: 0, losses: 0, places: {}, avgPlace: null, great: 0, rough: 0 })),
  })

  // This group's races, newest first
  const groupRaces = activeKey ? history.filter(e => e.results && groupKey(e.names) === activeKey) : []

  return (
    <div className="matchups">
      <label className="matchup-filter">
        <span>Group</span>
        <select value={selected} onChange={e => setSelected(e.target.value)}>
          <option value={ALL}>All groups ({keys.length})</option>
          {keys.map(k => (
            <option key={k} value={k}>
              {groupNames[k] ? `${groupNames[k]} — ${groupMembers(k).join(', ')}` : groupMembers(k).join(' · ')}
              {byKey[k] ? ` (${byKey[k].races})` : ''}
            </option>
          ))}
          <option value={PICK}>＋ Pick players…</option>
        </select>
      </label>

      {selected === PICK && (
        <div className="pick-chips">
          {people.length === 0 && <p className="edit-hint">Add players in Setup first.</p>}
          {people.map(n => (
            <button key={n} className={`pick-chip ${picked.includes(n) ? 'on' : ''}`} onClick={() => togglePick(n)}>{n}</button>
          ))}
        </div>
      )}

      {/* ── All groups ── */}
      {selected === ALL && (keys.length === 0 ? (
        <div className="stats-empty">
          <p>No head-to-head races yet.</p>
          <p className="stats-empty-sub">Record placements for a race with 2 or more players, or pick players above to set up a group.</p>
        </div>
      ) : keys.map(k => (
        <div key={k} className="tappable" onClick={() => setSelected(k)}>
          <GroupCard m={byKey[k] ?? emptyMatchup(k)} title={groupLabel(k, groupNames)}
            subtitle={groupNames[k] ? groupMembers(k).join(' · ') : undefined} />
        </div>
      )))}

      {/* ── One group ── */}
      {activeKey && groupMembers(activeKey).length >= 2 && (
        <>
          <GroupCard m={byKey[activeKey] ?? emptyMatchup(activeKey)} title={groupLabel(activeKey, groupNames)}
            subtitle={groupNames[activeKey] ? groupMembers(activeKey).join(' · ') : undefined} />

          <div className="group-name-row">
            <input className="group-name-input" value={nameDraft} maxLength={30}
              placeholder="Name this group (optional)"
              onChange={e => setNameDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') onNameGroup(activeKey, nameDraft) }} />
            <button className="picker-mini" disabled={(groupNames[activeKey] ?? '') === nameDraft.trim()}
              onClick={() => onNameGroup(activeKey, nameDraft)}>Save</button>
          </div>

          <h4 className="group-hist-title">Race history ({groupRaces.length})</h4>
          {groupRaces.length === 0 && <p className="edit-hint">No recorded races for this group yet.</p>}
          {groupRaces.map(e => {
            const map = e.map ? BY_ID.maps[e.map] : null
            return (
              <div className="group-race" key={e.id}>
                <div className="group-race-head">
                  <span className="group-race-map">{map?.name ?? 'Race'}</span>
                  <span className="group-race-date">{when(e.ts)}</span>
                </div>
                <ResultSummary names={e.names} results={e.results!} />
              </div>
            )
          })}
        </>
      )}

      {selected === PICK && picked.length < 2 && people.length > 0 && (
        <p className="edit-hint">Tap at least 2 players to see that group.</p>
      )}

      <p className="edit-hint">
        Points use Mario Kart scoring: 1st 15 · 2nd 12 · 3rd 10 · 4th 9 · 5th 8 … 12th 1.
        A win = best placement in that group for the race (doesn't have to be 1st); ties count as a win for each.
        Map counts are one master total across every game.
      </p>
    </div>
  )
}
