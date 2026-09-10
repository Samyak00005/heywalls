export const categories = [
  'Nature',
  'Minimal',
  'Abstract',
  'Texture',
  'Space',
  'Anime',
]

function img(seed, w, h) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`
}

export const placeholderWallpapers = [
  { id: 1, title: 'Moss trail', seed: 'moss-1', orientation: 'phone', category: 'Nature' },
  { id: 2, title: 'Grid line', seed: 'grid-2', orientation: 'desktop', category: 'Minimal' },
  { id: 3, title: 'Dust field', seed: 'dust-3', orientation: 'phone', category: 'Abstract' },
  { id: 4, title: 'Ink wash', seed: 'ink-4', orientation: 'desktop', category: 'Texture' },
  { id: 5, title: 'Night haze', seed: 'haze-5', orientation: 'phone', category: 'Space' },
  { id: 6, title: 'Soft line', seed: 'line-6', orientation: 'desktop', category: 'Minimal' },
  { id: 7, title: 'Fern light', seed: 'fern-7', orientation: 'phone', category: 'Nature' },
  { id: 8, title: 'Static field', seed: 'static-8', orientation: 'desktop', category: 'Abstract' },
  { id: 9, title: 'Paper grain', seed: 'paper-9', orientation: 'phone', category: 'Texture' },
  { id: 10, title: 'Deep orbit', seed: 'orbit-10', orientation: 'desktop', category: 'Space' },
  { id: 11, title: 'Ronin sketch', seed: 'ronin-11', orientation: 'phone', category: 'Anime' },
  { id: 12, title: 'Clay wall', seed: 'clay-12', orientation: 'desktop', category: 'Texture' },
].map((w) => ({
  ...w,
  imageUrl: img(w.seed, w.orientation === 'phone' ? 480 : 640, w.orientation === 'phone' ? 640 : 480),
}))

export const communityWallpapers = [
  { id: 101, title: 'Wet asphalt', seed: 'user-a', orientation: 'phone', uploader: 'priya.k' },
  { id: 102, title: 'Cut glass', seed: 'user-b', orientation: 'phone', uploader: 'moth.exe' },
  { id: 103, title: 'Sand line', seed: 'user-c', orientation: 'phone', uploader: 'dune' },
  { id: 104, title: 'Ink panel', seed: 'user-d', orientation: 'phone', uploader: 'leo_draws' },
].map((w) => ({ ...w, imageUrl: img(w.seed, 300, 400) }))
