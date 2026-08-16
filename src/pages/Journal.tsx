import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown, Trash2 } from 'lucide-react'
import { inventoryPrompts, type InventoryEntry } from '../data/inventory'
import { useLocalStorage } from '../hooks/useLocalStorage'

const moodEmoji: Record<number, string> = { 1: '😞', 2: '😕', 3: '🙂', 4: '😊', 5: '🤩' }

export default function Journal() {
  const [entries, setEntries] = useLocalStorage<InventoryEntry[]>('odaat:entries', [])
  const [openId, setOpenId] = useState<string | null>(null)

  const sorted = [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-2">
        <Link
          to="/step10"
          aria-label="Back to Step 10"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-ink-900/5 dark:text-ink-400 dark:hover:bg-white/10"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">Journal</h1>
      </div>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
        {entries.length} entr{entries.length === 1 ? 'y' : 'ies'} — this is only stored on your device.
      </p>

      <div className="mt-4 flex flex-col gap-2.5">
        {sorted.map((entry) => {
          const isOpen = openId === entry.id
          return (
            <div
              key={entry.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:ring-ink-800"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : entry.id)}
                className="flex w-full items-center justify-between gap-3 p-3.5 text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{moodEmoji[entry.mood]}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">
                      {new Date(entry.createdAt).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-ink-500 dark:text-ink-400">{entry.timeOfDay} check-in</p>
                  </div>
                </div>
                <ChevronDown
                  size={18}
                  className={['text-ink-400 transition-transform', isOpen ? 'rotate-180' : ''].join(' ')}
                />
              </button>

              {isOpen && (
                <div className="border-t border-ink-100 px-3.5 pb-3.5 pt-3 dark:border-ink-800">
                  <div className="flex flex-col gap-3">
                    {inventoryPrompts.map((p) => {
                      const answer = entry.answers[p.id]?.trim()
                      if (!answer) return null
                      return (
                        <div key={p.id}>
                          <p className="text-xs font-semibold text-ink-500 dark:text-ink-400">
                            {p.emoji} {p.question}
                          </p>
                          <p className="mt-0.5 text-sm text-ink-800 dark:text-ink-200">{answer}</p>
                        </div>
                      )
                    })}
                  </div>
                  <button
                    onClick={() => removeEntry(entry.id)}
                    className="mt-3 flex items-center gap-1.5 text-xs font-medium text-sunrise-600 dark:text-sunrise-400"
                  >
                    <Trash2 size={13} /> Delete entry
                  </button>
                </div>
              )}
            </div>
          )
        })}

        {sorted.length === 0 && (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-ink-500 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:text-ink-400 dark:ring-ink-800">
            No entries yet. Your first Tenth Step check-in will show up here. 📓
          </div>
        )}
      </div>
    </div>
  )
}
