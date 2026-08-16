import { Link } from 'react-router-dom'
import { ArrowLeft, ShieldCheck, Ban, Database, Eye } from 'lucide-react'

const staysOnDevice = [
  'Your Tenth Step journal entries',
  'Your contacts — names, numbers, notes',
  'Your service commitments',
  'Your meeting notes and attendance log',
  'Favorited quotes and your streak',
  'Which meeting feed URLs you use',
]

const neverHappens = [
  'No account or sign-up, ever',
  'No analytics or usage tracking',
  'No ad trackers or third-party SDKs',
  "No server-side database of what you've written",
  'No one but you can see your journal, contacts, or notes',
]

export default function Privacy() {
  return (
    <div className="px-4 pt-4">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          aria-label="Back to Home"
          className="flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-ink-900/5 dark:text-ink-400 dark:hover:bg-white/10"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-ink-50">
          Privacy &amp; trust
        </h1>
      </div>
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
        Recovery data is about as sensitive as data gets. Here's exactly what happens to yours — not a
        marketing line, the actual mechanics.
      </p>

      <div className="mt-4 rounded-3xl bg-gradient-to-br from-serenity-500 to-dusk-600 p-5 text-white shadow-sm">
        <ShieldCheck size={28} />
        <p className="mt-2 font-display text-lg font-semibold">Nothing you write ever leaves this device.</p>
        <p className="mt-1 text-sm text-white/85">
          Everything below is stored using your browser's local storage — the same technology any website
          uses to remember you're logged in, except we don't have a server for it to sync to.
        </p>
      </div>

      <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:ring-ink-800">
        <div className="flex items-center gap-2">
          <Database size={16} className="text-serenity-600 dark:text-serenity-300" />
          <h2 className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">
            What stays on your device
          </h2>
        </div>
        <ul className="mt-2 flex flex-col gap-1.5">
          {staysOnDevice.map((item) => (
            <li key={item} className="text-sm text-ink-700 dark:text-ink-300">
              • {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:ring-ink-800">
        <div className="flex items-center gap-2">
          <Ban size={16} className="text-sunrise-600 dark:text-sunrise-400" />
          <h2 className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">
            What never happens
          </h2>
        </div>
        <ul className="mt-2 flex flex-col gap-1.5">
          {neverHappens.map((item) => (
            <li key={item} className="text-sm text-ink-700 dark:text-ink-300">
              • {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink-200/70 dark:bg-ink-900 dark:ring-ink-800">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-dusk-600 dark:text-dusk-300" />
          <h2 className="font-display text-sm font-semibold text-ink-900 dark:text-ink-50">
            Verify it yourself
          </h2>
        </div>
        <p className="mt-2 text-sm text-ink-700 dark:text-ink-300">
          Open your browser's developer tools (usually F12), go to the "Application" or "Storage" tab, and
          look under "Local Storage" for this site. Every key you see there — and nothing else — is what
          this app knows.
        </p>
      </div>

      <div className="mt-3 rounded-2xl bg-ink-100 p-4 dark:bg-ink-900">
        <h2 className="font-display text-sm font-semibold text-ink-800 dark:text-ink-200">
          The honest tradeoff
        </h2>
        <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-400">
          Nothing leaving your device also means nothing backs it up. Clear your browser data, switch
          devices, or reinstall, and your journal and contacts are gone — there's no account to recover
          them from. That's the deliberate cost of not running a server that could see them. A future,
          fully opt-in backup option may change this, but the default will always stay local-only.
        </p>
      </div>

      <div className="mt-3 rounded-2xl bg-ink-100 p-4 dark:bg-ink-900">
        <h2 className="font-display text-sm font-semibold text-ink-800 dark:text-ink-200">
          What does reach the network
        </h2>
        <p className="mt-1.5 text-sm text-ink-600 dark:text-ink-400">
          The Meetings page fetches public meeting-directory data from the Intergroup feed URLs you've
          configured — the same open data any AA meeting-finder app uses. Those requests don't include
          anything about you. Two Google Fonts load on every visit for the app's typography.
        </p>
      </div>
    </div>
  )
}
