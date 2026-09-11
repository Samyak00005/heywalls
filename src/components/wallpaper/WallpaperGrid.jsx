import WallpaperCard from './WallpaperCard.jsx'

/**
 * CSS-columns masonry ("river" layout) instead of a row-based grid. This
 * is what lets a 16:9 desktop card and a 9:16 phone card sit side by side
 * without one stretching to match the other's height.
 */
export default function WallpaperGrid({ wallpapers }) {
  if (!wallpapers.length) {
    return (
      <p className="text-body-sm text-ink-soft py-2xl text-center">
        No wallpapers match those filters yet.
      </p>
    )
  }

  return (
    <div className="columns-2 md:columns-4 gap-md md:gap-lg">
      {wallpapers.map((w) => (
        <WallpaperCard key={w.id} wallpaper={w} />
      ))}
    </div>
  )
}
