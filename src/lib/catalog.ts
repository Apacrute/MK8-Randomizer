// src/lib/catalog.ts
// One place to look up any game item by id, and the pool each slot draws from.
import { CHARACTERS } from '../data/characters'
import { KARTS } from '../data/karts'
import { TIRES } from '../data/tires'
import { HANGERS } from '../data/hangers'
import { MODES } from '../data/modes'
import { MAPS } from '../data/maps'
import { PRIXES, PrixItem } from '../data/prixes'
import { ITEM_SETS, CHALLENGES, ItemSet, Challenge } from '../data/extras'
import { GameItem, MapItem, PoolKey, LoadoutSlot } from '../types'

function index<T extends { id: string }>(list: T[]): Record<string, T> {
  const out: Record<string, T> = {}
  for (const x of list) out[x.id] = x
  return out
}

export const BY_ID = {
  characters: index(CHARACTERS),
  karts: index(KARTS),
  tires: index(TIRES),
  gliders: index(HANGERS),
  maps: index(MAPS) as Record<string, MapItem>,
  prixes: index(PRIXES) as Record<string, PrixItem>,
  modes: index(MODES),
  items: index(ITEM_SETS) as Record<string, ItemSet>,
  challenges: index(CHALLENGES) as Record<string, Challenge>,
}

export const POOLS: Record<PoolKey, GameItem[]> = {
  characters: CHARACTERS,
  karts: KARTS,
  tires: TIRES,
  gliders: HANGERS,
  maps: MAPS,
  prixes: PRIXES,
}

export const POOL_LABELS: Record<PoolKey, string> = {
  characters: 'Characters',
  karts: 'Karts',
  tires: 'Tires',
  gliders: 'Gliders',
  maps: 'Maps',
  prixes: 'Cups',
}

// Which ban pool each loadout slot draws from
export const SLOT_POOL: Record<LoadoutSlot, PoolKey> = {
  character: 'characters',
  kart: 'karts',
  tire: 'tires',
  glider: 'gliders',
}

export const SLOT_LABEL: Record<LoadoutSlot, string> = {
  character: 'Character',
  kart: 'Kart',
  tire: 'Tires',
  glider: 'Glider',
}

export { CHARACTERS, KARTS, TIRES, HANGERS, MODES, MAPS, PRIXES, ITEM_SETS, CHALLENGES }
