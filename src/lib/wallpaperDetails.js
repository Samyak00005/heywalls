import { mapWallhavenWallpaper } from './wallpaperMapper.js'

const detailsCache = new Map()
const pendingRequests = new Map()
const SESSION_CACHE_PREFIX = 'heywalls:wallhaven:detail:v1:'
const SESSION_CACHE_TTL = 6 * 60 * 60 * 1000
const DETAIL_REQUEST_GAP = 1800
let detailRequestQueue = Promise.resolve()
let lastDetailRequestAt = 0

function readSessionDetail(id) {
  try {
    const cached = JSON.parse(sessionStorage.getItem(`${SESSION_CACHE_PREFIX}${id}`) || 'null')
    if (!cached?.timestamp || !cached?.details) return null
    if (Date.now() - cached.timestamp > SESSION_CACHE_TTL) {
      sessionStorage.removeItem(`${SESSION_CACHE_PREFIX}${id}`)
      return null
    }
    return cached.details
  } catch {
    return null
  }
}

function writeSessionDetail(id, details) {
  try {
    sessionStorage.setItem(`${SESSION_CACHE_PREFIX}${id}`, JSON.stringify({ timestamp: Date.now(), details }))
  } catch {
    // Session storage is an optional cache; API results still work without it.
  }
}

function enqueueDetailRequest(task) {
  const request = detailRequestQueue.then(async () => {
    const wait = Math.max(0, DETAIL_REQUEST_GAP - (Date.now() - lastDetailRequestAt))
    if (wait) await new Promise((resolve) => window.setTimeout(resolve, wait))
    lastDetailRequestAt = Date.now()
    return task()
  })
  detailRequestQueue = request.catch(() => undefined)
  return request
}

export function getWallpaperDetails(id) {
  const photoId = String(id || '').replace(/^wallhaven-/, '')
  if (!photoId) return Promise.reject(new Error('Wallpaper ID is missing.'))
  if (detailsCache.has(photoId)) return Promise.resolve(detailsCache.get(photoId))
  if (pendingRequests.has(photoId)) return pendingRequests.get(photoId)
  const savedDetail = readSessionDetail(photoId)
  if (savedDetail) {
    detailsCache.set(photoId, savedDetail)
    return Promise.resolve(savedDetail)
  }

  const request = enqueueDetailRequest(async () => {
    const response = await fetch(`/api/wallhaven?id=${encodeURIComponent(photoId)}`)
    const responseBody = await response.text()
    let result
    try {
      result = JSON.parse(responseBody)
    } catch {
      throw new Error('The wallpaper service returned an invalid response.')
    }
    if (!response.ok) throw new Error(result.error || 'Could not load wallpaper details.')
    const details = mapWallhavenWallpaper(result.data)
    detailsCache.set(photoId, details)
    const sessionDetail = {
      title: details.title,
      description: details.description,
      category: details.category,
      apiCategory: details.apiCategory,
      tags: details.tags,
    }
    writeSessionDetail(photoId, sessionDetail)
    return details
  }).finally(() => pendingRequests.delete(photoId))

  pendingRequests.set(photoId, request)
  return request
}
