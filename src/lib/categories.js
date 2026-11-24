// These are curated subject searches. Wallhaven's actual category groups are
// read from the API records and shown separately in the Categories page.
export const WALLPAPER_TOPICS = [
  { slug: 'nature', name: 'Nature', query: 'nature', description: 'Quiet forests, lakes, and open skies.' },
  { slug: 'anime', name: 'Anime', query: 'anime', description: 'Illustrated worlds and favorite characters.' },
  { slug: 'space', name: 'Space', query: 'space', description: 'Planets, galaxies, and deep space.' },
  { slug: 'minimal', name: 'Minimal', query: 'minimal', description: 'Clean shapes and calm color palettes.' },
  { slug: 'abstract', name: 'Abstract', query: 'abstract', description: 'Patterns, color, and unexpected forms.' },
  { slug: 'architecture', name: 'Architecture', query: 'architecture', description: 'Buildings, interiors, and city lines.' },
  { slug: 'animals', name: 'Animals', query: 'animals', description: 'Wildlife and animal photography.' },
  { slug: 'cars', name: 'Cars', query: 'cars', description: 'Classic cars, supercars, and motorsport.' },
  { slug: 'city', name: 'City', query: 'city', description: 'City streets, skylines, and night lights.' },
  { slug: 'gaming', name: 'Gaming', query: 'video games', description: 'Worlds and art inspired by video games.' },
  { slug: 'ocean', name: 'Ocean', query: 'ocean', description: 'Coastlines, waves, and underwater scenes.' },
  { slug: 'flowers', name: 'Flowers', query: 'flowers', description: 'Colorful blooms and botanical details.' },
  { slug: 'mountains', name: 'Mountains', query: 'mountains', description: 'Alpine views and dramatic peaks.' },
  { slug: 'technology', name: 'Technology', query: 'technology', description: 'Devices, circuits, and digital ideas.' },
  { slug: 'fantasy', name: 'Fantasy', query: 'fantasy', description: 'Mythical places and imaginative scenes.' },
  { slug: 'dark', name: 'Dark', query: 'dark', description: 'Low-light art and moody palettes.' },
  { slug: 'photography', name: 'Photography', query: 'photography', description: 'Photographic moments from around the world.' },
  { slug: 'digital-art', name: 'Digital art', query: 'digital art', description: 'Original digital illustrations and scenes.' },
]

export const FEATURED_TOPICS = WALLPAPER_TOPICS.slice(0, 6)

export function getWallpaperTopic(slug) {
  return WALLPAPER_TOPICS.find((topic) => topic.slug === slug) || null
}
