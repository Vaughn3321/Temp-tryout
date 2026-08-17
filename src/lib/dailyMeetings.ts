import type { Meeting } from '../data/meetings'

/**
 * Adds a synthetic 'Daily' tag to meetings that occur every day of the
 * week under the same name, at the same location and time — a filter
 * users have specifically asked competitor apps for.
 */
export function withDailyTags(meetings: Meeting[]): Meeting[] {
  const groups = new Map<string, Meeting[]>()
  for (const m of meetings) {
    const key = `${m.name}|${m.locationName}|${m.time}`
    const group = groups.get(key)
    if (group) group.push(m)
    else groups.set(key, [m])
  }

  const dailyIds = new Set<string>()
  for (const group of groups.values()) {
    const days = new Set(group.map((m) => m.day))
    if (days.size === 7) {
      for (const m of group) dailyIds.add(m.id)
    }
  }

  if (dailyIds.size === 0) return meetings

  return meetings.map((m) =>
    dailyIds.has(m.id) && !m.tags.includes('Daily') ? { ...m, tags: [...m.tags, 'Daily'] } : m,
  )
}
