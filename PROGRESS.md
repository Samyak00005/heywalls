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

**Refinements (after live testing on Vercel)**
- Fixed a layout bug: mixing 16:9 desktop and 9:16 phone cards in a regular
  CSS grid stretched each row to the tallest item, leaving a large empty
  gap under shorter cards
- `WallpaperGrid` switched from a row-based grid to a CSS-columns masonry
  ("river") layout — each column flows independently, no more gaps
- `WallpaperCard` now uses fixed ratios: 16:9 for desktop, 9:16 for phone
- Same stretch bug existed in the Home hero "hung gallery" (flex default
  `align-items: stretch`) — fixed with `items-start`
- Added `DownloadButton` — real cross-origin download via blob fetch (not
  just opening the image in a new tab), shown on every card
- Installed `lucide-react` for icons

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

## Phase 2 — Database & real data ✅

**Added**
- `supabase/migrations/0001_init.sql` — creates `profiles`, `categories`,
  `wallpapers`, `wallpaper_categories`, with RLS enabled and public-read
  policies (write policies land in Phase 4/5 alongside auth + roles)
- `supabase/seed.sql` — seeds the 6 categories and 16 curated wallpapers
  (same content as the old placeholder data, now in the real database)
- `src/hooks/useWallpapers.js`, `useWallpaper.js`, `useCategories.js` —
  fetch from Supabase, replacing `placeholderData.js` (deleted)
- `src/lib/wallpaperMapper.js` — shared mapping from Supabase's joined
  rows to the flat shape components expect
- `src/components/common/DataState.jsx` — shared loading/error states,
  so every data-fetching page looks and behaves the same way
- **New pages:** `WallpaperDetail` (`/wallpaper/:id`) with a "more like
  this" section, and `Category` (`/category/:slug`)
- `WallpaperCard` now links to its detail page
- `DownloadButton` got a `variant` prop (`icon` for cards, `primary` for
  the detail page) instead of overriding its styles from outside

**Changed**
- Home's "From the community" section renamed to "Fresh on HeyWalls" —
  it's pulling from the same curated dataset as everything else right now
  (no real uploader accounts exist yet), so the old label overstated it
- Explore's filters now run against real Supabase data instead of a local
  array (still filtered client-side — the catalog is small enough that
  this is simpler than server-side filtering for now)

**Known items**
- One lint warning in `useWallpaper.js` (`setState` inside effect) — an
  intentional reset-on-id-change pattern, not a bug
- This phase can't be tested from my side — it depends on your Supabase
  project. Run the migration + seed SQL, add your keys to `.env`, then
  check `/`, `/explore`, `/category/:slug`, and `/wallpaper/:id`

**Status:** builds clean; needs your Supabase project connected to verify live

---

## Phase 3 — Auth & user accounts (not started)
## Phase 4 — Upload & favorites (not started)
## Phase 5 — Admin & moderation (not started)
## Phase 6 — Polish & launch (not started)
