import { storeKeys } from '../data/store'
import { useState } from 'react'
import { Plus, StickyNote, Pencil, Trash2, X } from 'lucide-react'
import { useCrudList } from '../hooks/useCrudList'
import { sampleMeetings as meetings } from '../data/meetings'
import { todayKey } from '../data/inventory'
import type { MeetingNote } from '../data/meetingNotes'
import VibePicker, { vibes } from './VibePicker'

const meetingNames = meetings.map((m) => m.name)
const countWindows = [7, 30, 90] as const

const emptyForm = {
  meetingName: '',
  date: todayKey(),
  vibe: 3,
  note: '',
}

type MeetingNoteForm = typeof emptyForm

function countInWindow(notes: MeetingNote[], days: number): number {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const cutoffKey = todayKey(cutoff)
  return notes.filter((n) => n.date >= cutoffKey).length
}

export default function MeetingNotesSection() {
  const { items: notes, formOpen, editingId, form, setForm, openNew, openEdit, closeForm, save, remove } =
    useCrudList<MeetingNote, MeetingNoteForm>(
      storeKeys.meetingNotes,
      emptyForm,
      (n) => ({ meetingName: n.meetingName, date: n.date, vibe: n.vibe, note: n.note }),
      (f, existing) => {
        if (!f.meetingName.trim()) return null
        const shared = { meetingName: f.meetingName.trim(), date: f.date, vibe: f.vibe, note: f.note.trim() }
        return existing
          ? { ...existing, ...shared }
          : { id: crypto.randomUUID(), ...shared, createdAt: new Date().toISOString() }
      },
    )
  const [countWindow, setCountWindow] = useState<(typeof countWindows)[number]>(30)

  const sorted = [...notes].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-ink-500 dark:text-ink-400">
          A running log of meetings you've been to — what came up, what stuck.
        </p>
        {!formOpen && (
          <button
            onClick={openNew}
            className="flex shrink-0 items-center gap-1 rounded-full bg-dusk-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
          >
            <Plus size={14} /> Add
          </button>
        )}
      </div>

      <div className="mt-3 rounded-2xl bg-dusk-500 p-4 text-white shadow-sm">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-semibold">{countInWindow(notes, countWindow)}</span>
          <span className="text-sm text-dusk-100">meetings in the last {countWindow} days</span>
        </div>
        <div className="mt-3 flex gap-1.5 rounded-full bg-white/15 p-1 text-xs">
          {countWindows.map((w) => (
            <button
              key={w}
              onClick={() => setCountWindow(w)}
              className={[
                'flex-1 rounded-full py-1.5 font-semibold transition-colors',
                countWindow === w ? 'bg-white text-dusk-700' : 'text-white/80',
              ].join(' ')}
            >
              {w} days
            </button>
          ))}
        </div>
      </div>

      {formOpen && (
        <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:ring-ink-800">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">
              {editingId ? 'Edit note' : 'New meeting note'}
            </h3>
            <button onClick={closeForm} aria-label="Close" className="text-ink-400">
              <X size={16} />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <label className="block text-xs font-medium text-ink-500 dark:text-ink-400">
              Meeting
              <input
                value={form.meetingName}
                onChange={(e) => setForm((f) => ({ ...f, meetingName: e.target.value }))}
                list="meeting-names-notes"
                placeholder="Which meeting?"
                className="mt-1 w-full rounded-xl bg-ink-50 p-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-400 dark:bg-ink-800 dark:text-ink-100"
              />
              <datalist id="meeting-names-notes">
                {meetingNames.map((n) => (
                  <option key={n} value={n} />
                ))}
              </datalist>
            </label>
            <label className="block text-xs font-medium text-ink-500 dark:text-ink-400">
              Date
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="mt-1 rounded-xl bg-ink-50 p-2.5 text-sm text-ink-900 outline-none dark:bg-ink-800 dark:text-ink-100"
              />
            </label>
          </div>

          <div className="mt-3">
            <p className="text-xs font-medium text-ink-500 dark:text-ink-400">How was it?</p>
            <div className="mt-1">
              <VibePicker value={form.vibe} onChange={(v) => setForm((f) => ({ ...f, vibe: v }))} />
            </div>
          </div>

          <label className="mt-3 block text-xs font-medium text-ink-500 dark:text-ink-400">
            Notes
            <textarea
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              rows={3}
              placeholder="Topic, a share that hit home, someone to follow up with…"
              className="mt-1 w-full resize-none rounded-xl bg-ink-50 p-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-400 dark:bg-ink-800 dark:text-ink-100"
            />
          </label>

          <button
            onClick={save}
            className="mt-3 w-full rounded-xl bg-dusk-500 py-2.5 text-sm font-semibold text-white shadow-sm active:scale-[0.98]"
          >
            {editingId ? 'Save changes' : 'Add note'}
          </button>
        </div>
      )}

      <div className="mt-3 flex flex-col gap-2.5">
        {sorted.map((n) => (
          <div
            key={n.id}
            className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:ring-ink-800"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-dusk-100 text-dusk-600 dark:bg-dusk-500/15 dark:text-dusk-300">
                <StickyNote size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">
                    {n.meetingName}
                  </h3>
                  <span className="text-lg leading-none">{vibes.find((v) => v.value === n.vibe)?.emoji}</span>
                </div>
                <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
                  {new Date(`${n.date}T00:00:00`).toLocaleDateString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
                {n.note && <p className="mt-2 text-sm text-ink-700 dark:text-ink-300">{n.note}</p>}
                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => openEdit(n)}
                    className="flex items-center gap-1 text-xs font-medium text-dusk-600 dark:text-dusk-300"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => remove(n.id)}
                    className="flex items-center gap-1 text-xs font-medium text-sunrise-600 dark:text-sunrise-400"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {sorted.length === 0 && !formOpen && (
          <div className="rounded-2xl bg-white p-6 text-center text-sm text-ink-500 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:text-ink-400 dark:ring-ink-800">
            No meeting notes yet. Log your first one after your next meeting. 📝
          </div>
        )}
      </div>
    </div>
  )
}
