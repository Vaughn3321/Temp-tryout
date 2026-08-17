# ODAAT — One Day At A Time

A hip, mobile-first web app prototype for people in AA recovery. Three core pieces:

- **Find a meeting** — browse local AA meetings with filters for day, format (Open/Closed/Speaker/Big Book/etc.), and free-text search.
- **Daily inspiration** — a quote of the day plus a browsable feed of recovery-minded quotes/slogans, with favoriting and a configurable daily nudge time.
- **Tenth Step inventory** — a guided morning/nightly check-in wizard (mood + 8 reflective prompts covering resentment, fear, selfishness, dishonesty, amends, kindness, gratitude, and tomorrow's intention), with a streak counter and a journal history.

## Status

This is a front-end prototype: all data (meetings, quotes) is mocked in `src/data/`, and journal entries / favorites / preferences persist to `localStorage` only — nothing leaves the device. There's no backend, accounts, or real push notifications yet.

## Stack

React + TypeScript + Vite, Tailwind CSS v4, React Router, lucide-react icons.

## Running locally

```bash
npm install
npm run dev
```

## Next steps toward a real product

- Real meeting data source (e.g. an aggregator API) with geolocation-based distance
- Accounts + server-side sync so journal entries survive a device switch, with entries encrypted at rest given how sensitive Step 10 content is
- Real push notifications for the daily quote nudge
- Optional sponsor/accountability-partner sharing for journal entries
