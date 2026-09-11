/**
 * Flattens a Supabase wallpapers row (with joined wallpaper_categories →
 * categories) into the flat shape WallpaperCard/WallpaperGrid expect.
 * A wallpaper can have multiple categories; the first is used as the
 * card's display label, matching the single-label design.
 */
export function mapWallpaperRow(row) {
  const joined = row.wallpaper_categories ?? []
  const categoryNames = joined.map((wc) => wc.categories?.name).filter(Boolean)
  const categorySlugs = joined.map((wc) => wc.categories?.slug).filter(Boolean)

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.thumbnail_url || row.image_url,
    fullImageUrl: row.image_url,
    orientation: row.orientation,
    width: row.width || null,
    height: row.height || null,
    resolution: row.width && row.height ? `${row.width} × ${row.height}` : null,
    category: categoryNames[0] || 'Uncategorized',
    categorySlugs,
    uploader: row.profiles?.username || null,
    downloadCount: row.download_count,
    createdAt: row.created_at,
    status: row.status,
  }
}

export const WALLPAPER_SELECT =
  'id, title, description, image_url, thumbnail_url, orientation, width, height, download_count, created_at, profiles(username), wallpaper_categories(categories(name, slug))'
