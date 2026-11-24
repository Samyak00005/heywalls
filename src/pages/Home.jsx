import { Link } from 'react-router-dom'
import { ArrowDown, ArrowUpRight, Monitor, Smartphone } from 'lucide-react'
import { ErrorState } from '../components/common/DataState.jsx'
import OptimizedImage from '../components/wallpaper/OptimizedImage.jsx'
import WallpaperGrid, { WallpaperGridSkeleton } from '../components/wallpaper/WallpaperGrid.jsx'
import { useWallpapers } from '../hooks/useWallpapers.js'
import { WALLPAPER_TOPICS } from '../lib/categories.js'

const deviceLinks = [
  { label: 'Desktop', orientation: 'desktop', icon: Monitor },
  { label: 'Mobile', orientation: 'phone', icon: Smartphone },
]

function chooseHeroWallpapers(wallpapers) {
  const phones = wallpapers.filter((wallpaper) => wallpaper.orientation === 'phone')
  const desktops = wallpapers.filter((wallpaper) => wallpaper.orientation === 'desktop')
  const selected = new Set()

  function take(preferred) {
    const wallpaper = preferred.find((item) => !selected.has(item.id))
      || wallpapers.find((item) => !selected.has(item.id))
    if (wallpaper) selected.add(wallpaper.id)
    return wallpaper || null
  }

  return {
    left: take(phones),
    top: take(desktops),
    bottom: take(desktops),
    right: take(phones),
  }
}

function HeroTile({ wallpaper, orientation, loading = false, priority = false }) {
  const portrait = orientation === 'phone'
  const aspect = portrait ? 'aspect-[9/16]' : 'aspect-[16/9]'
  const tileShape = `${aspect} lg:aspect-auto lg:h-full`

  if (loading) {
    return (
      <div
        aria-hidden="true"
        className={`${tileShape} rounded-md border border-line bg-surface`}
      />
    )
  }

  if (!wallpaper) {
    return <div aria-hidden="true" className={`${tileShape} rounded-md border border-line bg-surface`} />
  }

  return (
    <Link
      to={`/wallpaper/${wallpaper.id}`}
      className={`relative block overflow-hidden rounded-md border border-line bg-surface shadow-hung ${tileShape}`}
    >
      <OptimizedImage
        src={wallpaper.imageUrl}
        fallbackSources={wallpaper.imageFallbackUrls}
        alt={wallpaper.title}
        width={portrait ? 520 : 760}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={`block h-full w-full ${portrait ? 'object-contain' : 'object-cover'}`}
      />
    </Link>
  )
}

function HeroCollage({ wallpapers, loading }) {
  const hero = chooseHeroWallpapers(wallpapers)

  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_minmax(0,0.8fr)] items-center gap-sm md:gap-md lg:aspect-[21/9] lg:items-stretch">
      <HeroTile wallpaper={hero.left} orientation="phone" loading={loading} priority />
      <div className="grid min-w-0 gap-sm md:gap-md lg:h-full lg:grid-rows-2">
        <HeroTile wallpaper={hero.top} orientation="desktop" loading={loading} priority />
        <HeroTile wallpaper={hero.bottom} orientation="desktop" loading={loading} />
      </div>
      <HeroTile wallpaper={hero.right} orientation="phone" loading={loading} />
    </div>
  )
}

export default function Home() {
  const { wallpapers, loading, loadingMore, error, loadMoreError, hasMore, loadMore, retry, totalCount } = useWallpapers({ sort: 'random' })

  return (
    <div>
      <section className="container-page grid items-center gap-2xl pt-2xl pb-3xl md:pt-5xl md:pb-5xl lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] lg:gap-4xl">
        <div>
          <p className="mb-md text-label uppercase tracking-[0.12em] text-ink-soft">A personal wallpaper library</p>
          <h1 className="mb-lg max-w-[680px] font-display italic text-display">
            Walls worth living with.
          </h1>
          <p className="mb-xl max-w-[460px] text-body text-ink-soft">
            Find a wallpaper that feels like yours. Save the ones you love and keep them close in this browser.
          </p>
          <Link to="/explore" className="inline-flex rounded-md bg-accent px-lg py-sm text-body font-medium text-accent-contrast">
            Explore wallpapers
          </Link>

          <nav className="mt-xl flex flex-wrap items-center gap-sm" aria-label="Browse wallpapers by device">
            <span className="mr-xs text-label uppercase tracking-[0.08em] text-ink-soft">Browse by</span>
            {deviceLinks.map(({ label, orientation, icon: Icon }) => (
              <Link
                key={orientation}
                to={`/explore?orientation=${orientation}`}
                className="inline-flex items-center gap-xs rounded-md border border-line bg-surface px-md py-sm text-body-sm text-ink transition-colors hover:border-ink-soft"
              >
                <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>

        </div>

        <HeroCollage wallpapers={wallpapers} loading={loading} />
      </section>

      <section className="container-page pb-2xl" aria-labelledby="home-categories-heading">
        <div className="mb-md flex flex-wrap items-baseline justify-between gap-sm">
          <h2 id="home-categories-heading" className="font-display text-h2">Browse by topic</h2>
          <Link to="/categories" className="inline-flex items-center gap-xs text-body-sm text-ink-soft hover:text-ink">
            All categories <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>
        <nav className="flex flex-wrap gap-sm" aria-label="Popular wallpaper categories">
          {WALLPAPER_TOPICS.slice(0, 8).map(({ slug, name }) => (
            <Link key={slug} to={`/category/${slug}`} className="rounded-md border border-line bg-surface px-md py-sm text-body-sm text-ink transition-colors hover:border-ink-soft">
              {name}
            </Link>
          ))}
        </nav>
      </section>

      <section className="container-page pb-3xl md:pb-4xl">
        <div className="mb-lg flex flex-wrap items-baseline justify-between gap-sm">
          <div>
            <p className="mb-xs text-label uppercase tracking-[0.08em] text-ink-soft">A new mix from Wallhaven</p>
            <h2 className="font-display text-h2">Fresh wallpapers</h2>
          </div>
          {totalCount != null && <span className="text-label text-ink-soft">{totalCount.toLocaleString()} to explore</span>}
        </div>
        {loading && <WallpaperGridSkeleton count={8} />}
        {error && wallpapers.length === 0 && <ErrorState error={error} onRetry={retry} />}
        {!loading && wallpapers.length > 0 && <WallpaperGrid wallpapers={wallpapers} columns={4} />}
        {loadingMore && <div className="mt-xl"><WallpaperGridSkeleton count={4} /></div>}
        {loadMoreError && <p role="alert" className="mt-lg text-center text-body-sm text-ink-soft">{loadMoreError.message}</p>}
        {!loading && !error && hasMore && (
          <div className="mt-2xl flex justify-center">
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-xs rounded-md border border-ink bg-surface px-lg py-sm text-body-sm text-ink transition-colors hover:bg-bg disabled:cursor-wait disabled:opacity-60"
            >
              {loadingMore ? 'Loading more wallpapers…' : <>{loadMoreError ? 'Try again' : 'Show more wallpapers'} <ArrowDown size={16} strokeWidth={1.8} aria-hidden="true" /></>}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
