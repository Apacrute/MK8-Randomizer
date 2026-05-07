// src/components/SetupScreen.tsx
import { RandomizeSettings } from '../types'
import './SetupScreen.css'

interface Props {
  settings: RandomizeSettings
  onSettingsChange: (s: RandomizeSettings) => void
  onRandomize: () => void
  spinning: boolean
  availableMapCount: number
}

function Toggle({
  label, sublabel, checked, onChange, accent
}: {
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
      <div className="toggle-switch">
        <div className="toggle-thumb" />
      </div>
    </button>
  )
}

export default function SetupScreen({ settings, onSettingsChange, onRandomize, spinning, availableMapCount }: Props) {
  const set = (key: keyof RandomizeSettings, val: boolean | number) =>
    onSettingsChange({ ...settings, [key]: val })

  const noMapCategorySelected = !settings.standardMaps && !settings.dlcMaps && !settings.rainbowRoads && !settings.tours

  return (
    <div className="setup-screen">

      {/* Player Count */}
      <section className="setup-section">
        <h2 className="section-title">👥 Players</h2>
        <div className="player-count-row">
          {[1, 2, 3, 4].map(n => (
            <button
              key={n}
              className={`player-btn ${settings.playerCount === n ? 'active' : ''}`}
              onClick={() => set('playerCount', n)}
            >
              {n}P
            </button>
          ))}
        </div>
        <p className="section-hint">Each player gets their own character, kart, tires & glider. Map and mode are shared.</p>
      </section>

      {/* Loadout */}
      <section className="setup-section">
        <h2 className="section-title">🎮 Loadout</h2>
        <div className="toggle-group">
          <Toggle label="🧑 Character" checked={settings.character} onChange={() => set('character', !settings.character)} accent="#e8001c" />
          <Toggle label="🏎️ Kart" checked={settings.kart} onChange={() => set('kart', !settings.kart)} accent="#0057b8" />
          <Toggle label="🛞 Tires" checked={settings.tire} onChange={() => set('tire', !settings.tire)} accent="#00a651" />
          <Toggle label="🪂 Glider" checked={settings.hanger} onChange={() => set('hanger', !settings.hanger)} accent="#7b2fff" />
        </div>
      </section>

      {/* Mode */}
      <section className="setup-section">
        <h2 className="section-title">⚡ Engine Class</h2>
        <div className="toggle-group">
          <Toggle label="Randomize Engine Class" sublabel="50cc · 100cc · 150cc · Mirror · 200cc" checked={settings.mode} onChange={() => set('mode', !settings.mode)} accent="#ff6b00" />
        </div>
      </section>

      {/* Map */}
      <section className="setup-section">
        <h2 className="section-title">🗺️ Map</h2>
        <div className="toggle-group">
          <Toggle label="Randomize Map" checked={settings.map} onChange={() => set('map', !settings.map)} accent="#ffd700" />
        </div>

        {settings.map && (
          <>
            <div className="toggle-group" style={{ marginTop: 8 }}>
              <Toggle label="Standard Maps" sublabel="45 tracks" checked={settings.standardMaps} onChange={() => set('standardMaps', !settings.standardMaps)} />
              <Toggle label="DLC Maps" sublabel="Booster Course Pass" checked={settings.dlcMaps} onChange={() => set('dlcMaps', !settings.dlcMaps)} />
              <Toggle label="Rainbow Roads" sublabel="5 tracks" checked={settings.rainbowRoads} onChange={() => set('rainbowRoads', !settings.rainbowRoads)} />
              <Toggle label="Tour Maps" sublabel="City tracks" checked={settings.tours} onChange={() => set('tours', !settings.tours)} />
            </div>

            <div className="map-count-pill">
              {noMapCategorySelected
                ? '⚠️ No map category selected'
                : `${availableMapCount} tracks in pool`}
            </div>

            <div className="toggle-group" style={{ marginTop: 8 }}>
              <Toggle
                label="🚫 No Repeats"
                sublabel="Exclude already-played maps until all are done"
                checked={settings.noRepeats}
                onChange={() => set('noRepeats', !settings.noRepeats)}
                accent="#ff6b00"
              />
            </div>
          </>
        )}
      </section>

      {/* Big Randomize Button */}
      <div className="randomize-btn-wrap">
        <button
          className={`randomize-btn ${spinning ? 'spinning' : ''}`}
          onClick={onRandomize}
          disabled={spinning}
        >
          {spinning ? '🎲 Rolling...' : '🎲 RANDOMIZE!'}
        </button>
      </div>

    </div>
  )
}
