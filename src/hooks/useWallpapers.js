import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { mapWallpaperRow, WALLPAPER_SELECT } from '../lib/wallpaperMapper.js'

export function useWallpapers() {
  const [wallpapers, setWallpapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase
        .from('wallpapers')
        .select(WALLPAPER_SELECT)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (!active) return

      if (queryError) {
        setError(queryError)
        setWallpapers([])
      } else {
        setWallpapers((data || []).map(mapWallpaperRow))
      }
      setLoading(false)
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return { wallpapers, loading, error }
}
