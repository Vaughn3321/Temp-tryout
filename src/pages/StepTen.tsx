import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, NotebookPen } from 'lucide-react'
import { inventoryPrompts, todayKey, type InventoryEntry } from '../data/inventory'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { computeStreak } from '../lib/streak'
import StreakBadge from '../components/StreakBadge'

const moods = [
  { value: 1, emoji: '😞', label: 'Rough' },
  { value: 2, emoji: '😕', label: 'Meh' },
  { value: 3, emoji: '🙂', label: 'Okay' },
  { value: 4, emoji: '😊', label: 'Good' },
  { value: 5, emoji: '🤩', label: 'Great' },
]

type FlowStage = 'idle' | 'mood' | 'question' | 'review' | 'done'

export default function StepTen() {
  const [entries, setEntries] = useLocalStorage<InventoryEntry[]>('odaat:entries', [])
  const streak = useMemo(() => computeStreak(entries), [entries])

  const [stage, setStage] = useState<FlowStage>('idle')
  const [timeOfDay, setTimeOfDay] = useState<'Morning' | 'Night'>(
    new Date().getHours() < 16 ? 'Morning' : 'Night',
  )
  const [mood, setMood] = useState<number>(3)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const todaysEntries = entries.filter((e) => e.date === todayKey())

  function startFlow() {
    setAnswers({})
    setStep(0)
    setStage('mood')
  }

  function saveEntry() {
    const entry: InventoryEntry = {
      id: crypto.randomUUID(),
      date: todayKey(),
      timeOfDay,
      mood,
      answers,
      createdAt: new Date().toISOString(),
    }
    setEntries((prev) => [entry, ...prev])
    setStage('done')
  }

  const prompt = inventoryPrompts[step]
  const isLastQuestion = step === inventoryPrompts.length - 1

  return (
    <div className="px-4 pt-4">
      {stage === 'idle' && (
        <>
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
              Tenth Step
            </h1>
            <StreakBadge streak={streak} />
          </div>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            "Continued to take personal inventory" — a few honest minutes, twice a day if you want them.
          </p>

          <div className="mt-4 rounded-3xl bg-gradient-to-br from-dusk-500 to-dusk-700 p-5 text-white shadow-sm">
            <p className="text-sm font-medium text-dusk-100">
              {timeOfDay === 'Morning' ? 'Morning check-in' : "Tonight's check-in"}
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold">
              {timeOfDay === 'Morning'
                ? 'Set an honest tone for the day.'
                : 'Eight quick questions before you close the day.'}
            </h2>
            <div className="mt-3 flex gap-2">
              {(['Morning', 'Night'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTimeOfDay(t)}
                  className={[
                    'rounded-full px-3 py-1 text-xs font-semibold transition-colors',
                    timeOfDay === t ? 'bg-white text-dusk-700' : 'bg-white/15 text-white',
                  ].join(' ')}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={startFlow}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-2.5 text-sm font-semibold text-dusk-700 shadow-sm transition-transform active:scale-[0.98]"
            >
              <NotebookPen size={16} />
              Begin {timeOfDay.toLowerCase()} inventory
            </button>
          </div>

          {todaysEntries.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-ink-700 dark:text-ink-300">Today's check-ins</h3>
              <div className="mt-2 flex flex-col gap-2">
                {todaysEntries.map((e) => (
                  <div
                    key={e.id}
                    className="flex items-center justify-between rounded-2xl bg-white p-3.5 text-sm shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:ring-ink-800"
                  >
                    <span className="flex items-center gap-2 font-medium text-ink-800 dark:text-ink-200">
                      <Check size={16} className="text-serenity-500" />
                      {e.timeOfDay} check-in
                    </span>
                    <span className="text-lg">{moods.find((m) => m.value === e.mood)?.emoji}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link
            to="/journal"
            className="mt-4 flex items-center justify-center gap-1.5 rounded-2xl border border-dashed border-ink-300 py-3 text-sm font-medium text-ink-600 dark:border-ink-700 dark:text-ink-300"
          >
            View past entries <ArrowRight size={14} />
          </Link>
        </>
      )}

      {stage === 'mood' && (
        <div className="pt-6">
          <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">
            How are you doing right now?
          </h2>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">No wrong answer — just be honest.</p>
          <div className="mt-5 flex justify-between">
            {moods.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={[
                  'flex flex-col items-center gap-1 rounded-2xl px-2.5 py-2.5 transition-all',
                  mood === m.value
                    ? 'scale-110 bg-sunrise-100 dark:bg-sunrise-500/15'
                    : 'opacity-60',
                ].join(' ')}
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[11px] font-medium text-ink-600 dark:text-ink-300">{m.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setStage('question')}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-dusk-500 py-3 text-sm font-semibold text-white shadow-sm active:scale-[0.98]"
          >
            Continue <ArrowRight size={16} />
          </button>
        </div>
      )}

      {stage === 'question' && (
        <div className="pt-4">
          <div className="flex items-center gap-2">
            {inventoryPrompts.map((_, i) => (
              <div
                key={i}
                className={[
                  'h-1.5 flex-1 rounded-full transition-colors',
                  i <= step ? 'bg-dusk-500' : 'bg-ink-200 dark:bg-ink-800',
                ].join(' ')}
              />
            ))}
          </div>
          <p className="mt-2 text-xs font-medium text-ink-400">
            Question {step + 1} of {inventoryPrompts.length}
          </p>

          <div className="mt-3 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:ring-ink-800">
            <span className="text-3xl">{prompt.emoji}</span>
            <h2 className="mt-2 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
              {prompt.question}
            </h2>
            <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{prompt.hint}</p>
            <textarea
              value={answers[prompt.id] ?? ''}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [prompt.id]: e.target.value }))}
              rows={4}
              placeholder="Type as much or as little as you want…"
              className="mt-3 w-full resize-none rounded-2xl bg-ink-50 p-3 text-sm text-ink-900 outline-none ring-1 ring-transparent placeholder:text-ink-400 focus:ring-dusk-400 dark:bg-ink-800 dark:text-ink-100"
            />
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => (step === 0 ? setStage('mood') : setStep((s) => s - 1))}
              className="flex items-center justify-center gap-1.5 rounded-2xl bg-ink-100 px-4 py-3 text-sm font-semibold text-ink-600 dark:bg-ink-800 dark:text-ink-300"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => (isLastQuestion ? setStage('review') : setStep((s) => s + 1))}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-dusk-500 py-3 text-sm font-semibold text-white shadow-sm active:scale-[0.98]"
            >
              {isLastQuestion ? 'Review answers' : 'Next'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {stage === 'review' && (
        <div className="pt-4">
          <h2 className="font-display text-xl font-semibold text-ink-900 dark:text-ink-50">
            Quick look before you save
          </h2>
          <div className="mt-3 flex flex-col gap-2.5">
            {inventoryPrompts.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:ring-ink-800"
              >
                <p className="text-xs font-semibold text-ink-500 dark:text-ink-400">
                  {p.emoji} {p.question}
                </p>
                <p className="mt-1 text-sm text-ink-800 dark:text-ink-200">
                  {answers[p.id]?.trim() || <span className="italic text-ink-400">Skipped</span>}
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={saveEntry}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sunrise-400 to-sunrise-500 py-3 text-sm font-semibold text-white shadow-sm active:scale-[0.98]"
          >
            <Check size={16} /> Save my inventory
          </button>
        </div>
      )}

      {stage === 'done' && (
        <div className="flex flex-col items-center pt-12 text-center">
          <span className="text-5xl">🎉</span>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
            Nice work.
          </h2>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            That kind of honesty is the whole point of this step.
          </p>
          <div className="mt-4">
            <StreakBadge streak={computeStreak(entries)} />
          </div>
          <div className="mt-6 flex w-full gap-2">
            <Link
              to="/journal"
              className="flex-1 rounded-2xl bg-ink-100 py-3 text-center text-sm font-semibold text-ink-700 dark:bg-ink-800 dark:text-ink-200"
            >
              View journal
            </Link>
            <button
              onClick={() => setStage('idle')}
              className="flex-1 rounded-2xl bg-dusk-500 py-3 text-sm font-semibold text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
