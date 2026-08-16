import { useMemo, useState } from 'react'
import { allDays, allTags, type DayOfWeek } from '../data/meetings'
import MeetingCard from '../components/MeetingCard'
import { useLiveMeetings } from '../hooks/useLiveMeetings'
import { Search, RefreshCw, Settings2, X } from 'lucide-react'

const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as DayOfWeek

export default function Meetings() {
  const { meetings, status, errorMessage, sourceLabels, sources, setSources, refetch } = useLiveMeetings()
  const [day, setDay] = useState<DayOfWeek | 'All'>(today)
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set())
  const [query, setQuery] = useState('')
  const [sourcePanelOpen, setSourcePanelOpen] = useState(false)
  const [feedUrlDraft, setFeedUrlDraft] = useState(sources[0]?.feedUrl ?? '')

  function toggleTag(tag: string) {
    setActiveTags((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  function saveFeedUrl() {
    const url = feedUrlDraft.trim()
    if (!url) return
    setSources((prev) => (prev.length > 0 ? [{ ...prev[0], feedUrl: url }] : [{ id: 'custom', label: 'Custom feed', feedUrl: url }]))
    setSourcePanelOpen(false)
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
  }, [meetings, day, activeTags, query])

  return (
    <div className="px-4 pt-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
            Find a meeting
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            {filtered.length} meeting{filtered.length === 1 ? '' : 's'} match your filters.
          </p>
        </div>
        <button
          onClick={() => setSourcePanelOpen((v) => !v)}
          aria-label="Meeting data source settings"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-400 hover:bg-ink-900/5 dark:hover:bg-white/10"
        >
          <Settings2 size={16} />
        </button>
      </div>

      <div
        className={[
          'mt-3 flex items-center justify-between gap-2 rounded-2xl px-3.5 py-2.5 text-xs',
          status === 'live'
            ? 'bg-serenity-50 text-serenity-700 dark:bg-serenity-500/10 dark:text-serenity-300'
            : status === 'loading'
              ? 'bg-ink-100 text-ink-500 dark:bg-ink-900 dark:text-ink-400'
              : 'bg-sunrise-100 text-sunrise-800 dark:bg-sunrise-500/10 dark:text-sunrise-300',
        ].join(' ')}
      >
        <span>
          {status === 'live' && `Live from ${sourceLabels.join(', ')}`}
          {status === 'loading' && 'Checking for live meetings…'}
          {status === 'sample' && 'Showing sample data — no live feed configured'}
          {status === 'error' && `Showing sample data — live feed unavailable${errorMessage ? ` (${errorMessage})` : ''}`}
        </span>
        <button
          onClick={() => refetch()}
          aria-label="Retry live feed"
          className="flex shrink-0 items-center gap-1 font-medium underline underline-offset-2"
        >
          <RefreshCw size={12} /> Retry
        </button>
      </div>

      {sourcePanelOpen && (
        <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:ring-ink-800">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">Meeting feed URL</h3>
            <button onClick={() => setSourcePanelOpen(false)} aria-label="Close" className="text-ink-400">
              <X size={16} />
            </button>
          </div>
          <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
            Points at a Meeting Guide / TSML-format JSON feed from a local Intergroup. If live meetings
            aren't loading, double-check this URL from a browser.
          </p>
          <input
            value={feedUrlDraft}
            onChange={(e) => setFeedUrlDraft(e.target.value)}
            placeholder="https://example.org/meetings/?format=json&mode=meetings"
            className="mt-2 w-full rounded-xl bg-ink-50 p-2.5 text-xs text-ink-900 outline-none placeholder:text-ink-400 dark:bg-ink-800 dark:text-ink-100"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={saveFeedUrl}
              className="flex-1 rounded-xl bg-dusk-500 py-2 text-xs font-semibold text-white"
            >
              Save &amp; reload
            </button>
          </div>
        </div>
      )}

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
