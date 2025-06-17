<div align="center">
  <img src="public/favicon.svg" width="72" height="72" alt="SpecMaster" />
  <h1>SpecMaster</h1>
  <p>The bartender's learning companion — master recipes, techniques, and the craft of cocktails.</p>

  <p>
    <a href="https://specmaster-app.vercel.app"><strong>specmaster-app.vercel.app</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Supabase-database%20%26%20auth-3ecf8e?logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06b6d4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel" alt="Vercel" />
  </p>
</div>

---

## Features

- **Recipe library** — 200+ cocktails with search, filters by spirit/method/difficulty, and save/bookmark
- **Learning paths** — Structured lessons with XP, levels (11 tiers), and daily streak tracking
- **Games** — Flashcard, Ingredient Challenge, and Name That Cocktail modes
- **Badges** — 9 unlockable achievements earned through gameplay and progress
- **Profile** — Avatar picker, display name, bio, level progress, and stats
- **Auth** — Email/password + Google OAuth, forgot password, and reset password flow

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Server Actions) |
| Language | TypeScript (strict) |
| Database & Auth | Supabase (Postgres + Row Level Security) |
| Styling | Tailwind CSS + shadcn/ui |
| Deployment | Vercel |

## Getting Started

**Prerequisites:** Node.js 18+, a Supabase project

```bash
git clone https://github.com/itsarviii/specmaster.git
cd specmaster
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database Setup

Apply the migrations in order from `supabase/migrations/`, then seed the data:

```bash
npx tsx scripts/seed.ts          # ~500 recipes from TheCocktailDB
npx tsx scripts/seed-badges.ts   # 9 badge definitions
npx tsx scripts/seed-paths.ts    # learning path content
```

## Project Structure

```
app/
├── (app)/          # Authenticated routes (dashboard, recipes, games, etc.)
├── (auth)/         # Auth routes (sign-in, sign-up, onboarding, etc.)
└── api/            # API routes (auth callback, health check)
components/
├── ui/             # shadcn/ui base components
├── auth/           # Auth forms and flows
├── games/          # Game hub and session
├── layout/         # Sidebar, mobile nav, page header
├── learn/          # Learning path components
├── profile/        # Profile hero, badges, avatar picker
└── recipes/        # Recipe grid, filters, save button
lib/
├── actions/        # Server actions
├── db/             # Database query functions
└── supabase/       # Supabase client setup
```
