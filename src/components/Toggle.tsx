export default function Toggle({
  checked,
  onChange,
  activeClassName = 'bg-sunrise-500',
  label,
}: {
  checked: boolean
  onChange: () => void
  activeClassName?: string
  label?: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={[
        'relative h-6 w-11 shrink-0 rounded-full transition-colors',
        checked ? activeClassName : 'bg-ink-300 dark:bg-ink-700',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-[22px]' : 'translate-x-0.5',
        ].join(' ')}
      />
    </button>
  )
}
