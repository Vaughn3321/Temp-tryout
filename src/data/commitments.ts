export type CommitmentFrequency = 'Weekly' | 'Biweekly' | 'Monthly' | 'One-time'

export interface Commitment {
  id: string
  title: string
  meetingName: string
  day?: string
  time?: string
  frequency: CommitmentFrequency
  active: boolean
  notes: string
  createdAt: string
}
