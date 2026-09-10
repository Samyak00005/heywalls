import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ErrorState, LoadingState } from "../components/common/DataState.jsx";
import SwatchTag from "../components/wallpaper/SwatchTag.jsx";
import WallpaperGrid from "../components/wallpaper/WallpaperGrid.jsx";
import { useCategories } from "../hooks/useCategories.js";
import { useWallpapers } from "../hooks/useWallpapers.js";

const rotations = ["-2deg", "1.5deg", "-1deg", "2deg", "-1.5deg", "1deg"];

export default function Home() {
  const { wallpapers, loading, error } = useWallpapers();
  const { categories } = useCategories();

  // "Hung gallery" strip and the community section both pull from the same
  // live dataset for now — Phase 4 will split this by uploader_id once
  // real user uploads exist alongside curated content.
  const hung = useMemo(() => wallpapers.slice(0, 6), [wallpapers]);
  const spotlight = useMemo(() => wallpapers.slice(6, 10), [wallpapers]);

  return (
    <div>
      <section className="container-page pt-2xl md:pt-5xl pb-xl md:pb-3xl">
        <p className="text-label text-ink-soft mb-sm">Curated + community</p>
        <h1 className="font-display italic text-display max-w-[480px] mb-lg">
          Walls worth living with.
        </h1>
        <p className="text-body text-ink-soft max-w-[340px] mb-xl">
          Wallpapers curated by us, uploaded by everyone else. Pick a mood, grab
          it for your phone or your desktop, done.
        </p>
        <div className="flex gap-sm">
          <Link
            to="/explore"
            className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body font-medium"
          >
            Explore wallpapers
          </Link>
          <button className="border border-ink text-ink rounded-md px-lg py-sm text-body">
            Upload yours
          </button>
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
          <div className="flex items-start gap-md md:gap-lg overflow-x-auto container-page pb-3xl">
            {hung.map((w, i) => (
              <Link
                key={w.id}
                to={`/wallpaper/${w.id}`}
                className="shrink-0 bg-surface p-sm pb-xl rounded-sm shadow-hung block"
                style={{ transform: `rotate(${rotations[i]})` }}
              >
                <img
                  src={w.imageUrl}
                  alt={w.title}
                  width={w.orientation === "phone" ? 140 : 220}
                  height={w.orientation === "phone" ? 249 : 124}
                  className="rounded-sm block"
                />
                <p className="text-label text-ink-soft text-center mt-sm">
                  {w.category}
                </p>
              </Link>
            ))}
          </div>

          <section className="container-page pb-3xl md:pb-4xl">
            <div className="flex items-baseline justify-between mb-lg">
              <h2 className="font-display text-h2">Pick a mood</h2>
              <span className="text-label text-ink-soft">
                {categories.length} categories
              </span>
            </div>
            <div className="flex flex-wrap gap-sm">
              {categories.map((c) => (
                <Link key={c.id} to={`/category/${c.slug}`}>
                  <SwatchTag label={c.name} />
                </Link>
              ))}
            </div>
          </section>

          <section className="container-page pb-3xl md:pb-4xl">
            <div className="flex items-baseline justify-between mb-lg">
              <h2 className="font-display text-h2">Fresh on HeyWalls</h2>
              <span className="text-label text-ink-soft">updated daily</span>
            </div>
            <WallpaperGrid wallpapers={spotlight} />
          </section>
        </>
      )}

      <section className="container-page pb-3xl md:pb-4xl">
        <div className="border border-dashed border-ink-soft rounded-lg p-xl md:p-2xl">
          <h3 className="font-display text-h3 mb-sm">
            Got a wall worth sharing?
          </h3>
          <p className="text-body-sm text-ink-soft max-w-[380px] mb-lg">
            Drop your desktop or phone wallpaper and let the community grab it.
          </p>
          <button className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body font-medium">
            Upload a wallpaper
          </button>
        </div>
      </section>
    </div>
  );
}
