export type ContactTag = 'Sponsor' | 'Sponsee' | 'Home Group' | 'Friend' | 'Service'

export const contactTags: ContactTag[] = ['Sponsor', 'Sponsee', 'Home Group', 'Friend', 'Service']

export interface Contact {
  id: string
  name: string
  phone?: string
  metAt: string
  dateMet: string
  tags: ContactTag[]
  notes: string
  pinned: boolean
  createdAt: string
}
