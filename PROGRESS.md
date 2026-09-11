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

**Status:** confirmed working — local dev, GitHub, and Vercel production
deployment all pulling real data from Supabase

**Deployment notes (for future phases)**
- My zip export had a bug: the exclude pattern meant to skip the `.git`
  folder (`*.git*`) also matched and stripped `.gitignore` itself. Every
  zip up through this point shipped without it — recreated manually.
  Fixed for any future exports.
- Local `.env` and Vercel's environment variables are two separate places
  — adding keys to one does nothing for the other. Both need
  `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` set independently.
- Vercel doesn't apply new/changed environment variables to an existing
  deployment — it needs an explicit **Redeploy** after saving them.
- The Supabase "Project URL" is `https://<ref>.supabase.co` — easy to
  mistake for the dashboard link (`supabase.com/dashboard/project/<ref>`),
  which looks similar but isn't the API endpoint.

---

## Phase 3 — Auth & user accounts (not started)
## Phase 3 — Auth & user accounts ✅

**Added**
- `supabase/migrations/0002_auth_profile_trigger.sql` — a Postgres trigger
  that auto-creates a `profiles` row the moment someone signs up (handles
  username collisions by appending a number), plus an update policy so
  users can edit their own profile
- `src/context/AuthContext.jsx` — wraps Supabase Auth: session, profile,
  sign up/in/out, password reset/update
- `src/components/auth/AuthForm.jsx` — shared login/signup form
- `src/components/auth/ProtectedRoute.jsx` — redirects guests to `/login`
- **New pages:** `Login`, `Signup`, `ForgotPassword`, `UpdatePassword`
  (the reset-email landing page), `Profile` (`/profile/:username`,
  public), `AccountSettings` (`/account/settings`, protected)
- `Navbar` now shows Sign in/Sign out based on real auth state
- `src/hooks/useProfile.js` — fetch a public profile by username

**Design decisions**
- Chose a DB trigger over a client-side insert for creating `profiles`
  rows — it's atomic with the signup itself, doesn't depend on the
  browser tab staying open, and will work the same way later if OAuth
  providers get added
- Signup handles both Supabase project configurations (email confirmation
  on or off) rather than assuming one

**Status:** builds clean, lints clean (0 errors); needs your Supabase
project to run the new migration before auth will work live

**Follow-up fixes (after live testing)**
- **Username not appearing / not saving:** root cause was almost
  certainly the signup trigger not creating a `profiles` row (or an
  `.update()` call succeeding silently even when it changed zero rows —
  a Supabase gotcha). Fixed two ways: (1) `AccountSettings` now uses
  `.select().single()` on save, which turns a silent no-op into a real,
  visible error instead of a false "Saved."; (2) added a **self-healing
  `ensureProfile`** in `AuthContext` — if a signed-in user has no profile
  row, one is created on the spot, so the app recovers regardless of
  whether the trigger fired.
- `supabase/migrations/0003_profile_insert_policy.sql` — the self-heal
  insert needs its own RLS policy (only SELECT and UPDATE existed before)
- Auth pages (Login/Signup/Forgot/Update Password) now use a centered
  `AuthLayout` instead of the left-aligned page layout
- Added `PasswordInput` — show/hide toggle, used on every password field
  sitewide for consistency
- Signup now has a confirm-password field with a mismatch check
- Signup detects an already-registered email (Supabase returns a
  "successful" signup with an empty `identities` array in this case, to
  avoid leaking which emails exist) and redirects to Login with the email
  prefilled
- Widened `--container-max` from 1200px to 1400px so the homepage hero
  gallery fits 5 wallpapers without scrolling
- Home's hero gallery now picks a curated 5-wallpaper mix (3 phone + 2
  desktop when available) instead of an arbitrary slice
- Added the site logo (provided by Samyak) to the Navbar, resized from
  542KB to 16KB for page-load reasons. Flagged for the record: the logo's
  multi-color gradient sits outside the site's one-accent-color system —
  intentional per Samyak's direction, not an oversight

---

## Phase 4 — Upload & favorites ✅ (plus admin dashboard, pulled forward)

**Why admin came early:** uploads need somewhere to be reviewed, so
building Phase 4 without any moderation UI would mean pending uploads
pile up with no way to act on them. Built a working slice of Phase 5
alongside Phase 4 rather than leave that gap.

