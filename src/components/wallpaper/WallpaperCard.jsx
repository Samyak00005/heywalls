import { Link } from "react-router-dom";
import { useWallpaperMetadata } from "../../hooks/useWallpaperMetadata.js";
import {
  getOrientationAspectClass,
  getOrientationLabel,
  getOrientationWidth,
} from "../../lib/orientation.js";
import DownloadButton from "./DownloadButton.jsx";
import FavoriteButton from "./FavoriteButton.jsx";
import OptimizedImage from "./OptimizedImage.jsx";
import ShareButton from "./ShareButton.jsx";

export default function WallpaperCard({
  wallpaper,
  showFavorite = true,
  showDownload = true,
  priority = false,
}) {
  const { cardRef, metadata, loadingMetadata } =
    useWallpaperMetadata(wallpaper);
  const {
    id,
    title,
    imageUrl,
    imageFallbackUrls,
    fullImageUrl,
    orientation,
    category,
  } = metadata;
  const aspect = getOrientationAspectClass(orientation);
  const filename = `heywalls-${title.toLowerCase().replace(/\s+/g, "-")}.jpg`;

  return (
    <article
      ref={cardRef}
      className="group break-inside-avoid mb-md md:mb-lg border border-line rounded-md overflow-hidden bg-surface"
    >
      <Link
        to={`/wallpaper/${id}`}
        className={`relative block bg-surface ${aspect}`}
      >
        <OptimizedImage
          src={imageUrl}
          fallbackSources={imageFallbackUrls}
          alt={title}
          width={getOrientationWidth(orientation)}
          className={`relative w-full h-full block ${orientation === "phone" ? "object-contain bg-surface" : "object-cover"}`}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
        />

        <div className="wallpaper-card-actions absolute inset-0 pointer-events-none transition-opacity duration-150">
          {showFavorite && (
            <div className="absolute top-sm left-sm pointer-events-auto">
              <FavoriteButton wallpaper={metadata} variant="icon-static" />
            </div>
          )}

          <div className="absolute top-sm right-sm flex items-center gap-sm pointer-events-auto">
            <ShareButton
              title={title}
              url={`${window.location.origin}/wallpaper/${id}`}
              variant="icon"
            />
            {showDownload && (
              <DownloadButton
                imageUrl={fullImageUrl || imageUrl}
                filename={filename}
                variant="icon-static"
              />
            )}
          </div>
        </div>
      </Link>

      <Link to={`/wallpaper/${id}`} className="block p-sm sm:p-md lg:p-lg">
        {loadingMetadata && !wallpaper.tags?.length ? (
          <span
            aria-label="Loading wallpaper name"
            className="mb-xs block h-3 w-3/5 animate-pulse rounded bg-line/70"
          />
        ) : (
          <p className="text-body-sm text-ink truncate font-medium leading-tight">
            {title}
          </p>
        )}

        <div className="mt-xs flex items-center justify-between gap-sm">
          <span className="text-label text-ink-soft truncate">
            {getOrientationLabel(orientation)}
          </span>

          <span className="text-label text-ink-soft truncate text-right">
            {category || "Wallpaper"} · Wallhaven
          </span>
        </div>
      </Link>
    </article>
  );
}
