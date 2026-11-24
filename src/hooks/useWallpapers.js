import { useCallback, useEffect, useRef, useState } from 'react'
import { readWallpaperCache, writeWallpaperCache } from '../lib/wallpaperCache.js'
import { mapWallhavenWallpaper } from '../lib/wallpaperMapper.js'

const CACHE_KEY = 'wallhaven-latest-v2'
const CACHE_MAX_AGE = 10 * 60 * 1000
const BATCH_SIZE = 24
const FILTERED_BATCH_TARGET = 20
const MAX_FILTER_SCAN_PAGES = 6

const SORTING = {
  newest: ['date_added', 'desc'],
  oldest: ['date_added', 'asc'],
  title: ['date_added', 'desc'],
  views: ['views', 'desc'],
  favorites: ['favorites', 'desc'],
  toplist: ['toplist', 'desc'],
  random: ['random', 'desc'],
}

function normalizeQuery(value) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, 100)
}

function matchesOrientation(wallpaper, orientation) {
  return orientation === 'all' || orientation === 'both' || wallpaper.orientation === orientation
}

function sortTitles(items) {
  return [...items].sort((a, b) => a.title.localeCompare(b.title))
}

function createRandomSeed() {
  return Math.random().toString(36).slice(2, 8).padEnd(6, '0')
}

export function useWallpapers(options = {}) {
  const {
    query = '',
    orientation = 'all',
    category = 'all',
    categorySlug = null,
    apiCategory = '',
    sort = 'newest',
  } = options

  const search = normalizeQuery(query)
  const categoryQuery = categorySlug || (category !== 'all' ? category : '')
  const effectiveQuery = [search, categoryQuery].filter(Boolean).join(' ')
  const isDefaultCatalog = !effectiveQuery && !apiCategory && orientation === 'all' && sort === 'newest'
  const cached = isDefaultCatalog ? readWallpaperCache(CACHE_KEY, CACHE_MAX_AGE) : null
  const [wallpapers, setWallpapers] = useState(cached?.items || [])
  const [loading, setLoading] = useState(!cached?.items?.length)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [loadMoreError, setLoadMoreError] = useState(null)
  const [hasMore, setHasMore] = useState(cached?.hasMore ?? true)
  const [totalCount, setTotalCount] = useState(cached?.totalCount ?? null)
  const [page, setPage] = useState(cached?.page ?? 1)
  const requestId = useRef(0)
  const wallpapersRef = useRef(cached?.items || [])
  const randomSeed = useRef(null)
  if (!randomSeed.current) randomSeed.current = createRandomSeed()

  const loadPage = useCallback(async (nextPage, append = false) => {
    const currentRequest = ++requestId.current
    if (append) {
      setLoadingMore(true)
      setLoadMoreError(null)
    }
    else {
      setLoading(true)
      setLoadingMore(false)
      setLoadMoreError(null)
    }
    setError(null)

    try {
      const [sorting, order] = SORTING[sort] || SORTING.newest
      const targetCount = orientation === 'all' || orientation === 'both' ? BATCH_SIZE : FILTERED_BATCH_TARGET
      const maxPages = orientation === 'all' || orientation === 'both' ? 1 : MAX_FILTER_SCAN_PAGES
      const existing = append ? wallpapersRef.current : []
      const seen = new Set(existing.map((wallpaper) => wallpaper.id))
      const mapped = []
      let requestPage = nextPage
      let resultMeta = null

      for (let index = 0; index < maxPages; index += 1) {
        const params = new URLSearchParams({ page: String(requestPage), sorting })
        if (order === 'asc') params.set('order', order)
        if (effectiveQuery) params.set('q', effectiveQuery)
        if (apiCategory) params.set('apiCategory', apiCategory)
        if (sort === 'random') params.set('seed', randomSeed.current)

        const response = await fetch(`/api/wallhaven?${params.toString()}`)
        const responseBody = await response.text()
        let result
        try {
          result = JSON.parse(responseBody)
        } catch {
          throw new Error('The wallpaper service returned an invalid response. Please try again shortly.')
        }
        if (!response.ok) throw new Error(result.error || 'Could not load wallpapers.')
        if (currentRequest !== requestId.current) return false

        resultMeta = result.meta || null
        for (const wallpaper of (result.data || []).map(mapWallhavenWallpaper)) {
          if (!matchesOrientation(wallpaper, orientation) || seen.has(wallpaper.id)) continue
          seen.add(wallpaper.id)
          mapped.push(wallpaper)
        }

        const currentApiPage = Number(resultMeta?.current_page) || requestPage
        const lastApiPage = Number(resultMeta?.last_page) || currentApiPage
        if (mapped.length >= targetCount || currentApiPage >= lastApiPage || index === maxPages - 1) break
        requestPage = currentApiPage + 1
      }

      let sortedMapped = mapped
      if (sort === 'title') sortedMapped = sortTitles(mapped)

      const nextWallpapers = append ? [...existing, ...sortedMapped] : sortedMapped
      wallpapersRef.current = nextWallpapers
      setWallpapers(nextWallpapers)
      const currentApiPage = Number(resultMeta?.current_page) || nextPage
      const lastApiPage = Number(resultMeta?.last_page) || currentApiPage
      setPage(currentApiPage)
      setTotalCount(resultMeta?.total ?? sortedMapped.length)
      setHasMore(currentApiPage < lastApiPage)
      if (isDefaultCatalog && !append) {
        writeWallpaperCache(CACHE_KEY, {
          items: nextWallpapers,
          totalCount: resultMeta?.total ?? nextWallpapers.length,
          hasMore: currentApiPage < lastApiPage,
          page: currentApiPage,
        })
      }
      setLoadMoreError(null)
      setLoading(false)
      setLoadingMore(false)
      return true
    } catch (loadError) {
      if (currentRequest !== requestId.current) return false
      if (append) {
        setLoadMoreError(loadError)
      } else {
        setError(loadError)
        setWallpapers([])
      }
      setLoading(false)
      setLoadingMore(false)
      return false
    }
  }, [apiCategory, effectiveQuery, isDefaultCatalog, orientation, sort])

  useEffect(() => {
    requestId.current += 1
    setPage(1)
    wallpapersRef.current = []
    const timer = window.setTimeout(() => loadPage(1), search ? 250 : 0)
    return () => window.clearTimeout(timer)
  }, [loadPage, search])

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return
    await loadPage(page + 1, true)
  }, [hasMore, loadPage, loading, loadingMore, page])

  const retry = useCallback(() => loadPage(1), [loadPage])

  return {
    wallpapers,
    loading,
    loadingMore,
    error,
    loadMoreError,
    retry,
    hasMore,
    totalCount,
    loadMore,
    batchSize: BATCH_SIZE,
  }
}
