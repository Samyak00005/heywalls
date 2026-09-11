import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ErrorState, LoadingState } from '../components/common/DataState.jsx'
import DownloadButton from '../components/wallpaper/DownloadButton.jsx'
import FavoriteButton from '../components/wallpaper/FavoriteButton.jsx'
import ShareButton from '../components/wallpaper/ShareButton.jsx'
import CollectionButton from '../components/wallpaper/CollectionButton.jsx'
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
      .slice(0, 8)
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
  const aspectLabel = wallpaper.orientation === 'phone' ? '9:16' : '16:9'
  const orientationLabel = wallpaper.orientation === 'phone' ? 'Mobile' : 'Desktop'

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <Link to="/explore" className="text-label text-ink-soft mb-lg inline-block">
        ← All wallpapers
      </Link>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-2xl lg:gap-4xl items-start">
        <div className="min-w-0 flex justify-center lg:justify-start">
          <div className={`relative flex items-center justify-center w-full min-h-0 max-h-[68vh] lg:max-h-[72vh] rounded-md overflow-hidden border border-line bg-surface ${wallpaper.orientation === 'phone' ? 'lg:max-w-[520px]' : 'lg:max-w-[920px]'}`}>
            <img
              src={wallpaper.fullImageUrl}
              alt={wallpaper.title}
              className="block max-w-full max-h-[68vh] lg:max-h-[72vh] w-auto h-auto object-contain"
            />
          </div>
        </div>

        <div className="lg:sticky lg:top-xl">
          <div className="flex items-start gap-md">
            <h1 className="font-display text-h1 mb-sm flex-1">{wallpaper.title}</h1>
            <div className="lg:hidden shrink-0 -mt-sm">
              <ShareButton
                title={wallpaper.title}
                variant="ghost-icon"
              />
            </div>
          </div>

          {wallpaper.description && (
            <p className="text-body-sm text-ink-soft mb-lg">
              {wallpaper.description}
            </p>
          )}

          <div className="mb-xl">
            <p className="text-body-sm text-ink mb-xs">
              {orientationLabel} · {aspectLabel}
            </p>
            <p className="text-body-sm text-ink-soft">
              Resolution: {wallpaper.resolution || 'Not available'}
            </p>
          </div>

          <p className="text-label text-ink-soft mb-xl">
            {wallpaper.uploader ? `Uploaded by @${wallpaper.uploader}` : 'Curated by HeyWalls'}
          </p>

          <div className="hidden lg:flex flex-wrap gap-sm">
            <DownloadButton
              imageUrl={wallpaper.fullImageUrl}
              filename={filename}
              wallpaperId={wallpaper.id}
              variant="primary"
            />
            <FavoriteButton wallpaperId={wallpaper.id} variant="primary" />
            <CollectionButton wallpaperId={wallpaper.id} />
            <ShareButton title={wallpaper.title} variant="primary" />
          </div>

          <div className="lg:hidden flex flex-wrap gap-sm">
            <DownloadButton
              imageUrl={wallpaper.fullImageUrl}
              filename={filename}
              wallpaperId={wallpaper.id}
              variant="primary"
            />
            <FavoriteButton wallpaperId={wallpaper.id} variant="primary" />
            <CollectionButton wallpaperId={wallpaper.id} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-4xl">
          <h2 className="font-display text-h2 mb-lg">
            Related wallpapers
          </h2>
          <WallpaperGrid wallpapers={related} />
        </div>
      )}
    </div>
  )
}
