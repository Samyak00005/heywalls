import WallpaperCard from './WallpaperCard.jsx'

export default function WallpaperGrid({ wallpapers }) {
  if (!wallpapers.length) {
    return (
      <p className="text-body-sm text-ink-soft py-2xl text-center">
        No wallpapers match those filters yet.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-md md:gap-lg">
      {wallpapers.map((w) => (
        <WallpaperCard key={w.id} wallpaper={w} />
      ))}
    </div>
  )
}
