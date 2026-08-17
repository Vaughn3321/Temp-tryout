import { Flame } from 'lucide-react'

export default function StreakBadge({ streak }: { streak: number }) {
  const lit = streak > 0
  return (
    <div
      className={[
        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold shadow-sm',
        lit
          ? 'bg-gradient-to-r from-sunrise-400 to-sunrise-500 text-white'
          : 'bg-ink-100 text-ink-500 dark:bg-ink-800 dark:text-ink-400',
      ].join(' ')}
    >
      <Flame size={16} className={lit ? 'fill-white/30' : ''} />
      {streak > 0 ? `${streak}-day streak` : 'Start your streak'}
    </div>
  )
}
