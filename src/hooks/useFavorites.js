import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { useAuth } from './useAuth.js'

export function useFavorites() {
  const { user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  async function load() {
    if (!user) {
      setFavoriteIds(new Set())
      setLoading(false)
      return
    }
    setLoading(true)
    const { data } = await supabase
      .from('favorites')
      .select('wallpaper_id')
      .eq('user_id', user.id)
    setFavoriteIds(new Set((data || []).map((r) => r.wallpaper_id)))
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [user])

  async function toggle(wallpaperId) {
    if (!user) return false
    if (favoriteIds.has(wallpaperId)) {
      await supabase.from('favorites').delete().eq('user_id', user.id).eq('wallpaper_id', wallpaperId)
      setFavoriteIds((prev) => {
        const next = new Set(prev)
        next.delete(wallpaperId)
        return next
      })
      return false
    }
    await supabase.from('favorites').insert({ user_id: user.id, wallpaper_id: wallpaperId })
    setFavoriteIds((prev) => new Set(prev).add(wallpaperId))
    return true
  }

  return { favoriteIds, isFavorite: (id) => favoriteIds.has(id), toggle, loading, refresh: load }
}
