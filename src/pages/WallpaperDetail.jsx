import { Heart, Image as ImageIcon, Layers3 } from "lucide-react";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { ErrorState, LoadingState } from "../components/common/DataState.jsx";
import CollectionButton from "../components/wallpaper/CollectionButton.jsx";
import DownloadButton from "../components/wallpaper/DownloadButton.jsx";
import FavoriteButton from "../components/wallpaper/FavoriteButton.jsx";
import OptimizedImage from "../components/wallpaper/OptimizedImage.jsx";
import ShareButton from "../components/wallpaper/ShareButton.jsx";
import WallpaperGrid from "../components/wallpaper/WallpaperGrid.jsx";
import { useWallpaper } from "../hooks/useWallpaper.js";
import { useWallpapers } from "../hooks/useWallpapers.js";
import {
  getAspectRatioLabel,
  getOrientationLabel,
  getOrientationWidth,
} from "../lib/orientation.js";

function MetaItem({ icon: Icon, label, value, first = false }) {
  return (
    <div
      className={`flex min-h-[60px] items-center gap-lg border-line ${
        first ? "" : "border-t"
      }`}
    >
      <Icon size={16} strokeWidth={1.7} className="shrink-0 text-ink-soft" />

      <div className="min-w-0 flex-1">
        <p className="text-label text-ink-soft uppercase tracking-[0.08em]">
          {label}
        </p>

        <p className="text-body-sm text-ink mt-xs">{value}</p>
      </div>
    </div>
  );
}

export default function WallpaperDetail() {
  const { id } = useParams();
  const { wallpaper, loading, error } = useWallpaper(id);
  const { wallpapers } = useWallpapers();

  const related = useMemo(() => {
    if (!wallpaper) return [];

    const sameCategory = wallpapers.filter(
      (w) => w.id !== wallpaper.id && w.category === wallpaper.category,
    );
    const fallback = wallpapers.filter(
      (w) => w.id !== wallpaper.id && w.category !== wallpaper.category,
    );

    return [...sameCategory, ...fallback].slice(0, 8);
  }, [wallpapers, wallpaper]);

  if (loading) {
    return (
      <div className="container-page pt-xl pb-3xl">
        <LoadingState />
      </div>
    );
  }

  if (error || !wallpaper) {
    return (
      <div className="container-page pt-xl pb-3xl">
        <ErrorState error={error} />
      </div>
    );
  }

  const filename = `heywalls-${wallpaper.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}.jpg`;

  const aspectLabel = getAspectRatioLabel(wallpaper.orientation);
  const orientationLabel = getOrientationLabel(wallpaper.orientation);
  const isPhone = wallpaper.orientation === "phone";

  return (
    <div className="container-page pt-lg md:pt-xl pb-3xl md:pb-4xl">
      <Link
        to="/explore"
        className="text-label text-ink-soft mb-lg inline-flex items-center gap-xs"
      >
        ← All wallpapers
      </Link>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] gap-2xl lg:gap-4xl items-start">
        {/* Preview */}
        <div className="min-w-0">
          <div
            className={`wallpaper-detail-frame relative w-full flex items-center justify-center border border-line bg-surface rounded-md overflow-hidden ${
              isPhone ? "min-h-[520px] h-[72vh]" : "min-h-[360px] h-[68vh]"
            } max-md:h-auto max-md:min-h-0 max-md:rounded-none max-md:border-0 max-md:bg-transparent max-md:overflow-visible`}
          >
            <OptimizedImage
              src={wallpaper.fullImageUrl}
              alt={wallpaper.title}
              width={getOrientationWidth(wallpaper.orientation)}
              quality={92}
              loading="eager"
              fetchPriority="high"
              className={
                isPhone
                  ? "block max-w-full max-h-[70vh] w-auto h-auto object-contain max-md:max-h-[78vh]"
                  : "block w-full h-full object-contain max-md:w-full max-md:h-auto max-md:max-h-none"
              }
            />
          </div>
        </div>

        {/* Information */}
        <aside className="lg:sticky lg:top-xl">
          <div className="flex items-start gap-md">
            <h1 className="font-display text-h1 flex-1">{wallpaper.title}</h1>
            <div className="shrink-0 -mt-xs">
              <span className="md:hidden">
                <ShareButton title={wallpaper.title} variant="ghost-icon" />
              </span>
              <span className="hidden md:inline-flex">
                <ShareButton title={wallpaper.title} variant="detail-icon" />
              </span>
            </div>
          </div>

          {wallpaper.description && (
            <p className="text-body text-ink-soft mt-md mb-xl max-w-[520px]">
              {wallpaper.description}
            </p>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-md my-lg">
            <MetaItem
              icon={ImageIcon}
              label="Format"
              value={`${orientationLabel} · ${aspectLabel}`}
              first
            />
            <MetaItem
              icon={Layers3}
              label="Resolution"
              value={wallpaper.resolution || "Not available"}
            />
            <MetaItem
              icon={Heart}
              label="Category"
              value={wallpaper.category || "Uncategorized"}
            />
          </div>

          <div className="border-t border-line pt-lg mb-xl">
            <p className="text-body-sm text-ink-soft">
              Published by:{" "}
              {wallpaper.uploader ? (
                <Link
                  to={`/profile/${wallpaper.uploader}`}
                  className="text-ink hover:underline underline-offset-4"
                >
                  @{wallpaper.uploader}
                </Link>
              ) : (
                <span className="text-ink">HeyWalls</span>
              )}
            </p>
          </div>
          <div className="flex flex-col gap-sm">
            <div className="w-full">
              <DownloadButton
                imageUrl={wallpaper.fullImageUrl}
                filename={filename}
                wallpaperId={wallpaper.id}
                variant="primary"
              />
            </div>
            <div className="flex gap-sm w-full">
              <div className="flex-1 min-w-0">
                <FavoriteButton wallpaperId={wallpaper.id} variant="primary" />
              </div>
              <div className="flex-1 min-w-0">
                <CollectionButton wallpaperId={wallpaper.id} />
              </div>
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-4xl">
          <div className="flex items-baseline justify-between gap-lg mb-lg">
            <div>
              <p className="text-label text-ink-soft uppercase tracking-[0.08em] mb-xs">
                More like this
              </p>
              <h2 className="font-display text-h2">Related wallpapers</h2>
            </div>
            <Link
              to={
                wallpaper.category
                  ? `/explore?category=${encodeURIComponent(wallpaper.category)}`
                  : "/explore"
              }
              className="text-label text-ink hover:underline underline-offset-4 shrink-0"
            >
              Explore more →
            </Link>
          </div>
          <WallpaperGrid wallpapers={related} />
        </section>
      )}
    </div>
  );
}
