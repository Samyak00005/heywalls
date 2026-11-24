function getOrientation(width, height) {
  const ratio = width && height ? width / height : 1
  if (ratio < 0.82) return 'phone'
  if (ratio > 1.2) return 'desktop'
  return 'tablet'
}

function formatCategory(value) {
  if (!value) return 'Wallpaper'
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function mapWallhavenWallpaper(row) {
  const width = Number(row.dimension_x) || null
  const height = Number(row.dimension_y) || null
  const tags = (row.tags || []).map((tag) => tag.name).filter(Boolean)
  const rawCategory = String(row.category || '').trim()
  const category = formatCategory(rawCategory || tags[0])
  const resolution = row.resolution || (width && height ? `${width} × ${height}` : null)
  const imageCandidates = [row.thumbs?.original, row.thumbs?.large, row.thumbs?.small, row.path].filter(Boolean)
  const imageUrl = imageCandidates[0] || ''
  const titleSource = typeof row.source === 'string' && !/^https?:\/\//i.test(row.source.trim())
    ? row.source.trim()
    : ''
  const title = tags.length
    ? tags.slice(0, 2).join(' · ')
    : titleSource || `Wallpaper ${String(row.id || '').toUpperCase()}`

  return {
    id: `wallhaven-${row.id}`,
    title,
    description: tags.slice(0, 6).join(' · '),
    // The large thumbnail is center-cropped. Prefer Wallhaven's original-ratio
    // thumbnail so portrait previews keep their full composition.
    imageUrl,
    imageFallbackUrls: imageCandidates.filter((url) => url !== imageUrl),
    fullImageUrl: row.path || row.thumbs?.original || row.thumbs?.large || row.thumbs?.small,
    orientation: getOrientation(width, height),
    width,
    height,
    resolution,
    category,
    apiCategory: rawCategory.toLowerCase(),
    tags,
    uploader: row.uploader?.username || null,
    createdAt: row.created_at || null,
    views: row.views || 0,
    source: 'Wallhaven',
    sourceUrl: row.url || `https://wallhaven.cc/w/${row.id}`,
  }
}
