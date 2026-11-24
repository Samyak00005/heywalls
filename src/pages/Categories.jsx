import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ErrorState } from '../components/common/DataState.jsx'
import { useWallpapers } from '../hooks/useWallpapers.js'
import { WALLPAPER_TOPICS } from '../lib/categories.js'

export default function Categories() {
  const { wallpapers, loading, error, retry } = useWallpapers({ sort: 'random' })
  const apiCategories = [...new Map(
    wallpapers
      .filter((wallpaper) => wallpaper.apiCategory)
      .map((wallpaper) => [wallpaper.apiCategory, {
        slug: wallpaper.apiCategory.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        name: wallpaper.category,
        apiCategory: wallpaper.apiCategory,
      }]),
  ).values()].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <p className="mb-xs text-label uppercase tracking-[0.08em] text-ink-soft">Browse the collection</p>
      <h1 className="font-display text-h1">Wallpaper categories</h1>
      <p className="mt-sm max-w-[620px] text-body-sm text-ink-soft">
        Wallhaven’s category groups are read from the wallpaper results. Choose one, or browse subject searches below.
      </p>

      <section className="mt-2xl" aria-labelledby="api-categories-heading">
        <h2 id="api-categories-heading" className="mb-md font-display text-h2">Wallhaven categories</h2>
        {error && wallpapers.length === 0 && <ErrorState error={error} onRetry={retry} />}
        {loading && (
          <div className="grid grid-cols-1 gap-sm sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => <div key={index} aria-hidden="true" className="h-20 animate-pulse rounded-md border border-line bg-surface" />)}
          </div>
        )}
        {!loading && !apiCategories.length && !error && <p className="text-body-sm text-ink-soft">No categories are available right now. Try again in a moment.</p>}
        {!loading && apiCategories.length > 0 && (
          <nav className="grid grid-cols-1 gap-sm sm:grid-cols-2 md:grid-cols-3" aria-label="Wallhaven API categories">
            {apiCategories.map(({ slug, name, apiCategory }) => (
              <Link key={apiCategory} to={`/category/${slug}?apiCategory=${encodeURIComponent(apiCategory)}`} className="group flex items-center justify-between gap-md rounded-md border border-line bg-surface p-lg transition-colors hover:border-ink-soft hover:bg-bg">
                <span className="font-display text-h3 text-ink">{name}</span>
                <ArrowUpRight size={18} strokeWidth={1.8} className="shrink-0 text-ink-soft" aria-hidden="true" />
              </Link>
            ))}
          </nav>
        )}
      </section>

      <section className="mt-3xl" aria-labelledby="topic-searches-heading">
        <h2 id="topic-searches-heading" className="mb-md font-display text-h2">Explore topics</h2>
        <nav className="flex flex-wrap gap-sm" aria-label="Wallpaper topic searches">
          {WALLPAPER_TOPICS.map(({ slug, name }) => (
            <Link key={slug} to={`/category/${slug}`} className="rounded-md border border-line bg-surface px-md py-sm text-body-sm text-ink transition-colors hover:border-ink-soft">
              {name}
            </Link>
          ))}
        </nav>
      </section>
    </div>
  )
}
