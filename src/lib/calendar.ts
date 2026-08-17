import type { DayOfWeek, Meeting } from '../data/meetings'

const DAY_TO_ICS: Record<DayOfWeek, string> = {
  Sunday: 'SU',
  Monday: 'MO',
  Tuesday: 'TU',
  Wednesday: 'WE',
  Thursday: 'TH',
  Friday: 'FR',
  Saturday: 'SA',
}

const DAY_INDEX: Record<DayOfWeek, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
}

function parseTimeTo24h(time: string): { hours: number; minutes: number } {
  const match = time.match(/(\d+):(\d+)\s?(AM|PM)/i)
  if (!match) return { hours: 19, minutes: 0 }
  let hours = Number(match[1]) % 12
  const minutes = Number(match[2])
  if (match[3].toUpperCase() === 'PM') hours += 12
  return { hours, minutes }
}

function nextOccurrence(day: DayOfWeek, hours: number, minutes: number): Date {
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0, 0)
  let diff = (DAY_INDEX[day] - now.getDay() + 7) % 7
  if (diff === 0 && target < now) diff = 7
  target.setDate(target.getDate() + diff)
  return target
}

function formatIcsLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
}

function formatIcsUtc(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
}

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

/** Builds an RFC 5545 .ics file for a meeting, recurring weekly on its day. */
export function buildMeetingIcs(meeting: Meeting): string {
  const { hours, minutes } = parseTimeTo24h(meeting.time)
  const start = nextOccurrence(meeting.day, hours, minutes)
  const end = new Date(start.getTime() + meeting.durationMin * 60000)

  const location = meeting.conferenceUrl || meeting.address || meeting.locationName
  const descriptionParts = [meeting.vibe]
  if (meeting.conferenceUrl) descriptionParts.push(`Join online: ${meeting.conferenceUrl}`)

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ODAAT//Meeting Export//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${meeting.id}@odaat.app`,
    `DTSTAMP:${formatIcsUtc(new Date())}`,
    `DTSTART:${formatIcsLocal(start)}`,
    `DTEND:${formatIcsLocal(end)}`,
    `RRULE:FREQ=WEEKLY;BYDAY=${DAY_TO_ICS[meeting.day]}`,
    `SUMMARY:${escapeIcsText(meeting.name)}`,
    `DESCRIPTION:${escapeIcsText(descriptionParts.join('\n'))}`,
    `LOCATION:${escapeIcsText(location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.join('\r\n')
}

export function downloadMeetingIcs(meeting: Meeting) {
  const ics = buildMeetingIcs(meeting)
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${meeting.name.replace(/[^a-z0-9]+/gi, '-')}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
