import { useEffect, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { ErrorState } from '../components/common/DataState.jsx'
import FilterBar from '../components/wallpaper/FilterBar.jsx'
import WallpaperGrid, { WallpaperGridSkeleton } from '../components/wallpaper/WallpaperGrid.jsx'
import { useWallpapers } from '../hooks/useWallpapers.js'

export default function Explore() {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const [query, setQuery] = useState(params.get('q') || '')
  const [orientation, setOrientation] = useState(params.get('orientation') || params.get('device') || 'all')
  const [sort, setSort] = useState(params.get('sort') || 'newest')
  const { wallpapers, loading, loadingMore, error, loadMoreError, hasMore, loadMore, retry, totalCount } = useWallpapers({
    query,
    orientation,
    sort,
  })

  useEffect(() => {
    const incoming = new URLSearchParams(location.search)
    setQuery(incoming.get('q') || '')
    setOrientation(incoming.get('orientation') || incoming.get('device') || 'all')
    setSort(incoming.get('sort') || 'newest')
  }, [location.search])

  useEffect(() => {
    const next = new URLSearchParams()
    if (query.trim()) next.set('q', query.trim())
    if (orientation !== 'all') next.set('orientation', orientation)
    if (sort !== 'newest') next.set('sort', sort)
    const nextUrl = next.toString() ? `/explore?${next.toString()}` : '/explore'
    window.history.replaceState(null, '', nextUrl)
  }, [location.pathname, orientation, query, sort])

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <div className="flex flex-wrap items-end justify-between gap-lg mb-xl">
        <div>
          <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-xs">{query.trim() ? 'Search results for' : 'Wallhaven collection'}</p>
          <h1 className="font-display text-h1 break-words">{query.trim() || 'Explore'}</h1>
          {totalCount != null && <p className="text-body-sm text-ink-soft mt-sm">{totalCount.toLocaleString()} wallpapers found</p>}
        </div>
      </div>

      <FilterBar
        activeOrientation={orientation}
        onOrientationChange={setOrientation}
        query={query}
        onQueryChange={setQuery}
        showQuery={false}
        sort={sort}
        onSortChange={setSort}
      />

      {loading && <WallpaperGridSkeleton count={orientation === 'all' ? 8 : 20} />}
      {error && <ErrorState error={error} onRetry={retry} />}
      {!loading && !error && (
        <>
          {wallpapers.length === 0 ? (
            <div className="py-3xl text-center">
              <p className="font-display text-h2">No wallpapers found</p>
              <p className="text-body-sm text-ink-soft mt-sm">Try another search or image shape.</p>
            </div>
          ) : (
            <WallpaperGrid wallpapers={wallpapers} />
          )}
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
