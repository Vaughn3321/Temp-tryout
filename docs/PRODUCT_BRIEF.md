# Product & Architecture Brief

**A private operating system for someone's AA life**

Status: draft for review · Working app name: temporary, not final branding

---

## 0. Vision restatement

The meeting finder is what gets someone to download the app. Their recovery *life* is what
keeps them using it. The product should help someone find fellowship, work their program,
maintain relationships, handle sponsorship, keep service commitments, preserve the meaningful
parts of their journey, and know what matters today — without ever trying to replace AA,
sponsors, meetings, or human connection.

Two principles govern every decision below:

> Technology should strengthen sponsor-to-sponsee relationships, never impersonate them.

> The user's recovery belongs to the user.

---

## 1. Inventory of what already exists

**Pages/routes:** Home (`/`), Meetings (`/meetings`), Inspiration (`/inspiration`),
Step Ten (`/step10`), Journal (`/journal`, reachable only from Step Ten), My AA (`/my-aa`,
three tabs: Commitments / Meeting Notes / Contacts), Privacy (`/privacy`).

**localStorage keys in use today:** `odaat:favorites`, `odaat:entries` (Step 10 journal),
`odaat:commitments`, `odaat:meetingNotes`, `odaat:contacts`, `odaat:meetingSources`,
`odaat:meetingsCache`, `odaat:dark`, `odaat:notifTime`, `odaat:notifOn`.

**Shared building blocks:** `useLocalStorage` (generic persistence hook), `useLiveMeetings`
(Meeting Guide/TSML feed fetch + 1hr cache + silent sample-data fallback), `meetingGuide.ts`
(spec-compliant feed parser/normalizer), `dailyMeetings.ts` (derives a "Daily" tag by
grouping meetings sharing name+location+time across all 7 days), `calendar.ts` (client-side
`.ics` generation, weekly RRULE), `streak.ts` (consecutive-day streak calc), `time.ts`
(duration formatting), plus `MeetingCard`, `QuoteCard`, `Toggle`, `VibePicker`, `StreakBadge`,
`BottomNav` components.

**Feature-complete today:**
- **Meetings** — live Meeting Guide feed integration (LA Central Office + Online Intergroup
  defaults, user-editable, multi-source merge, graceful fallback to sample data), day/tag
  filters including derived "Daily", search, duration display, join-online link,
  add-to-calendar.
- **Step Ten** — guided mood + 8-question nightly/morning inventory wizard, saved entries,
  streak, full journal history with expand/delete.
- **Inspiration** — quote of the day + browsable list, favoriting, daily nudge time picker
  wired to real browser Notification permission (fires while the tab is open; honestly
  labeled as such, not a background push claim), streak-aware nudge copy.
- **My AA** — Commitments (service-role CRUD: title/meeting/day/time/frequency/active/notes),
  Meeting Notes (attendance log CRUD with a 7/30/90-day count widget), Contacts (name/phone/
  met-at/date/tags/notes/pinned, tap-to-call).
- **Privacy page** — explicit, provable local-only data model.

**Design system:** Tailwind v4 tokens (sunrise/dusk/serenity/ink palettes), Fredoka + Inter,
full light/dark theming, mobile-first single column capped at `max-w-md`, bottom tab nav.

**Infra:** Vite + React + TypeScript SPA. No backend, no accounts, no analytics — everything
client-only, deployed to GitHub Pages via an Actions workflow that auto-builds on push.

---

## 2. Fit analysis

**Fits naturally on the current architecture — same patterns, no new primitives:**

| Vision piece | Why it fits |
|---|---|
| Quote hide / personal-add | Extends `quotes.ts` + `Inspiration.tsx` + existing favorites pattern |
| Home Group Hub (personal-only) | Same CRUD shape as Commitments/Contacts |
| Service Work Manager | Already exists as Commitments — needs a richer role vocabulary and a Today surface, not new code |
| Step tracking (1–12, notes) | New small model, identical CRUD pattern |
| My Sponsor / Sponsees (local-only) | Same CRUD pattern as Contacts, richer fields |
| Sobriety date + milestone chips | One new profile field + a derived "which chips are earned" calc, same spirit as `computeStreak` |
| Recovery Timeline | Best built as a *derived, read-only* view assembling dated records that already exist elsewhere, not a new store |
| Personal Meeting Rhythm | Reuses the Meetings page's meeting-picker/datalist pattern, attached to a new small model |

**Needs foundational work first:**

