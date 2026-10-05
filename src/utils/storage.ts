// src/utils/storage.ts
// Uses Capacitor Preferences (works on Android + web)
import { Preferences } from '@capacitor/preferences'
import { MapStats, RaceEntry, RandomizeSettings } from '../types'

const STATS_KEY = 'mk8_map_stats'
const SETTINGS_KEY = 'mk8_settings'
const HISTORY_KEY = 'mk8_history'
const CURRENT_KEY = 'mk8_current_id'

const HISTORY_LIMIT = 1000

async function getJSON<T>(key: string): Promise<T | null> {
  try {
    const { value } = await Preferences.get({ key })
    return value ? JSON.parse(value) as T : null
  } catch (e) {
    console.error(`read ${key} failed:`, e)
    return null
  }
}

async function setJSON(key: string, data: unknown): Promise<void> {
  try {
    await Preferences.set({ key, value: JSON.stringify(data) })
  } catch (e) {
    console.error(`write ${key} failed:`, e)
  }
}

// ── Stats (map + cup counters) ──
function normalizeStats(raw: Partial<MapStats> | null): MapStats {
  return {
    counts: raw?.counts ?? {},
    played: raw?.played ?? [],
    prixCounts: raw?.prixCounts ?? {},
  }
}

export async function loadStats(): Promise<MapStats> {
  return normalizeStats(await getJSON<MapStats>(STATS_KEY))
}

export async function saveStats(stats: MapStats): Promise<void> {
  await setJSON(STATS_KEY, stats)
}

// Pure helpers: return a new stats object (App saves it)
export function bumpMap(stats: MapStats, id: string, delta: number): MapStats {
  const v = Math.max(0, (stats.counts[id] || 0) + delta)
  return withMapCount(stats, id, v)
}

export function withMapCount(stats: MapStats, id: string, value: number): MapStats {
  const v = Math.max(0, Math.floor(value || 0))
  const played = stats.played.filter(x => x !== id)
  if (v > 0) played.push(id)
  return { ...stats, counts: { ...stats.counts, [id]: v }, played }
}

export function bumpPrix(stats: MapStats, id: string, delta: number): MapStats {
  return withPrixCount(stats, id, (stats.prixCounts[id] || 0) + delta)
}

export function withPrixCount(stats: MapStats, id: string, value: number): MapStats {
  return { ...stats, prixCounts: { ...stats.prixCounts, [id]: Math.max(0, Math.floor(value || 0)) } }
}

// ── Setup screen settings ──
export async function loadSettings(defaults: RandomizeSettings): Promise<RandomizeSettings> {
  const saved = await getJSON<Partial<RandomizeSettings>>(SETTINGS_KEY)
  return mergeSettings(defaults, saved)
}

// Merge onto defaults so settings added in later updates still get a value
export function mergeSettings(defaults: RandomizeSettings, saved: Partial<RandomizeSettings> | null): RandomizeSettings {
  if (!saved) return defaults
  const names = [...defaults.playerNames]
  ;(saved.playerNames || []).forEach((n, i) => { if (i < names.length && typeof n === 'string') names[i] = n })
  return {
    ...defaults,
    ...saved,
    playerNames: names,
    excluded: { ...defaults.excluded, ...(saved.excluded || {}) },
  }
}

export async function saveSettings(settings: RandomizeSettings): Promise<void> {
  await setJSON(SETTINGS_KEY, settings)
}

// ── Race history ──
export async function loadHistory(): Promise<RaceEntry[]> {
  return (await getJSON<RaceEntry[]>(HISTORY_KEY)) ?? []
}

export async function saveHistory(history: RaceEntry[]): Promise<void> {
  await setJSON(HISTORY_KEY, history.slice(0, HISTORY_LIMIT))
}

export async function loadCurrentId(): Promise<string | null> {
  return getJSON<string>(CURRENT_KEY)
}

export async function saveCurrentId(id: string | null): Promise<void> {
  await setJSON(CURRENT_KEY, id)
}

// ── Backup / restore ──
export interface Backup {
  app: 'mk8-randomizer'
  version: 1
  exportedAt: string
  stats: MapStats
  history: RaceEntry[]
  settings: Partial<RandomizeSettings> | null
  currentId: string | null
}

export async function buildBackup(): Promise<Backup> {
  return {
    app: 'mk8-randomizer',
    version: 1,
    exportedAt: new Date().toISOString(),
    stats: await loadStats(),
    history: await loadHistory(),
    settings: await getJSON<Partial<RandomizeSettings>>(SETTINGS_KEY),
    currentId: await loadCurrentId(),
  }
}

// Throws a readable message if the file isn't a backup from this app
export function parseBackup(text: string): Backup {
  let data: any
  try { data = JSON.parse(text) } catch { throw new Error("That file isn't a valid backup (not JSON).") }
  if (!data || data.app !== 'mk8-randomizer' || !data.stats) {
    throw new Error("That file isn't an MK8 Randomizer backup.")
  }
  return {
    app: 'mk8-randomizer',
    version: 1,
    exportedAt: String(data.exportedAt || ''),
    stats: normalizeStats(data.stats),
    history: Array.isArray(data.history) ? data.history : [],
    settings: data.settings ?? null,
    currentId: data.currentId ?? null,
  }
}

export async function restoreBackup(b: Backup): Promise<void> {
  await saveStats(b.stats)
  await saveHistory(b.history)
  if (b.settings) await setJSON(SETTINGS_KEY, b.settings)
  await saveCurrentId(b.currentId)
}
