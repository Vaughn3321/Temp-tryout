import { Heart } from 'lucide-react'
import type { Quote } from '../data/quotes'

export default function QuoteCard({
  quote,
  favorited,
  onToggleFavorite,
  hero = false,
}: {
  quote: Quote
  favorited: boolean
  onToggleFavorite: (id: string) => void
  hero?: boolean
}) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-3xl p-5 shadow-sm',
        hero
          ? 'bg-gradient-to-br from-sunrise-400 via-sunrise-500 to-dusk-500 text-white'
          : 'bg-white text-ink-900 ring-1 ring-ink-200/70 dark:bg-ink-900 dark:text-ink-100 dark:ring-ink-800',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-2xl leading-none">{quote.emoji}</span>
        <button
          type="button"
          onClick={() => onToggleFavorite(quote.id)}
          aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
          className={[
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors',
            hero
              ? 'hover:bg-white/15'
              : 'hover:bg-ink-900/5 dark:hover:bg-white/10',
          ].join(' ')}
        >
          <Heart
            size={18}
            className={favorited ? 'fill-current text-current' : ''}
            strokeWidth={2}
          />
        </button>
      </div>
      <p
        className={[
          'mt-3 text-balance font-display text-lg font-medium leading-snug',
        ].join(' ')}
      >
        {quote.text}
      </p>
      <span
        className={[
          'mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-medium',
          hero ? 'bg-white/20' : 'bg-sunrise-100 text-sunrise-700 dark:bg-sunrise-500/15 dark:text-sunrise-300',
        ].join(' ')}
      >
        {quote.tag}
      </span>
    </div>
  )
}
