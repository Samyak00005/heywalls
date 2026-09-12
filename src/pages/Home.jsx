import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ErrorState, LoadingState } from '../components/common/DataState.jsx'
import { Layers3, Leaf, Minus, Orbit, Palette, Sparkles } from 'lucide-react'
import WallpaperGrid from '../components/wallpaper/WallpaperGrid.jsx'
import OptimizedImage from '../components/wallpaper/OptimizedImage.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useCategories } from '../hooks/useCategories.js'
import { useWallpapers } from '../hooks/useWallpapers.js'

const rotations = ['-2deg', '1.5deg', '-1deg', '2deg', '-1.5deg', '1deg']

const deviceLinks = [
  { label: 'Desktop wallpapers', device: 'desktop' },
  { label: 'Mobile wallpapers', device: 'phone' },
  { label: 'Tablet wallpapers', device: 'tablet' },
]

const moodIcons = {
  abstract: Palette,
  anime: Sparkles,
  minimal: Minus,
  nature: Leaf,
  space: Orbit,
  stock: Palette,
  superhero: Palette,
  texture: Layers3,
}

function MoodCard({ category }) {
  const Icon = moodIcons[category.slug] || Palette

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group flex min-w-[118px] flex-1 items-center gap-md rounded-md border border-line bg-surface px-md py-md transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-soft hover:shadow-hung"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-bg text-ink-soft transition-colors group-hover:text-ink">
        <Icon size={17} strokeWidth={1.7} />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-body-sm text-ink">{category.name}</span>
        <span className="mt-xs block text-label text-ink-soft">Explore mood</span>
      </span>
    </Link>
  )
}

/**
 * Curates a repeating hero rhythm: one 9:16 phone wallpaper beside two
 * 16:9 desktop wallpapers stacked vertically. The group repeats when there
 * are enough images and gracefully falls back when the catalog is smaller.
 */
function pickHero(wallpapers, count = 6) {
  const phones = wallpapers.filter((w) => w.orientation === 'phone')
  const desktops = wallpapers.filter((w) => w.orientation === 'desktop')

  // The desktop hero repeats this composition:
  //   [ vertical | horizontal ]
  //   [ vertical | horizontal ]
  // followed by another group when enough wallpapers exist.
  // This keeps the visual rhythm balanced while preserving each image's
  // intended orientation.
  const preferred = [
    phones[0],
    desktops[0],
    desktops[1],
    phones[1],
    desktops[2],
    desktops[3],
  ].filter(Boolean)

  if (preferred.length >= 3) return preferred.slice(0, count)

  return wallpapers.slice(0, count)
}

