const CACHE_PREFIX = 'heywalls:wallpapers:v1:'
const MAX_CACHED_ITEMS = 100

function storageKey(key) {
  return `${CACHE_PREFIX}${key}`
}

export function readWallpaperCache(key, maxAgeMs = 10 * 60 * 1000) {
  try {
    const raw = localStorage.getItem(storageKey(key))
    if (!raw) return null

    const cached = JSON.parse(raw)
    if (!cached?.timestamp || !Array.isArray(cached.items)) return null
    if (Date.now() - cached.timestamp > maxAgeMs) return null

    return cached
  } catch {
    return null
  }
}

export function writeWallpaperCache(key, value) {
  try {
    const payload = {
      timestamp: Date.now(),
      items: (value.items || []).slice(0, MAX_CACHED_ITEMS),
      totalCount: value.totalCount ?? null,
      hasMore: Boolean(value.hasMore),
    }
    localStorage.setItem(storageKey(key), JSON.stringify(payload))
  } catch {
    // Caching is an enhancement. A full/disabled localStorage must never
    // prevent wallpapers from loading from Supabase.
  }
}
