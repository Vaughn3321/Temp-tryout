import type { InventoryEntry } from '../data/inventory'

/** Counts consecutive days (ending today or yesterday) that have at least one entry. */
export function computeStreak(entries: InventoryEntry[]): number {
  if (entries.length === 0) return 0

  const dateKeys = new Set(entries.map((e) => e.date))
  const cursor = new Date()
  let streak = 0

  // Allow the streak to still "count" if today has no entry yet but yesterday does.
  const todayKey = formatKey(cursor)
  if (!dateKeys.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1)
  }

  while (dateKeys.has(formatKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

function formatKey(d: Date): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
