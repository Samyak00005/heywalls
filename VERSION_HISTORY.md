# HeyWalls — Version History

This is the single source of truth for the HeyWalls build history. Older per-version notes were consolidated here to avoid duplicate documentation files.

## v21.8 — Search layout and API resilience
- Put image-shape filters on the left and the sort control on the right in one responsive row.
- Show “Search results for” above the actual query and add a retry action for failed searches.
- Preserve Wallhaven’s upstream HTTP status, identify rate limits/timeouts, and cache public detail responses at the edge.
- Queue and session-cache detail lookups to reduce bursts against Wallhaven’s request limit.

## v21.7 — Search, pagination, and mobile polish
- Run the same Wallhaven JSON proxy locally and on Vercel, so local search and “Show more” use the secure response handler.
- Keep existing results visible if a later page fails, show a readable retry message, and add a retry action.
- Show the active search phrase in the Explore heading and keep its sort control compact.
- Simplify the mobile Saved control and add a personal maker note for Samyak Nimsarkar on About.

## v21.6 — Search and image polish
- Removed the duplicate query field from Explore; the universal header search now carries the active query between routes.
- Added live topic suggestions and a soft, pale focus state to the universal search.
- Removed image fade resets that could make wallpapers flash during loading or metadata updates.
- Set desktop hero collage to a 21:9 frame, loaded detail previews from the original image URL, and aligned the detail metadata rows.

## v21.5 — API metadata and global search
- Load wallpaper names and API categories from Wallhaven detail/search data instead of showing generic category-based titles.
- Discover API category groups from returned wallpaper records; keep custom subject searches clearly separate as topics.
- Added alternate thumbnail/original image fallbacks and an unavailable-image placeholder.
- Added a header search that works across routes, improved the About page layout, and removed the source note from the Home hero.

## v21.4 — Categories and fresh discovery
- Added a category directory with 18 subject searches and featured topic links.
- Added an About HeyWalls page and links from the navigation and footer.
- Changed “Show more” controls to use a downward arrow.
- Increased filtered Explore batches to up to 20 matching wallpapers and widened the masonry layout at medium screen widths.
- Switched the Home feed to uncached random results with a per-visit seed.

## v21.3 — Hero collage proportions
- Adjusted the collage columns so each portrait tile matches the combined height of the two stacked landscape previews.
- Added more vertical breathing room around the hero section.

## v21.2 — Home and navigation refinements
- Moved Explore and mood categories into the centered header, with Saved kept at the edge.
- Rebuilt the hero collage with portrait side panels and two stacked landscape previews.
- Added direct Desktop and Mobile browse filters below the hero CTA.
- Reset scroll position when navigating to a different route or search.

## v21.1 — Gallery loading and navigation polish
- Added skeleton states for wallpaper grids, individual images, and wallpaper details.
- Added a Home page “Show more” action backed by paginated results.
- Added Explore and Saved icons to desktop navigation.
- Gave the header and footer a contrasting surface color.
- Preserved the full composition of portrait previews while loading.

## v21.0 — Public wallpaper catalog
- Replaced database-backed browsing with Wallhaven's public SFW API through a Vercel serverless proxy.
- Removed hosted authentication, uploads, collections, moderation, admin pages, database migrations, and dependencies.
- Replaced account favorites with a Saved page stored in browser local storage.
- Added Wallhaven search, filters, sorting, pagination, source links, and cached catalog responses.
- Updated setup and deployment instructions; the public SFW feed requires no API key.

## v0 — Project setup
- Created the Vite + React foundation.
- Added Tailwind CSS v4 and the HeyWalls design tokens.
- Set up routing, project structure, and deployment documentation.

## v1 — Static pages & theme
- Built Navbar, Footer, Layout, WallpaperCard, WallpaperGrid, FilterBar and related reusable UI.
- Built the first Home, Explore and category browsing experience.
- Added the initial visual system, masonry wallpaper layout, fixed desktop/mobile card ratios, Lucide icons and download actions.

## v2 — Database & real data
- Added a relational schema, migrations and seed data for profiles, wallpapers, categories and wallpaper-category relationships.
- Replaced placeholder wallpaper data with live database data.
- Added Wallpaper Detail and Category pages.
- Added shared loading/error states and wallpaper mapping.

## v3 — Authentication & accounts
- Added authentication, signup/login/logout, protected routes and password reset/update flows.
- Added public profiles and Account Settings.
- Added profile self-healing and profile RLS support.
- Added password visibility controls and signup validation.
- Added display-name support later through the profile migration.

## v4 — Uploads, favourites & account foundation
- Added wallpaper upload flow with object storage and moderation status.
- Added favourites, downloads and download counting.
- Added account settings, password change and account deletion flow.
- Added the initial admin/moderation functionality because uploads needed review tools.
- Added collections in the subsequent account-space work.

## v5–v10 — Admin & product refinement
- Expanded the admin dashboard, moderation, wallpaper editing, category management and user-role management.
- Added collections and collection detail flows.
- Refined wallpaper details, profile presentation, navigation, filters, footer and account UI.
- Added contextual account navigation and the protected account-management flows.

## v11 — Global UI polish
- Added consistent interactive hover/active behavior.
- Added keyboard-visible focus states.
- Prevented accidental text selection in browsing UI while keeping form fields selectable.

## v12 — Account & profile improvements
- Added editable display name, username and bio presentation.
- Improved public creator/profile information while keeping email private.
- Added creator information to wallpaper details and My Uploads.

## v16.1 — Account edit/delete refinement
- Reworked Edit Profile into a focused profile-editing page with Cancel and Save actions.
- Save shows a success toast and redirects to the profile.
- Cancel redirects back to the profile.
- Added password + typed confirmation protection for account deletion.
- Added a cancellable delete-account confirmation dialog.

