import { Link, useParams } from 'react-router-dom'
import { ErrorState, LoadingState } from '../components/common/DataState.jsx'
import WallpaperGrid from '../components/wallpaper/WallpaperGrid.jsx'
import { useWallpapers } from '../hooks/useWallpapers.js'
import { useCategories } from '../hooks/useCategories.js'

export default function Category() {
  const { slug } = useParams()
  const { categories } = useCategories()
  const category = categories.find((item) => item.slug === slug)
  const { wallpapers, loading, loadingMore, error, hasMore, loadMore } = useWallpapers({ categorySlug: slug })

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <Link to="/explore" className="text-label text-ink-soft mb-sm inline-block">← All wallpapers</Link>
      <h1 className="font-display text-h1 mb-xl capitalize">{category?.name || slug}</h1>

      {loading && <LoadingState />}
      {error && <ErrorState error={error} />}
      {!loading && !error && (
        <>
          <WallpaperGrid wallpapers={wallpapers} />
          {hasMore && (
            <div className="mt-2xl flex justify-center">
              <button type="button" onClick={loadMore} disabled={loadingMore} className="border border-line bg-surface rounded-md px-lg py-sm text-body-sm text-ink disabled:opacity-60">
                {loadingMore ? 'Loading more…' : 'Show more wallpapers →'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
