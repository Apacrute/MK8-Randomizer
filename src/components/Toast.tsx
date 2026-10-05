// src/components/Toast.tsx
import { useEffect } from 'react'
import './Toast.css'

export interface ToastState {
  text: string
  actionLabel?: string
  onAction?: () => void
  key?: number
}

export default function Toast({ toast, onClose }: { toast: ToastState | null; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [toast?.key])

  if (!toast) return null
  return (
    <div className="toast" key={toast.key} role="status">
      <span className="toast-text">{toast.text}</span>
      {toast.actionLabel && (
        <button
          className="toast-action"
          onClick={() => { toast.onAction?.(); onClose() }}
        >
          {toast.actionLabel}
        </button>
      )}
    </div>
  )
}