- **IA reorganization.** The current five tabs (Home/Meetings/Inspire/Step10/My AA) don't map
  1:1 onto the five pillars (Today/Meetings/My Recovery/My People/My Program). Doing this
  early means new features land in their permanent home instead of being migrated twice.
- **A real Today dashboard.** Home.tsx today is a light version of this (streak + next
  meeting + quote). It needs to become a composable stack of independent cards that each
  no-op gracefully when their data doesn't exist yet — so a user who's only touched Meetings
  sees a calm screen, not empty-state clutter from six unused features.
- **Sponsor↔sponsee linking, permissioned sharing, assignment collaboration.** Needs auth +
  backend. The local-only "My Sponsor"/"Sponsees" models should be shaped so they *could*
  later map onto a synced record without a schema rewrite — not built now.
- **"I Need a Meeting Now."** Geolocation is buildable client-side today; real travel-time
  estimation needs a routing API, which should be backend-proxied rather than embedding an
  API key in a public SPA. V1 ships a simplified heuristic (closest + soonest, no real
  travel time); true travel-time is backend-gated.
- **Newcomer Mode.** A *display mode* over existing data (simplified nav, hidden advanced
  sections) — no new data, but needs the IA pass finished first so there's a stable
  structure to simplify.
- **Travel Mode.** Needs a way to query meetings for an arbitrary city, not just the user's
  configured sources. V1 can ship local-only by letting the user paste a temporary feed URL
  for the city they're visiting (same pattern as existing meeting sources) rather than
  requiring a maintained city→feed directory (which is a later, heavier lift).

---

## 3. Architectural changes before adding substantial new functionality

**a. A typed, centralized store registry.** Today, every feature independently picks its own
`localStorage` key string and shape via ad hoc `useLocalStorage` calls. Fine at six slices;
error-prone at fifteen-plus (chips, sponsor, sponsees, assignments, steps, home group,
regular meetings, recovery profile…). Add `src/data/store.ts`: one place declaring every key,
its type, and a schema version — so a future shape change can migrate old data instead of
silently losing it. This matters more here than in a typical app because there's no server to
patch broken client data after the fact.

**b. Extract the repeated CRUD-list-with-form pattern.** `CommitmentsSection`,
`ContactsSection`, and `MeetingNotesSection` are each ~200 lines of nearly identical
add/edit/delete/form-toggle logic. Before adding five more sections in this shape (Sponsees,
Steps, Home Group, Chip notes, Regular Meetings), factor this into a shared hook/component so
each new section is closer to 40 lines of field config than 200 lines of repeated
boilerplate. This is the single highest-leverage refactor for everything that follows in this
brief.

**c. Do the IA relabel now, before every pillar has content.** Today → Meetings → My Recovery
→ My People → My Program. Concretely: `Home` → `Today`; `Meetings` unchanged; `My Recovery` =
Inspiration + Step Ten + Journal + (new) Chips/Timeline/Library; `My People` = Contacts +
(new) Sponsor/Sponsees; `My Program` = Commitments + (new) Steps/Home Group/Regular Meeting
Rhythm. Journal currently has no nav entry at all and should move under My Recovery.

**d. Introduce a "recovery profile" as its own top-level record**, sobriety date at minimum,
since chips, the timeline, streak framing, and newcomer-mode all key off it. Should exist
before chips or the timeline are built.

**e. Decide the local-only backup story now.** Once ten-plus data types hold someone's real
history, "clear your browser and lose everything" (already disclosed on the Privacy page)
becomes a much bigger deal. A manual **Export my data as JSON / Import** pair is cheap to
build now and is a natural stepping stone toward optional cloud sync later, without
committing to a backend yet.

---

## 4. Proposed information architecture

```
Today          Meetings        My Recovery      My People       My Program
─────          ────────        ───────────      ─────────       ──────────
Dashboard   →  Near Me         Step Ten          Sponsor         Steps (1–12)
               Starting Soon   Inspiration       Sponsees        Service work
               Tonight         Journal           Contacts        Home Group
               Online          Chips             (People Memory) Regular meetings
               Favorites       Timeline                          (rhythm)
               My Rhythm       Library
               Advanced ⚙
                (feed config,
                 hidden from
                 normal use)
```

Bottom nav stays five tabs — same cognitive load as today, new destination underneath each.
"Advanced" meeting-source configuration (currently a visible gear icon on the Meetings page)
moves fully out of the primary flow into a Settings surface reachable from Today, so a normal
user never sees the words "feed URL" or "JSON."

---

## 5. Proposed data models

