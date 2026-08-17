import { MapPin, Clock, Video, ExternalLink, CalendarPlus } from 'lucide-react'
import type { Meeting } from '../data/meetings'
import { formatDuration } from '../lib/time'
import { downloadMeetingIcs } from '../lib/calendar'

export default function MeetingCard({ meeting }: { meeting: Meeting }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:ring-ink-800">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-serenity-100 text-lg dark:bg-serenity-500/15">
          {meeting.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate font-display text-base font-semibold text-ink-900 dark:text-ink-50">
              {meeting.name}
            </h3>
            {meeting.distanceMi != null && (
              <span className="shrink-0 text-xs font-medium text-ink-400">
                {meeting.distanceMi} mi
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-ink-500 dark:text-ink-400">{meeting.vibe}</p>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500 dark:text-ink-400">
            <span className="flex items-center gap-1">
              <Clock size={13} /> {meeting.day} · {meeting.time} · {formatDuration(meeting.durationMin)}
            </span>
            <span className="flex items-center gap-1">
              {meeting.format === 'Online' ? <Video size={13} /> : <MapPin size={13} />}
              {meeting.locationName}
            </span>
          </div>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {meeting.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {meeting.conferenceUrl && (
              <a
                href={meeting.conferenceUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 text-xs font-semibold text-dusk-600 dark:text-dusk-300"
              >
                <ExternalLink size={12} /> Join online
              </a>
            )}
            <button
              type="button"
              onClick={() => downloadMeetingIcs(meeting)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-serenity-600 dark:text-serenity-300"
            >
              <CalendarPlus size={12} /> Add to calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
