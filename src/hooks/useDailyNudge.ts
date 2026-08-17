import { useEffect, useRef, useState } from 'react'

type Permission = NotificationPermission | 'unsupported'

/**
 * Fires a browser Notification once a day at `time` while this tab is open.
 * Web push without a backend can't wake a closed tab — this is an honest,
 * client-only approximation, not a background push notification.
 */
export function useDailyNudge(enabled: boolean, time: string, getMessage: () => string) {
  const [permission, setPermission] = useState<Permission>(() =>
    typeof window === 'undefined' || typeof Notification === 'undefined' ? 'unsupported' : Notification.permission,
  )
  const lastFiredRef = useRef<string | null>(null)
  const getMessageRef = useRef(getMessage)
  getMessageRef.current = getMessage

  useEffect(() => {
    if (!enabled || permission !== 'granted') return
    const check = () => {
      const now = new Date()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      const todayKey = now.toDateString()
      if (currentTime === time && lastFiredRef.current !== todayKey) {
        lastFiredRef.current = todayKey
        new Notification('ODAAT', { body: getMessageRef.current() })
      }
    }
    check()
    const interval = setInterval(check, 20_000)
    return () => clearInterval(interval)
  }, [enabled, time, permission])

  async function requestPermission(): Promise<Permission> {
    if (typeof Notification === 'undefined') return 'unsupported'
    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }

  return { permission, requestPermission }
}
