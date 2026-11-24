import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'heywalls:saved-wallpapers:v1'
const CHANGE_EVENT = 'heywalls:saved-wallpapers-changed'

function readSavedWallpapers() {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(value)
      ? value
          .filter((item) => item?.id && item?.imageUrl)
          .map((item) => ({
            ...item,
            imageUrl: item.imageUrl.includes('th.wallhaven.cc/lg/')
              ? item.imageUrl.replace('/lg/', '/orig/')
              : item.imageUrl,
          }))
      : []
  } catch {
    return []
  }
}

function saveWallpapers(items) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    window.dispatchEvent(new Event(CHANGE_EVENT))
    return true
  } catch {
    return false
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(readSavedWallpapers)

  useEffect(() => {
    const sync = () => setFavorites(readSavedWallpapers())
    window.addEventListener(CHANGE_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const favoriteIds = useMemo(() => new Set(favorites.map((item) => item.id)), [favorites])
  const isFavorite = useCallback((id) => favoriteIds.has(id), [favoriteIds])

  const toggle = useCallback((wallpaper) => {
    if (!wallpaper?.id) return
    const current = readSavedWallpapers()
    const next = current.some((item) => item.id === wallpaper.id)
      ? current.filter((item) => item.id !== wallpaper.id)
      : [wallpaper, ...current]
    if (!saveWallpapers(next)) return false
    setFavorites(next)
    return true
  }, [])

  return { favorites, favoriteIds, isFavorite, toggle }
}
