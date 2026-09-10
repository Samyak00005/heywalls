# HeyWalls — Progress Log

Tracks what was added/changed in each phase. Update this at the end of every
phase — it's the fast way to see where the project actually is without
digging through the code.

See `HeyWalls-Phases.md` (planning docs) for what each phase is supposed to
cover.

---

## Phase 0 — Project setup ✅

**Added**
- Vite + React project scaffolded
- Tailwind v4 wired in via `@tailwindcss/vite`
- `src/styles/globals.css` — design tokens (color, type, spacing) as CSS
  variables, sourced from `HeyWalls-Design-System.md`
- Folder structure: `components/{common,wallpaper,upload,auth,admin,profile}`,
  `pages/`, `pages/admin/`, `hooks/`, `context/`, `lib/`, `routes/`, `utils/`
- `react-router-dom` installed, placeholder `/` route
- `src/lib/supabaseClient.js` — Supabase client, reads keys from `.env`
- `.env.example` + README with local setup / Vercel deploy steps

**Status:** blank styled page confirmed working (screenshot approved)

---

## Phase 1 — Static pages & theme ✅

**Added**
- `Navbar`, `Footer`, `Layout` (common, persistent across all pages)
- `SwatchTag`, `WallpaperCard`, `WallpaperGrid`, `FilterBar` (wallpaper
  components — reusable across Home/Explore/Category/Profile later)
- Real `Home` page: hero, "hung gallery" wallpaper strip, mood swatches,
  community grid, upload CTA
- `Explore` page (`/explore`): filter bar (category + orientation) with
  working client-side filtering against placeholder data
- `src/utils/placeholderData.js` — mock wallpapers/categories, used until
  Phase 2 connects the real database

**Fixed**
- Renamed spacing tokens `--spacing-1..9` → `xs/sm/md/lg/xl/2xl/3xl/4xl/5xl`.
  The numeric names collided with Tailwind's own default spacing scale
  (`p-8` ≠ our 64px) — would've caused silent inconsistency later
- Corrected a mismatch in the design doc: desktop gutter was labeled 48px
  but pointed at the 64px token

**Status:** builds clean, lints clean, visually confirmed against the theme

---

## Phase 2 — Database & real data ⏳ next

**Will add**
- Supabase migrations for `profiles`, `wallpapers`, `categories`,
  `wallpaper_categories`
- Seed data (curated wallpapers + categories)
- `Home`/`Explore` switched from `placeholderData.js` to real Supabase
  queries
- `WallpaperDetail` page, `Category` page
- `FilterBar` wired to actually query the database instead of filtering a
  local array

**Blocked on:** you creating a free Supabase project and adding the keys to
`.env` (see README)

---

## Phase 3 — Auth & user accounts (not started)
## Phase 4 — Upload & favorites (not started)
## Phase 5 — Admin & moderation (not started)
## Phase 6 — Polish & launch (not started)
