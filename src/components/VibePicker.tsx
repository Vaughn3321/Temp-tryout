const vibes = [
  { value: 1, emoji: '😞' },
  { value: 2, emoji: '😕' },
  { value: 3, emoji: '🙂' },
  { value: 4, emoji: '😊' },
  { value: 5, emoji: '🤩' },
]

export default function VibePicker({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="flex justify-between">
      {vibes.map((v) => (
        <button
          key={v.value}
          type="button"
          onClick={() => onChange(v.value)}
          className={[
            'flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all',
            value === v.value ? 'scale-110 bg-sunrise-100 dark:bg-sunrise-500/15' : 'opacity-50',
          ].join(' ')}
        >
          {v.emoji}
        </button>
      ))}
    </div>
  )
}

export { vibes }
