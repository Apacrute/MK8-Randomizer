// src/data/prixes.ts
// A "prix" (cup) is a group of 4 tracks. MK8 Deluxe has 24 cups total:
// 12 base game + 12 Booster Course Pass.
// No images required — each cup uses an emoji emblem + colour.

export type PrixCategory = 'base' | 'dlc'

export interface PrixItem {
  id: string
  name: string
  emblem: string      // emoji used as the cup icon
  color: string       // accent colour for the card
  category: PrixCategory
}

export const PRIXES: PrixItem[] = [
  // ── Base game — Nitro ──
  { id: "mushroom", name: "Mushroom Cup", emblem: "🍄", color: "#e8001c", category: "base" },
  { id: "flower",   name: "Flower Cup",   emblem: "🌼", color: "#ff8c1a", category: "base" },
  { id: "star",     name: "Star Cup",     emblem: "⭐", color: "#ffd700", category: "base" },
  { id: "special",  name: "Special Cup",  emblem: "👑", color: "#7b2fff", category: "base" },

  // ── Base game — Retro ──
  { id: "shell",     name: "Shell Cup",     emblem: "🐢", color: "#00a651", category: "base" },
  { id: "banana",    name: "Banana Cup",    emblem: "🍌", color: "#f2c700", category: "base" },
  { id: "leaf",      name: "Leaf Cup",      emblem: "🍃", color: "#3fae3f", category: "base" },
  { id: "lightning", name: "Lightning Cup", emblem: "⚡", color: "#ffb300", category: "base" },

  // ── Base game — Wii U DLC era ──
  { id: "egg",      name: "Egg Cup",      emblem: "🥚", color: "#3fbf7f", category: "base" },
  { id: "triforce", name: "Triforce Cup", emblem: "🔺", color: "#d4af37", category: "base" },
  { id: "crossing", name: "Crossing Cup", emblem: "🍂", color: "#5bb85b", category: "base" },
  { id: "bell",     name: "Bell Cup",     emblem: "🔔", color: "#ffcc33", category: "base" },

  // ── Booster Course Pass ──
  { id: "golden-dash", name: "Golden Dash Cup", emblem: "💨", color: "#e8b923", category: "dlc" },
  { id: "lucky-cat",   name: "Lucky Cat Cup",   emblem: "🐱", color: "#ff9e44", category: "dlc" },
  { id: "turnip",      name: "Turnip Cup",      emblem: "🥬", color: "#9acd32", category: "dlc" },
  { id: "propeller",   name: "Propeller Cup",   emblem: "🚁", color: "#33aaff", category: "dlc" },
  { id: "rock",        name: "Rock Cup",        emblem: "🪨", color: "#9e8877", category: "dlc" },
  { id: "moon",        name: "Moon Cup",        emblem: "🌙", color: "#b0a8ff", category: "dlc" },
  { id: "fruit",       name: "Fruit Cup",       emblem: "🍓", color: "#ff5a7a", category: "dlc" },
  { id: "boomerang",   name: "Boomerang Cup",   emblem: "🪃", color: "#ff7733", category: "dlc" },
  { id: "feather",     name: "Feather Cup",     emblem: "🪶", color: "#66d9d9", category: "dlc" },
  { id: "cherry",      name: "Cherry Cup",      emblem: "🍒", color: "#e8003c", category: "dlc" },
  { id: "acorn",       name: "Acorn Cup",       emblem: "🌰", color: "#b5651d", category: "dlc" },
  { id: "spiny",       name: "Spiny Cup",       emblem: "🔵", color: "#1f6feb", category: "dlc" },
]
