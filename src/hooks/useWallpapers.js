import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { mapWallpaperRow, WALLPAPER_SELECT } from '../lib/wallpaperMapper.js'
import { readWallpaperCache, writeWallpaperCache } from '../lib/wallpaperCache.js'

const CACHE_KEY = 'approved-batch'
const CACHE_MAX_AGE = 10 * 60 * 1000
const BATCH_SIZE = 20

function cleanSearch(value) {
  return String(value || '')
    .trim()
    .replace(/[,%()]/g, ' ')
    .replace(/\s+/g, ' ')
    .slice(0, 80)
}

function buildOr(parts) {
  return parts.filter(Boolean).join(',')
}

async function resolveSearchIds(search) {
  if (!search) return { profileIds: [], wallpaperIds: [] }

  const pattern = `%${search}%`
  const [{ data: profiles }, { data: categories }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id')
      .or(`username.ilike.${pattern},display_name.ilike.${pattern}`)
      .limit(100),
    supabase
      .from('categories')
      .select('id')
      .ilike('name', pattern)
      .limit(50),
  ])

  const categoryIds = (categories || []).map((item) => item.id)
  let wallpaperIds = []

  if (categoryIds.length) {
    const { data } = await supabase
      .from('wallpaper_categories')
      .select('wallpaper_id')
      .in('category_id', categoryIds)
      .limit(5000)
    wallpaperIds = (data || []).map((item) => item.wallpaper_id)
  }

  return {
    profileIds: (profiles || []).map((item) => item.id),
    wallpaperIds,
  }
}

export function useWallpapers(options = {}) {
  const {
    query = '',
    orientation = 'all',
    category = 'all',
    categorySlug = null,
    sort = 'newest',
  } = options

  const search = cleanSearch(query)
  const isDefaultCatalog = !search && orientation === 'all' && category === 'all' && !categorySlug && sort === 'newest'
  const cached = isDefaultCatalog ? readWallpaperCache(CACHE_KEY, CACHE_MAX_AGE) : null
  const initialItems = cached?.items?.slice(0, BATCH_SIZE) || []
  const [wallpapers, setWallpapers] = useState(initialItems)
  const [loading, setLoading] = useState(!initialItems.length)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(cached?.hasMore ?? true)
  const [totalCount, setTotalCount] = useState(cached?.totalCount ?? null)
  const requestId = useRef(0)

  const loadBatch = useCallback(async (offset, append = false) => {
    const currentRequest = ++requestId.current
    if (append) setLoadingMore(true)
    else setLoading(true)
    setError(null)

    const categoryFilter = categorySlug || (category !== 'all' ? category : null)
    let searchIds = { profileIds: [], wallpaperIds: [] }

    try {
      if (search) searchIds = await resolveSearchIds(search)

      let select = WALLPAPER_SELECT
      if (categoryFilter) {
        select = 'id, title, description, image_url, thumbnail_url, orientation, width, height, download_count, created_at, profiles(username, display_name), wallpaper_categories!inner(category_id, categories(name, slug))'
      }

      let request = supabase
        .from('wallpapers')
        .select(select, { count: 'exact' })
        .eq('status', 'approved')
        .range(offset, offset + BATCH_SIZE - 1)

      if (orientation !== 'all') request = request.eq('orientation', orientation)

      if (categoryFilter) {
        if (categorySlug) {
          request = request.eq('wallpaper_categories.categories.slug', categorySlug)
        } else {
          request = request.eq('wallpaper_categories.categories.name', categoryFilter)
        }
      }

      if (search) {
        const pattern = `%${search}%`
        const parts = [`title.ilike.${pattern}`, `description.ilike.${pattern}`]
        if (searchIds.profileIds.length) {
          parts.push(`uploader_id.in.(${searchIds.profileIds.join(',')})`)
        }
        if (searchIds.wallpaperIds.length) {
          parts.push(`id.in.(${searchIds.wallpaperIds.join(',')})`)
        }
        request = request.or(buildOr(parts))
      }

      if (sort === 'oldest') request = request.order('created_at', { ascending: true })
      else if (sort === 'title') request = request.order('title', { ascending: true })
      else if (sort === 'downloads') request = request.order('download_count', { ascending: false })
      else request = request.order('created_at', { ascending: false })

      const { data, error: queryError, count } = await request
      if (currentRequest !== requestId.current) return false
      if (queryError) throw queryError

      const mapped = (data || []).map(mapWallpaperRow)
      setWallpapers((current) => {
        if (!append) return mapped
        const existingIds = new Set(current.map((item) => item.id))
        return [...current, ...mapped.filter((item) => !existingIds.has(item.id))]
      })

      const nextTotal = count ?? mapped.length
      const nextHasMore = offset + mapped.length < nextTotal
      setTotalCount(nextTotal)
      setHasMore(nextHasMore)

      if (isDefaultCatalog && !append) {
        writeWallpaperCache(CACHE_KEY, { items: mapped, totalCount: nextTotal, hasMore: nextHasMore })
      }

      setLoading(false)
      setLoadingMore(false)
      return true
    } catch (queryError) {
      if (currentRequest !== requestId.current) return false
      setError(queryError)
      if (!append) setWallpapers([])
      setLoading(false)
      setLoadingMore(false)
      return false
    }
  }, [category, categorySlug, orientation, search, sort, isDefaultCatalog])

  useEffect(() => {
    requestId.current += 1
    const timer = window.setTimeout(() => {
      loadBatch(0, false)
    }, search ? 250 : 0)

    return () => window.clearTimeout(timer)
  }, [loadBatch, search])

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return
    await loadBatch(wallpapers.length, true)
  }, [hasMore, loadBatch, loading, loadingMore, wallpapers.length])

  return { wallpapers, loading, loadingMore, error, hasMore, totalCount, loadMore, batchSize: BATCH_SIZE }
}
