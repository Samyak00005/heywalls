import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import LibraryFilters, { applyLibraryFilters, DEFAULT_LIBRARY_FILTERS } from '../components/wallpaper/LibraryFilters.jsx'
import WallpaperGrid from '../components/wallpaper/WallpaperGrid.jsx'
import { useFavorites } from '../hooks/useFavorites.js'

export default function Favorites() {
  const { favorites } = useFavorites()
  const [filters, setFilters] = useState(DEFAULT_LIBRARY_FILTERS)
  const categories = useMemo(
    () => [...new Set(favorites.map((item) => item.category).filter(Boolean))].sort(),
    [favorites],
  )
  const filteredWallpapers = useMemo(
    () => applyLibraryFilters(favorites, filters),
    [favorites, filters],
  )

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <section className="min-w-0">
        <div className="flex flex-wrap items-end justify-between gap-lg mb-xl">
          <div>
            <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-xs">Stored in this browser</p>
            <h1 className="font-display text-h1">Saved wallpapers</h1>
            <p className="text-body-sm text-ink-soft mt-sm">Your saved list stays on this device and browser.</p>
          </div>
          {favorites.length > 0 && (
            <span className="text-label text-ink-soft">
              {filteredWallpapers.length} shown · {favorites.length} saved
            </span>
          )}
        </div>

        {favorites.length > 0 ? (
          <>
            <LibraryFilters filters={filters} onChange={setFilters} categories={categories} />
            {filteredWallpapers.length > 0 ? (
              <WallpaperGrid wallpapers={filteredWallpapers} />
            ) : (
              <p className="text-body-sm text-ink-soft py-xl">No saved wallpapers match these filters.</p>
            )}
          </>
        ) : (
          <div className="rounded-md border border-line bg-surface px-xl py-2xl text-center">
            <p className="font-display text-h2">Your saved list is ready</p>
            <p className="text-body-sm text-ink-soft mt-sm mb-lg">Tap the heart on a wallpaper to keep it here.</p>
            <Link to="/explore" className="inline-block bg-accent text-accent-contrast rounded-md px-lg py-sm text-body font-medium">
              Explore wallpapers
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
