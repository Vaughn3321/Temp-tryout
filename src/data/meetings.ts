export type MeetingTag =
  | 'Open'
  | 'Closed'
  | 'Speaker'
  | 'Discussion'
  | 'Big Book'
  | "Women"
  | "Men"
  | 'LGBTQ+'
  | 'Beginner'
  | 'Online'
  | 'In Person'

export type DayOfWeek =
  | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday'
  | 'Thursday' | 'Friday' | 'Saturday'

export interface Meeting {
  id: string
  name: string
  day: DayOfWeek
  time: string // "7:00 AM"
  durationMin: number
  tags: MeetingTag[]
  format: 'In Person' | 'Online' | 'Hybrid'
  locationName: string
  address?: string
  distanceMi?: number
  vibe: string // one-line "hip" description
  emoji: string
}

export const meetings: Meeting[] = [
  {
    id: 'm1',
    name: 'Sunrise Sobriety',
    day: 'Monday',
    time: '6:30 AM',
    durationMin: 60,
    tags: ['Open', 'Discussion', 'Beginner'],
    format: 'In Person',
    locationName: 'Maple Street Church Annex',
    address: '214 Maple St, Room B',
    distanceMi: 0.6,
    vibe: 'Coffee, sunrise views, and honest talk before the day gets loud.',
    emoji: '🌅',
  },
  {
    id: 'm2',
    name: 'Steady As She Goes',
    day: 'Monday',
    time: '12:00 PM',
    durationMin: 45,
    tags: ['Closed', 'Big Book'],
    format: 'In Person',
    locationName: 'Downtown Library, Room 204',
    address: '88 Court Ave',
    distanceMi: 1.4,
    vibe: 'Lunch-break Big Book study for the working crowd.',
    emoji: '📖',
  },
  {
    id: 'm3',
    name: 'Night Owls',
    day: 'Monday',
    time: '9:00 PM',
    durationMin: 60,
    tags: ['Open', 'Discussion', 'Online'],
    format: 'Online',
    locationName: 'Zoom — link on RSVP',
    distanceMi: undefined,
    vibe: 'Late-night check-in for anyone whose brain gets loud after dark.',
    emoji: '🦉',
  },
  {
    id: 'm4',
    name: 'Riverside Fellowship',
    day: 'Tuesday',
    time: '7:00 PM',
    durationMin: 60,
    tags: ['Open', 'Speaker'],
    format: 'In Person',
    locationName: 'Riverside Community Center',
    address: '1900 Riverside Dr',
    distanceMi: 2.1,
    vibe: 'A speaker meeting with genuinely great stories. Bring tissues.',
    emoji: '🌊',
  },
  {
    id: 'm5',
    name: 'Ladies of the Lake',
    day: 'Tuesday',
    time: '10:00 AM',
    durationMin: 60,
    tags: ['Closed', 'Women', 'Discussion'],
    format: 'In Person',
    locationName: 'Lakeside Wellness Center',
    address: '47 Lake Shore Blvd',
    distanceMi: 3.3,
    vibe: 'Women-only circle — warm, funny, and no-BS.',
    emoji: '💜',
  },
  {
    id: 'm6',
    name: 'New Day Beginners',
    day: 'Wednesday',
    time: '6:00 PM',
    durationMin: 60,
    tags: ['Open', 'Beginner', 'Discussion'],
    format: 'Hybrid',
    locationName: "St. Andrew's Fellowship Hall",
    address: '312 Chapel Row',
    distanceMi: 0.9,
    vibe: 'Built for people in their first 90 days. Zero judgment, all questions welcome.',
    emoji: '🌱',
  },
  {
    id: 'm7',
    name: 'Pride & Progress',
    day: 'Wednesday',
    time: '8:00 PM',
    durationMin: 60,
    tags: ['Open', 'LGBTQ+', 'Discussion'],
    format: 'In Person',
    locationName: 'Union Square Center',
    address: '5 Union Sq',
    distanceMi: 1.8,
    vibe: 'A proudly queer meeting focused on authenticity over perfection.',
    emoji: '🏳️‍🌈',
  },
  {
    id: 'm8',
    name: 'Midday Reset',
    day: 'Thursday',
    time: '12:15 PM',
    durationMin: 45,
    tags: ['Open', 'Discussion', 'Online'],
    format: 'Online',
    locationName: 'Zoom — link on RSVP',
    distanceMi: undefined,
    vibe: 'A quick recharge between meetings — literally and figuratively.',
    emoji: '☕',
  },
  {
    id: 'm9',
    name: 'Old Timers & New Faces',
    day: 'Thursday',
    time: '7:30 PM',
    durationMin: 75,
    tags: ['Open', 'Speaker', 'Big Book'],
    format: 'In Person',
    locationName: 'Veterans Memorial Hall',
    address: '600 Liberty Ave',
    distanceMi: 4.0,
    vibe: 'Decades of experience in the room, told with a sense of humor.',
    emoji: '🎙️',
  },
  {
    id: 'm10',
    name: 'Men Working It',
    day: 'Friday',
    time: '6:30 AM',
    durationMin: 60,
    tags: ['Closed', 'Men', 'Discussion'],
    format: 'In Person',
    locationName: 'Ironworks Gym Community Room',
    address: '77 Foundry St',
    distanceMi: 2.6,
    vibe: 'Early, direct, and no-nonsense — in and out before work.',
    emoji: '🛠️',
  },
  {
    id: 'm11',
    name: 'Friday Night Lights',
    day: 'Friday',
    time: '8:00 PM',
    durationMin: 60,
    tags: ['Open', 'Speaker'],
    format: 'In Person',
    locationName: 'Riverside Community Center',
    address: '1900 Riverside Dr',
    distanceMi: 2.1,
    vibe: 'The biggest meeting of the week — packed room, big energy, good snacks.',
    emoji: '✨',
  },
  {
    id: 'm12',
    name: 'Saturday Slow Down',
    day: 'Saturday',
    time: '9:00 AM',
    durationMin: 60,
    tags: ['Open', 'Discussion', 'Beginner'],
    format: 'In Person',
    locationName: 'Maple Street Church Annex',
    address: '214 Maple St, Room B',
    distanceMi: 0.6,
    vibe: 'A gentle weekend start — good for anyone still finding their footing.',
    emoji: '🐢',
  },
  {
    id: 'm13',
    name: 'Serenity Sunday',
    day: 'Sunday',
    time: '10:30 AM',
    durationMin: 60,
    tags: ['Open', 'Discussion', 'Online'],
    format: 'Hybrid',
    locationName: "St. Andrew's Fellowship Hall + Zoom",
    address: '312 Chapel Row',
    distanceMi: 0.9,
    vibe: 'Grounding before the week resets. Join in person or from the couch.',
    emoji: '🕊️',
  },
  {
    id: 'm14',
    name: 'Sunday Night Anchor',
    day: 'Sunday',
    time: '8:30 PM',
    durationMin: 60,
    tags: ['Open', 'Discussion', 'Online'],
    format: 'Online',
    locationName: 'Zoom — link on RSVP',
    distanceMi: undefined,
    vibe: 'The last stop before Monday — a solid anchor to close the week.',
    emoji: '⚓',
  },
]

export const allDays: DayOfWeek[] = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
]

export const allTags: MeetingTag[] = [
  'Open', 'Closed', 'Speaker', 'Discussion', 'Big Book',
  'Women', 'Men', 'LGBTQ+', 'Beginner', 'Online', 'In Person',
]
