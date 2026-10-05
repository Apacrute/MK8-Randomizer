// src/components/ResultsScreen.tsx
import { useState, useEffect } from 'react'
import {
  RaceEntry, RandomizeSettings, MapStats, RerollTarget, PoolKey, PlayerPlacement,
  RollScope, LoadoutSlot, GameItem,
} from '../types'
import type { Reveal } from '../App'
import { BY_ID, POOLS, SLOT_POOL, SLOT_LABEL, MODES, ITEM_SETS, CHALLENGES } from '../lib/catalog'
import { mapPool, available } from '../lib/roll'
import SlotReveal from './SlotReveal'
import GameImage from './GameImage'
import RecordRace, { ResultSummary } from './RecordRace'
import { useLongPress } from './useLongPress'
import './ResultsScreen.css'

interface Props {
  entry: RaceEntry | null
  settings: RandomizeSettings
  stats: MapStats
  reveal: Reveal
  onRoll: (scope?: RollScope) => void
  onScopeChange: (scope: RollScope) => void
  onReroll: (target: RerollTarget) => void
  onBan: (pool: PoolKey, id: string) => void
  onRecord: (entryId: string, results: PlayerPlacement[] | null) => void
  onCountCup: (entryId: string) => void
}

const PLAYER_COLORS = ['#e8001c', '#0057b8', '#00a651', '#ff6b00']
const SLOTS: LoadoutSlot[] = ['character', 'kart', 'tire', 'glider']

// A tappable card: tap = reroll this slot, hold = ban it
function Tappable({ className, style, onTap, onHold, children }: {
  className: string
  style?: React.CSSProperties
  onTap: () => void
  onHold?: () => void
  children: React.ReactNode
}) {
  const press = useLongPress(onHold ?? (() => {}), onTap)
  return <div className={`tappable ${className}`} style={style} {...press}>{children}</div>
}

