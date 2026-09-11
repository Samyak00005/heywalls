export function mapWallpaperRow(row) {
  const joined = row.wallpaper_categories ?? [];
  const categoryNames = joined.map((wc) => wc.categories?.name).filter(Boolean);
  const categorySlugs = joined.map((wc) => wc.categories?.slug).filter(Boolean);

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
    category: categoryNames[0] || "Uncategorized",
    categorySlugs,
    categoryIds: joined.map((wc) => wc.category_id).filter(Boolean),
    uploader: row.profiles?.username || null,
    uploaderDisplayName: row.profiles?.display_name || null,
    downloadCount: row.download_count,
    createdAt: row.created_at,
    status: row.status,
  };
}

export const WALLPAPER_SELECT =
  "id, title, description, image_url, thumbnail_url, orientation, width, height, download_count, created_at, profiles(username, display_name), wallpaper_categories(category_id, categories(name, slug))";
