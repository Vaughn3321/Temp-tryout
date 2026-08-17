import type { DayOfWeek, Meeting } from '../data/meetings'

/**
 * Fields from the Meeting Guide API spec (code4recovery/spec) that we
 * actually use. The spec allows many more optional fields — anything we
 * don't read here is simply ignored.
 */
export interface MeetingGuideEntry {
  name: string
  slug?: string
  day?: number | number[] // 0 = Sunday .. 6 = Saturday
  time?: string // "HH:MM" 24-hour
  end_time?: string
  timezone?: string
  formatted_address?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
  latitude?: number
  longitude?: number
  types?: string[]
  notes?: string
  location?: string
  location_notes?: string
  conference_url?: string
  conference_url_notes?: string
  conference_phone?: string
  conference_phone_notes?: string
  group?: string
  updated?: string
}

const DAY_NAMES: DayOfWeek[] = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
]

/** Common Meeting Guide type codes we recognize; anything else passes through humanized. */
const TYPE_LABELS: Record<string, string> = {
  O: 'Open',
  C: 'Closed',
  D: 'Discussion',
  B: 'Big Book',
  BB: 'Big Book',
  SP: 'Speaker',
  ST: 'Step Study',
  BEG: 'Beginner',
  NEWCOMER: 'Beginner',
  W: 'Women',
  M: 'Men',
  ONL: 'Online',
  LGBTQ: 'LGBTQ+',
  Y: 'Young People',
  X: 'Wheelchair Access',
}

const EMOJI_BY_TYPE: Record<string, string> = {
  Speaker: '🎙️',
  Beginner: '🌱',
  Women: '💜',
  Men: '🛠️',
  Online: '💻',
  'Big Book': '📖',
  'LGBTQ+': '🏳️‍🌈',
  'Step Study': '🪜',
  'Young People': '✨',
}
const FALLBACK_EMOJIS = ['🌅', '🌊', '☕', '🕊️', '⚓', '🐢', '🧭']

function humanizeType(code: string): string {
  return TYPE_LABELS[code.toUpperCase()] ?? code
}

function pickEmoji(tags: string[], seed: string): string {
  for (const tag of tags) {
    if (EMOJI_BY_TYPE[tag]) return EMOJI_BY_TYPE[tag]
  }
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
  return FALLBACK_EMOJIS[hash % FALLBACK_EMOJIS.length]
}

function to12Hour(time?: string): string {
  if (!time) return ''
  const [hStr, mStr] = time.split(':')
  let hours = Number(hStr)
  const minutes = Number(mStr ?? 0)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time
  const suffix = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${hours}:${String(minutes).padStart(2, '0')} ${suffix}`
}

function minutesBetween(start?: string, end?: string): number {
  if (!start || !end) return 60
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  if ([sh, sm, eh, em].some((n) => Number.isNaN(n))) return 60
  const diff = eh * 60 + em - (sh * 60 + sm)
  return diff > 0 ? diff : 60
}

function buildAddress(entry: MeetingGuideEntry): string | undefined {
  if (entry.formatted_address) return entry.formatted_address
  const parts = [entry.address, entry.city, entry.state, entry.postal_code].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : undefined
}

/**
 * Converts one Meeting Guide spec entry into our internal Meeting shape.
 * A spec entry with an array `day` (meets on multiple days) expands into
 * one Meeting per day, matching how our UI groups by single day.
 */
export function normalizeMeetingGuideEntry(entry: MeetingGuideEntry, sourceLabel: string): Meeting[] {
  if (!entry.name || entry.day == null) return []

  const days = Array.isArray(entry.day) ? entry.day : [entry.day]
  const tags = (entry.types ?? []).map(humanizeType)
  const hasOnline = Boolean(entry.conference_url || entry.conference_phone)
  const hasAddress = Boolean(buildAddress(entry))
  const format: Meeting['format'] = hasOnline && hasAddress ? 'Hybrid' : hasOnline ? 'Online' : 'In Person'

  const address = buildAddress(entry)
  const locationName = hasAddress
    ? entry.location?.trim() || address || 'Location provided at meeting'
    : 'Online — link provided'

  const vibe = entry.notes?.trim() || entry.location_notes?.trim() || `${sourceLabel} meeting`

  return days
    .filter((d) => d >= 0 && d <= 6)
    .map((d) => {
      const id = `${sourceLabel}-${entry.slug ?? entry.name}-${d}-${entry.time ?? ''}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
      const meeting: Meeting = {
        id,
        name: entry.name,
        day: DAY_NAMES[d],
        time: to12Hour(entry.time),
        durationMin: minutesBetween(entry.time, entry.end_time),
        tags,
        format,
        locationName,
        address: hasAddress ? address : undefined,
        distanceMi: undefined,
        vibe,
        emoji: pickEmoji(tags, entry.slug ?? entry.name),
        conferenceUrl: entry.conference_url,
        conferencePhone: entry.conference_phone,
        source: sourceLabel,
      }
      return meeting
    })
}

export class MeetingGuideFetchError extends Error {}

/** Fetches and parses a Meeting Guide spec JSON feed. Throws on any failure — callers should catch and fall back. */
export async function fetchMeetingGuideFeed(feedUrl: string, sourceLabel: string): Promise<Meeting[]> {
  let response: Response
  try {
    response = await fetch(feedUrl, { headers: { Accept: 'application/json' } })
  } catch (err) {
    throw new MeetingGuideFetchError(`Network error reaching ${sourceLabel}: ${(err as Error).message}`)
  }
  if (!response.ok) {
    throw new MeetingGuideFetchError(`${sourceLabel} responded with ${response.status}`)
  }
  let data: unknown
  try {
    data = await response.json()
  } catch {
    throw new MeetingGuideFetchError(`${sourceLabel} did not return valid JSON`)
  }
  if (!Array.isArray(data)) {
    throw new MeetingGuideFetchError(`${sourceLabel} feed was not a JSON array of meetings`)
  }

  const meetings: Meeting[] = []
  for (const raw of data as MeetingGuideEntry[]) {
    try {
      meetings.push(...normalizeMeetingGuideEntry(raw, sourceLabel))
    } catch {
      // skip malformed individual entries rather than failing the whole feed
    }
  }
  return meetings
}
