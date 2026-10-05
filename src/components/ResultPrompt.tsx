// src/components/ResultPrompt.tsx
// Pops up a couple of minutes after a race is rolled to ask for placements.
import { RaceEntry, PlayerPlacement } from '../types'
import { BY_ID } from '../lib/catalog'
import GameImage from './GameImage'
import RecordRace from './RecordRace'
import './ResultPrompt.css'

interface Props {
  entry: RaceEntry
  onSave: (results: PlayerPlacement[] | null) => void
  onLater: () => void
  onSkip: () => void
}

export default function ResultPrompt({ entry, onSave, onLater, onSkip }: Props) {
  const map = entry.map ? BY_ID.maps[entry.map] : null
  const prix = entry.prix ? BY_ID.prixes[entry.prix] : null
  const title = map?.name ?? prix?.name ?? 'that race'

  return (
    <div className="prompt-backdrop" role="dialog" aria-modal="true" aria-label="Record race result">
      <div className="prompt-sheet">
        <div className="prompt-head">
          <GameImage src={map?.image ?? prix?.image} alt={title} fallback={prix?.emblem ?? '🏁'} className="prompt-img" />
          <div>
            <span className="prompt-kicker">🏁 Race finished?</span>
            <h3 className="prompt-title">How did {title} go?</h3>
          </div>
        </div>
        <RecordRace
          key={entry.id}
          names={entry.names}
          initial={entry.results}
          onSave={onSave}
        />
        <div className="prompt-actions">
          <button className="prompt-link" onClick={onLater}>Remind me in 2 min</button>
          <button className="prompt-link muted" onClick={onSkip}>Skip this race</button>
        </div>
      </div>
    </div>
  )
}