**Admin**
- `ADMIN_ONLY_LOGIN` flag in `src/lib/featureFlags.js` — while true, only
  `profiles.role = 'admin'` accounts can sign in (signup still works,
  for creating test accounts). Flip to `false` in Phase 6 for real launch.
- `supabase/make_admin.sql` — one-time script to promote an account
  (not a numbered migration — a personal data change, run once)
- `.admin-theme` in `globals.css` — inverted dark background/text, same
  accent colors. Wrapping the admin route tree in this class re-themes
  every existing component automatically via the CSS variable cascade,
  no per-component changes needed. This is the "different colors" ask.
- `/admin` — dashboard with stats (total/pending/users)
- `/admin/moderation` — approve/reject queue for pending uploads
- `/admin/categories` — add/delete categories
- `/admin/users` — promote/demote admin role
- `AdminRoute` guard, `AdminLayout` wrapper

**Upload**
- `/upload` — title, description, orientation, category picker, drag-drop
  image (`UploadDropzone`, client-validated: JPG/PNG, 15MB max)
- Uploads go to Supabase Storage (`wallpapers` bucket), row inserted as
  `pending` for regular users, `approved` immediately for admins
- `/account/uploads` — see your own uploads and their status, using the
  new "view own wallpapers regardless of status" RLS policy

**Favorites**
- `useFavorites` hook, `FavoriteButton` on every card and the detail page
- `/account/favorites` — saved wallpapers

**Downloads**
- `DownloadButton` now logs to the `downloads` table and increments
  `download_count` via an `increment_download_count` RPC — works for
  guests too (nullable `user_id`)

**Account Settings follow-up (from feedback)**
- Now centered (missed this earlier — only auth pages got `AuthLayout`)
- Added: change password (in-app, no email round-trip needed since
  already authenticated), delete account, quick links to uploads/favorites
- **Delete account** required a Supabase Edge Function
  (`supabase/functions/delete-account`) — deleting a user needs the
  service role key, which must never reach the browser, so this runs
  server-side. Needs a manual `supabase functions deploy` — see README.

**Other fixes from feedback**
- Home's "Fresh on HeyWalls" now shows 5 wallpapers, not 4
- Upload CTAs on Home now actually link somewhere (`/upload` if signed
  in, `/login` if not) instead of being static buttons

**New migrations:** `0004_own_wallpapers_visibility.sql`,
`0005_phase4_and_admin.sql` (admin policies, favorites/downloads tables,
download-count RPC), `0006_storage.sql` (wallpapers bucket + policies)

**Status:** builds clean, lints clean (0 errors); needs the new
migrations run, the admin account promoted via `make_admin.sql`, and the
Edge Function deployed before everything works live

---

## Phase 11 — Global UI polish ✅

- Added a calm, consistent hover/active response to interactive buttons.
- Added keyboard-visible focus outlines for buttons, links, and form controls.
- Disabled accidental text selection across the browsing UI while keeping
  inputs, textareas, selects, and editable fields selectable.
- Preserved existing component-specific hover states (including admin and
  destructive actions) rather than replacing them with a global color.

## Phase 12 — Account & profile improvements ✅

- Added editable display name to Account settings alongside username and bio.
- Signup now collects an optional display name and passes it to the existing profile trigger.
- Public creator profiles now show display name, username, bio, published wallpaper count, and approved uploads.
- Wallpaper detail uploader information now links to the creator profile and shows display name when available.
- My Uploads now surfaces the signed-in creator identity with a link to the public profile.
- Signed-in username in the desktop navbar now opens the public creator profile; Account settings remains available in the mobile account menu.
- Public profile queries and wallpaper joins expose profile display name/username only; email remains private.
- Reused migration `0011_profile_display_name.sql`; no additional database migration is required for this phase.

**Status:** implementation complete; build verification requires installing project dependencies.

---

## Phase 5 — Admin & moderation (core pulled into Phase 4 — see above)
## Phase 6 — Polish & launch (not started)

## Phase 16.1 — Account edit/delete flow

- Replaced View profile with Cancel on Edit profile and redirect to profile after cancel/save.
- Profile save shows a success toast before navigating to the profile.
- Tightened edit-profile form spacing.
- Added password + DELETE confirmation modal for account deletion with Cancel.
- Password is verified before invoking the account-deletion Edge Function.
