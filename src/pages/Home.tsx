import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, NotebookPen } from 'lucide-react'
import { allDays, type DayOfWeek, type Meeting } from '../data/meetings'
import { quoteOfTheDay } from '../data/quotes'
import { inventoryPrompts, todayKey, type InventoryEntry } from '../data/inventory'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useLiveMeetings } from '../hooks/useLiveMeetings'
import { computeStreak } from '../lib/streak'
import StreakBadge from '../components/StreakBadge'
import QuoteCard from '../components/QuoteCard'
import MeetingCard from '../components/MeetingCard'

function timeToMinutes(time: string): number {
  const [, h, m, mer] = time.match(/(\d+):(\d+)\s?(AM|PM)/i) ?? []
  let hours = Number(h) % 12
  if (mer?.toUpperCase() === 'PM') hours += 12
  return hours * 60 + Number(m)
}

function useNextMeeting(meetings: Meeting[]) {
  return useMemo(() => {
    const now = new Date()
    const todayIndex = allDays.indexOf(
      now.toLocaleDateString('en-US', { weekday: 'long' }) as DayOfWeek,
    )
    const nowMinutes = now.getHours() * 60 + now.getMinutes()

    const withOffset = meetings.map((m) => {
      const dayIndex = allDays.indexOf(m.day)
      let dayOffset = (dayIndex - todayIndex + 7) % 7
      const minutes = timeToMinutes(m.time)
      if (dayOffset === 0 && minutes < nowMinutes) dayOffset = 7
      return { meeting: m, sortKey: dayOffset * 24 * 60 + minutes }
    })

    withOffset.sort((a, b) => a.sortKey - b.sortKey)
    return withOffset[0]?.meeting
  }, [meetings])
}

export default function Home() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('odaat:favorites', [])
  const [entries] = useLocalStorage<InventoryEntry[]>('odaat:entries', [])
  const { meetings } = useLiveMeetings()
  const streak = computeStreak(entries)
  const nextMeeting = useNextMeeting(meetings)
  const today = quoteOfTheDay()
  const checkedInToday = entries.some((e) => e.date === todayKey())

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  function toggleFavorite(id: string) {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  return (
    <div className="px-4 pt-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-500 dark:text-ink-400">{greeting} 👋</p>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
            One day at a time.
          </h1>
        </div>
        <StreakBadge streak={streak} />
      </div>

      <div className="mt-4">
        <Link to="/inspiration">
          <QuoteCard quote={today} favorited={favorites.includes(today.id)} onToggleFavorite={toggleFavorite} hero />
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Link
          to="/meetings"
          className="flex flex-col items-start gap-2 rounded-2xl bg-serenity-500 p-4 text-white shadow-sm transition-transform active:scale-[0.98]"
        >
          <MapPin size={20} />
          <span className="font-display text-sm font-semibold leading-tight">Find a meeting</span>
        </Link>
        <Link
          to="/step10"
          className="flex flex-col items-start gap-2 rounded-2xl bg-dusk-500 p-4 text-white shadow-sm transition-transform active:scale-[0.98]"
        >
          <NotebookPen size={20} />
          <span className="font-display text-sm font-semibold leading-tight">
            {checkedInToday ? "Add another check-in" : "Today's inventory"}
          </span>
        </Link>
      </div>

      {!checkedInToday && (
        <div className="mt-3 rounded-2xl bg-sunrise-100 p-3.5 text-sm text-sunrise-800 dark:bg-sunrise-500/10 dark:text-sunrise-300">
          You haven't checked in today — {inventoryPrompts.length} quick questions whenever you're ready. 🌙
        </div>
      )}

      {nextMeeting && (
        <div className="mt-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-700 dark:text-ink-300">Your next meeting</h2>
            <Link
              to="/meetings"
              className="flex items-center gap-1 text-xs font-medium text-dusk-600 dark:text-dusk-300"
            >
              See all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="mt-2">
            <MeetingCard meeting={nextMeeting} />
          </div>
        </div>
      )}
    </div>
  )
}
