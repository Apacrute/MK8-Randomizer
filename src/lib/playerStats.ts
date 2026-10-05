// src/lib/playerStats.ts
// Build per-player and per-map winner stats from recorded races.
import { RaceEntry } from '../types'

// Mario Kart 8 race points: 1st 15, 2nd 12, 3rd 10, 4th 9 ... 12th 1
export const RACE_POINTS = [15, 12, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
export function pointsFor(place: number | null | undefined): number {
  return place ? RACE_POINTS[place - 1] ?? 0 : 0
}

export interface PlayerStat {
  name: string
  races: number          // races with a recorded result
  groupWins: number      // beat everyone else in the group (ties share it)
  points: number         // MK8 race points across all recorded races
  firsts: number         // finished 1st overall
  podiums: number        // finished top 3
  avgPlace: number | null
  great: number
  rough: number
  bestMaps: { mapId: string; wins: number }[]
}

// Whoever had the best (lowest) place in a race. Returns indexes; ties all count.
export function groupWinners(entry: RaceEntry): number[] {
  if (!entry.results || entry.names.length < 2) return []
  const places = entry.results.map(r => r?.place ?? null)
  const valid = places.filter((p): p is number => p !== null)
  if (valid.length === 0) return []
  const best = Math.min(...valid)
  return places.map((p, i) => (p === best ? i : -1)).filter(i => i >= 0)
}

export function buildPlayerStats(history: RaceEntry[]): PlayerStat[] {
  const by: Record<string, PlayerStat & { placeSum: number; placed: number; mapWins: Record<string, number> }> = {}

  for (const e of history) {
    if (!e.results) continue
    const winners = groupWinners(e)
    e.names.forEach((name, i) => {
      const r = e.results![i]
      if (!r || (r.place === null && r.rating === null)) return
      const s = by[name] ??= {
        name, races: 0, groupWins: 0, points: 0, firsts: 0, podiums: 0, avgPlace: null, great: 0, rough: 0,
        bestMaps: [], placeSum: 0, placed: 0, mapWins: {},
      }
      s.races++
      if (r.place !== null) {
        s.placeSum += r.place
        s.placed++
        s.points += pointsFor(r.place)
        if (r.place === 1) s.firsts++
        if (r.place <= 3) s.podiums++
      }
      if (r.rating === 'great') s.great++
      if (r.rating === 'rough') s.rough++
      if (winners.includes(i)) {
        s.groupWins++
        if (e.map) s.mapWins[e.map] = (s.mapWins[e.map] || 0) + 1
      }
    })
  }

  return Object.values(by)
    .map(s => ({
      name: s.name,
      races: s.races,
      groupWins: s.groupWins,
      points: s.points,
      firsts: s.firsts,
      podiums: s.podiums,
      avgPlace: s.placed ? s.placeSum / s.placed : null,
      great: s.great,
      rough: s.rough,
      bestMaps: Object.entries(s.mapWins)
        .map(([mapId, wins]) => ({ mapId, wins }))
        .sort((a, b) => b.wins - a.wins)
        .slice(0, 3),
    }))
    .sort((a, b) =>
      b.groupWins - a.groupWins ||
      (a.avgPlace ?? 99) - (b.avgPlace ?? 99) ||
      b.races - a.races)
}

// map id -> the player with the most group wins on it
export function mapChampions(history: RaceEntry[]): Record<string, { name: string; wins: number }> {
  const tally: Record<string, Record<string, number>> = {}
  for (const e of history) {
    if (!e.map) continue
    for (const i of groupWinners(e)) {
      const name = e.names[i]
      tally[e.map] ??= {}
      tally[e.map][name] = (tally[e.map][name] || 0) + 1
    }
  }
  const out: Record<string, { name: string; wins: number }> = {}
  for (const [mapId, names] of Object.entries(tally)) {
    const [name, wins] = Object.entries(names).sort((a, b) => b[1] - a[1])[0]
    out[mapId] = { name, wins }
  }
  return out
}

// ── Matchups: how each exact group of players does against each other ──
export interface MatchupMember {
  name: string
  points: number          // MK8 race points in races with this group
  wins: number            // best placement among this group in a race
  losses: number          // placed, but someone in the group finished higher
  places: Record<number, number>   // finishing place -> how many times
  avgPlace: number | null
  great: number
  rough: number
}

export interface Matchup {
  key: string             // sorted names, e.g. "Connor|Drew"
  names: string[]
  races: number
  members: MatchupMember[]   // sorted by points
}

interface Tally { wins: number; sum: number; n: number; great: number; rough: number; points: number; places: Record<number, number> }
const emptyTally = (): Tally => ({ wins: 0, sum: 0, n: 0, great: 0, rough: 0, points: 0, places: {} })

export function buildMatchups(history: RaceEntry[]): Matchup[] {
  const groups: Record<string, { names: string[]; races: number; m: Record<string, Tally> }> = {}

  for (const e of history) {
    if (!e.results || e.names.length < 2) continue
    if (!e.results.some(r => r && r.place !== null)) continue
    const names = Array.from(new Set(e.names)).sort((a, b) => a.localeCompare(b))
    if (names.length < 2) continue
    const key = names.join('|')
    const g = groups[key] ??= { names, races: 0, m: {} }
    g.races++
    const winners = groupWinners(e)
    e.names.forEach((name, i) => {
      const r = e.results![i]
      const s = g.m[name] ??= emptyTally()
      if (winners.includes(i)) s.wins++
      if (r?.place != null) {
        s.sum += r.place; s.n++
        s.points += pointsFor(r.place)
        s.places[r.place] = (s.places[r.place] || 0) + 1
      }
      if (r?.rating === 'great') s.great++
      if (r?.rating === 'rough') s.rough++
    })
  }

  return Object.entries(groups)
    .map(([key, g]) => ({
      key,
      names: g.names,
      races: g.races,
      members: g.names
        .map(name => {
          const s = g.m[name] ?? emptyTally()
          return {
            name, points: s.points, wins: s.wins, losses: Math.max(0, s.n - s.wins), places: s.places,
            avgPlace: s.n ? s.sum / s.n : null, great: s.great, rough: s.rough,
          }
        })
        .sort((a, b) => b.points - a.points || b.wins - a.wins || (a.avgPlace ?? 99) - (b.avgPlace ?? 99)),
    }))
    .sort((a, b) => b.races - a.races || a.names.length - b.names.length)
}
