// src/data/extras.ts
// Item-set rules and house-rule challenges.
import { GameItem } from '../types'

export interface ItemSet extends GameItem {
  emblem: string  // emoji fallback when there is no image yet
}

const I = 'images/items/'

// The item settings available in VS races.
export const ITEM_SETS: ItemSet[] = [
  { id: "normal",    name: "Normal Items",   image: I + "110px-ItemBoxMK8.png",          emblem: "❓" },
  { id: "frantic",   name: "Frantic Items",  image: I + "FranticItems.png",              emblem: "🌀" },
  { id: "shells",    name: "Shells Only",    image: I + "120px-GreenShellMK8.png",       emblem: "🐢" },
  { id: "bananas",   name: "Bananas Only",   image: I + "120px-BananaMK8.png",           emblem: "🍌" },
  { id: "mushrooms", name: "Mushrooms Only", image: I + "120px-MushroomMarioKart8.png",  emblem: "🍄" },
  { id: "bobombs",   name: "Bob-ombs Only",  image: I + "120px-Bob-ombMK8.png",          emblem: "💣" },
  { id: "none",      name: "No Items",       image: I + "NoItems.png",                   emblem: "🚫" },
]

export interface Challenge {
  id: string
  name: string
  detail: string
  emblem: string   // emoji fallback until images/challenges/<id>.png exists
  image: string
}

// Optional house rules rolled on top of the race.
const RAW_CHALLENGES: Omit<Challenge, 'image'>[] = [
  { id: "no-drift",      emblem: "🧊", name: "No Drifting",          detail: "Nobody drifts for the whole race." },
  { id: "no-shortcuts",  emblem: "🚧", name: "No Shortcuts",         detail: "Stay on the main road — no shortcuts or item-assisted skips." },
  { id: "hold-items",    emblem: "🎒", name: "Hoarder",              detail: "Hold every item until the final lap." },
  { id: "drop-bananas",  emblem: "🍌", name: "Butterfingers",        detail: "Bananas must be dropped the moment you get them." },
  { id: "no-tricks",     emblem: "🛹", name: "No Tricks",            detail: "No jump tricks off ramps or ledges." },
  { id: "no-coins",      emblem: "🪙", name: "Broke",                detail: "Avoid coins — every coin you grab is a penalty point." },
  { id: "last-picks",    emblem: "🗳️", name: "Loser's Choice",       detail: "Last place picks the next track instead of rolling." },
  { id: "same-racer",    emblem: "👯", name: "Clone Wars",           detail: "Next race, everyone uses the winner's character." },
  { id: "no-mushroom",   emblem: "🍄", name: "No Boosting",          detail: "Mushrooms can't be used — hold or drop them." },
]

export const CHALLENGES: Challenge[] = RAW_CHALLENGES.map(c => ({ ...c, image: `images/challenges/${c.id}.png` }))
