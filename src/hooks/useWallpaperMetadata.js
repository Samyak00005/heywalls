import { useEffect, useRef, useState } from 'react'
import { getWallpaperDetails } from '../lib/wallpaperDetails.js'

export function useWallpaperMetadata(wallpaper) {
  const cardRef = useRef(null)
  const [nearViewport, setNearViewport] = useState(false)
  const [metadata, setMetadata] = useState(wallpaper)
  const [loadingMetadata, setLoadingMetadata] = useState(!wallpaper.tags?.length)

  useEffect(() => {
    const node = cardRef.current
    if (!node) return undefined
    if (!('IntersectionObserver' in window)) {
      setNearViewport(true)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearViewport(true)
        observer.disconnect()
      }
    }, { rootMargin: '120px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [wallpaper.id])

  useEffect(() => {
    let active = true
    setMetadata(wallpaper)

    if (wallpaper.tags?.length) {
      setLoadingMetadata(false)
      return () => { active = false }
    }
    if (!nearViewport) return () => { active = false }

    setLoadingMetadata(true)
    getWallpaperDetails(wallpaper.id)
      .then((details) => {
        if (active) {
          setMetadata((current) => ({
            ...current,
            title: details.title,
            description: details.description,
            category: details.category,
            apiCategory: details.apiCategory,
            tags: details.tags,
          }))
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoadingMetadata(false)
      })

    return () => { active = false }
  }, [nearViewport, wallpaper])

  return { cardRef, metadata, loadingMetadata }
}
