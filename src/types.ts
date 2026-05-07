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

export interface PlayerResult {
  character: GameItem | null
  kart: GameItem | null
  tire: GameItem | null
  hanger: GameItem | null
  mode: GameItem | null
  map: MapItem | null
}

export interface MapStats {
  counts: Record<string, number>
  played: string[]
}

export interface RandomizeSettings {
  character: boolean
  kart: boolean
  tire: boolean
  hanger: boolean
  mode: boolean
  map: boolean
  standardMaps: boolean
  dlcMaps: boolean
  rainbowRoads: boolean
  tours: boolean
  noRepeats: boolean
  playerCount: number
}
