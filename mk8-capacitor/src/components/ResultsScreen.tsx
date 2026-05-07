// src/components/ResultsScreen.tsx
import { PlayerResult, RandomizeSettings, MapStats } from '../types'
import './ResultsScreen.css'

interface Props {
  results: PlayerResult[]
  settings: RandomizeSettings
  stats: MapStats
  onReRandomize: () => void
  spinning: boolean
}

const PLAYER_COLORS = ['#e8001c', '#0057b8', '#00a651', '#ff6b00']
const PLAYER_LABELS = ['P1', 'P2', 'P3', 'P4']

function ItemCard({ label, name, image }: { label: string; name: string; image: string }) {
  return (
    <div className="item-card">
      <span className="item-label">{label}</span>
      <div className="item-img-wrap">
        <img
          src={image}
          alt={name}
          className="item-img"
          onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3' }}
        />
      </div>
      <span className="item-name">{name}</span>
    </div>
  )
}

export default function ResultsScreen({ results, settings, stats, onReRandomize, spinning }: Props) {
  if (results.length === 0) {
    return (
      <div className="results-empty">
        <div className="empty-icon">🎲</div>
        <p>No results yet!</p>
        <p className="empty-sub">Hit <strong>Roll!</strong> to randomize your loadout.</p>
      </div>
    )
  }

  // Shared across all players
  const sharedMap = results[0]?.map
  const sharedMode = results[0]?.mode
  const mapCount = sharedMap ? (stats.counts[sharedMap.id] || 0) : 0

  return (
    <div className="results-screen">

      {/* Shared results: Map + Mode */}
      {(sharedMap || sharedMode) && (
        <section className="shared-section">
          {sharedMap && (
            <div className="map-result-card">
              <div className="map-img-wrap">
                <img
                  src={sharedMap.image}
                  alt={sharedMap.name}
                  className="map-img"
                  onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3' }}
                />
                <div className="map-overlay">
                  <span className="map-category-badge">{sharedMap.category}</span>
                  {mapCount > 0 && (
                    <span className="map-count-badge">
                      🏁 Played {mapCount}×
                    </span>
                  )}
                </div>
              </div>
              <div className="map-info">
                <span className="map-label">🗺️ Track</span>
                <span className="map-name">{sharedMap.name}</span>
              </div>
            </div>
          )}

          {sharedMode && (
            <div className="mode-pill">
              <img
                src={sharedMode.image}
                alt={sharedMode.name}
                className="mode-img"
                onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3' }}
              />
              <span>{sharedMode.name}</span>
            </div>
          )}
        </section>
      )}

      {/* Per-player loadouts */}
      {results.map((result, i) => (
        <section
          key={i}
          className="player-section"
          style={{ '--player-color': PLAYER_COLORS[i] } as React.CSSProperties}
        >
          {results.length > 1 && (
            <h3 className="player-heading">{PLAYER_LABELS[i]}</h3>
          )}
          <div className="loadout-grid">
            {result.character && (
              <ItemCard label="Character" name={result.character.name} image={result.character.image} />
            )}
            {result.kart && (
              <ItemCard label="Kart" name={result.kart.name} image={result.kart.image} />
            )}
            {result.tire && (
              <ItemCard label="Tires" name={result.tire.name} image={result.tire.image} />
            )}
            {result.hanger && (
              <ItemCard label="Glider" name={result.hanger.name} image={result.hanger.image} />
            )}
          </div>
        </section>
      ))}

      {/* Re-roll */}
      <div className="reroll-wrap">
        <button
          className={`reroll-btn ${spinning ? 'spinning' : ''}`}
          onClick={onReRandomize}
          disabled={spinning}
        >
          {spinning ? '🎲 Rolling...' : '🎲 Roll Again'}
        </button>
      </div>
    </div>
  )
}
