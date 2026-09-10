/**
 * Flat card — per the design system, grid cards use a border, not the
 * "hung frame" shadow (that's reserved for the hero moment on Home).
 */
export default function WallpaperCard({ wallpaper }) {
  const { title, imageUrl, orientation, category, uploader } = wallpaper
  const aspect = orientation === 'phone' ? 'aspect-[3/4]' : 'aspect-[4/3]'

  return (
    <div className="border border-line rounded-md overflow-hidden bg-surface">
      <img
        src={imageUrl}
        alt={title}
        className={`w-full ${aspect} object-cover block`}
      />
      <div className="p-lg flex items-center justify-between">
        <span className="text-body-sm text-ink truncate">{title}</span>
        <span className="text-label text-ink-soft shrink-0 ml-sm">
          {uploader ? `@${uploader}` : category}
        </span>
      </div>
    </div>
  )
}
