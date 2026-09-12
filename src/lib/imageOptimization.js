/**
 * Builds a lightweight Supabase Storage Image Transformation URL for cards.
 * Falls back to the original URL for non-Supabase images.
 */
export function getOptimizedImageUrl(url, { width, quality = 78, resize = 'contain' } = {}) {
  if (!url || !width) return url

  try {
    const parsed = new URL(url)
    const marker = '/storage/v1/object/public/'
    const index = parsed.pathname.indexOf(marker)
    if (index === -1) return url

    const transformedPath =
      parsed.pathname.slice(0, index) +
      '/storage/v1/render/image/public/' +
      parsed.pathname.slice(index + marker.length)

    parsed.pathname = transformedPath
    parsed.search = ''
    parsed.searchParams.set('width', String(Math.round(width)))
    parsed.searchParams.set('quality', String(quality))
    parsed.searchParams.set('resize', resize)
    return parsed.toString()
  } catch {
    return url
  }
}
