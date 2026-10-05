// src/lib/playerStats.ts
// Build per-player and per-map winner stats from recorded races.
import { RaceEntry } from '../types'

export interface PlayerStat {
  name: string
  races: number          // races with a recorded result
  groupWins: number      // beat everyone else in the group (ties share it)
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
        name, races: 0, groupWins: 0, firsts: 0, podiums: 0, avgPlace: null, great: 0, rough: 0,
        bestMaps: [], placeSum: 0, placed: 0, mapWins: {},
      }
      s.races++
      if (r.place !== null) {
        s.placeSum += r.place
        s.placed++
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
