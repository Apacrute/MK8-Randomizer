// src/App.tsx
import { useState, useEffect, useCallback } from 'react'
import { CHARACTERS } from './data/characters'
import { KARTS } from './data/karts'
import { TIRES } from './data/tires'
import { HANGERS } from './data/hangers'
import { MODES } from './data/modes'
import { MAPS } from './data/maps'
import { PRIXES } from './data/prixes'
import { randomItem } from './utils/random'
import {
  loadStats, incrementMap, incrementPrix,
  resetPlayed, resetCounts, resetPrixCounts, resetAllStats,
  adjustMapCount, setMapCount, adjustPrixCount, setPrixCount,
} from './utils/storage'
import { RandomizeSettings, PlayerResult, MapStats, MapItem } from './types'
import SetupScreen from './components/SetupScreen'
import ResultsScreen from './components/ResultsScreen'
import StatsScreen from './components/StatsScreen'
import SpinOverlay from './components/SpinOverlay'
import './App.css'

const DEFAULT_SETTINGS: RandomizeSettings = {
  character: true,
  kart: true,
  tire: true,
  hanger: true,
  mode: false,
  map: true,
  prix: false,
  standardMaps: true,
  dlcMaps: true,
  rainbowRoads: false,
  tours: false,
  noRepeats: false,
  playerCount: 1,
}

type Tab = 'setup' | 'results' | 'stats'

export default function App() {
  const [settings, setSettings] = useState<RandomizeSettings>(DEFAULT_SETTINGS)
  const [results, setResults] = useState<PlayerResult[]>([])
  const [stats, setStats] = useState<MapStats>({ counts: {}, played: [], prixCounts: {} })
  const [tab, setTab] = useState<Tab>('setup')
  const [spinning, setSpinning] = useState(false)

  useEffect(() => {
    loadStats().then(setStats)
  }, [])

  // Build the pool of maps allowed by the category toggles
  const getCategoryMaps = useCallback((): MapItem[] => {
    return MAPS.filter(m =>
      (settings.standardMaps && m.category === 'standard') ||
      (settings.dlcMaps && m.category === 'dlc') ||
      (settings.rainbowRoads && m.category === 'Rainbow Roads') ||
      (settings.tours && m.category === 'Tours')
    )
  }, [settings])

  // FEATURE #4: "play-count leveling" no-repeat logic.
  // Instead of stopping after one pass, we always pick only from the maps
  // that have the LOWEST play count in the current pool. So if every map is at
  // 3 plays, all of them are eligible; once some climb to 4, only the maps
  // still at 3 are eligible until they catch up. Never needs a manual reset.
  const getEligibleMaps = useCallback((pool: MapItem[], currentStats: MapStats): MapItem[] => {
    if (!settings.noRepeats || pool.length === 0) return pool
    const counts = pool.map(m => currentStats.counts[m.id] || 0)
    const minCount = Math.min(...counts)
    return pool.filter(m => (currentStats.counts[m.id] || 0) === minCount)
  }, [settings.noRepeats])

  const handleRandomize = useCallback(async () => {
    if (spinning) return
    setSpinning(true)

    const categoryMaps = getCategoryMaps()
    const eligibleMaps = getEligibleMaps(categoryMaps, stats)

    // Map and mode and prix are shared across all players (one race = one of each)
    const sharedMode = settings.mode ? randomItem(MODES) : null
    const sharedMap = settings.map && eligibleMaps.length > 0
      ? randomItem(eligibleMaps)
      : null
    const sharedPrix = settings.prix ? randomItem(PRIXES) : null

    const newResults: PlayerResult[] = []
    for (let i = 0; i < settings.playerCount; i++) {
      newResults.push({
        character: settings.character ? randomItem(CHARACTERS) : null,
        kart: settings.kart ? randomItem(KARTS) : null,
        tire: settings.tire ? randomItem(TIRES) : null,
        hanger: settings.hanger ? randomItem(HANGERS) : null,
        mode: sharedMode,
        map: sharedMap,
        prix: sharedPrix,
      })
    }

    setResults(newResults)

    // Update counters (map + prix tracked separately)
    let updated = stats
    if (sharedMap) updated = await incrementMap(sharedMap.id)
    if (sharedPrix) updated = await incrementPrix(sharedPrix.id)
    if (sharedMap || sharedPrix) setStats(updated)

    // FEATURE #3: keep the spin overlay up briefly so it's obvious the roll fired,
    // even when the same map comes up twice in a row.
    setTimeout(() => {
      setSpinning(false)
      setTab('results')
    }, 900)
  }, [spinning, settings, stats, getCategoryMaps, getEligibleMaps])

  // ── Stat handlers (Feature #1 manual adjust + resets) ──
  const handleAdjustMap = async (id: string, delta: number) => setStats(await adjustMapCount(id, delta))
  const handleSetMap = async (id: string, value: number) => setStats(await setMapCount(id, value))
  const handleAdjustPrix = async (id: string, delta: number) => setStats(await adjustPrixCount(id, delta))
  const handleSetPrix = async (id: string, value: number) => setStats(await setPrixCount(id, value))
  const handleResetPlayed = async () => setStats(await resetPlayed())
  const handleResetCounts = async () => setStats(await resetCounts())
  const handleResetPrix = async () => setStats(await resetPrixCounts())
  const handleResetAll = async () => setStats(await resetAllStats())

  const categoryMaps = getCategoryMaps()
  const eligibleCount = getEligibleMaps(categoryMaps, stats).length

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-title">
          <span className="header-icon">🏎️</span>
          <span>MK8 Randomizer</span>
        </div>
        {tab === 'setup' && settings.noRepeats && settings.map && (
          <div className="remaining-badge">
            {eligibleCount} up next
          </div>
        )}
      </header>

      <main className="app-content">
        {tab === 'setup' && (
          <SetupScreen
            settings={settings}
            onSettingsChange={setSettings}
            onRandomize={handleRandomize}
            spinning={spinning}
            availableMapCount={categoryMaps.length}
          />
        )}
        {tab === 'results' && (
          <ResultsScreen
            results={results}
            stats={stats}
            onReRandomize={handleRandomize}
            spinning={spinning}
          />
        )}
        {tab === 'stats' && (
          <StatsScreen
            stats={stats}
            onAdjustMap={handleAdjustMap}
            onSetMap={handleSetMap}
            onAdjustPrix={handleAdjustPrix}
            onSetPrix={handleSetPrix}
            onResetCounts={handleResetCounts}
            onResetPrix={handleResetPrix}
            onResetAll={handleResetAll}
          />
        )}
      </main>

      <nav className="bottom-nav">
        <button className={`nav-btn ${tab === 'setup' ? 'active' : ''}`} onClick={() => setTab('setup')}>
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Setup</span>
        </button>
        <button
          className={`nav-btn randomize-nav-btn ${spinning ? 'spinning' : ''}`}
          onClick={handleRandomize}
        >
          <span className="nav-icon">🎲</span>
          <span className="nav-label">Roll!</span>
        </button>
        <button className={`nav-btn ${tab === 'results' ? 'active' : ''}`} onClick={() => setTab('results')}>
          <span className="nav-icon">🏆</span>
          <span className="nav-label">Results</span>
        </button>
        <button className={`nav-btn ${tab === 'stats' ? 'active' : ''}`} onClick={() => setTab('stats')}>
          <span className="nav-icon">📊</span>
          <span className="nav-label">Stats</span>
        </button>
      </nav>

      {/* FEATURE #3: full-screen spin animation */}
      {spinning && <SpinOverlay />}
    </div>
  )
}
