import { useEffect, useState } from 'react'
import { LoadingState } from '../components/common/DataState.jsx'
import WallpaperGrid from '../components/wallpaper/WallpaperGrid.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useFavorites } from '../hooks/useFavorites.js'
import { supabase } from '../lib/supabaseClient.js'
import { mapWallpaperRow, WALLPAPER_SELECT } from '../lib/wallpaperMapper.js'

export default function Favorites() {
  const { user } = useAuth()
  const { favoriteIds, loading: favoritesLoading } = useFavorites()
  const [wallpapers, setWallpapers] = useState(null)

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

  if (wallpapers === null) {
    return (
      <div className="container-page pt-xl pb-3xl">
        <LoadingState label="Loading favorites…" />
      </div>
    )
  }

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <h1 className="font-display text-h1 mb-xl">Favorites</h1>
      {wallpapers.length === 0 ? (
        <p className="text-body-sm text-ink-soft py-xl">
          Nothing saved yet — tap the heart on any wallpaper to save it here.
        </p>
      ) : (
        <WallpaperGrid wallpapers={wallpapers} />
      )}
    </div>
  )
}
