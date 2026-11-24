import { Download } from "lucide-react";
import { useToast } from "../common/ToastContext.jsx";

/**
 * Triggers a real "Save As" download, not just opening the image in a new
 * tab — which is what a plain <a download> does for cross-origin images
 * for remote image CDNs. Fetches the image as a blob first.
 * variant="icon" (default) — small overlay button on a WallpaperCard
 * variant="primary" — full-width primary button, e.g. on the detail page
 */
export default function DownloadButton({
  imageUrl,
  filename = "wallpaper.jpg",
  variant = "icon",
}) {
  const { showToast } = useToast();

  async function handleDownload(e) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
      showToast("Wallpaper downloaded");
    } catch {
      // Fallback if a future CDN blocks CORS — at least gets the user to the image.
      window.open(imageUrl, "_blank", "noopener,noreferrer");
      showToast("Opened the wallpaper in a new tab", { type: "success" });
    }
  }

  if (variant === "primary") {
    return (
      <button
        type="button"
        onClick={handleDownload}
        className="w-full bg-accent text-accent-contrast rounded-md px-lg py-sm text-body font-medium inline-flex items-center justify-center gap-sm"
      >
        <Download size={16} strokeWidth={2} />
        Download
      </button>
    );
  }

  const iconClasses =
    variant === "icon-static"
      ? "bg-bg/90 hover:bg-bg text-ink rounded-sm p-sm shadow-hung transition-colors"
      : "absolute top-sm right-sm bg-bg/90 hover:bg-bg text-ink rounded-sm p-sm shadow-hung transition-colors";

  return (
    <button
      type="button"
      onClick={handleDownload}
      aria-label="Download wallpaper"
      className={iconClasses}
    >
      <Download size={16} strokeWidth={2} />
    </button>
  );
}
