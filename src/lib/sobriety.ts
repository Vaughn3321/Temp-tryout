/** Sobriety date counts as day 1, matching how it's usually counted in the rooms. */
export function daysSober(sobrietyDate: string, today: Date = new Date()): number {
  const start = new Date(`${sobrietyDate}T00:00:00`)
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const diffDays = Math.floor((now.getTime() - start.getTime()) / 86_400_000)
  return diffDays + 1
}

export function formatSobrietyLength(sobrietyDate: string, today: Date = new Date()): string {
  const days = daysSober(sobrietyDate, today)
  if (days <= 0) return 'Starting soon'
  if (days < 90) return `${days} day${days === 1 ? '' : 's'}`

  const start = new Date(`${sobrietyDate}T00:00:00`)
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  let years = now.getFullYear() - start.getFullYear()
  let months = now.getMonth() - start.getMonth()
  if (now.getDate() < start.getDate()) months -= 1
  if (months < 0) {
    years -= 1
    months += 12
  }

  if (years === 0) return `${months} month${months === 1 ? '' : 's'}`
  if (months === 0) return `${years} year${years === 1 ? '' : 's'}`
  return `${years} year${years === 1 ? '' : 's'}, ${months} month${months === 1 ? '' : 's'}`
}