export default function ResultsScreen({
  entry, settings, stats, reveal, onRoll, onScopeChange, onReroll, onBan, onRecord, onCountCup,
}: Props) {
  const [recording, setRecording] = useState(false)
  // Close the recorder when a new race is rolled
  useEffect(() => { setRecording(false) }, [entry?.id])
  const fresh = Date.now() - reveal.at < 1500
  const spins = (key: string) => reveal.targets === 'all' || reveal.targets.includes(key)
  const slotProps = (key: string, delay: number) =>
    ({ nonce: reveal.nonce, spin: spins(key), fresh, delay })

  const rollBar = (
    <div className="roll-bar">
      <div className="scope-switch" role="radiogroup" aria-label="What the Roll button rerolls">
        <button
          className={`scope-btn ${settings.rollScope === 'all' ? 'active' : ''}`}
          onClick={() => onScopeChange('all')}
        >🎲 Everything</button>
        <button
          className={`scope-btn ${settings.rollScope === 'map' ? 'active' : ''}`}
          onClick={() => onScopeChange('map')}
          disabled={!settings.map}
        >🗺️ Map only</button>
      </div>
      <button className="reroll-btn" onClick={() => onRoll()}>
        {settings.rollScope === 'map' && entry ? '🗺️ Roll New Map' : '🎲 Roll Everything'}
      </button>
    </div>
  )

  if (!entry) {
    return (
      <div className="results-screen">
        <div className="results-empty">
          <div className="empty-icon">🎲</div>
          <p>No results yet!</p>
          <p className="empty-sub">Hit <strong>Roll</strong> to randomize your race.</p>
        </div>
        {rollBar}
      </div>
    )
  }

  const map = entry.map ? BY_ID.maps[entry.map] : null
  const prix = entry.prix ? BY_ID.prixes[entry.prix] : null
  const mode = entry.mode ? BY_ID.modes[entry.mode] : null
  const items = entry.items ? BY_ID.items[entry.items] : null
  const challenge = entry.challenge ? BY_ID.challenges[entry.challenge] : null
  const mapCount = map ? (stats.counts[map.id] || 0) : 0
  const prixCount = prix ? (stats.prixCounts[prix.id] || 0) : 0
  const maps = mapPool(settings)
  const prixPool = available(POOLS.prixes, settings.excluded.prixes)

  return (
    <div className="results-screen">
      <p className="results-hint">Tap a card to reroll just that · hold to ban it</p>

      {/* ── Cup ── */}
      {prix && (
        <section className="prix-result-card" style={{ '--prix-color': prix.color } as React.CSSProperties}>
          <Tappable className="prix-head" onTap={() => onReroll({ kind: 'shared', slot: 'prix' })}
            onHold={() => onBan('prixes', prix.id)}>
            <SlotReveal final={prix as GameItem} pool={prixPool} {...slotProps('prix', 0)}
              render={(p, rolling) => (
                <>
                  <GameImage src={p?.image} alt={p?.name ?? ''} fallback={(p as any)?.emblem}
                    className={`prix-emblem ${rolling ? 'rolling' : ''}`} />
                  <div className="prix-info">
                    <span className="prix-label">🏆 Cup</span>
                    <span className="prix-name">{p?.name}</span>
                  </div>
                </>
              )} />
            {prixCount > 0 && <span className="prix-count-badge">{prixCount}×</span>}
          </Tappable>
          <div className="cup-tracks">
            {prix.tracks.map(t => {
              const m = BY_ID.maps[t]
              return (
                <div className="cup-track" key={t}>
                  <GameImage src={m?.image} alt={m?.name ?? t} className="cup-track-img" />
                  <span className="cup-track-name">{m?.name}</span>
                  <span className="cup-track-count">{stats.counts[t] || 0}×</span>
                </div>
              )
            })}
          </div>
          <button className="cup-count-btn" disabled={!!entry.cupTracksCounted}
            onClick={() => onCountCup(entry.id)}>
            {entry.cupTracksCounted ? '✅ Counted all 4 tracks' : '🏁 Played the whole cup? +1 to all 4 tracks'}
          </button>
        </section>
      )}

      {/* ── Map ── */}
      {map && (
        <Tappable className="map-result-card" onTap={() => onReroll({ kind: 'shared', slot: 'map' })}
          onHold={() => onBan('maps', map.id)}>
          <SlotReveal final={map as GameItem} pool={maps} {...slotProps('map', 80)}
            render={(m, rolling) => (
              <>
                <div className="map-img-wrap">
                  <GameImage src={m?.image} alt={m?.name ?? ''} className={`map-img ${rolling ? 'rolling' : ''}`} />
                  {!rolling && (
                    <div className="map-overlay">
                      <span className="map-category-badge">{map.category}</span>
                      <span className="map-count-badge">🏁 Rolled {mapCount}×</span>
                    </div>
                  )}
                </div>
                <div className="map-info">
                  <span className="map-label">🗺️ Track</span>
                  <span className="map-name">{m?.name}</span>
                </div>
              </>
            )} />
        </Tappable>
      )}

      {/* ── Engine class + item set ── */}
      {(mode || items) && (
        <div className="rules-row">
          {mode && (
            <Tappable className="rule-pill" onTap={() => onReroll({ kind: 'shared', slot: 'mode' })}>
              <SlotReveal final={mode} pool={MODES} {...slotProps('mode', 160)}
                render={m => (
                  <>
                    <GameImage src={m?.image} alt={m?.name ?? ''} className="rule-img" />
                    <span>{m?.name}</span>
                  </>
                )} />
            </Tappable>
          )}
          {items && (
            <Tappable className="rule-pill" onTap={() => onReroll({ kind: 'shared', slot: 'items' })}>
              <SlotReveal final={items as GameItem} pool={ITEM_SETS} {...slotProps('items', 200)}
                render={it => (
                  <>
                    <GameImage src={it?.image} alt={it?.name ?? ''} fallback={(it as any)?.emblem} className="rule-img" />
                    <span>{it?.name}</span>
                  </>
                )} />
            </Tappable>
          )}
        </div>
      )}

      {/* ── Challenge ── */}
      {challenge && (
        <Tappable className="challenge-card" onTap={() => onReroll({ kind: 'shared', slot: 'challenge' })}>
          <SlotReveal final={challenge} pool={CHALLENGES} {...slotProps('challenge', 240)}
            render={c => (
              <>
                <GameImage src={c?.image} alt={c?.name ?? ''} fallback={c?.emblem} className="challenge-emblem" />
                <div className="challenge-info">
                  <span className="challenge-label">⚠️ Challenge</span>
                  <span className="challenge-name">{c?.name}</span>
                  <span className="challenge-detail">{c?.detail}</span>
                </div>
              </>
            )} />
        </Tappable>
      )}

      {/* ── Players ── */}
      {entry.loadouts.map((l, i) => {
        const active = SLOTS.filter(slot => l[slot])
        if (active.length === 0) return null
        return (
          <section key={i} className="player-section"
            style={{ '--player-color': PLAYER_COLORS[i] } as React.CSSProperties}>
            <h3 className="player-heading">{entry.names[i] ?? `P${i + 1}`}</h3>
            <div className="loadout-grid">
              {active.map((slot, si) => {
                const pool = SLOT_POOL[slot]
                const item = (BY_ID as any)[pool][l[slot]!] as GameItem | undefined
                const key = `p${i}-${slot}`
                return (
                  <Tappable key={slot} className="item-card"
                    onTap={() => onReroll({ kind: 'player', slot, player: i })}
                    onHold={() => item && onBan(pool, item.id)}>
                    <span className="item-label">{SLOT_LABEL[slot]}</span>
                    <SlotReveal final={item ?? null}
                      pool={available(POOLS[pool], settings.excluded[pool])}
                      {...slotProps(key, 300 + i * 120 + si * 60)}
                      render={(it, rolling) => (
                        <>
                          <div className={`item-img-wrap ${rolling ? 'rolling' : ''}`}>
                            <GameImage src={it?.image} alt={it?.name ?? ''} className="item-img" />
                          </div>
                          <span className="item-name">{it?.name}</span>
                        </>
                      )} />
                  </Tappable>
                )
              })}
            </div>
          </section>
        )
      })}

      {/* ── Record the race ── */}
      <section className="record-section">
        <div className="record-head">
          <h3 className="record-title">🏁 Race result</h3>
          {entry.results && !recording && (
            <button className="link-btn" onClick={() => setRecording(true)}>Edit</button>
          )}
        </div>
        {recording ? (
          <RecordRace
            key={entry.id}
            names={entry.names}
            initial={entry.results}
            onSave={r => { onRecord(entry.id, r); setRecording(false) }}
            onCancel={() => setRecording(false)}
          />
        ) : entry.results ? (
          <ResultSummary names={entry.names} results={entry.results} />
        ) : (
          <button className="record-open-btn" onClick={() => setRecording(true)}>
            Record placements
          </button>
        )}
      </section>

      {rollBar}
    </div>
  )
}
