import { Link } from "react-router-dom";
import DownloadButton from "./DownloadButton.jsx";
import FavoriteButton from "./FavoriteButton.jsx";
import ShareButton from "./ShareButton.jsx";

export default function WallpaperCard({ wallpaper, showFavorite = true, showDownload = true }) {
  const { id, title, imageUrl, orientation, category } = wallpaper;
  const aspect = orientation === "phone" ? "aspect-[9/16]" : "aspect-[16/9]";
  const filename = `heywalls-${title.toLowerCase().replace(/\s+/g, "-")}.jpg`;

  return (
    <article className="group break-inside-avoid mb-md md:mb-lg border border-line rounded-md overflow-hidden bg-surface">
      <Link to={`/wallpaper/${id}`} className={`relative block ${aspect}`}>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover block"
        />

        <div className="wallpaper-card-actions absolute inset-0 pointer-events-none transition-opacity duration-150">
          {showFavorite && (
            <div className="absolute top-sm left-sm pointer-events-auto">
              <FavoriteButton wallpaperId={id} variant="icon-static" />
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
                imageUrl={imageUrl}
                filename={filename}
                wallpaperId={id}
                variant="icon-static"
              />
            )}
          </div>
        </div>
      </Link>

      <Link to={`/wallpaper/${id}`} className="block p-sm sm:p-md lg:p-lg">
        <p className="text-body-sm text-ink truncate font-medium leading-tight">
          {title}
        </p>

        <div className="mt-xs flex items-center justify-between gap-sm">
          <span className="text-label text-ink-soft truncate">
            {orientation === "phone" ? "Mobile" : "Desktop"}
          </span>

          <span className="text-label text-ink-soft truncate text-right">
            {category || "Uncategorized"}
          </span>
        </div>
      </Link>
    </article>
  );
}
