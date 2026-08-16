import { useState } from 'react'
import { Plus, CalendarCheck, Pencil, Trash2, X } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { meetings, allDays, type DayOfWeek } from '../data/meetings'
import type { Commitment, CommitmentFrequency } from '../data/commitments'
import Toggle from './Toggle'

const frequencies: CommitmentFrequency[] = ['Weekly', 'Biweekly', 'Monthly', 'One-time']
const meetingNames = meetings.map((m) => m.name)

const emptyForm = {
  title: '',
  meetingName: '',
  day: '' as DayOfWeek | '',
  time: '',
  frequency: 'Weekly' as CommitmentFrequency,
  notes: '',
}

export default function CommitmentsSection() {
  const [commitments, setCommitments] = useLocalStorage<Commitment[]>('odaat:commitments', [])
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  function openNew() {
    setForm(emptyForm)
    setEditingId(null)
    setFormOpen(true)
  }

  function openEdit(c: Commitment) {
    setForm({
      title: c.title,
      meetingName: c.meetingName,
      day: (c.day as DayOfWeek) ?? '',
      time: c.time ?? '',
      frequency: c.frequency,
      notes: c.notes,
    })
    setEditingId(c.id)
    setFormOpen(true)
  }

  function save() {
    if (!form.title.trim()) return
    if (editingId) {
      setCommitments((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                title: form.title.trim(),
                meetingName: form.meetingName.trim(),
                day: form.day || undefined,
                time: form.time.trim() || undefined,
                frequency: form.frequency,
                notes: form.notes.trim(),
              }
            : c,
        ),
      )
    } else {
      const newCommitment: Commitment = {
        id: crypto.randomUUID(),
        title: form.title.trim(),
        meetingName: form.meetingName.trim(),
        day: form.day || undefined,
        time: form.time.trim() || undefined,
        frequency: form.frequency,
        active: true,
        notes: form.notes.trim(),
        createdAt: new Date().toISOString(),
      }
      setCommitments((prev) => [newCommitment, ...prev])
    }
    setFormOpen(false)
  }

  function remove(id: string) {
    setCommitments((prev) => prev.filter((c) => c.id !== id))
  }

  function toggleActive(id: string) {
    setCommitments((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))
  }

  const sorted = [...commitments].sort((a, b) => Number(b.active) - Number(a.active))

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-ink-500 dark:text-ink-400">
          Service commitments — what you signed up for, and what to remember about it.
        </p>
        {!formOpen && (
          <button
            onClick={openNew}
            className="flex shrink-0 items-center gap-1 rounded-full bg-serenity-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
          >
            <Plus size={14} /> Add
          </button>
        )}
      </div>

      {formOpen && (
        <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:ring-ink-800">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">
              {editingId ? 'Edit commitment' : 'New commitment'}
            </h3>
            <button onClick={() => setFormOpen(false)} aria-label="Close" className="text-ink-400">
              <X size={16} />
            </button>
          </div>

          <label className="mt-3 block text-xs font-medium text-ink-500 dark:text-ink-400">
            What's the commitment?
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Coffee maker, Secretary, GSR"
              className="mt-1 w-full rounded-xl bg-ink-50 p-2.5 text-sm text-ink-900 outline-none ring-1 ring-transparent placeholder:text-ink-400 focus:ring-serenity-400 dark:bg-ink-800 dark:text-ink-100"
            />
          </label>

          <label className="mt-3 block text-xs font-medium text-ink-500 dark:text-ink-400">
            Meeting
            <input
              value={form.meetingName}
              onChange={(e) => setForm((f) => ({ ...f, meetingName: e.target.value }))}
              list="meeting-names"
              placeholder="Which meeting is this for?"
              className="mt-1 w-full rounded-xl bg-ink-50 p-2.5 text-sm text-ink-900 outline-none ring-1 ring-transparent placeholder:text-ink-400 focus:ring-serenity-400 dark:bg-ink-800 dark:text-ink-100"
            />
            <datalist id="meeting-names">
              {meetingNames.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
          </label>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="block text-xs font-medium text-ink-500 dark:text-ink-400">
              Day (optional)
              <select
                value={form.day}
                onChange={(e) => setForm((f) => ({ ...f, day: e.target.value as DayOfWeek | '' }))}
                className="mt-1 w-full rounded-xl bg-ink-50 p-2.5 text-sm text-ink-900 outline-none dark:bg-ink-800 dark:text-ink-100"
              >
                <option value="">—</option>
                {allDays.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-xs font-medium text-ink-500 dark:text-ink-400">
              Time (optional)
              <input
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                placeholder="7:00 PM"
                className="mt-1 w-full rounded-xl bg-ink-50 p-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-400 dark:bg-ink-800 dark:text-ink-100"
              />
            </label>
          </div>

          <label className="mt-3 block text-xs font-medium text-ink-500 dark:text-ink-400">
            How often?
            <select
              value={form.frequency}
              onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value as CommitmentFrequency }))}
              className="mt-1 w-full rounded-xl bg-ink-50 p-2.5 text-sm text-ink-900 outline-none dark:bg-ink-800 dark:text-ink-100"
            >
              {frequencies.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </label>

          <label className="mt-3 block text-xs font-medium text-ink-500 dark:text-ink-400">
            Notes
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              placeholder="What do you need to remember — supplies, who to hand off to, key info…"
              className="mt-1 w-full resize-none rounded-xl bg-ink-50 p-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-400 dark:bg-ink-800 dark:text-ink-100"
            />
          </label>

          <button
            onClick={save}
            className="mt-3 w-full rounded-xl bg-serenity-500 py-2.5 text-sm font-semibold text-white shadow-sm active:scale-[0.98]"
          >
            {editingId ? 'Save changes' : 'Add commitment'}
          </button>
        </div>
      )}

      <div className="mt-3 flex flex-col gap-2.5">
        {sorted.map((c) => (
          <div
            key={c.id}
            className={[
              'rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:ring-ink-800',
              c.active ? '' : 'opacity-60',
            ].join(' ')}
          >
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-serenity-100 text-serenity-600 dark:bg-serenity-500/15 dark:text-serenity-300">
                <CalendarCheck size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">
                    {c.title}
                  </h3>
                  <Toggle checked={c.active} onChange={() => toggleActive(c.id)} activeClassName="bg-serenity-500" label="Active" />
                </div>
                <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
                  {c.meetingName || 'No meeting set'}
                  {c.day ? ` · ${c.day}` : ''}
                  {c.time ? ` · ${c.time}` : ''}
                </p>
                <span className="mt-1.5 inline-block rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                  {c.frequency}
                </span>
                {c.notes && <p className="mt-2 text-sm text-ink-700 dark:text-ink-300">{c.notes}</p>}
                <div className="mt-2 flex gap-3">
                  <button
                    onClick={() => openEdit(c)}
                    className="flex items-center gap-1 text-xs font-medium text-dusk-600 dark:text-dusk-300"
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => remove(c.id)}
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
            No commitments yet — track what you signed up for. 📋
          </div>
        )}
      </div>
    </div>
  )
}
