import { useEffect, useState } from 'react'
import { mapWallhavenWallpaper } from '../lib/wallpaperMapper.js'

export function useWallpaper(id) {
  const [wallpaper, setWallpaper] = useState(null)
  const [loading, setLoading] = useState(Boolean(id))
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

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
        const response = await fetch(`/api/wallhaven?id=${encodeURIComponent(photoId)}`)
        const result = await response.json()
        if (!response.ok) throw new Error(result.error || 'Could not load this wallpaper.')
        if (active) setWallpaper(mapWallhavenWallpaper(result.data))
      } catch (loadError) {
        if (active) setError(loadError)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [id])

  return { wallpaper, loading, error }
}
