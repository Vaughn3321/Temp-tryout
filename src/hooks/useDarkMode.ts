import { storeKeys } from '../data/store'
import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export function useDarkMode() {
  const [dark, setDark] = useLocalStorage<boolean>(
    storeKeys.dark,
    window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false,
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  return [dark, setDark] as const
}
