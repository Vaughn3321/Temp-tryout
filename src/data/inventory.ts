export interface InventoryPrompt {
  id: string
  question: string
  hint: string
  emoji: string
}

export const inventoryPrompts: InventoryPrompt[] = [
  {
    id: 'resentment',
    question: 'Did I carry any resentment, anger, or irritation today?',
    hint: 'Who or what triggered it — and what was underneath it?',
    emoji: '😤',
  },
  {
    id: 'fear',
    question: 'Did fear or anxiety steer any of my choices today?',
    hint: 'What were you actually afraid of losing or facing?',
    emoji: '😰',
  },
  {
    id: 'selfishness',
    question: 'Was I self-centered, or did I put myself ahead of others in a way I regret?',
    hint: 'No judgment — just notice it.',
    emoji: '🪞',
  },
  {
    id: 'dishonesty',
    question: 'Was I dishonest with myself or anyone else today, even in a small way?',
    hint: 'Half-truths and things left unsaid count too.',
    emoji: '🎭',
  },
  {
    id: 'amends',
    question: 'Do I owe anyone an apology, or is there something I should make right?',
    hint: 'It can wait until tomorrow — just name it here.',
    emoji: '🤲',
  },
  {
    id: 'kindness',
    question: 'Where was I kind, patient, or genuinely helpful today?',
    hint: "Give yourself credit — this list isn't only about what went wrong.",
    emoji: '💛',
  },
  {
    id: 'gratitude',
    question: 'What are three things you are grateful for today?',
    hint: 'Big or tiny — a good coffee counts.',
    emoji: '🙏',
  },
  {
    id: 'tomorrow',
    question: 'What is one thing you want to carry into tomorrow?',
    hint: 'An intention, a boundary, or just a reminder to be gentle with yourself.',
    emoji: '🌅',
  },
]

export interface InventoryEntry {
  id: string
  date: string // YYYY-MM-DD
  timeOfDay: 'Morning' | 'Night'
  mood: number // 1-5
  answers: Record<string, string>
  createdAt: string // ISO
}

export function todayKey(d: Date = new Date()): string {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}
