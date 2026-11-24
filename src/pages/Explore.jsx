import { useEffect, useState } from "react";
import { ErrorState, LoadingState } from "../components/common/DataState.jsx";
import FilterBar from "../components/wallpaper/FilterBar.jsx";
import WallpaperGrid from "../components/wallpaper/WallpaperGrid.jsx";
import { useCategories } from "../hooks/useCategories.js";
import { useWallpapers } from "../hooks/useWallpapers.js";

export default function Explore() {
  const params = new URLSearchParams(window.location.search);
  const [query, setQuery] = useState(params.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(
    params.get("category") || null,
  );
  const [activeOrientation, setActiveOrientation] = useState(
    params.get("device") || null,
  );
  const [sort, setSort] = useState(params.get("sort") || "newest");
  const { categories } = useCategories();
  const {
    wallpapers,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    totalCount,
  } = useWallpapers({
    query,
    category: activeCategory || "all",
    orientation: activeOrientation || "all",
    sort,
  });

  useEffect(() => {
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    if (activeCategory) next.set("category", activeCategory);
    if (activeOrientation) next.set("device", activeOrientation);
    if (sort !== "newest") next.set("sort", sort);
    const nextUrl = next.toString()
      ? `/explore?${next.toString()}`
      : "/explore";
    window.history.replaceState(null, "", nextUrl);
  }, [activeCategory, activeOrientation, query, sort]);

  function handleCategoryChange(value) {
    setActiveCategory(value);
  }

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <div className="flex flex-wrap items-end justify-between gap-lg mb-xl">
        <div>
          <h1 className="font-display text-h1">Explore</h1>
          {totalCount != null && (
            <p className="text-body-sm text-ink-soft mt-sm">
              {totalCount} wallpapers found
            </p>
          )}
        </div>
      </div>

      <FilterBar
        categories={categories.map((c) => c.name)}
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
        activeOrientation={activeOrientation}
        onOrientationChange={setActiveOrientation}
        query={query}
        onQueryChange={setQuery}
        sort={sort}
        onSortChange={setSort}
      />

      {loading && <LoadingState />}
      {error && <ErrorState error={error} />}
      {!loading && !error && (
        <>
          {query.trim() && wallpapers.length === 0 ? (
            <div className="py-3xl text-center">
              <p className="font-display text-h2">No wallpapers found</p>
              <p className="text-body-sm text-ink-soft mt-sm">
                Try a different search or browse all wallpapers.
              </p>
            </div>
          ) : (
            <WallpaperGrid wallpapers={wallpapers} />
          )}
          {hasMore && (
            <div className="mt-2xl flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="border border-line bg-surface rounded-md px-lg py-sm text-body-sm text-ink disabled:opacity-60"
              >
                {loadingMore ? "Loading more…" : "Show more wallpapers →"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
