export interface MeetingSource {
  id: string
  label: string
  feedUrl: string
}

/**
 * Best-effort defaults based on the documented Meeting Guide / TSML
 * convention (?format=json&mode=meetings appended to a site's meetings
 * page). Verify these in a real browser and adjust from the Meetings page
 * if either endpoint changes — the app falls back to sample data if a
 * source is unreachable, and other configured sources still load normally.
 */
export const defaultMeetingSources: MeetingSource[] = [
  {
    id: 'la-central-office',
    label: 'LA Central Office',
    feedUrl: 'https://lacoaa.org/meetings.php?format=json&mode=meetings',
  },
  {
    id: 'online-intergroup',
    label: 'Online Intergroup (worldwide)',
    feedUrl: 'https://aa-intergroup.org/meetings/?format=json&mode=meetings',
  },
]
