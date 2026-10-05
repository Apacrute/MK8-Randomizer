// src/App.tsx
import { useState, useEffect, useCallback, useRef } from 'react'
import {
  RandomizeSettings, MapStats, RaceEntry, RerollTarget, PoolKey, PlayerPlacement, RollScope,
} from './types'
import {
  loadStats, saveStats, loadSettings, saveSettings, loadHistory, saveHistory,
  loadCurrentId, saveCurrentId, bumpMap, bumpPrix, withMapCount, withPrixCount,
} from './utils/storage'
import {
  rollEverything, rollMapOnly, rollShared, pickForSlot, eligibleMaps,
} from './lib/roll'
import { BY_ID, POOL_LABELS } from './lib/catalog'
import SetupScreen from './components/SetupScreen'
import ResultsScreen from './components/ResultsScreen'
import StatsScreen from './components/StatsScreen'
import Toast, { ToastState } from './components/Toast'
import './App.css'

export const DEFAULT_SETTINGS: RandomizeSettings = {
  character: true,
  kart: true,
  tire: true,
  hanger: true,
  mode: false,
  items: false,
  challenge: false,
  map: true,
  prix: false,
  prixNoRepeats: false,
  standardMaps: true,
  dlcMaps: true,
  rainbowRoads: false,
  tours: false,
  noRepeats: false,
  uniqueLoadouts: false,
  playerCount: 1,
  playerNames: ['', '', '', ''],
  rollScope: 'all',
  excluded: { characters: [], karts: [], tires: [], gliders: [], maps: [], prixes: [] },
}

type Tab = 'setup' | 'results' | 'stats'

// Which cards should play the slot-machine animation for the latest action
export interface Reveal {
  nonce: number
  targets: 'all' | string[]   // 'map', 'prix', 'mode', 'items', 'challenge', 'p0-character', ...
  at: number                  // when it happened, so a freshly opened Results screen still animates
}

