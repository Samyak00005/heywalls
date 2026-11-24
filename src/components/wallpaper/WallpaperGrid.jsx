import WallpaperCard from "./WallpaperCard.jsx";

const SKELETON_SHAPES = [
  "aspect-[9/16]",
  "aspect-[16/9]",
  "aspect-[4/5]",
  "aspect-square",
];

export function WallpaperGridSkeleton({ count = 8 }) {
  return (
    <div
      className="columns-2 sm:columns-3 md:columns-4 gap-sm sm:gap-md lg:gap-lg"
      role="status"
      aria-label="Loading wallpapers"
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="break-inside-avoid mb-md md:mb-lg overflow-hidden rounded-md border border-line bg-surface"
        >
          <div className={`${SKELETON_SHAPES[index % SKELETON_SHAPES.length]} animate-pulse bg-line/50`} />
          <div className="space-y-sm p-sm sm:p-md lg:p-lg">
            <div className="h-3 w-3/5 animate-pulse rounded bg-line/70" />
            <div className="flex justify-between gap-sm">
              <div className="h-2.5 w-1/4 animate-pulse rounded bg-line/50" />
              <div className="h-2.5 w-1/3 animate-pulse rounded bg-line/50" />
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">Loading wallpapers…</span>
    </div>
  );
}

/**
 * CSS-columns masonry ("river" layout) instead of a row-based grid. This
 * is what lets a 16:9 desktop card and a 9:16 phone card sit side by side
 * without one stretching to match the other's height.
 */
export default function WallpaperGrid({ wallpapers, columns = "auto" }) {
  if (!wallpapers.length) {
    return (
      <p className="text-body-sm text-ink-soft py-2xl text-center">
        No wallpapers match those filters yet.
      </p>
    );
  }

  const allPhone =
    wallpapers.length > 0 && wallpapers.every((w) => w.orientation === "phone");
  const columnClass =
    columns === 4
      ? "md:columns-4"
      : columns === 5
        ? "md:columns-5"
        : allPhone
          ? "md:columns-5"
          : "md:columns-4";

  return (
    <div
      className={`columns-2 sm:columns-3 ${columnClass} gap-sm sm:gap-md lg:gap-lg`}
    >
      {wallpapers.map((w, index) => (
        <WallpaperCard key={w.id} wallpaper={w} priority={index < 4} />
      ))}
    </div>
  );
}
