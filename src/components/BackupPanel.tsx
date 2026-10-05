// src/components/BackupPanel.tsx
import { useRef, useState } from 'react'
import { exportBackup, readFileText } from '../utils/backup'
import { parseBackup, restoreBackup } from '../utils/storage'
import type { ToastState } from './Toast'

interface Props {
  onRestored: () => void
  onToast: (t: ToastState) => void
}

export default function BackupPanel({ onRestored, onToast }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  const doExport = async () => {
    setBusy(true)
    try {
      await exportBackup()
    } catch (e: any) {
      // Closing the share sheet without picking anything isn't an error
      if (!/cancel/i.test(String(e?.message ?? e))) onToast({ text: `Backup failed: ${e?.message ?? e}` })
    } finally {
      setBusy(false)
    }
  }

  const doImport = async (file: File | undefined) => {
    if (!file) return
    try {
      const backup = parseBackup(await readFileText(file))
      const date = backup.exportedAt ? new Date(backup.exportedAt).toLocaleString() : 'unknown date'
      const races = backup.history.length
      if (!window.confirm(`Replace ALL current counts, history and settings with this backup?\n\nFrom: ${date}\nRaces: ${races}`)) return
      await restoreBackup(backup)
      onRestored()
    } catch (e: any) {
      onToast({ text: e?.message ?? 'Could not restore that file.' })
    } finally {
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <section className="backup-panel">
      <h3 className="backup-title">💾 Backup</h3>
      <p className="backup-text">
        Saves your counts, race history, player names and settings to a file. Keep it in Google Drive
        or email it to yourself so a new phone can pick up where you left off.
      </p>
      <div className="backup-actions">
        <button className="backup-btn" onClick={doExport} disabled={busy}>
          {busy ? 'Saving…' : '⬆️ Save backup'}
        </button>
        <button className="backup-btn ghost" onClick={() => fileRef.current?.click()}>
          ⬇️ Restore backup
        </button>
      </div>
      <input ref={fileRef} type="file" hidden onChange={e => doImport(e.target.files?.[0])} />
    </section>
  )
}
