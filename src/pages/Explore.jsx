import { useMemo, useState } from 'react'
import { ErrorState, LoadingState } from '../components/common/DataState.jsx'
import FilterBar from '../components/wallpaper/FilterBar.jsx'
import WallpaperGrid from '../components/wallpaper/WallpaperGrid.jsx'
import { useCategories } from '../hooks/useCategories.js'
import { useWallpapers } from '../hooks/useWallpapers.js'

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeOrientation, setActiveOrientation] = useState(null)

  const { wallpapers, loading, error } = useWallpapers()
  const { categories } = useCategories()

  // Full list comes from Supabase now — filtering still happens client-side
  // since the dataset is small. Real server-side filtering can replace
  // this later if the catalog grows large enough to matter.
  const filtered = useMemo(() => {
    return wallpapers.filter((w) => {
      if (activeCategory && w.category !== activeCategory) return false
      if (activeOrientation && w.orientation !== activeOrientation) return false
      return true
    })
  }, [wallpapers, activeCategory, activeOrientation])

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <h1 className="font-display text-h1 mb-xl">Explore</h1>

      <FilterBar
        categories={categories.map((c) => c.name)}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activeOrientation={activeOrientation}
        onOrientationChange={setActiveOrientation}
      />

      {loading && <LoadingState />}
      {error && <ErrorState error={error} />}
      {!loading && !error && <WallpaperGrid wallpapers={filtered} />}
    </div>
  )
}