export default function App() {
  const [settings, setSettings] = useState<RandomizeSettings>(DEFAULT_SETTINGS)
  const [stats, setStats] = useState<MapStats>({ counts: {}, played: [], prixCounts: {} })
  const [history, setHistory] = useState<RaceEntry[]>([])
  const [currentId, setCurrentId] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [tab, setTab] = useState<Tab>('setup')
  const [reveal, setReveal] = useState<Reveal>({ nonce: 0, targets: [], at: 0 })
  const [toast, setToast] = useState<ToastState | null>(null)
  const contentRef = useRef<HTMLElement>(null)

  // New tab or new roll → start at the top so the cup/map are visible
  useEffect(() => { contentRef.current?.scrollTo({ top: 0 }) }, [tab])

  // ── Load everything once ──
  const loadAll = useCallback(async () => {
    const [st, se, hi, cid] = await Promise.all([
      loadStats(), loadSettings(DEFAULT_SETTINGS), loadHistory(), loadCurrentId(),
    ])
    setStats(st)
    setSettings(se)
    setHistory(hi)
    setCurrentId(cid && hi.some(h => h.id === cid) ? cid : null)
    setLoaded(true)
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  // ── Save whenever something changes (only after the saved data has loaded,
  //    so defaults never overwrite real data) ──
  useEffect(() => { if (loaded) saveSettings(settings) }, [settings, loaded])
  useEffect(() => { if (loaded) saveStats(stats) }, [stats, loaded])
  useEffect(() => { if (loaded) saveHistory(history) }, [history, loaded])
  useEffect(() => { if (loaded) saveCurrentId(currentId) }, [currentId, loaded])

  const current = history.find(h => h.id === currentId) || null

  // Refs so callbacks always see the latest state
  const stateRef = useRef({ settings, stats, current })
  stateRef.current = { settings, stats, current }

  const showToast = (t: ToastState) => setToast({ ...t, key: Date.now() })

  const animate = (targets: Reveal['targets']) => {
    setReveal(r => ({ nonce: r.nonce + 1, targets, at: Date.now() }))
    // A full or map roll jumps to the top; a single-card reroll stays put
    if (targets === 'all' || targets.includes('map')) contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Add a brand-new race to history and count its map/cup
  const pushRace = (entry: RaceEntry, countPrix: boolean) => {
    setStats(st => {
      let next = st
      if (entry.map) next = bumpMap(next, entry.map, 1)
      if (countPrix && entry.prix) next = bumpPrix(next, entry.prix, 1)
      return next
    })
    setHistory(h => [entry, ...h])
    setCurrentId(entry.id)
  }

  // ── Rolling ──
  const roll = useCallback((scope?: RollScope) => {
    const { settings: s, stats: st, current: cur } = stateRef.current
    const wanted = scope ?? s.rollScope
    const canMapOnly = wanted === 'map' && cur && s.map && cur.loadouts.length === s.playerCount

    if (canMapOnly) {
      pushRace(rollMapOnly(s, st, cur!), false)
      animate(['map'])
    } else {
      pushRace(rollEverything(s, st), true)
      animate('all')
    }
    setTab('results')
  }, [])

  // Tap a single card on the results screen
  const reroll = useCallback((target: RerollTarget) => {
    const { settings: s, stats: st, current: cur } = stateRef.current
    if (!cur) return

    if (target.kind === 'shared' && target.slot === 'map') {
      roll('map')   // a new track is a new race
      return
    }

    let updated: RaceEntry
    if (target.kind === 'shared') {
      const value = rollShared({ ...s, [target.slot]: true }, st, target.slot)
      updated = { ...cur, [target.slot]: value }
      if (target.slot === 'prix' && value) setStats(x => bumpPrix(x, value, 1))
      animate([target.slot])
    } else {
      const taken = cur.loadouts
        .filter((_, i) => i !== target.player)
        .map(l => l[target.slot])
        .filter(Boolean) as string[]
      const forced = { ...s, [target.slot === 'glider' ? 'hanger' : target.slot]: true } as RandomizeSettings
      const loadouts = cur.loadouts.map((l, i) =>
        i === target.player ? { ...l, [target.slot]: pickForSlot(forced, target.slot, taken) } : l)
      updated = { ...cur, loadouts }
      animate([`p${target.player}-${target.slot}`])
    }
    setHistory(h => h.map(e => (e.id === cur.id ? updated : e)))
  }, [roll])

  // ── Bans ──
  const toggleBan = useCallback((pool: PoolKey, id: string, announce = false) => {
    setSettings(s => {
      const list = s.excluded[pool]
      const banned = list.includes(id)
      const next = banned ? list.filter(x => x !== id) : [...list, id]
      return { ...s, excluded: { ...s.excluded, [pool]: next } }
    })
    if (announce) {
      const item = (BY_ID as any)[pool][id]
      const wasBanned = stateRef.current.settings.excluded[pool].includes(id)
      showToast({
        text: wasBanned
          ? `${item?.name ?? id} is back in the ${POOL_LABELS[pool].toLowerCase()} pool`
          : `Banned ${item?.name ?? id} — it won't be rolled`,
        actionLabel: 'Undo',
        onAction: () => toggleBan(pool, id, false),
      })
    }
  }, [])

  // ── Race results ──
  const recordResults = (entryId: string, results: PlayerPlacement[] | null) =>
    setHistory(h => h.map(e => (e.id === entryId ? { ...e, results } : e)))

  const deleteEntry = (entryId: string) => {
    setHistory(h => h.filter(e => e.id !== entryId))
    if (entryId === currentId) setCurrentId(null)
  }

  const countCupTracks = (entryId: string) => {
    const entry = history.find(e => e.id === entryId)
    const prix = entry?.prix ? BY_ID.prixes[entry.prix] : null
    if (!entry || !prix || entry.cupTracksCounted) return
    setStats(st => prix.tracks.reduce((acc, t) => bumpMap(acc, t, 1), st))
    setHistory(h => h.map(e => (e.id === entryId ? { ...e, cupTracksCounted: true } : e)))
    showToast({ text: `+1 to all 4 ${prix.name} tracks` })
  }

  const eligibleCount = eligibleMaps(settings, stats).length

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-title">
          <span className="header-icon">🏎️</span>
          <span>MK8 Randomizer</span>
        </div>
        {tab === 'setup' && settings.noRepeats && settings.map && (
          <div className="remaining-badge">{eligibleCount} up next</div>
        )}
      </header>

      <main className="app-content" ref={contentRef}>
        {tab === 'setup' && (
          <SetupScreen
            settings={settings}
            onSettingsChange={setSettings}
            onRandomize={() => roll('all')}
            onToggleBan={(p, id) => toggleBan(p, id)}
          />
        )}
        {tab === 'results' && (
          <ResultsScreen
            entry={current}
            settings={settings}
            stats={stats}
            reveal={reveal}
            onRoll={roll}
            onScopeChange={scope => setSettings(s => ({ ...s, rollScope: scope }))}
            onReroll={reroll}
            onBan={(p, id) => toggleBan(p, id, true)}
            onRecord={recordResults}
            onCountCup={countCupTracks}
          />
        )}
        {tab === 'stats' && (
          <StatsScreen
            stats={stats}
            history={history}
            onSetMap={(id, v) => setStats(s => withMapCount(s, id, v))}
            onAdjustMap={(id, d) => setStats(s => bumpMap(s, id, d))}
            onSetPrix={(id, v) => setStats(s => withPrixCount(s, id, v))}
            onAdjustPrix={(id, d) => setStats(s => bumpPrix(s, id, d))}
            onResetCounts={() => setStats(s => ({ ...s, counts: {}, played: [] }))}
            onResetPrix={() => setStats(s => ({ ...s, prixCounts: {} }))}
            onResetHistory={() => { setHistory([]); setCurrentId(null) }}
            onResetAll={() => {
              setStats({ counts: {}, played: [], prixCounts: {} })
              setHistory([])
              setCurrentId(null)
            }}
            onRecord={recordResults}
            onDelete={deleteEntry}
            onRestored={async () => { await loadAll(); showToast({ text: 'Backup restored' }) }}
            onToast={showToast}
          />
        )}
      </main>

      <nav className="bottom-nav">
        <button className={`nav-btn ${tab === 'setup' ? 'active' : ''}`} onClick={() => setTab('setup')}>
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">Setup</span>
        </button>
        <button className="nav-btn randomize-nav-btn" onClick={() => roll()}>
          <span className="nav-icon" key={reveal.nonce}>🎲</span>
          <span className="nav-label">
            {settings.rollScope === 'map' && current ? 'Roll Map' : 'Roll All'}
          </span>
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

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
