// src/components/PoolManager.tsx
// Browse every pool and tap items to ban / unban them.
import { useState } from 'react'
import { Excluded, PoolKey } from '../types'
import { POOLS, POOL_LABELS } from '../lib/catalog'
import GameImage from './GameImage'
import './PoolManager.css'

interface Props {
  excluded: Excluded
  onToggle: (pool: PoolKey, id: string) => void
  onClearPool: (pool: PoolKey) => void
  onClose: () => void
}

const KEYS: PoolKey[] = ['characters', 'karts', 'tires', 'gliders', 'maps', 'prixes']

export default function PoolManager({ excluded, onToggle, onClearPool, onClose }: Props) {
  const [pool, setPool] = useState<PoolKey>('characters')
  const items = POOLS[pool]
  const banned = excluded[pool]
  const wide = pool === 'maps'

  return (
    <div className="pool-manager">
      <div className="pm-top">
        <button className="pm-back" onClick={onClose}>‹ Back</button>
        <h2 className="section-title" style={{ margin: 0 }}>Banned Items</h2>
      </div>

      <div className="pm-tabs">
        {KEYS.map(k => (
          <button key={k} className={`pm-tab ${pool === k ? 'active' : ''}`} onClick={() => setPool(k)}>
            {POOL_LABELS[k]}
            {excluded[k].length > 0 && <span className="pm-tab-count">{excluded[k].length}</span>}
          </button>
        ))}
      </div>

      <div className="pm-bar">
        <span>{banned.length} of {items.length} banned · tap to toggle</span>
        {banned.length > 0 && (
          <button className="pm-clear" onClick={() => onClearPool(pool)}>Unban all</button>
        )}
      </div>

      <div className={`pm-grid ${wide ? 'wide' : ''}`}>
        {items.map(item => {
          const isBanned = banned.includes(item.id)
          return (
            <button key={item.id} className={`pm-item ${isBanned ? 'banned' : ''}`}
              onClick={() => onToggle(pool, item.id)}>
              <div className="pm-img-wrap">
                <GameImage src={item.image} alt={item.name} fallback={(item as any).emblem}
                  className={wide ? 'pm-img cover' : 'pm-img'} />
                {isBanned && <span className="pm-ban">🚫</span>}
              </div>
              <span className="pm-name">{item.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