All new stores follow the existing convention: string `id`, ISO date strings, optional
fields wherever a field isn't guaranteed to exist.

```ts
// Recovery Profile — singleton, not a list
interface RecoveryProfile {
  sobrietyDate?: string        // YYYY-MM-DD
  firstName?: string           // personalization only, never required
  homeGroupId?: string
  currentStepNumber?: number   // 1–12
  newcomerMode: boolean
  streaksEnabled: boolean      // per "no punitive streaks" — user can turn this off
}

// Quotes — extend the existing Quote, add a personal layer
interface Quote { id: string; text: string; tag: string; source: 'app' | 'personal' }
interface QuotePrefs { hiddenIds: string[] }   // favorites already exist as odaat:favorites

// Chips
interface Chip {
  id: string            // '24h' | '30d' | '90d' | '6mo' | '9mo' | '1yr' | 'annual-{n}'
  earnedDate: string
  note?: string
  location?: string
  givenBy?: string
  photoDataUrl?: string  // stored as data URI — needs a size cap, see §9
}
// Which chips are "earned" is computed from sobrietyDate; earned chips persist their own
// row so a note/photo survives even if the milestone math changes later.

// Sponsor — singleton with history (supports sponsor changes without deleting the past)
interface SponsorProfile {
  id: string; name: string; phone?: string; sobrietyDate?: string; homeGroup?: string
  callRoutine?: string   // "Sundays at 6pm"
  notes?: string
  active: boolean
}

// Sponsees — my own private view of who I sponsor
interface Sponsee {
  id: string; name: string; phone?: string; sobrietyDate?: string
  currentStepNumber?: number; notes?: string
  lastContact?: string; nextCheckIn?: string; active: boolean
}

// Sponsor Assignments — work items; local-only v1 tracks "my own" assignments,
// cross-device sponsor↔sponsee sync is a Phase 3 (backend) feature
interface Assignment {
  id: string
  owner: 'me' | 'sponsee'     // whose assignment this is
  forSponseeId?: string       // set when I'm the sponsor assigning to someone I sponsor
  title: string; detail?: string; dueDate?: string
  status: 'assigned' | 'in_progress' | 'complete'
  sponseeNote?: string        // reflection attached on completion
  createdAt: string; completedAt?: string
}

// Step Progress — always all 12 present, so the UI renders a fixed ladder
interface StepProgress {
  stepNumber: number
  status: 'not_started' | 'in_progress' | 'complete'
  startedDate?: string; completedDate?: string; notes?: string
}

// AA Contacts — extends the existing Contact type
interface Contact {
  /* existing: id, name, phone?, metAt, dateMet, tags, notes, pinned, createdAt */
  sobrietyDate?: string; homeGroup?: string; lastConnected?: string
  wantsAnniversaryReminder?: boolean
  relationship?: 'sponsor' | 'sponsee' | 'friend' | 'other'
}

// Personal Meeting Rhythm
interface RegularMeeting {
  id: string
  meetingRef: { name: string; day: DayOfWeek; time: string }  // loose ref, not a hard FK —
                                                                 // live-feed ids can change
  label?: string   // "My home group", "Men's meeting"
}

// Home Group
interface HomeGroup {
  id: string; name: string
  regularMeeting?: { day: DayOfWeek; time: string; locationName: string }
  businessMeeting?: { day: DayOfWeek; time: string; frequency: string }  // "1st Tuesday"
  contacts: { name: string; role: string; phone?: string }[]
  notes?: string
}

// Service Commitments — already exists as Commitment, unchanged; only the suggested-role
// vocabulary in the UI grows (secretary, treasurer, GSR, literature, setup, cleanup, ...)

// Recovery Timeline — derived, not its own store
type TimelineEvent =
  | { type: 'sobriety_date'; date: string }
  | { type: 'chip'; date: string; chip: Chip }
  | { type: 'step'; date: string; step: StepProgress }
  | { type: 'sponsor_change'; date: string; sponsorName: string }
  | { type: 'home_group_change'; date: string; groupName: string }
  | { type: 'commitment_started'; date: string; title: string }
  | { type: 'meeting_note'; date: string; meetingName: string }
  | { type: 'personal_note'; date: string; text: string }  // the one type needing its own
                                                              // small store — a freeform
                                                              // entry the user adds directly
```

---

## 6. Phased roadmap

**Phase 0 — foundation (do first, no new feature surface):**
typed store registry · CRUD-list hook extraction · IA relabel (nav + route grouping) ·
Recovery Profile (sobriety date) · JSON export/import.

