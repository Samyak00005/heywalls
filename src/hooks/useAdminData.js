import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { mapWallpaperRow, WALLPAPER_SELECT } from '../lib/wallpaperMapper.js'

export function usePendingWallpapers() {
  const [wallpapers, setWallpapers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('wallpapers')
      .select(WALLPAPER_SELECT + ', status')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
    if (error) setError(error)
    else setWallpapers(data.map(mapWallpaperRow))
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  return { wallpapers, loading, error, refresh: load }
}

export function useAdminStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ count: total }, { count: pending }, { count: users }] = await Promise.all([
        supabase.from('wallpapers').select('*', { count: 'exact', head: true }),
        supabase.from('wallpapers').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
      ])
      setStats({ total: total ?? 0, pending: pending ?? 0, users: users ?? 0 })
      setLoading(false)
    }
    load()
  }, [])

  return { stats, loading }
}
