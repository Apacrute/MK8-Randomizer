// src/components/useLongPress.ts
// Tap → onTap, press and hold → onLongPress (the tap is suppressed).
import { useRef } from 'react'

export function useLongPress(onLongPress: () => void, onTap: () => void, ms = 550) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const fired = useRef(false)
  const start = useRef<{ x: number; y: number } | null>(null)

  const clear = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }

  return {
    onPointerDown: (e: React.PointerEvent) => {
      fired.current = false
      start.current = { x: e.clientX, y: e.clientY }
      clear()
      timer.current = setTimeout(() => {
        fired.current = true
        if (navigator.vibrate) navigator.vibrate(30)
        onLongPress()
      }, ms)
    },
    onPointerMove: (e: React.PointerEvent) => {
      // Cancel if the finger moves (scrolling)
      if (start.current && Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y) > 10) clear()
    },
    onPointerUp: clear,
    onPointerLeave: clear,
    onPointerCancel: clear,
    onContextMenu: (e: React.MouseEvent) => e.preventDefault(),
    onClick: () => {
      if (fired.current) { fired.current = false; return }
      onTap()
    },
  }
}
