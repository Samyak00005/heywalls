import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorState, LoadingState } from "../components/common/DataState.jsx";
import WallpaperGrid from "../components/wallpaper/WallpaperGrid.jsx";
import { useWallpapers } from "../hooks/useWallpapers.js";

export default function Category() {
  const { slug } = useParams();
  const { wallpapers, loading, error } = useWallpapers();

  const filtered = useMemo(
    () => wallpapers.filter((w) => w.categorySlugs.includes(slug)),
    [wallpapers, slug],
  );

  const categoryName = filtered[0]?.category;

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <Link
        to="/explore"
        className="text-label text-ink-soft mb-sm inline-block"
      >
        ← All wallpapers
      </Link>
      <h1 className="font-display text-h1 mb-xl capitalize">
        {categoryName || slug}
      </h1>

      {loading && <LoadingState />}
      {error && <ErrorState error={error} />}
      {!loading && !error && <WallpaperGrid wallpapers={filtered} />}
    </div>
  );
}
