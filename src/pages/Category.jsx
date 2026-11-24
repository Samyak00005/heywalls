import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ErrorState } from '../components/common/DataState.jsx'
import WallpaperGrid, { WallpaperGridSkeleton } from '../components/wallpaper/WallpaperGrid.jsx'
import { useWallpapers } from '../hooks/useWallpapers.js'
import { getWallpaperTopic } from '../lib/categories.js'
import { ArrowDown } from 'lucide-react'

function titleCase(slug = '') {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default function Category() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const apiCategory = searchParams.get('apiCategory') || ''
  const topic = getWallpaperTopic(slug)
  const { wallpapers, loading, loadingMore, error, loadMoreError, hasMore, loadMore } = useWallpapers(
    apiCategory ? { apiCategory } : { categorySlug: topic?.query || slug.replace(/-/g, ' ') },
  )

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <Link to="/explore" className="text-label text-ink-soft mb-sm inline-block">← All wallpapers</Link>
      <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-xs">Wallhaven search</p>
      <h1 className="font-display text-h1 mb-xl">{topic?.name || titleCase(slug)}</h1>

      {loading && <WallpaperGridSkeleton count={20} />}
      {error && <ErrorState error={error} />}
      {!loading && !error && (
        <>
          <WallpaperGrid wallpapers={wallpapers} />
          {loadMoreError && <p role="alert" className="mt-lg text-center text-body-sm text-ink-soft">{loadMoreError.message}</p>}
          {hasMore && (
            <div className="mt-2xl flex justify-center">
              <button type="button" onClick={loadMore} disabled={loadingMore} className="inline-flex items-center gap-xs border border-line bg-surface rounded-md px-lg py-sm text-body-sm text-ink disabled:opacity-60">
                {loadingMore ? 'Loading more…' : <>{loadMoreError ? 'Try again' : 'Show more wallpapers'} <ArrowDown size={16} strokeWidth={1.8} aria-hidden="true" /></>}
              </button>
            </div>
          )}
          {loadingMore && <div className="mt-xl"><WallpaperGridSkeleton count={4} /></div>}
        </>
      )}
    </div>
  )
}