export default function Home() {
  const { user } = useAuth()
  const { wallpapers, loading, error, totalCount } = useWallpapers()
  const { categories } = useCategories()

  // "Hung gallery" strip and the community section both pull from the same
  // live dataset for now — Phase 4 will split this by uploader_id once
  // real user uploads exist alongside curated content.
  const hung = useMemo(() => pickHero(wallpapers, 6), [wallpapers])
  const spotlight = useMemo(() => {
    const hungIds = new Set(hung.map((w) => w.id))
    return wallpapers.filter((w) => !hungIds.has(w.id)).slice(0, 20)
  }, [wallpapers, hung])

  return (
    <div>
      <section className="container-page pt-lg md:pt-2xl pb-xl md:pb-3xl">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] gap-2xl lg:gap-4xl items-end">
          <div>
            <h1 className="font-display italic text-display max-w-[620px] mb-lg">
              Walls worth living with.
            </h1>
            <p className="text-body text-ink-soft max-w-[420px] mb-xl">
              Wallpapers curated by us, uploaded by everyone else. Pick a mood,
              grab it for your phone, tablet, or desktop, done.
            </p>
            <div className="flex gap-sm">
              <Link
                to="/explore"
                className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body font-medium"
              >
                Explore wallpapers
              </Link>
            </div>
            <nav className="mt-lg flex flex-wrap items-center gap-x-lg gap-y-sm text-body-sm text-ink-soft" aria-label="Browse by device">
              <span className="text-label uppercase tracking-[0.08em]">Browse by</span>
              {deviceLinks.map(({ label, device }) => (
                <Link
                  key={device}
                  to={`/explore?device=${device}`}
                  className="text-ink hover:underline underline-offset-4"
                >
                  {label.replace(' wallpapers', '')}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden lg:grid grid-cols-3 border-y border-line py-lg gap-lg">
            <div>
              <p className="font-display text-h2">{totalCount ?? '—'}</p>
              <p className="text-label text-ink-soft mt-xs">walls to explore</p>
            </div>
            <div>
              <p className="font-display text-h2">{categories.length || '—'}</p>
              <p className="text-label text-ink-soft mt-xs">moods & categories</p>
            </div>
            <div>
              <p className="font-display text-h2">9:16 / 4:3 / 16:9</p>
              <p className="text-label text-ink-soft mt-xs">phone + tablet + desktop</p>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="container-page pb-3xl">
          <ErrorState error={error} />
        </div>
      )}

      {!error && loading && (
        <div className="container-page pb-3xl">
          <LoadingState />
        </div>
      )}

      {!error && !loading && (
        <>
          <div className="container-page pb-3xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-md md:gap-lg w-full">
              {Array.from({ length: Math.ceil(hung.length / 3) }, (_, groupIndex) => {
                const group = hung.slice(groupIndex * 3, groupIndex * 3 + 3)

                if (!group.length) return null

                return (
                  <div
                    key={`hero-group-${groupIndex}`}
                    className="flex items-start gap-md md:gap-lg min-w-0"
                  >
                    {group[0] && (
                      <Link
                        to={`/wallpaper/${group[0].id}`}
                        className="bg-surface p-sm rounded-sm shadow-hung block min-w-0 w-[38.7%]"
                        style={{ transform: `rotate(${rotations[groupIndex * 3] || '0deg'})` }}
                      >
                        <div className="aspect-[9/16]">
                          <OptimizedImage
                            src={group[0].imageUrl}
                            alt={group[0].title}
                            width={520}
                            quality={84}
                            loading="eager"
                            fetchPriority="high"
                            className="rounded-sm block w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-label text-ink-soft text-center mt-sm truncate">
                          {group[0].category}
                        </p>
                      </Link>
                    )}

                    <div className="flex flex-col gap-md md:gap-lg min-w-0 flex-1">
                      {group.slice(1, 3).map((w, index) => (
                        <Link
                          key={w.id}
                          to={`/wallpaper/${w.id}`}
                          className="bg-surface p-sm rounded-sm shadow-hung block min-w-0"
                          style={{
                            transform: `rotate(${
                              rotations[groupIndex * 3 + index + 1] || '0deg'
                            })`,
                          }}
                        >
                          <div className="aspect-[16/9]">
                            <OptimizedImage
                              src={w.imageUrl}
                              alt={w.title}
                              width={760}
                              quality={84}
                              loading={groupIndex === 0 ? 'eager' : 'lazy'}
                              fetchPriority={groupIndex === 0 ? 'high' : 'auto'}
                              className="rounded-sm block w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-label text-ink-soft text-center mt-sm truncate">
                            {w.category}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <section className="container-page pb-3xl md:pb-4xl">
            <div className="flex items-baseline justify-between mb-lg">
              <h2 className="font-display text-h2">Pick a mood</h2>
              <span className="text-label text-ink-soft">
                {categories.length} categories
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-sm md:gap-md">
              {categories.map((c) => (
                <MoodCard key={c.id} category={c} />
              ))}
            </div>
          </section>

          <section className="container-page pb-3xl md:pb-4xl">
            <div className="flex items-baseline justify-between mb-lg">
              <h2 className="font-display text-h2">Fresh on HeyWalls</h2>
              <span className="text-label text-ink-soft">updated daily</span>
            </div>
            <WallpaperGrid wallpapers={spotlight} columns={4} />
          </section>
        </>
      )}

      <section className="container-page pb-3xl md:pb-4xl">
        <div className="border border-dashed border-ink-soft rounded-lg p-xl md:p-2xl">
          <h3 className="font-display text-h3 mb-sm">
            Got a wall worth sharing?
          </h3>
          <p className="text-body-sm text-ink-soft max-w-[380px] mb-lg">
            Drop your desktop, tablet, or phone wallpaper and let the community grab
            it.
          </p>
          <Link
            to={user ? '/upload' : '/login'}
            className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body font-medium inline-block"
          >
            Upload a wallpaper
          </Link>
        </div>
      </section>
    </div>
  )
}
