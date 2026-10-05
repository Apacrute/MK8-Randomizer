// src/lib/roll.ts
// Pure randomizing logic — no React, no storage.
import { randomItem } from '../utils/random'
import {
  RandomizeSettings, MapStats, RaceEntry, PlayerLoadout, LoadoutSlot, SharedSlot,
  MapItem, GameItem, PoolKey,
} from '../types'
import { POOLS, SLOT_POOL, MAPS, PRIXES, MODES, ITEM_SETS, CHALLENGES } from './catalog'

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// A pool minus anything banned. If everything is banned, fall back to the full
// pool so the randomizer never comes back empty-handed.
export function available<T extends { id: string }>(all: T[], banned: string[]): T[] {
  const left = all.filter(x => !banned.includes(x.id))
  return left.length > 0 ? left : all
}

// "Least-played first": only the items with the lowest count are eligible.
// When everything is at 3 plays, anything that reaches 4 waits until the rest catch up.
export function leveled<T extends { id: string }>(pool: T[], counts: Record<string, number>): T[] {
  if (pool.length === 0) return pool
  const min = Math.min(...pool.map(x => counts[x.id] || 0))
  return pool.filter(x => (counts[x.id] || 0) === min)
}

// Maps allowed by the category toggles and the ban list (before leveling)
export function mapPool(s: RandomizeSettings): MapItem[] {
  const byCategory = MAPS.filter(m =>
    (s.standardMaps && m.category === 'standard') ||
    (s.dlcMaps && m.category === 'dlc') ||
    (s.rainbowRoads && m.category === 'Rainbow Roads') ||
    (s.tours && m.category === 'Tours')
  )
  return available(byCategory, s.excluded.maps)
}

export function eligibleMaps(s: RandomizeSettings, stats: MapStats): MapItem[] {
  const pool = mapPool(s)
  return s.noRepeats ? leveled(pool, stats.counts) : pool
}

export function eligiblePrixes(s: RandomizeSettings, stats: MapStats) {
  const pool = available(PRIXES, s.excluded.prixes)
  return s.prixNoRepeats ? leveled(pool, stats.prixCounts) : pool
}

function slotEnabled(s: RandomizeSettings, slot: LoadoutSlot): boolean {
  if (slot === 'glider') return s.hanger
  return s[slot]
}

// Pick one item for a loadout slot, avoiding ids other players already have
// when "different for everyone" is on (falls back to allowing repeats if the
// pool is too small).
export function pickForSlot(
  s: RandomizeSettings, slot: LoadoutSlot, taken: string[] = [],
): string | null {
  if (!slotEnabled(s, slot)) return null
  const key: PoolKey = SLOT_POOL[slot]
  const pool: GameItem[] = available(POOLS[key], s.excluded[key])
  const fresh = s.uniqueLoadouts ? pool.filter(x => !taken.includes(x.id)) : pool
  return randomItem(fresh.length > 0 ? fresh : pool).id
}

const SLOTS: LoadoutSlot[] = ['character', 'kart', 'tire', 'glider']

export function rollLoadouts(s: RandomizeSettings): PlayerLoadout[] {
  const out: PlayerLoadout[] = []
  for (let i = 0; i < s.playerCount; i++) {
    const l = {} as PlayerLoadout
    for (const slot of SLOTS) {
      const taken = out.map(o => o[slot]).filter(Boolean) as string[]
      l[slot] = pickForSlot(s, slot, taken)
    }
    out.push(l)
  }
  return out
}

export function rollShared(s: RandomizeSettings, stats: MapStats, slot: SharedSlot): string | null {
  switch (slot) {
    case 'map': {
      if (!s.map) return null
      const pool = eligibleMaps(s, stats)
      return pool.length ? randomItem(pool).id : null
    }
    case 'prix': return s.prix ? randomItem(eligiblePrixes(s, stats)).id : null
    case 'mode': return s.mode ? randomItem(MODES).id : null
    case 'items': return s.items ? randomItem(ITEM_SETS).id : null
    case 'challenge': return s.challenge ? randomItem(CHALLENGES).id : null
  }
}

export function activeNames(s: RandomizeSettings): string[] {
  return Array.from({ length: s.playerCount }, (_, i) =>
    (s.playerNames[i] || '').trim() || `P${i + 1}`)
}

// A completely fresh roll of everything
export function rollEverything(s: RandomizeSettings, stats: MapStats): RaceEntry {
  return {
    id: newId(),
    ts: Date.now(),
    names: activeNames(s),
    loadouts: rollLoadouts(s),
    map: rollShared(s, stats, 'map'),
    prix: rollShared(s, stats, 'prix'),
    mode: rollShared(s, stats, 'mode'),
    items: rollShared(s, stats, 'items'),
    challenge: rollShared(s, stats, 'challenge'),
    results: null,
  }
}

// Same players, loadouts, cup and rules — just a new track. This is a new race.
export function rollMapOnly(s: RandomizeSettings, stats: MapStats, prev: RaceEntry): RaceEntry {
  return {
    ...prev,
    id: newId(),
    ts: Date.now(),
    names: activeNames(s),
    map: rollShared(s, stats, 'map'),
    results: null,
    cupTracksCounted: false,
  }
}
