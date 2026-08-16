import { useState } from 'react'
import { Plus, Phone, Star, Pencil, Trash2, X, User } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { sampleMeetings as meetings } from '../data/meetings'
import { todayKey } from '../data/inventory'
import { contactTags, type Contact, type ContactTag } from '../data/contacts'

const meetingNames = meetings.map((m) => m.name)

const emptyForm = {
  name: '',
  phone: '',
  metAt: '',
  dateMet: todayKey(),
  tags: [] as ContactTag[],
  notes: '',
}

export default function ContactsSection() {
  const [contacts, setContacts] = useLocalStorage<Contact[]>('odaat:contacts', [])
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)

  function openNew() {
    setForm(emptyForm)
    setEditingId(null)
    setFormOpen(true)
  }

  function openEdit(c: Contact) {
    setForm({
      name: c.name,
      phone: c.phone ?? '',
      metAt: c.metAt,
      dateMet: c.dateMet,
      tags: c.tags,
      notes: c.notes,
    })
    setEditingId(c.id)
    setFormOpen(true)
  }

  function toggleTag(tag: ContactTag) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }))
  }

  function save() {
    if (!form.name.trim()) return
    if (editingId) {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                name: form.name.trim(),
                phone: form.phone.trim() || undefined,
                metAt: form.metAt.trim(),
                dateMet: form.dateMet,
                tags: form.tags,
                notes: form.notes.trim(),
              }
            : c,
        ),
      )
    } else {
      const contact: Contact = {
        id: crypto.randomUUID(),
        name: form.name.trim(),
        phone: form.phone.trim() || undefined,
        metAt: form.metAt.trim(),
        dateMet: form.dateMet,
        tags: form.tags,
        notes: form.notes.trim(),
        pinned: false,
        createdAt: new Date().toISOString(),
      }
      setContacts((prev) => [contact, ...prev])
    }
    setFormOpen(false)
  }

  function remove(id: string) {
    setContacts((prev) => prev.filter((c) => c.id !== id))
  }

  function togglePin(id: string) {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)))
  }

  const sorted = [...contacts].sort((a, b) => Number(b.pinned) - Number(a.pinned) || a.name.localeCompare(b.name))

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-ink-500 dark:text-ink-400">
          People you've met — sponsors, sponsees, and friends in the rooms.
        </p>
        {!formOpen && (
          <button
            onClick={openNew}
            className="flex shrink-0 items-center gap-1 rounded-full bg-sunrise-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
          >
            <Plus size={14} /> Add
          </button>
        )}
      </div>

      {formOpen && (
        <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:ring-ink-800">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">
              {editingId ? 'Edit contact' : 'New contact'}
            </h3>
            <button onClick={() => setFormOpen(false)} aria-label="Close" className="text-ink-400">
              <X size={16} />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="block text-xs font-medium text-ink-500 dark:text-ink-400">
              Name
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="First name / initial"
                className="mt-1 w-full rounded-xl bg-ink-50 p-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-400 dark:bg-ink-800 dark:text-ink-100"
              />
            </label>
            <label className="block text-xs font-medium text-ink-500 dark:text-ink-400">
              Phone (optional)
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="(555) 555-0100"
                className="mt-1 w-full rounded-xl bg-ink-50 p-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-400 dark:bg-ink-800 dark:text-ink-100"
              />
            </label>
          </div>

          <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
            <label className="block text-xs font-medium text-ink-500 dark:text-ink-400">
              Met at
              <input
                value={form.metAt}
                onChange={(e) => setForm((f) => ({ ...f, metAt: e.target.value }))}
                list="meeting-names-contacts"
                placeholder="Which meeting?"
                className="mt-1 w-full rounded-xl bg-ink-50 p-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-400 dark:bg-ink-800 dark:text-ink-100"
              />
              <datalist id="meeting-names-contacts">
                {meetingNames.map((n) => (
                  <option key={n} value={n} />
                ))}
              </datalist>
            </label>
            <label className="block text-xs font-medium text-ink-500 dark:text-ink-400">
              Date met
              <input
                type="date"
                value={form.dateMet}
                onChange={(e) => setForm((f) => ({ ...f, dateMet: e.target.value }))}
                className="mt-1 rounded-xl bg-ink-50 p-2.5 text-sm text-ink-900 outline-none dark:bg-ink-800 dark:text-ink-100"
              />
            </label>
          </div>

          <div className="mt-3">
            <p className="text-xs font-medium text-ink-500 dark:text-ink-400">Tags</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {contactTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={[
                    'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                    form.tags.includes(tag)
                      ? 'bg-sunrise-500 text-white'
                      : 'bg-sunrise-50 text-sunrise-700 dark:bg-sunrise-500/10 dark:text-sunrise-300',
                  ].join(' ')}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <label className="mt-3 block text-xs font-medium text-ink-500 dark:text-ink-400">
            Notes
            <textarea
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              rows={3}
              placeholder="How you know them, sober time, anything worth remembering…"
              className="mt-1 w-full resize-none rounded-xl bg-ink-50 p-2.5 text-sm text-ink-900 outline-none placeholder:text-ink-400 dark:bg-ink-800 dark:text-ink-100"
            />
          </label>

          <button
            onClick={save}
            className="mt-3 w-full rounded-xl bg-sunrise-500 py-2.5 text-sm font-semibold text-white shadow-sm active:scale-[0.98]"
          >
            {editingId ? 'Save changes' : 'Add contact'}
          </button>
        </div>
      )}

      <div className="mt-3 flex flex-col gap-2.5">
        {sorted.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:ring-ink-800"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sunrise-100 text-sunrise-600 dark:bg-sunrise-500/15 dark:text-sunrise-300">
                <User size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">{c.name}</h3>
                  <div className="flex items-center gap-1">
                    {c.phone && (
                      <a
                        href={`tel:${c.phone}`}
                        aria-label={`Call ${c.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-serenity-100 text-serenity-600 dark:bg-serenity-500/15 dark:text-serenity-300"
                      >
                        <Phone size={13} />
                      </a>
                    )}
                    <button
                      onClick={() => togglePin(c.id)}
                      aria-label={c.pinned ? 'Unpin contact' : 'Pin contact'}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-ink-400 hover:bg-ink-900/5 dark:hover:bg-white/10"
                    >
                      <Star size={15} className={c.pinned ? 'fill-sunrise-400 text-sunrise-400' : ''} />
                    </button>
                  </div>
                </div>
                <p className="mt-0.5 text-xs text-ink-500 dark:text-ink-400">
                  {c.metAt || 'Met somewhere along the way'}
                  {c.phone ? ` · ${c.phone}` : ''}
                </p>
                {c.tags.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {c.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-medium text-ink-600 dark:bg-ink-800 dark:text-ink-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
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
            No contacts yet — save someone's name and number after your next meeting. 📇
          </div>
        )}
      </div>
    </div>
  )
}
