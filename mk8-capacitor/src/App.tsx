// src/App.tsx
import { useState, useEffect, useCallback } from 'react'
import { CHARACTERS } from './data/characters'
import { KARTS } from './data/karts'
import { TIRES } from './data/tires'
import { HANGERS } from './data/hangers'
import { MODES } from './data/modes'
import { MAPS } from './data/maps'
import { randomItem } from './utils/random'
import { loadStats, incrementMap, resetPlayed, resetAllStats } from './utils/storage'
import { RandomizeSettings, PlayerResult, MapStats, MapItem } from './types'
import SetupScreen from './components/SetupScreen'
import ResultsScreen from './components/ResultsScreen'
import StatsScreen from './components/StatsScreen'
import './App.css'

const DEFAULT_SETTINGS: RandomizeSettings = {
  character: true,
  kart: true,
  tire: true,
  hanger: true,
  mode: false,
  map: true,
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
  const [stats, setStats] = useState<MapStats>({ counts: {}, played: [] })
  const [tab, setTab] = useState<Tab>('setup')
  const [spinning, setSpinning] = useState(false)

  useEffect(() => {
    loadStats().then(setStats)
  }, [])

  const getFilteredMaps = useCallback((): MapItem[] => {
    let maps = MAPS.filter(m =>
      (settings.standardMaps && m.category === 'standard') ||
      (settings.dlcMaps && m.category === 'dlc') ||
      (settings.rainbowRoads && m.category === 'Rainbow Roads') ||
      (settings.tours && m.category === 'Tours')
    )
    if (settings.noRepeats) {
      const unplayed = maps.filter(m => !stats.played.includes(m.id))
      // if all played, use full pool (auto-reset behaviour)
      maps = unplayed.length > 0 ? unplayed : maps
    }
    return maps
  }, [settings, stats])

  const handleRandomize = useCallback(async () => {
    if (spinning) return
    setSpinning(true)

    const filteredMaps = getFilteredMaps()
    const newResults: PlayerResult[] = []

    // Each player gets independent character/kart/tire/hanger
    // Mode and Map are shared across all players (one race = one track/mode)
    const sharedMode = settings.mode ? randomItem(MODES) : null
    const sharedMap = settings.map && filteredMaps.length > 0
      ? randomItem(filteredMaps)
      : null

    for (let i = 0; i < settings.playerCount; i++) {
      newResults.push({
        character: settings.character ? randomItem(CHARACTERS) : null,
        kart: settings.kart ? randomItem(KARTS) : null,
        tire: settings.tire ? randomItem(TIRES) : null,
        hanger: settings.hanger ? randomItem(HANGERS) : null,
        mode: sharedMode,
        map: sharedMap,
      })
    }

    setResults(newResults)

    // Track map play
    if (sharedMap) {
      const newStats = await incrementMap(sharedMap.id)
      setStats(newStats)
    }

    setTimeout(() => {
      setSpinning(false)
      setTab('results')
    }, 600)
  }, [spinning, settings, getFilteredMaps])

  const handleResetPlayed = async () => {
    const newStats = await resetPlayed()
    setStats(newStats)
  }

  const handleResetAll = async () => {
    const newStats = await resetAllStats()
    setStats(newStats)
  }

  const availableMaps = getFilteredMaps()
  const remainingMaps = settings.noRepeats
    ? availableMaps.filter(m => !stats.played.includes(m.id))
    : availableMaps

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-title">
          <span className="header-icon">🏎️</span>
          <span>MK8 Randomizer</span>
        </div>
        {tab === 'setup' && settings.noRepeats && (
          <div className="remaining-badge">
            {remainingMaps.length} maps left
          </div>
        )}
      </header>

      {/* Content */}
      <main className="app-content">
        {tab === 'setup' && (
          <SetupScreen
            settings={settings}
            onSettingsChange={setSettings}
            onRandomize={handleRandomize}
            spinning={spinning}
            availableMapCount={availableMaps.length}
          />
        )}
        {tab === 'results' && (
          <ResultsScreen
            results={results}
            settings={settings}
            stats={stats}
            onReRandomize={handleRandomize}
            spinning={spinning}
          />
        )}
        {tab === 'stats' && (
          <StatsScreen
            stats={stats}
            onResetPlayed={handleResetPlayed}
            onResetAll={handleResetAll}
          />
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="bottom-nav">
        <button
          className={`nav-btn ${tab === 'setup' ? 'active' : ''}`}
          onClick={() => setTab('setup')}
        >
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
        <button
          className={`nav-btn ${tab === 'results' ? 'active' : ''}`}
          onClick={() => setTab('results')}
        >
          <span className="nav-icon">🏆</span>
          <span className="nav-label">Results</span>
        </button>
        <button
          className={`nav-btn ${tab === 'stats' ? 'active' : ''}`}
          onClick={() => setTab('stats')}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">Stats</span>
        </button>
      </nav>
    </div>
  )
}
