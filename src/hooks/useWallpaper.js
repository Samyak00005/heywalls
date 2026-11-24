import { useCallback, useEffect, useState } from 'react'
import { mapWallhavenWallpaper } from '../lib/wallpaperMapper.js'

export function useWallpaper(id) {
  const [wallpaper, setWallpaper] = useState(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const retry = useCallback(() => setRetryCount((count) => count + 1), [])

  useEffect(() => {
    let active = true
    const controller = new AbortController()

    async function load() {
      if (!id) {
        setWallpaper(null)
        setError(new Error('Wallpaper ID is missing.'))
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const photoId = id.replace(/^wallhaven-/, '')
        const response = await fetch(`/api/wallhaven?id=${encodeURIComponent(photoId)}`, {
          signal: controller.signal,
        })
        const responseBody = await response.text()
        let result
        try {
          result = JSON.parse(responseBody)
        } catch {
          throw new Error('The wallpaper service returned an invalid response. Please try again shortly.')
        }
        if (!response.ok) throw new Error(result?.error || 'Could not load this wallpaper.')
        if (!result?.data || typeof result.data !== 'object' || Array.isArray(result.data)) {
          throw new Error('This wallpaper is no longer available.')
        }
        if (active) setWallpaper(mapWallhavenWallpaper(result.data))
      } catch (loadError) {
        if (active && loadError?.name !== 'AbortError') setError(loadError)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
      controller.abort()
    }
  }, [id, retryCount])

  return { wallpaper, loading, error, retry }
}
