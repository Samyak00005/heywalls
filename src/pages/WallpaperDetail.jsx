import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ErrorState, LoadingState } from '../components/common/DataState.jsx'
import DownloadButton from '../components/wallpaper/DownloadButton.jsx'
import WallpaperGrid from '../components/wallpaper/WallpaperGrid.jsx'
import { useWallpaper } from '../hooks/useWallpaper.js'
import { useWallpapers } from '../hooks/useWallpapers.js'

export default function WallpaperDetail() {
  const { id } = useParams()
  const { wallpaper, loading, error } = useWallpaper(id)
  const { wallpapers } = useWallpapers()

  const related = useMemo(() => {
    if (!wallpaper) return []
    return wallpapers
      .filter((w) => w.id !== wallpaper.id && w.category === wallpaper.category)
      .slice(0, 4)
  }, [wallpapers, wallpaper])

  if (loading) {
    return (
      <div className="container-page pt-xl pb-3xl">
        <LoadingState />
      </div>
    )
  }

  if (error || !wallpaper) {
    return (
      <div className="container-page pt-xl pb-3xl">
        <ErrorState error={error} />
      </div>
    )
  }

  const filename = `heywalls-${wallpaper.title.toLowerCase().replace(/\s+/g, '-')}.jpg`
  const aspect = wallpaper.orientation === 'phone' ? 'aspect-[9/16]' : 'aspect-video'

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <Link to="/explore" className="text-label text-ink-soft mb-lg inline-block">
        ← All wallpapers
      </Link>

      <div className="grid md:grid-cols-[1fr_280px] gap-xl">
        <div className={`relative ${aspect} max-w-[640px] rounded-md overflow-hidden border border-line`}>
          <img
            src={wallpaper.fullImageUrl}
            alt={wallpaper.title}
            className="w-full h-full object-cover block"
          />
        </div>

        <div>
          <h1 className="font-display text-h1 mb-sm">{wallpaper.title}</h1>
          {wallpaper.description && (
            <p className="text-body-sm text-ink-soft mb-lg">
              {wallpaper.description}
            </p>
          )}

          <div className="flex flex-wrap gap-sm mb-lg">
            <span className="text-body-sm bg-surface border border-line rounded-md px-lg py-sm">
              {wallpaper.category}
            </span>
            <span className="text-body-sm bg-surface border border-line rounded-md px-lg py-sm capitalize">
              {wallpaper.orientation}
            </span>
          </div>

          <p className="text-label text-ink-soft mb-xl">
            {wallpaper.uploader ? `Uploaded by @${wallpaper.uploader}` : 'Curated by HeyWalls'}
          </p>

          <DownloadButton
            imageUrl={wallpaper.fullImageUrl}
            filename={filename}
            variant="primary"
          />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-4xl">
          <h2 className="font-display text-h2 mb-lg">
            More {wallpaper.category.toLowerCase()}
          </h2>
          <WallpaperGrid wallpapers={related} />
        </div>
      )}
    </div>
  )
}
