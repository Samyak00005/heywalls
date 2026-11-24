import { useEffect, useState } from "react";
import { getOptimizedImageUrl } from "../../lib/imageOptimization.js";

const EMPTY_FALLBACKS = [];

export default function OptimizedImage({
  src,
  fallbackSources = EMPTY_FALLBACKS,
  alt,
  className = "",
  width,
  quality = 78,
  loading = "lazy",
  fetchPriority = "auto",
  onLoad,
  onError,
  ...props
}) {
  const fallbackKey = fallbackSources.filter(Boolean).join("\u0000");
  const fallbackList = fallbackKey ? fallbackKey.split("\u0000") : [];
  const [currentSrc, setCurrentSrc] = useState(
    getOptimizedImageUrl(src, { width, quality }),
  );
  const [attemptedSources, setAttemptedSources] = useState([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(getOptimizedImageUrl(src, { width, quality }));
    setAttemptedSources([]);
    setFailed(false);
  }, [quality, src, width]);

  function handleLoad(event) {
    onLoad?.(event);
  }

  function handleError(event) {
    const candidates = [src, ...fallbackList].filter(Boolean);
    const nextSource = candidates.find(
      (candidate) =>
        candidate !== currentSrc && !attemptedSources.includes(candidate),
    );
    if (nextSource) {
      setAttemptedSources((previous) => [...previous, currentSrc]);
      setCurrentSrc(nextSource);
      return;
    }
    setFailed(true);
    onError?.(event);
  }

  if (failed) {
    return (
      <div
        {...props}
        role="img"
        aria-label={`${alt} (image unavailable)`}
        className={`${className} bg-surface px-md py-lg text-center text-label text-ink-soft`}
        style={{
          ...props.style,
          width: "100%",
          height: "100%",
          display: "grid",
          placeItems: "center",
        }}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      className={`${className} bg-surface`}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
}
