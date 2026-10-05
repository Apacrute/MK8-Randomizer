// src/components/GameImage.tsx
// An <img> that shows a fallback (emoji or initials) until the real image exists.
import { useState, useEffect } from 'react'

interface Props {
  src?: string | null
  alt: string
  fallback?: string        // emoji; defaults to the item's initials
  className?: string
}

function initials(name: string): string {
  return name.split(/[\s.()-]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export default function GameImage({ src, alt, fallback, className }: Props) {
  const [broken, setBroken] = useState(!src)
  useEffect(() => { setBroken(!src) }, [src])

  if (broken) {
    return (
      <span className={`img-fallback ${className ?? ''}`} aria-label={alt} role="img">
        {fallback || initials(alt)}
      </span>
    )
  }
  return (
    <img
      src={src!}
      alt={alt}
      className={className}
      draggable={false}
      onError={() => setBroken(true)}
    />
  )
}
