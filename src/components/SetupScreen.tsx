// src/components/SetupScreen.tsx
import { useState } from 'react'
import { RandomizeSettings, PoolKey } from '../types'
import { mapPool } from '../lib/roll'
import PoolManager from './PoolManager'
import PlayerPicker from './PlayerPicker'
import './SetupScreen.css'

interface Props {
  settings: RandomizeSettings
  onSettingsChange: (s: RandomizeSettings) => void
  onRandomize: () => void
  onToggleBan: (pool: PoolKey, id: string) => void
  onAddPlayer: (name: string, slot: number) => void
  onRenamePlayer: (from: string, to: string) => void
  onRemovePlayer: (name: string) => void
}

function Toggle({ label, sublabel, checked, onChange, accent }: {
  label: string
  sublabel?: string
  checked: boolean
  onChange: () => void
  accent?: string
}) {
  return (
    <button
      className={`toggle-row ${checked ? 'checked' : ''}`}
      onClick={onChange}
      style={checked && accent ? { '--accent': accent } as React.CSSProperties : undefined}
    >
      <div className="toggle-text">
        <span className="toggle-label">{label}</span>
        {sublabel && <span className="toggle-sublabel">{sublabel}</span>}
      </div>
      <div className="toggle-switch"><div className="toggle-thumb" /></div>
    </button>
  )
}

