# HeyWalls

HeyWalls is a wallpaper discovery site powered by Wallhaven's public, SFW search API. Browsing and search use a small Vercel API proxy, while saved wallpapers live in the current browser's local storage.

## Run locally

```bash
npm install
npm run dev
```

The Vite development server runs the same `/api/wallhaven` handler used on Vercel. No API key or `.env` file is required for the public SFW feed.

## Features

- Browse and search SFW wallpapers from Wallhaven.
- Browse API-provided wallpaper groups and 18 curated subject searches; learn about HeyWalls.
- Filter by portrait, landscape, or tablet-like image dimensions.
- Sort by newest, most viewed, most favorited, monthly toplist, or random.
- See a fresh random selection on Home and load additional wallpapers from Explore or Home; a failed next page keeps current results and can be retried.
- Fill filtered Explore batches with up to 20 matching wallpapers when available.
- Load wallpaper tag names from API detail records as cards enter view, and try alternate image URLs when a source image fails.
- Cache and pace wallpaper detail lookups; show specific upstream errors and a retry action when Wallhaven is unavailable or rate-limits requests.
- Use the universal header search with topic suggestions across routes; Explore shows the active query without a duplicate search field, and its sort control stays compact.
- See skeleton previews while wallpaper data loads; full wallpaper detail pages use the source's original image URL.
- Save and remove wallpapers in this browser.
- Open each wallpaper's Wallhaven source page and download its image.
- Read about the project and its maker, Samyak Nimsarkar.

Saved items are browser-specific and are not synced to other browsers or devices. HeyWalls stores the wallpaper links and metadata, not copies of the image files. Wallpaper images remain hosted by Wallhaven and belong to their respective uploaders.

## Deploy to Vercel

1. Push the repository to GitHub and import it into Vercel.
2. Deploy with the default Vite build settings. No provider secrets or environment variables are needed for the SFW feed.
3. Keep both `api/wallhaven.js` and `vercel.json` in the project. The API route proxies Wallhaven requests and the rewrite serves React Router pages on refresh.

The API proxy forces Wallhaven's SFW purity setting, limits request parameters, and briefly caches successful responses at Vercel's CDN.

## Project structure

- `api/wallhaven.js` — Vercel serverless proxy for Wallhaven search and detail requests.
- `src/hooks/useWallpapers.js` — search, sorting, pagination, and local catalog caching.
- `src/hooks/useFavorites.js` — browser-local saved wallpaper list.
- `src/lib/wallpaperMapper.js` — maps Wallhaven API records into HeyWalls wallpaper data.
- `src/routes/AppRoutes.jsx` — application routes.
- `src/components/` — shared interface and wallpaper components.
- `src/pages/` — Home, Explore, Categories, About, Saved, Category, and wallpaper detail pages.

## Commands

```bash
npm run dev
npm run build
npm run preview
```
