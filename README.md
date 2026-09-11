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
4. Deploy — you'll get a free `.vercel.app` URL

## Supabase setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Copy the project URL + anon key into `.env`
3. In the Supabase SQL Editor, run `supabase/migrations/0001_init.sql`,
   then `0002_auth_profile_trigger.sql`, then
   `0003_profile_insert_policy.sql`, then `supabase/seed.sql` — this
   creates the tables, the auto-profile trigger and its insert policy,
   and sample curated wallpapers so the site isn't empty
4. In Supabase Authentication settings, confirm whether "Confirm email" is
   on or off — either works with this app, but it changes what happens
   right after someone signs up (email confirmation step vs. immediate
   sign-in)
5. Restart `npm run dev` — Home and Explore should now show real data,
   and you should be able to sign up / sign in from the navbar