export default function SetupScreen({
  settings, onSettingsChange, onRandomize, onToggleBan, onAddPlayer, onRenamePlayer, onRemovePlayer,
}: Props) {
  const [managing, setManaging] = useState(false)
  const set = <K extends keyof RandomizeSettings>(key: K, val: RandomizeSettings[K]) =>
    onSettingsChange({ ...settings, [key]: val })

  const setName = (i: number, name: string) => {
    const names = [...settings.playerNames]
    names[i] = name
    set('playerNames', names)
  }

  const noMapCategory = !settings.standardMaps && !settings.dlcMaps && !settings.rainbowRoads && !settings.tours
  const mapCount = mapPool(settings).length
  const bannedTotal = Object.values(settings.excluded).reduce((n, l) => n + l.length, 0)

  if (managing) {
    return (
      <PoolManager
        excluded={settings.excluded}
        onToggle={onToggleBan}
        onClearPool={pool => set('excluded', { ...settings.excluded, [pool]: [] })}
        onClose={() => setManaging(false)}
      />
    )
  }

  return (
    <div className="setup-screen">

      <section className="setup-section">
        <h2 className="section-title">👥 Players</h2>
        <div className="player-count-row">
          {[1, 2, 3, 4].map(n => (
            <button key={n}
              className={`player-btn ${settings.playerCount === n ? 'active' : ''}`}
              onClick={() => set('playerCount', n)}>
              {n}P
            </button>
          ))}
        </div>
        <PlayerPicker
          count={settings.playerCount}
          slots={settings.playerNames}
          roster={settings.roster}
          onPick={setName}
          onAdd={onAddPlayer}
          onRename={onRenamePlayer}
          onRemove={onRemovePlayer}
        />
        {settings.playerCount > 1 && (
          <div className="toggle-group" style={{ marginTop: 10 }}>
            <Toggle label="👯 Different for everyone"
              sublabel="No two players get the same character, kart, tires or glider"
              checked={settings.uniqueLoadouts}
              onChange={() => set('uniqueLoadouts', !settings.uniqueLoadouts)} accent="#00a651" />
          </div>
        )}
        <p className="section-hint">Players are saved, so their stats carry over between game nights. Map, cup and rules are shared.</p>
      </section>

      <section className="setup-section">
        <h2 className="section-title">🎮 Loadout</h2>
        <div className="toggle-group">
          <Toggle label="🧑 Character" checked={settings.character} onChange={() => set('character', !settings.character)} accent="#e8001c" />
          <Toggle label="🏎️ Kart" checked={settings.kart} onChange={() => set('kart', !settings.kart)} accent="#0057b8" />
          <Toggle label="🛞 Tires" checked={settings.tire} onChange={() => set('tire', !settings.tire)} accent="#00a651" />
          <Toggle label="🪂 Glider" checked={settings.hanger} onChange={() => set('hanger', !settings.hanger)} accent="#7b2fff" />
        </div>
      </section>

      <section className="setup-section">
        <h2 className="section-title">⚡ Race Rules</h2>
        <div className="toggle-group">
          <Toggle label="Engine Class" sublabel="50cc · 100cc · 150cc · Mirror · 200cc"
            checked={settings.mode} onChange={() => set('mode', !settings.mode)} accent="#ff6b00" />
          <Toggle label="Item Set" sublabel="Normal · Frantic · Shells/Bananas/Mushrooms/Bob-ombs only · None"
            checked={settings.items} onChange={() => set('items', !settings.items)} accent="#ff6b00" />
          <Toggle label="Challenge" sublabel="Adds a house rule like No Drifting or Hoarder"
            checked={settings.challenge} onChange={() => set('challenge', !settings.challenge)} accent="#ff6b00" />
        </div>
      </section>

      <section className="setup-section">
        <h2 className="section-title">🏆 Cup</h2>
        <div className="toggle-group">
          <Toggle label="Randomize Cup" sublabel="Picks 1 of all 24 cups · tracked separately"
            checked={settings.prix} onChange={() => set('prix', !settings.prix)} accent="#ffd700" />
          {settings.prix && (
            <Toggle label="🚫 No Repeats (cups)" sublabel="Always picks from the least-rolled cups"
              checked={settings.prixNoRepeats} onChange={() => set('prixNoRepeats', !settings.prixNoRepeats)} accent="#ff6b00" />
          )}
        </div>
      </section>

      <section className="setup-section">
        <h2 className="section-title">🗺️ Map</h2>
        <div className="toggle-group">
          <Toggle label="Randomize Map" checked={settings.map} onChange={() => set('map', !settings.map)} accent="#ffd700" />
        </div>
        {settings.map && (
          <>
            <div className="toggle-group" style={{ marginTop: 8 }}>
              <Toggle label="Standard Maps" sublabel="Base game tracks" checked={settings.standardMaps} onChange={() => set('standardMaps', !settings.standardMaps)} />
              <Toggle label="DLC Maps" sublabel="Booster Course Pass" checked={settings.dlcMaps} onChange={() => set('dlcMaps', !settings.dlcMaps)} />
              <Toggle label="Rainbow Roads" sublabel="5 tracks" checked={settings.rainbowRoads} onChange={() => set('rainbowRoads', !settings.rainbowRoads)} />
              <Toggle label="Tour Maps" sublabel="City tracks" checked={settings.tours} onChange={() => set('tours', !settings.tours)} />
            </div>
            <div className="map-count-pill">
              {noMapCategory ? '⚠️ No map category selected' : `${mapCount} tracks in pool`}
            </div>
            <div className="toggle-group" style={{ marginTop: 8 }}>
              <Toggle label="🚫 No Repeats" sublabel="Always picks from the least-rolled maps — auto-balances"
                checked={settings.noRepeats} onChange={() => set('noRepeats', !settings.noRepeats)} accent="#ff6b00" />
            </div>
          </>
        )}
      </section>

      <section className="setup-section">
        <h2 className="section-title">🚫 Banned</h2>
        <button className="manage-btn" onClick={() => setManaging(true)}>
          <span>{bannedTotal === 0 ? 'Nothing banned' : `${bannedTotal} item${bannedTotal === 1 ? '' : 's'} banned`}</span>
          <span className="manage-go">Manage ›</span>
        </button>
        <p className="section-hint">Banned characters, parts, maps and cups are never rolled. You can also hold any card on the Results screen to ban it.</p>
      </section>

      <div className="randomize-btn-wrap">
        <button className="randomize-btn" onClick={onRandomize}>🎲 RANDOMIZE!</button>
      </div>
    </div>
  )
}
