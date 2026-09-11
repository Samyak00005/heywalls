import { Link } from "react-router-dom";
import DownloadButton from "./DownloadButton.jsx";
import FavoriteButton from "./FavoriteButton.jsx";
import ShareButton from "./ShareButton.jsx";

export default function WallpaperCard({ wallpaper }) {
  const { id, title, imageUrl, orientation, category, uploader, resolution } =
    wallpaper;

  const aspect = orientation === "phone" ? "aspect-[9/16]" : "aspect-[16/9]";

  const filename = `heywalls-${title.toLowerCase().replace(/\s+/g, "-")}.jpg`;

  return (
    <article className="break-inside-avoid mb-md md:mb-lg border border-line rounded-md overflow-hidden bg-surface">
      <Link to={`/wallpaper/${id}`} className={`relative block ${aspect}`}>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover block"
          draggable="false"
        />

        {/* Download — visible on all screen sizes */}
        <DownloadButton
          imageUrl={imageUrl}
          filename={filename}
          wallpaperId={id}
        />

        {/* Favorite — desktop/tablet only */}
        <div className="hidden sm:block">
          <FavoriteButton wallpaperId={id} />
        </div>

        {/* Share — desktop/tablet only */}
        <div className="hidden sm:block absolute top-sm right-[44px]">
          <ShareButton
            title={title}
            url={`${window.location.origin}/wallpaper/${id}`}
            variant="icon"
          />
        </div>
      </Link>

      <Link to={`/wallpaper/${id}`} className="block p-sm sm:p-md lg:p-lg">
        {/* Title */}
        <p className="text-body-sm text-ink truncate font-medium leading-tight">
          {title}
        </p>

        {/* Orientation + Category */}
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
