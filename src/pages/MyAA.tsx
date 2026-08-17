import { useState } from 'react'
import CommitmentsSection from '../components/CommitmentsSection'
import MeetingNotesSection from '../components/MeetingNotesSection'
import ContactsSection from '../components/ContactsSection'

const tabs = [
  { id: 'commitments', label: 'Commitments' },
  { id: 'notes', label: 'Meeting Notes' },
  { id: 'contacts', label: 'Contacts' },
] as const

type TabId = (typeof tabs)[number]['id']

export default function MyAA() {
  const [tab, setTab] = useState<TabId>('commitments')

  return (
    <div className="px-4 pt-4">
      <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">My AA</h1>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
        Your commitments, notes, and people — private to this device.
      </p>

      <div className="mt-3 flex gap-1.5 rounded-full bg-ink-100 p-1 text-sm dark:bg-ink-900">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={[
              'flex-1 rounded-full py-1.5 text-xs font-semibold transition-colors sm:text-sm',
              tab === t.id
                ? 'bg-white text-ink-900 shadow-sm dark:bg-ink-800 dark:text-ink-50'
                : 'text-ink-500 dark:text-ink-400',
            ].join(' ')}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === 'commitments' && <CommitmentsSection />}
        {tab === 'notes' && <MeetingNotesSection />}
        {tab === 'contacts' && <ContactsSection />}
      </div>
    </div>
  )
}
