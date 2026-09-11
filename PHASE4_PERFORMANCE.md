# HeyWalls Phase 4 — Progressive Loading & Image Performance

## What changed

- Public wallpaper queries now load **10 wallpapers initially**.
- The next request loads **15 more wallpapers**.
- `IntersectionObserver` starts the next request before the user reaches the bottom of a wallpaper grid.
- Wallpaper metadata is cached in `localStorage` for up to 10 minutes, so repeat visits can render cached cards immediately while the first page is refreshed quietly.
- Cache keys include public filters such as category and orientation, so different filtered views do not share the wrong data.
- Explore and category pages now apply public filters at the Supabase query level instead of filtering only the first page locally.
- Card images use `thumbnail_url` when available and `loading="lazy"` / `decoding="async"`.
- Cards preserve the wallpaper's actual `width / height` ratio and use `object-contain`, avoiding the zoom/cropping caused by `object-cover`.
- Downloads and detail pages continue using the original `fullImageUrl`.
- Home displays the exact server-side total count instead of the number of currently loaded cards.

## Cache model

The app caches wallpaper **metadata and URLs**, not full image binary data. The browser's normal HTTP cache handles the actual image files. This keeps the app fast without filling local storage with large wallpaper files.

## Notes

The current upload thumbnail generator already preserves the source aspect ratio. The visual zoom issue was primarily caused by forcing the thumbnail into a fixed card ratio with `object-cover`; the card now uses the stored source dimensions and `object-contain`.
