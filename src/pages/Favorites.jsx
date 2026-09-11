import { useEffect, useMemo, useState } from 'react'
import { LoadingState } from '../components/common/DataState.jsx'
import LibraryFilters, { applyLibraryFilters, DEFAULT_LIBRARY_FILTERS } from '../components/wallpaper/LibraryFilters.jsx'
import { useCategories } from '../hooks/useCategories.js'
import WallpaperGrid from '../components/wallpaper/WallpaperGrid.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useFavorites } from '../hooks/useFavorites.js'
import { supabase } from '../lib/supabaseClient.js'
import { mapWallpaperRow, WALLPAPER_SELECT } from '../lib/wallpaperMapper.js'

export default function Favorites() {
  const { user } = useAuth()
  const { favoriteIds, loading: favoritesLoading } = useFavorites()
  const [wallpapers, setWallpapers] = useState(null)
  const [filters, setFilters] = useState(DEFAULT_LIBRARY_FILTERS)
  const { categories } = useCategories()

  useEffect(() => {
    if (!user || favoritesLoading) return
    if (favoriteIds.size === 0) {
      setWallpapers([])
      return
    }
    supabase
      .from('wallpapers')
      .select(WALLPAPER_SELECT)
      .in('id', Array.from(favoriteIds))
      .then(({ data }) => setWallpapers((data || []).map(mapWallpaperRow)))
  }, [user, favoriteIds, favoritesLoading])

  const filteredWallpapers = useMemo(() => applyLibraryFilters(wallpapers || [], filters), [wallpapers, filters])

  if (wallpapers === null) {
    return (
      <div className="container-page pt-xl pb-3xl">
        <LoadingState label="Loading favourites…" />
      </div>
    )
  }

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <section className="min-w-0">
      <div className="flex flex-wrap items-end justify-between gap-lg mb-xl">
        <div>
          <h1 className="font-display text-h1">Favourites</h1>
          <p className="text-body-sm text-ink-soft mt-sm">Your favourite wallpapers.</p>
        </div>
        {wallpapers.length > 0 && <span className="text-label text-ink-soft">{filteredWallpapers.length} shown · {wallpapers.length} favourites</span>}
      </div>

      {wallpapers.length > 0 && (
        <LibraryFilters filters={filters} onChange={setFilters} categories={categories} />
      )}
      {filteredWallpapers.length === 0 ? (
        <p className="text-body-sm text-ink-soft py-xl">
          {wallpapers.length === 0 ? 'Nothing here yet — tap the heart on any wallpaper to add it to your favourites.' : 'No favourites match these filters.'}
        </p>
      ) : (
        <WallpaperGrid wallpapers={filteredWallpapers} />
      )}
      </section>
    </div>
  )
}
