import { useCallback, useEffect, useState } from 'react'
import { sampleMeetings, type Meeting } from '../data/meetings'
import { defaultMeetingSources, type MeetingSource } from '../data/meetingSources'
import { fetchMeetingGuideFeed } from '../lib/meetingGuide'
import { useLocalStorage } from './useLocalStorage'

const CACHE_KEY = 'odaat:meetingsCache'
const CACHE_TTL_MS = 60 * 60 * 1000 // 1 hour

interface Cache {
  fetchedAt: number
  meetings: Meeting[]
  sourceLabels: string[]
}

export type MeetingsStatus = 'loading' | 'live' | 'sample' | 'error'

/**
 * Loads real meetings from the configured Meeting Guide feed(s), with a
 * 1-hour localStorage cache and an automatic, silent fallback to the
 * curated sample data if every feed is unreachable or empty.
 */
export function useLiveMeetings() {
  const [sources, setSources] = useLocalStorage<MeetingSource[]>('odaat:meetingSources', defaultMeetingSources)
  const [meetings, setMeetings] = useState<Meeting[]>(sampleMeetings)
  const [status, setStatus] = useState<MeetingsStatus>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [sourceLabels, setSourceLabels] = useState<string[]>([])

  const load = useCallback(
    async (force = false) => {
      if (sources.length === 0) {
        setMeetings(sampleMeetings)
        setSourceLabels([])
        setStatus('sample')
        return
      }

      if (!force) {
        try {
          const raw = window.localStorage.getItem(CACHE_KEY)
          if (raw) {
            const cache = JSON.parse(raw) as Cache
            if (Date.now() - cache.fetchedAt < CACHE_TTL_MS && cache.meetings.length > 0) {
              setMeetings(cache.meetings)
              setSourceLabels(cache.sourceLabels)
              setStatus('live')
              return
            }
          }
        } catch {
          // ignore corrupt cache and fall through to a fresh fetch
        }
      }

      setStatus('loading')
      setErrorMessage(null)

      const results = await Promise.allSettled(sources.map((s) => fetchMeetingGuideFeed(s.feedUrl, s.label)))

      const fetched: Meeting[] = []
      const okLabels: string[] = []
      const errors: string[] = []
      results.forEach((r, i) => {
        if (r.status === 'fulfilled' && r.value.length > 0) {
          fetched.push(...r.value)
          okLabels.push(sources[i].label)
        } else if (r.status === 'rejected') {
          errors.push(r.reason instanceof Error ? r.reason.message : String(r.reason))
        }
      })

      if (fetched.length > 0) {
        setMeetings(fetched)
        setSourceLabels(okLabels)
        setStatus('live')
        try {
          const cache: Cache = { fetchedAt: Date.now(), meetings: fetched, sourceLabels: okLabels }
          window.localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
        } catch {
          // storage unavailable — non-fatal, we just refetch next time
        }
      } else {
        setMeetings(sampleMeetings)
        setSourceLabels([])
        setStatus('error')
        setErrorMessage(errors[0] ?? 'Live meeting feed unavailable')
      }
    },
    [sources],
  )

  useEffect(() => {
    load()
    // `load` changes identity when `sources` changes, which is exactly when we want to refetch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sources])

  return {
    meetings,
    status,
    errorMessage,
    sourceLabels,
    sources,
    setSources,
    refetch: () => load(true),
  }
}
