// src/components/SpinOverlay.tsx
import './SpinOverlay.css'

// Full-screen overlay shown while a roll is happening so it's always obvious
// the randomize command went through — even when the result is the same map twice.
export default function SpinOverlay() {
  return (
    <div className="spin-overlay">
      <div className="spin-backdrop" />
      <div className="spin-content">
        <div className="spin-wheel">🎲</div>
        <div className="spin-text">Rolling…</div>
        <div className="spin-track">
          <div className="spin-dot" />
          <div className="spin-dot" />
          <div className="spin-dot" />
        </div>
      </div>
    </div>
  )
}
