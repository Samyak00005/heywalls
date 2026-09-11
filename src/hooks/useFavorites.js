import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient.js'
import { useAuth } from './useAuth.js'

export function useFavorites() {
  const { user } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    if (!user) {
      setFavoriteIds(new Set())
      setError(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: queryError } = await supabase
      .from('favorites')
      .select('wallpaper_id')
      .eq('user_id', user.id)

    if (queryError) {
      setError(queryError)
      setFavoriteIds(new Set())
    } else {
      setFavoriteIds(new Set((data || []).map((row) => row.wallpaper_id)))
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [user])

  async function toggle(wallpaperId) {
    if (!user) return false

    setError(null)
    const currentlyFavorite = favoriteIds.has(wallpaperId)

    if (currentlyFavorite) {
      const { error: deleteError } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('wallpaper_id', wallpaperId)

      if (deleteError) {
        setError(deleteError)
        return true
      }

      setFavoriteIds((prev) => {
        const next = new Set(prev)
        next.delete(wallpaperId)
        return next
      })
      return false
    }

    const { error: insertError } = await supabase
      .from('favorites')
      .insert({ user_id: user.id, wallpaper_id: wallpaperId })

    if (insertError) {
      setError(insertError)
      return false
    }

    setFavoriteIds((prev) => new Set(prev).add(wallpaperId))
    return true
  }

  return {
    favoriteIds,
    isFavorite: (id) => favoriteIds.has(id),
    toggle,
    loading,
    error,
    refresh: load,
  }
}
