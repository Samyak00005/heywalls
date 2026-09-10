import { useMemo, useState } from 'react'
import FilterBar from '../components/wallpaper/FilterBar.jsx'
import WallpaperGrid from '../components/wallpaper/WallpaperGrid.jsx'
import { categories, placeholderWallpapers } from '../utils/placeholderData.js'

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeOrientation, setActiveOrientation] = useState(null)

  // Filtering placeholder data client-side for now — Phase 2 replaces this
  // with a real Supabase query using the same category/orientation state.
  const filtered = useMemo(() => {
    return placeholderWallpapers.filter((w) => {
      if (activeCategory && w.category !== activeCategory) return false
      if (activeOrientation && w.orientation !== activeOrientation) return false
      return true
    })
  }, [activeCategory, activeOrientation])

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <h1 className="font-display text-h1 mb-xl">Explore</h1>

      <FilterBar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        activeOrientation={activeOrientation}
        onOrientationChange={setActiveOrientation}
      />

      <WallpaperGrid wallpapers={filtered} />
    </div>
  )
}
