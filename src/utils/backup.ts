// src/utils/backup.ts
// Saving the backup file: on the phone it goes through the Android share sheet
// (save to Drive/Files, email it, etc.); in a browser it downloads.
import { Capacitor } from '@capacitor/core'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { buildBackup } from './storage'

export async function exportBackup(): Promise<void> {
  const backup = await buildBackup()
  const text = JSON.stringify(backup, null, 2)
  const stamp = new Date().toISOString().slice(0, 10)
  const filename = `mk8-randomizer-backup-${stamp}.json`

  if (Capacitor.isNativePlatform()) {
    const { uri } = await Filesystem.writeFile({
      path: filename,
      data: text,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    })
    await Share.share({
      title: 'MK8 Randomizer backup',
      dialogTitle: 'Save your backup',
      files: [uri],
    })
    return
  }

  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function readFileText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result || ''))
    r.onerror = () => reject(new Error('Could not read that file.'))
    r.readAsText(file)
  })
}
