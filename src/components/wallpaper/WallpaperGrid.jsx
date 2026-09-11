import WallpaperCard from './WallpaperCard.jsx'

/**
 * CSS-columns masonry ("river" layout) instead of a row-based grid. This
 * is what lets a 16:9 desktop card and a 9:16 phone card sit side by side
 * without one stretching to match the other's height.
 */
export default function WallpaperGrid({ wallpapers, columns = 'auto' }) {
  if (!wallpapers.length) {
    return (
      <p className="text-body-sm text-ink-soft py-2xl text-center">
        No wallpapers match those filters yet.
      </p>
    )
  }

  const allPhone = wallpapers.length > 0 && wallpapers.every((w) => w.orientation === 'phone')
  const columnClass =
    columns === 4
      ? 'lg:columns-4'
      : columns === 5
        ? 'lg:columns-5'
        : allPhone
          ? 'lg:columns-5'
          : 'lg:columns-4'

  return (
    <div className={`columns-2 sm:columns-3 ${columnClass} gap-sm sm:gap-md lg:gap-lg`}>
      {wallpapers.map((w, index) => (
        <WallpaperCard key={w.id} wallpaper={w} priority={index < 4} />
      ))}
    </div>
  )
}
