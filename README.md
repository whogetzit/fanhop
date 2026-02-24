# FanHop

Build your March Madness bracket by weighting 17 statistical factors. Share your model with anyone via a URL.

**Stack:** Next.js 14 · Supabase · Vercel · TypeScript

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your Supabase project URL and keys.
Get them from: https://supabase.com/dashboard/project/_/settings/api

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:3000 — you'll land on the bracket builder immediately.

---

## Deploy to Vercel

```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_APP_URL   # set to https://fanhop.com
```

---

## Project Structure

```
src/
├── app/
│   ├── bracket/page.tsx     ← Bracket builder (reads ?m= URL param)
│   ├── api/og/route.tsx     ← Dynamic OG image for link previews
│   └── layout.tsx           ← Root layout + fonts + metadata
├── components/
│   ├── BracketApp.tsx       ← Main client component (state, share)
│   ├── BracketCanvas.tsx    ← Tournament bracket grid
│   └── Sidebar.tsx          ← Sliders, presets, save/load
├── lib/
│   ├── simulation.ts        ← Tournament simulation engine
│   ├── encoding.ts          ← URL encode/decode model state
│   ├── supabase.ts          ← Supabase client + auth helpers
│   └── data/2013.ts         ← Team stats + bracket seedings
└── types/
    ├── bracket.ts           ← Core types + stat definitions
    └── database.ts          ← Supabase schema types
supabase/
└── migrations/001_initial.sql  ← Phase 2 DB schema (run when ready)
```

---

## Phases

| Phase | Status | Description |
|-------|--------|-------------|
| **1 — Shareable URLs** | ✅ Built | `?m=` encoded bracket state, OG image previews |
| **2 — Auth + Cloud Save** | 🔜 Next | Supabase Auth (GitHub/Google), models in DB |
| **3 — Leaderboard** | 🔜 Later | Score brackets vs reality, public rankings |
| **4 — Live NCAA Data** | 🔜 Later | Real tournament data each March |

---

## Phase 2 Setup (when ready)

1. Create a Supabase project at https://supabase.com
2. Run the migration: paste `supabase/migrations/001_initial.sql` into the SQL editor
3. Enable GitHub + Google OAuth in Supabase Auth settings
4. Generate updated types: `supabase gen types typescript --local > src/types/database.ts`

---

## URL Encoding

Bracket state is encoded as compact base64url in the `?m=` query param:

- 17 stat weights (0–10 each) packed into 9 bytes (4 bits per value)
- Optional model name appended as UTF-8 after a `0x00` separator
- Total: ~12 characters for weights-only, ~20–30 with a name

Example: `/bracket?m=VVVlVVVVVVVVVQ` loads a specific weighted model.
