import { useMemo, useState } from 'react'
import { meetings, allDays, allTags, type DayOfWeek, type MeetingTag } from '../data/meetings'
import MeetingCard from '../components/MeetingCard'
import { Search } from 'lucide-react'

const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as DayOfWeek

export default function Meetings() {
  const [day, setDay] = useState<DayOfWeek | 'All'>(today)
  const [activeTags, setActiveTags] = useState<Set<MeetingTag>>(new Set())
  const [query, setQuery] = useState('')

  function toggleTag(tag: MeetingTag) {
    setActiveTags((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  const filtered = useMemo(() => {
    return meetings
      .filter((m) => day === 'All' || m.day === day)
      .filter((m) => activeTags.size === 0 || m.tags.some((t) => activeTags.has(t)))
      .filter((m) =>
        query.trim() === ''
          ? true
          : (m.name + ' ' + m.locationName + ' ' + m.vibe).toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) => a.time.localeCompare(b.time))
  }, [day, activeTags, query])

  return (
    <div className="px-4 pt-4">
      <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
        Find a meeting
      </h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
        {filtered.length} meeting{filtered.length === 1 ? '' : 's'} match your filters.
      </p>

      <div className="mt-3 flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:ring-ink-800">
        <Search size={16} className="text-ink-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or vibe…"
          className="w-full bg-transparent text-sm text-ink-900 outline-none placeholder:text-ink-400 dark:text-ink-100"
        />
      </div>

      <div className="mt-3 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {(['All', ...allDays] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDay(d)}
            className={[
              'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
              day === d
                ? 'bg-dusk-500 text-white shadow-sm'
                : 'bg-white text-ink-600 ring-1 ring-ink-200/70 dark:bg-ink-900 dark:text-ink-300 dark:ring-ink-800',
            ].join(' ')}
          >
            {d === 'All' ? 'All days' : d.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={[
              'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
              activeTags.has(tag)
                ? 'bg-serenity-500 text-white'
                : 'bg-serenity-50 text-serenity-700 dark:bg-serenity-500/10 dark:text-serenity-300',
            ].join(' ')}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {filtered.map((m) => (
          <MeetingCard key={m.id} meeting={m} />
        ))}
        {filtered.length === 0 && (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-ink-500 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:text-ink-400 dark:ring-ink-800">
            No meetings match yet — try clearing a filter. 🔍
          </div>
        )}
      </div>
    </div>
  )
}