**Phase 1 — V1 priority, matches your own list:**
Milestone Chips · My Sponsor · Step Progress · Quote hide/personal-add · Home Group Hub
(personal) · basic Sponsee management (local, no sync).

**Phase 2:**
Personal Meeting Rhythm · Recovery Timeline (derived view) · Personal Recovery Library ·
Newcomer Mode (display toggle) · "When I'm Struggling" screen (pure local, references
existing sponsor/quotes/meeting-now) · simplified "Meeting Now" heuristic (no real travel
time yet) · Travel Mode v1 (manual temporary feed URL, same pattern as existing sources).

**Phase 3 — needs a backend decision:**
accounts · sponsor↔sponsee linking + permissioned sharing · assignment collaboration across
two devices · real travel-time-aware Meeting Now · maintained city→feed directory for Travel
Mode · optional cloud backup/sync.

---

## 7. Local-only for now

Everything through Phase 2: recovery profile, chips, sponsor/sponsees (each device
independently keeps its own private notes — not a shared record), steps, home group, regular
meeting rhythm, recovery library, quote customization, newcomer mode, the struggling screen,
export/import (a personal backup file, not sync).

## 8. Requires auth/backend/sync eventually

Sponsor↔sponsee account linking and permissioned sharing · assignment collaboration (needs
both parties' data to reach a shared place) · real travel-time routing (should be
backend-proxied so no API key sits in a public SPA) · a maintained city→Intergroup-feed
directory for Travel Mode · optional cloud backup/sync. Biometric/Face ID lock is its own
track — a WebAuthn capability question more than a backend one, but meaningfully easier once
this ships as an installed PWA rather than a plain website.

## 9. Privacy/security risks to account for now

- **Storage ceiling.** `localStorage` caps around 5–10MB per origin in most browsers. Chip
  photos are the most likely thing to hit that. Compress/cap images client-side before
  storing, and surface storage usage on the Privacy page instead of failing silently later.
- **Shared/borrowed devices.** This is a mobile-first app for people who may occasionally
  share a phone or use a library computer. There's no lock screen today. A lightweight local
  PIN/biometric lock is worth building ahead of anything backend-dependent.
- **Export/import creates a plaintext file** with someone's sobriety and sponsor data that
  can end up in Downloads, email, or cloud-drive sync. Warn clearly in the export flow;
  consider an optional passphrase-encrypted export.
- **Sponsor↔sponsee sharing (Phase 3)** must default to nothing shared, with explicit,
  revocable, per-item grants — never implicit access via the relationship itself — and a
  clean "unlink" that leaves no residual access.
- **Anniversary reminders (People Memory)** mean storing someone else's sobriety date without
  their direct consent to that specific use. Worth a short in-product note that this is the
  user's own private record-keeping, not data collected *about* that other person by the app.

## 10. Copyright/trademark risks affecting technical design

- **Never bundle AAWS-copyrighted text** — Big Book, Twelve & Twelve, Daily Reflections, or
  similar — into the app or its quote library. `quotes.ts` already sticks to original writing
  and public-domain slogans; keep that boundary explicit (a comment in the file) so a future
  contributor doesn't casually paste in copyrighted excerpts.
- **User-entered personal quotes are fine regardless of source** — that's the user privately
  storing their own material, like a private notes app — but the product itself shouldn't
  pre-populate or suggest copyrighted excerpts to enter.
- **Avoid the AA logo, the circle-and-triangle mark, and using "Alcoholics Anonymous" in the
  app's own branding** in any way implying affiliation or endorsement. Referencing AA
  factually ("for AA meetings," "Twelve Step recovery") — as this brief and the app already
  do — is fine; the product's identity should read as independent.
- **The app's own name needs to not collide with existing marks.** Per your note, the current
  working name is temporary and already used elsewhere — hold off on name-dependent assets
  (icons, domain, store listing copy) until that's resolved.
- **Meeting data via Meeting Guide/TSML feeds is logistics** (time/place/type), not
  copyrighted literature — that boundary is already respected and should stay that way; don't
  start pulling full meeting-format scripts or copyrighted pamphlet text into meeting
  descriptions.

---

## What's being built now

Phase 0 only, in this pass: the typed store registry, the shared CRUD-list pattern (with the
three existing sections refactored onto it, behavior preserved), JSON export/import, and the
Recovery Profile with sobriety date. The IA relabel and Phase 1 features (chips, sponsor,
steps, quote customization, home group) are scoped and ready but sequenced next, so this
lands as reviewable, working slices rather than one enormous change.
