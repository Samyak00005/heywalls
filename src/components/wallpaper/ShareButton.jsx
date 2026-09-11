import { Share2 } from "lucide-react";
import { useState } from "react";

export default function ShareButton({ title, url, variant = "primary" }) {
  const [status, setStatus] = useState("");

  async function handleShare() {
    const shareUrl = url || window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: title || "HeyWalls wallpaper",
          url: shareUrl,
        });
        setStatus("Shared");
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
        setStatus("Link copied");
      } else {
        window.prompt("Copy this link:", shareUrl);
      }
    } catch (error) {
      if (error?.name !== "AbortError") setStatus("Could not share");
    }

    window.setTimeout(() => setStatus(""), 2200);
  }

  const classes =
    variant === "icon"
      ? "bg-bg/90 hover:bg-bg text-ink rounded-sm p-sm shadow-hung transition-colors"
      : variant === "ghost-icon"
        ? "text-ink hover:text-ink-soft p-xs transition-colors"
        : "border border-ink text-ink rounded-md px-lg py-sm text-body font-medium inline-flex items-center gap-sm";

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Share wallpaper"
      className={classes}
    >
      <Share2 size={variant === "ghost-icon" ? 22 : 17} strokeWidth={1.9} />
      {variant !== "icon" && variant !== "ghost-icon" && (status || "Share")}
    </button>
  );
}
