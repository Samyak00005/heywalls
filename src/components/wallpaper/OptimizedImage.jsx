import { useState } from 'react'
import { getOptimizedImageUrl } from '../../lib/imageOptimization.js'

export default function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  quality = 78,
  loading = 'lazy',
  fetchPriority = 'auto',
  ...props
}) {
  const [currentSrc, setCurrentSrc] = useState(
    getOptimizedImageUrl(src, { width, quality })
  )
  const [failed, setFailed] = useState(false)

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      decoding="async"
      fetchPriority={fetchPriority}
      className={className}
      onError={() => {
        if (!failed && currentSrc !== src) {
          setFailed(true)
          setCurrentSrc(src)
        }
      }}
      {...props}
    />
  )
}
