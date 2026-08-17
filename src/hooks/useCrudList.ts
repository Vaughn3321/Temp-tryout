import { useState } from 'react'
import { useLocalStorage } from './useLocalStorage'

interface WithId {
  id: string
}

/**
 * Shared add/edit/delete/form-toggle logic behind every "list of things with
 * a form" section (Commitments, Contacts, Meeting Notes, and future ones like
 * Sponsees or Steps). Each caller only supplies the form shape and how to
 * turn form values into a saved item — the open/edit/save/remove mechanics
 * are identical everywhere, so they live here once.
 */
export function useCrudList<T extends WithId, TForm>(
  storageKey: string,
  emptyForm: TForm,
  toFormValues: (item: T) => TForm,
  buildItem: (form: TForm, existing: T | null) => T | null,
) {
  const [items, setItems] = useLocalStorage<T[]>(storageKey, [])
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<TForm>(emptyForm)

  function openNew() {
    setForm(emptyForm)
    setEditingId(null)
    setFormOpen(true)
  }

  function openEdit(item: T) {
    setForm(toFormValues(item))
    setEditingId(item.id)
    setFormOpen(true)
  }

  function closeForm() {
    setFormOpen(false)
  }

  function save() {
    const existing = editingId ? (items.find((i) => i.id === editingId) ?? null) : null
    const built = buildItem(form, existing)
    if (!built) return
    if (editingId) {
      setItems((prev) => prev.map((i) => (i.id === editingId ? built : i)))
    } else {
      setItems((prev) => [built, ...prev])
    }
    setFormOpen(false)
  }

  function remove(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return { items, setItems, formOpen, editingId, form, setForm, openNew, openEdit, closeForm, save, remove }
}
