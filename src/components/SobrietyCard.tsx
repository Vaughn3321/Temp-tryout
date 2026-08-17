import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { storeKeys } from '../data/store'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { defaultRecoveryProfile, type RecoveryProfile } from '../data/profile'
import { formatSobrietyLength } from '../lib/sobriety'

export default function SobrietyCard() {
  const [profile, setProfile] = useLocalStorage<RecoveryProfile>(storeKeys.recoveryProfile, defaultRecoveryProfile)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile.sobrietyDate ?? '')

  function save() {
    if (!draft) return
    setProfile((p) => ({ ...p, sobrietyDate: draft }))
    setEditing(false)
  }

  if (!profile.sobrietyDate && !editing) {
    return (
      <button
        onClick={() => {
          setDraft('')
          setEditing(true)
        }}
        className="mt-4 w-full rounded-2xl border border-dashed border-dusk-300 bg-dusk-50/60 p-4 text-left dark:border-dusk-700 dark:bg-dusk-500/10"
      >
        <p className="font-display text-sm font-semibold text-dusk-700 dark:text-dusk-300">
          Add your sobriety date
        </p>
        <p className="mt-0.5 text-xs text-dusk-600/80 dark:text-dusk-300/70">
          Tracked privately, only on this device — it's what milestone chips will count from.
        </p>
      </button>
    )
  }

  if (editing) {
    return (
      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:ring-ink-800">
        <p className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">Sobriety date</p>
        <div className="mt-2 flex gap-2">
          <input
            type="date"
            value={draft}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDraft(e.target.value)}
            className="flex-1 rounded-xl bg-ink-50 p-2.5 text-sm text-ink-900 outline-none dark:bg-ink-800 dark:text-ink-100"
          />
          <button onClick={save} className="rounded-xl bg-dusk-500 px-4 text-sm font-semibold text-white">
            Save
          </button>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => {
        setDraft(profile.sobrietyDate ?? '')
        setEditing(true)
      }}
      className="mt-4 flex w-full items-center justify-between rounded-2xl bg-gradient-to-br from-dusk-500 to-dusk-700 p-4 text-left text-white shadow-sm"
    >
      <div>
        <p className="text-xs font-medium text-dusk-100">Your recovery</p>
        <p className="font-display text-xl font-semibold">{formatSobrietyLength(profile.sobrietyDate!)}</p>
      </div>
      <Pencil size={16} className="text-dusk-200" />
    </button>
  )
}
