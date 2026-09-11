import { Link } from 'react-router-dom'
import DownloadButton from './DownloadButton.jsx'
import FavoriteButton from './FavoriteButton.jsx'

/**
 * Fixed ratios by orientation — this is what makes the masonry grid in
 * WallpaperGrid line up cleanly instead of leaving gaps. 'both' wallpapers
 * default to the desktop ratio for the thumbnail; the full-size page is
 * where the actual phone/desktop variants get chosen.
 */
export default function WallpaperCard({ wallpaper }) {
  const { id, title, imageUrl, orientation, category, uploader } = wallpaper
  const aspect = orientation === 'phone' ? 'aspect-[9/16]' : 'aspect-video'
  const filename = `heywalls-${title.toLowerCase().replace(/\s+/g, '-')}.jpg`

  return (
    <div className="break-inside-avoid mb-md md:mb-lg border border-line rounded-md overflow-hidden bg-surface">
      <Link to={`/wallpaper/${id}`} className={`relative block ${aspect}`}>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover block"
        />
        <DownloadButton imageUrl={imageUrl} filename={filename} wallpaperId={id} />
        <FavoriteButton wallpaperId={id} />
      </Link>
      <div className="p-lg flex items-center justify-between">
        <Link to={`/wallpaper/${id}`} className="text-body-sm text-ink truncate">
          {title}
        </Link>
        <span className="text-label text-ink-soft shrink-0 ml-sm">
          {uploader ? `@${uploader}` : category}
        </span>
      </div>
    </div>
  )
}