## v17 — Image & performance optimization
- Added optimized remote image requests for listing surfaces.
- Added lazy loading, async decoding and first-viewport priority hints.
- Added short-lived wallpaper metadata caching.
- Preserved original full-resolution images for details and downloads.
- Deliberately avoided blurred placeholders, artificial thumbnail frames and forced cropping.

## v17.1 — Batch wallpaper loading
- Public wallpaper queries load in batches instead of fetching the entire catalog at once.
- Added exact counts so the UI knows when more results exist.
- Explore and Category support Show more / additional batch loading.
- Batches append without duplicating existing wallpapers.
- Kept image optimization and lazy loading intact.

## v18.0 — Search & discovery
- Added server-side search and filtering for Explore and Category.
- Search covers wallpaper title/description, creator username/display name and category.
- Added device, category and sort filtering at the database query level.
- Preserved filter state in the URL.
- Show more continues from the current query.
- Added supporting indexes for search and category joins.

## v18.1 — Account-space restructuring
- Combined My Uploads and Collections temporarily into the account-space experience.
- Added collection creation, listing, counts, descriptions and deletion.
- Preserved compatibility routing for Collections.
- Cleaned up the My Uploads heading and navigation.

## v18.2 — Account navigation refinement
- Removed Admin Dashboard from the main navbar and made it available from the admin user's profile/account area.
- Renamed the mobile account destination to My account.
- Moved Edit Profile Cancel beside Save changes.

## v18.3 — Account-space refinement
- Restored Collections as its own page.
- Standardized visible terminology from Saved to Favourites.
- Updated account-space navigation and My account routing.
- Added subtle search-input background differentiation.
- Connected delete-account navigation to the existing deletion dialog.

## v18.4 — Contextual account sidebars
- Made account sidebars contextual to each page instead of identical everywhere.
- Profile, My Wallpapers, Favourites and Collections each received their appropriate navigation.

## v18.5 — Account sidebar titles
- Standardized My Uploads and Collections page titles.
- Used `Your wallpapers` as the right-side heading for the My Uploads/Collections account-space views.

## v18.6 — Account sidebar cleanup
- Removed the right sidebar from Favourites.
- Removed My Account from the My Uploads sidebar.
- Removed Published Wallpapers and My Collections from the profile sidebar.
- Preserved the contextual navigation structure.

## v18.7 — Device orientation & mobile detail
- Added first-class Tablet orientation alongside Desktop and Mobile.
- Added tablet filtering, upload selection, admin editing and moderation labels.
- Added a lightweight device chooser to Home.
- Hid wallpaper-card action buttons on mobile.
- Removed the tall detail preview container for desktop/tablet wallpapers on mobile; phone wallpapers retain a controlled tall preview.
- Mobile My account opens the public profile; editing uses `/account/edit-profile`.
- Added the tablet-orientation database migration and square-ish wallpaper classification support.

## v18.8 — Responsive UI refinement
- Made contextual account navigation accessible on mobile as a compact stacked section.
- Replaced large Home device cards with understated device links.
- Tablet wallpaper cards use a 1:1 presentation ratio.

## v19.0 — Wallpaper detail experience
- Refined responsive wallpaper detail hierarchy and navigation.
- Preserved full-resolution detail/download sources.
- Standardized device, aspect ratio, resolution and category metadata.
- Added creator information with public profile linking.
- Preserved lazy/batch loading, tablet support and 1:1 tablet cards.

## v19.1 — Wallpaper detail refinement
- Improved detail hierarchy and metadata presentation.
- Added creator display name support.
- Related wallpapers were refined for better device-aware discovery while preserving category relationships.
- Added download feedback through the global toast system.

## v19.2 — Wallpaper detail refinement
- Removed the divider immediately below the title.
- Improved metadata row alignment and spacing.
- Simplified creator text to `Published by: @username`.
- Removed duplicate mobile Share action.
- Added separate desktop Share treatment beside the title.
- Made Download the wider primary action.
- Related wallpapers are category-first across all devices/orientations.
- Explore more opens the relevant category when available.

## v19.3 — Wallpaper detail action layout
- Reduced metadata-row padding.
- Download occupies the full action row.
- Favourite and Collection sit side-by-side below Download.
- Share remains separate beside the title.

## v20 — Search, discovery & creators
- Continued the v19.3 Explore/filter/batch-loading foundation.
- Added the public Creators directory at `/creators`.
- Creators can be searched by display name, username or bio.
- Creator entries link to their public creator experience.
- Kept public creator data private with no email exposure.

## v20.1 — Dedicated creator pages
- Added a separate public creator route: `/creator/:username`.
- Creator pages are intentionally different from account/profile pages.
- Creator pages show only:
  - Creator name
  - Username
  - Bio, when available
  - Number of published uploads
  - Published wallpapers
- Removed account controls, collections, favourites, settings, email and account sidebars from creator pages.
- The Creators directory opens the dedicated creator page.
- `Published by: @username` on wallpaper details opens the dedicated creator page.
- `/profile/:username` remains the user's profile/account experience.

At that point in the project history, v20.1 was the current release.

## v20.2 — Creator experience refinement
- Refined the public Creator page into a clearer portfolio presentation.
- Added creator avatar support with an initials fallback.
- Added a simple `All creators` return link for creator discovery.
- Improved creator header hierarchy and published-wallpaper count treatment.
- Refined the Creators directory into a cleaner editorial list rather than boxed cards.
- Added clearer creator identity, bio preview, wallpaper count and directional navigation.
- Preserved the separation between public creator pages and account/profile controls.

At that point in the project history, v20.2 was the current release.

## Current version
**v21.8 — Search Layout and API Resilience**

The next version should build on this state. Update this file whenever a new version is completed.
