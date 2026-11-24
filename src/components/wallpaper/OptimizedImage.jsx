import { useState } from "react";
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
  const fallbackKey = fallbackSources.filter(Boolean).join('\u0000');
  const fallbackList = fallbackKey ? fallbackKey.split('\u0000') : [];
  const sourceKey = `${src || ''}\u0000${width || ''}\u0000${quality}\u0000${fallbackKey}`;
  const [imageState, setImageState] = useState(() => ({
    sourceKey,
    currentSrc: getOptimizedImageUrl(src, { width, quality }),
    attemptedSources: [],
    failed: false,
  }));
  const stateIsCurrent = imageState.sourceKey === sourceKey;
  const currentSrc = stateIsCurrent
    ? imageState.currentSrc
    : getOptimizedImageUrl(src, { width, quality });
  const attemptedSources = stateIsCurrent ? imageState.attemptedSources : [];
  const failed = stateIsCurrent && imageState.failed;

  function handleLoad(event) {
    onLoad?.(event);
  }

  function handleError(event) {
    const candidates = [src, ...fallbackList].filter(Boolean);
    const nextSource = candidates.find((candidate) => candidate !== currentSrc && !attemptedSources.includes(candidate));
    if (nextSource) {
      setImageState({
        sourceKey,
        currentSrc: nextSource,
        attemptedSources: [...attemptedSources, currentSrc],
        failed: false,
      });
      return;
    }
    setImageState({ sourceKey, currentSrc, attemptedSources, failed: true });
    onError?.(event);
  }

  if (failed) {
    return (
      <div
        {...props}
        role="img"
        aria-label={`${alt} (image unavailable)`}
        className={`${className} bg-surface px-md py-lg text-center text-label text-ink-soft`}
        style={{ ...props.style, width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}
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
