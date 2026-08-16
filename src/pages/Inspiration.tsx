import { useState } from 'react'
import { quotes, quoteOfTheDay } from '../data/quotes'
import QuoteCard from '../components/QuoteCard'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { Bell } from 'lucide-react'

export default function Inspiration() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('odaat:favorites', [])
  const [tab, setTab] = useState<'all' | 'favorites'>('all')
  const [notifTime, setNotifTime] = useLocalStorage<string>('odaat:notifTime', '08:00')
  const [notifOn, setNotifOn] = useLocalStorage<boolean>('odaat:notifOn', true)

  const today = quoteOfTheDay()

  function toggleFavorite(id: string) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const list = tab === 'all' ? quotes : quotes.filter((q) => favorites.includes(q.id))

  return (
    <div className="px-4 pt-4">
      <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
        Daily inspiration
      </h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
        A little encouragement, right when you need it.
      </p>

      <div className="mt-3">
        <QuoteCard quote={today} favorited={favorites.includes(today.id)} onToggleFavorite={toggleFavorite} hero />
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:ring-ink-800">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-dusk-100 text-dusk-600 dark:bg-dusk-500/15 dark:text-dusk-300">
            <Bell size={16} />
          </span>
          <div>
            <p className="text-sm font-medium text-ink-900 dark:text-ink-100">Daily nudge</p>
            <p className="text-xs text-ink-500 dark:text-ink-400">
              {notifOn ? `Sends every day at ${notifTime}` : 'Notifications paused'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {notifOn && (
            <input
              type="time"
              value={notifTime}
              onChange={(e) => setNotifTime(e.target.value)}
              className="rounded-lg bg-ink-100 px-2 py-1 text-xs text-ink-700 outline-none dark:bg-ink-800 dark:text-ink-200"
            />
          )}
          <button
            type="button"
            role="switch"
            aria-checked={notifOn}
            onClick={() => setNotifOn((v) => !v)}
            className={[
              'relative h-6 w-11 shrink-0 rounded-full transition-colors',
              notifOn ? 'bg-sunrise-500' : 'bg-ink-300 dark:bg-ink-700',
            ].join(' ')}
          >
            <span
              className={[
                'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                notifOn ? 'translate-x-[22px]' : 'translate-x-0.5',
              ].join(' ')}
            />
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-1.5 rounded-full bg-ink-100 p-1 text-sm dark:bg-ink-900">
        {(['all', 'favorites'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'flex-1 rounded-full py-1.5 font-medium transition-colors capitalize',
              tab === t
                ? 'bg-white text-ink-900 shadow-sm dark:bg-ink-800 dark:text-ink-50'
                : 'text-ink-500 dark:text-ink-400',
            ].join(' ')}
          >
            {t === 'all' ? 'All quotes' : `Favorites (${favorites.length})`}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {list.map((q) => (
          <QuoteCard key={q.id} quote={q} favorited={favorites.includes(q.id)} onToggleFavorite={toggleFavorite} />
        ))}
        {list.length === 0 && (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-ink-500 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:text-ink-400 dark:ring-ink-800">
            No favorites saved yet — tap the heart on a quote you love. 💛
          </div>
        )}
      </div>
    </div>
  )
}
