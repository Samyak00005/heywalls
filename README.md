# HeyWalls

A wallpaper site — curated + community uploads, desktop and phone.

This is the **Phase 0** scaffold: project setup, theme tokens, routing, and the
Supabase client are wired up. See `HeyWalls-Phases.md` in the planning docs for
what comes next, and `PROGRESS.md` for a phase-by-phase log of what's actually
been built.

## Get it running locally

```bash
npm install
cp .env.example .env   # then fill in your Supabase project URL + anon key
npm run dev
```

## Where things live

- `src/styles/globals.css` — every design token (color, type, spacing) from
  the design system, as CSS variables. Nothing outside this file should
  introduce a new color, font size, or spacing value.
- `src/lib/supabaseClient.js` — the Supabase client, reads keys from `.env`
- `src/routes/AppRoutes.jsx` — all app routes; new pages get added here per
  phase
- `src/components/` — organized by domain: `common`, `wallpaper`, `upload`,
  `auth`, `admin`, `profile`
- `src/pages/` — one file per route, `pages/admin/` for admin-only routes

## Deploying (free tier)

1. Push this repo to GitHub
2. Import it in [Vercel](https://vercel.com) — it auto-detects Vite
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment
   variables in the Vercel project settings
4. Keep `vercel.json` in the project root. It rewrites SPA routes such as
   `/admin/categories` to `index.html`, so direct navigation and browser
   refreshes work correctly with React Router.
5. Deploy — you'll get a free `.vercel.app` URL

## Supabase setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Copy the project URL + anon key into `.env`
3. In the Supabase SQL Editor, run these in order:
   `0001_init.sql` → `0002_auth_profile_trigger.sql` →
   `0003_profile_insert_policy.sql` → `0004_own_wallpapers_visibility.sql` →
   `0005_phase4_and_admin.sql` → `0006_storage.sql` → `0007_admin_profile_management.sql` → `seed.sql`
4. Run `supabase/make_admin.sql` once to make your own account an admin
   (edit the email list in that file if needed)
5. Deploy the delete-account Edge Function (needed for the "Delete
   account" button in settings):
   ```
   npx supabase login
   npx supabase link --project-ref <your-project-ref>
   npx supabase functions deploy delete-account
   ```
   No manual secrets are needed — Supabase injects the URL/keys automatically.
6. Restart `npm run dev` — Home and Explore should now show real data,
   auth should work, and once you're an admin, `/admin` should load.


## New UI / collections features

Run `supabase/migrations/0008_collections.sql` after the existing migrations to enable private user collections.

The wallpaper detail page now shows:
- exact 9:16 phone or 16:9 desktop presentation
- uploaded image resolution when stored
- related wallpapers
- Share
- Favorites / Saved
- Add to Collection

Users can access **Saved** and **Collections** from the navigation when signed in. Collections can be created from the Collections page or directly while viewing a wallpaper.
