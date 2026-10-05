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

// Re-export prix types so other files can import from one place if they want
export type { PrixItem, PrixCategory } from './data/prixes'

import type { PrixItem } from './data/prixes'

export interface PlayerResult {
  character: GameItem | null
  kart: GameItem | null
  tire: GameItem | null
  hanger: GameItem | null
  mode: GameItem | null
  map: MapItem | null
  prix: PrixItem | null
}

export interface MapStats {
  counts: Record<string, number>        // map id -> times played
  played: string[]                      // map ids that have been played (legacy, kept for compatibility)
  prixCounts: Record<string, number>    // prix id -> times played
}

export interface RandomizeSettings {
  character: boolean
  kart: boolean
  tire: boolean
  hanger: boolean
  mode: boolean
  map: boolean
  prix: boolean
  standardMaps: boolean
  dlcMaps: boolean
  rainbowRoads: boolean
  tours: boolean
  noRepeats: boolean
  playerCount: number
}
