import { allStoreKeys, STORAGE_VERSION } from '../data/store'

interface BackupFile {
  version: number
  exportedAt: string
  data: Record<string, unknown>
}

/** Downloads everything this app has stored locally as one JSON file. */
export function exportBackup() {
  const data: Record<string, unknown> = {}
  for (const key of allStoreKeys) {
    const raw = window.localStorage.getItem(key)
    if (raw === null) continue
    try {
      data[key] = JSON.parse(raw)
    } catch {
      // skip anything that isn't valid JSON rather than corrupt the export
    }
  }

  const backup: BackupFile = { version: STORAGE_VERSION, exportedAt: new Date().toISOString(), data }
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `odaat-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Restores a previously exported file. Overwrites any matching local keys —
 * caller should confirm with the user before invoking this, since it's
 * destructive to whatever's currently stored.
 */
export async function importBackup(file: File): Promise<{ ok: true; keysRestored: number } | { ok: false; error: string }> {
  let parsed: unknown
  try {
    parsed = JSON.parse(await file.text())
  } catch {
    return { ok: false, error: "That file isn't valid JSON." }
  }

  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    !('data' in parsed) ||
    typeof (parsed as BackupFile).data !== 'object'
  ) {
    return { ok: false, error: "That doesn't look like an ODAAT backup file." }
  }

  const { data } = parsed as BackupFile
  let count = 0
  for (const key of allStoreKeys) {
    if (!(key in data)) continue
    window.localStorage.setItem(key, JSON.stringify(data[key]))
    count += 1
  }

  return { ok: true, keysRestored: count }
}
