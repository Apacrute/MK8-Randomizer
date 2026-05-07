// src/utils/storage.ts
// Uses Capacitor Preferences (works on iOS, Android, and web)
import { Preferences } from '@capacitor/preferences'
import { MapStats } from '../types'

const STATS_KEY = 'mk8_map_stats'

export async function loadStats(): Promise<MapStats> {
  try {
    const { value } = await Preferences.get({ key: STATS_KEY })
    if (value) return JSON.parse(value) as MapStats
  } catch (e) {
    console.error('loadStats error:', e)
  }
  return { counts: {}, played: [] }
}

export async function saveStats(stats: MapStats): Promise<void> {
  try {
    await Preferences.set({ key: STATS_KEY, value: JSON.stringify(stats) })
  } catch (e) {
    console.error('saveStats error:', e)
  }
}

export async function incrementMap(mapId: string): Promise<MapStats> {
  const stats = await loadStats()
  stats.counts[mapId] = (stats.counts[mapId] || 0) + 1
  if (!stats.played.includes(mapId)) {
    stats.played.push(mapId)
  }
  await saveStats(stats)
  return stats
}

export async function resetPlayed(): Promise<MapStats> {
  const stats = await loadStats()
  stats.played = []
  await saveStats(stats)
  return stats
}

export async function resetAllStats(): Promise<MapStats> {
  const fresh: MapStats = { counts: {}, played: [] }
  await saveStats(fresh)
  return fresh
}
