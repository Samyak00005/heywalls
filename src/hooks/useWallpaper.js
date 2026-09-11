import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { mapWallpaperRow, WALLPAPER_SELECT } from '../lib/wallpaperMapper.js'

export function useWallpaper(id) {
  const [wallpaper, setWallpaper] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    let active = true
    setLoading(true)

    async function load() {
      const { data, error } = await supabase
        .from('wallpapers')
        .select(WALLPAPER_SELECT)
        .eq('id', id)
        .eq('status', 'approved')
        .single()

      if (!active) return
      if (error) {
        setError(error)
      } else {
        setWallpaper(mapWallpaperRow(data))
      }
      setLoading(false)
    }

    load()
    return () => {
      active = false
    }
  }, [id])

  return { wallpaper, loading, error }
}
