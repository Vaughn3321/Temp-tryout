export interface MeetingSource {
  id: string
  label: string
  feedUrl: string
}

/**
 * Best-effort default based on the documented Meeting Guide / TSML
 * convention (?format=json&mode=meetings appended to a site's meetings
 * page). Verify this in a real browser and adjust from the Meetings page
 * if the LA Central Office changes their endpoint.
 */
export const defaultMeetingSources: MeetingSource[] = [
  {
    id: 'la-central-office',
    label: 'LA Central Office',
    feedUrl: 'https://lacoaa.org/meetings.php?format=json&mode=meetings',
  },
]
