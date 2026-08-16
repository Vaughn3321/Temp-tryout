import { Link, Outlet } from 'react-router-dom'
import { Moon, ShieldCheck, Sun } from 'lucide-react'
import BottomNav from './components/BottomNav'
import { useDarkMode } from './hooks/useDarkMode'

export default function App() {
  const [dark, setDark] = useDarkMode()

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col bg-sunrise-50 dark:bg-ink-950">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink-200/60 bg-sunrise-50/85 px-4 py-3 backdrop-blur-md dark:border-ink-800 dark:bg-ink-950/85">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-sunrise-400 to-dusk-500 text-base shadow-sm">
            ☀️
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-ink-900 dark:text-ink-50">
            ODAAT
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Link
            to="/privacy"
            aria-label="Privacy & trust"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-900/5 dark:text-ink-300 dark:hover:bg-white/10"
          >
            <ShieldCheck size={18} />
          </Link>
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle dark mode"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-ink-900/5 dark:text-ink-300 dark:hover:bg-white/10"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main className="flex-1 pb-4">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
