// src/types.ts
export interface GameItem {
  id: string
  name: string
  image: string
}

export type MapCategory = 'standard' | 'dlc' | 'Rainbow Roads' | 'Tours'

export interface MapItem extends GameItem {
  category: MapCategory
}

export type { PrixItem, PrixCategory } from './data/prixes'

// ── Pools that can have items banned from them ──
export type PoolKey = 'characters' | 'karts' | 'tires' | 'gliders' | 'maps' | 'prixes'
export type Excluded = Record<PoolKey, string[]>

// ── A single roll, stored by id so it survives app updates ──
export interface PlayerLoadout {
  character: string | null
  kart: string | null
  tire: string | null
  glider: string | null
}

export type RunRating = 'great' | 'rough'

export interface PlayerPlacement {
  place: number | null        // 1–12 finishing position
  rating: RunRating | null    // good or bad run for their skill level
}

export interface RaceEntry {
  id: string
  ts: number                  // when it was rolled
  names: string[]             // player names at the time of the roll
  loadouts: PlayerLoadout[]
  map: string | null
  prix: string | null
  mode: string | null
  items: string | null
  challenge: string | null
  results: PlayerPlacement[] | null   // null until the race is recorded
  cupTracksCounted?: boolean          // "played the whole cup" already applied
}

// Slots that can be rerolled on their own from the results screen
export type LoadoutSlot = keyof PlayerLoadout
export type SharedSlot = 'map' | 'prix' | 'mode' | 'items' | 'challenge'
export type RerollTarget =
  | { kind: 'shared'; slot: SharedSlot }
  | { kind: 'player'; slot: LoadoutSlot; player: number }

export interface MapStats {
  counts: Record<string, number>        // map id -> times rolled
  played: string[]                      // legacy, kept for compatibility
  prixCounts: Record<string, number>    // cup id -> times rolled
}

export type RollScope = 'all' | 'map'

export interface RandomizeSettings {
  character: boolean
  kart: boolean
  tire: boolean
  hanger: boolean
  mode: boolean
  items: boolean
  challenge: boolean
  map: boolean
  prix: boolean
  prixNoRepeats: boolean
  standardMaps: boolean
  dlcMaps: boolean
  rainbowRoads: boolean
  tours: boolean
  noRepeats: boolean
  uniqueLoadouts: boolean
  playerCount: number
  playerNames: string[]
  rollScope: RollScope
  excluded: Excluded
}
