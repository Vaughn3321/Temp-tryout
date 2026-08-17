import { NavLink } from 'react-router-dom'
import { Home, MapPin, Sparkles, NotebookPen, Users } from 'lucide-react'

const tabs = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/meetings', label: 'Meetings', icon: MapPin, end: false },
  { to: '/inspiration', label: 'Inspire', icon: Sparkles, end: false },
  { to: '/step10', label: 'Step 10', icon: NotebookPen, end: false },
  { to: '/my-aa', label: 'My AA', icon: Users, end: false },
] as const

export default function BottomNav() {
  return (
    <nav className="sticky bottom-0 z-20 border-t border-ink-200/60 bg-white/85 backdrop-blur-md dark:border-ink-800 dark:bg-ink-950/85">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center gap-0.5 rounded-2xl py-2 text-xs font-medium transition-colors',
                  isActive
                    ? 'text-sunrise-600 dark:text-sunrise-300'
                    : 'text-ink-400 hover:text-ink-600 dark:text-ink-500 dark:hover:text-ink-300',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={[
                      'flex h-8 w-11 items-center justify-center rounded-full transition-colors',
                      isActive ? 'bg-sunrise-100 dark:bg-sunrise-500/15' : '',
                    ].join(' ')}
                  >
                    <Icon size={20} strokeWidth={isActive ? 2.4 : 2} />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
