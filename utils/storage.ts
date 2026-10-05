// src/utils/storage.ts
// Uses Capacitor Preferences (works on Android + web)
import { Preferences } from '@capacitor/preferences'
import { MapStats } from '../types'

const STATS_KEY = 'mk8_map_stats'

// Ensures any older saved data gets the new fields filled in.
function normalize(raw: Partial<MapStats> | null): MapStats {
  return {
    counts: raw?.counts ?? {},
    played: raw?.played ?? [],
    prixCounts: raw?.prixCounts ?? {},
  }
}

export async function loadStats(): Promise<MapStats> {
  try {
    const { value } = await Preferences.get({ key: STATS_KEY })
    if (value) return normalize(JSON.parse(value))
  } catch (e) {
    console.error('loadStats error:', e)
  }
  return normalize(null)
}

export async function saveStats(stats: MapStats): Promise<void> {
  try {
    await Preferences.set({ key: STATS_KEY, value: JSON.stringify(stats) })
  } catch (e) {
    console.error('saveStats error:', e)
  }
}

// ── Map counters ──
export async function incrementMap(mapId: string): Promise<MapStats> {
  const stats = await loadStats()
  stats.counts[mapId] = (stats.counts[mapId] || 0) + 1
  if (!stats.played.includes(mapId)) stats.played.push(mapId)
  await saveStats(stats)
  return stats
}

// Manually set a map's play count to an exact value (never below 0)
export async function setMapCount(mapId: string, value: number): Promise<MapStats> {
  const stats = await loadStats()
  const v = Math.max(0, Math.floor(value))
  stats.counts[mapId] = v
  // keep the legacy "played" list consistent with the count
  if (v > 0 && !stats.played.includes(mapId)) stats.played.push(mapId)
  if (v === 0) stats.played = stats.played.filter(id => id !== mapId)
  await saveStats(stats)
  return stats
}

// Nudge a map count up or down by a delta (used by +/- buttons)
export async function adjustMapCount(mapId: string, delta: number): Promise<MapStats> {
  const stats = await loadStats()
  const current = stats.counts[mapId] || 0
  return setMapCount(mapId, current + delta)
}

// ── Prix counters ──
export async function incrementPrix(prixId: string): Promise<MapStats> {
  const stats = await loadStats()
  stats.prixCounts[prixId] = (stats.prixCounts[prixId] || 0) + 1
  await saveStats(stats)
  return stats
}

export async function setPrixCount(prixId: string, value: number): Promise<MapStats> {
  const stats = await loadStats()
  stats.prixCounts[prixId] = Math.max(0, Math.floor(value))
  await saveStats(stats)
  return stats
}

export async function adjustPrixCount(prixId: string, delta: number): Promise<MapStats> {
  const stats = await loadStats()
  const current = stats.prixCounts[prixId] || 0
  return setPrixCount(prixId, current + delta)
}

// ── Resets ──
export async function resetPlayed(): Promise<MapStats> {
  const stats = await loadStats()
  stats.played = []
  await saveStats(stats)
  return stats
}

export async function resetCounts(): Promise<MapStats> {
  const stats = await loadStats()
  stats.counts = {}
  stats.played = []
  await saveStats(stats)
  return stats
}

export async function resetPrixCounts(): Promise<MapStats> {
  const stats = await loadStats()
  stats.prixCounts = {}
  await saveStats(stats)
  return stats
}

export async function resetAllStats(): Promise<MapStats> {
  const fresh: MapStats = { counts: {}, played: [], prixCounts: {} }
  await saveStats(fresh)
  return fresh
}
