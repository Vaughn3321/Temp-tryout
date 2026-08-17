/**
 * Central registry of every localStorage key this app uses.
 *
 * Add new keys here rather than hardcoding string literals at call sites —
 * this is the one place that needs to know about a future shape change if we
 * ever need to migrate someone's existing local data. It also drives
 * export/import (lib/backup.ts), since there's no server to enumerate a
 * user's data from.
 */

export const STORAGE_VERSION = 1

export const storeKeys = {
  favorites: 'odaat:favorites',
  entries: 'odaat:entries',
  commitments: 'odaat:commitments',
  meetingNotes: 'odaat:meetingNotes',
  contacts: 'odaat:contacts',
  meetingSources: 'odaat:meetingSources',
  meetingsCache: 'odaat:meetingsCache',
  dark: 'odaat:dark',
  notifTime: 'odaat:notifTime',
  notifOn: 'odaat:notifOn',
  recoveryProfile: 'odaat:recoveryProfile',
} as const

export type StoreKey = (typeof storeKeys)[keyof typeof storeKeys]

/** Every key above — used to enumerate all local data for export/import. */
export const allStoreKeys: StoreKey[] = Object.values(storeKeys)
