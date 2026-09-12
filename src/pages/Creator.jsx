import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { ErrorState, LoadingState } from '../components/common/DataState.jsx'
import WallpaperCard from '../components/wallpaper/WallpaperCard.jsx'
import { useProfile } from '../hooks/useProfile.js'
import { mapWallpaperRow, WALLPAPER_SELECT } from '../lib/wallpaperMapper.js'
import { supabase } from '../lib/supabaseClient.js'

export default function Creator() {
  const { username } = useParams()
  const { profile, loading: profileLoading, error: profileError } = useProfile(username)
  const [wallpapers, setWallpapers] = useState([])
  const [wallpapersLoading, setWallpapersLoading] = useState(false)
  const [wallpapersError, setWallpapersError] = useState(null)

  useEffect(() => {
    let active = true

    if (!profile?.id) {
      setWallpapers([])
      setWallpapersLoading(false)
      return undefined
    }

    setWallpapersLoading(true)
    setWallpapersError(null)

    async function loadWallpapers() {
      const { data, error } = await supabase
        .from('wallpapers')
        .select(WALLPAPER_SELECT)
        .eq('uploader_id', profile.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (!active) return

      if (error) {
        setWallpapers([])
        setWallpapersError(error)
      } else {
        setWallpapers((data || []).map(mapWallpaperRow))
      }
      setWallpapersLoading(false)
    }

    loadWallpapers()

    return () => {
      active = false
    }
  }, [profile?.id])

  const displayName = useMemo(
    () => profile?.display_name?.trim() || profile?.username || username,
    [profile, username],
  )

  const initials = displayName.charAt(0).toUpperCase() || '?'

  if (profileLoading) {
    return (
      <div className="container-page pt-xl pb-3xl md:pb-4xl">
        <LoadingState label="Loading creator…" />
      </div>
    )
  }

  if (profileError || !profile) {
    return (
      <div className="container-page pt-xl pb-3xl md:pb-4xl">
        <ErrorState error={profileError || new Error(`No creator found for @${username}.`)} />
      </div>
    )
  }

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <Link
        to="/creators"
        className="inline-flex items-center gap-xs text-body-sm text-ink-soft hover:text-ink mb-xl"
      >
        <ArrowLeft size={15} strokeWidth={1.8} aria-hidden="true" />
        All creators
      </Link>

      <section className="border-b border-line pb-2xl mb-2xl">
        <div className="flex items-start gap-lg">
          <div className="w-20 h-20 rounded-full border border-line bg-surface flex items-center justify-center shrink-0 overflow-hidden">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="font-display text-h2 text-ink">{initials}</span>
            )}
          </div>
          <div className="min-w-0 pt-xs">
            <h1 className="font-display text-h1 leading-tight">{displayName}</h1>
            <p className="text-body-sm text-ink-soft mt-xs">@{profile.username}</p>
          </div>
        </div>

        {profile.bio?.trim() && (
          <p className="text-body text-ink-soft mt-lg max-w-[720px] whitespace-pre-wrap">
            {profile.bio.trim()}
          </p>
        )}

        <div className="mt-xl flex flex-wrap items-center gap-x-xl gap-y-sm">
          <div className="flex items-center gap-xs">
            <ImageIcon size={15} strokeWidth={1.7} className="text-ink-soft" aria-hidden="true" />
            <span className="text-label text-ink">{wallpapers.length}</span>
            <span className="text-label text-ink-soft">{wallpapers.length === 1 ? 'published wallpaper' : 'published wallpapers'}</span>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-lg mb-lg">
          <div>
            <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-xs">Portfolio</p>
            <h2 className="font-display text-h2">Published wallpapers</h2>
          </div>
          <span className="text-label text-ink-soft">{wallpapers.length}</span>
        </div>

        {wallpapersLoading ? (
          <LoadingState label="Loading wallpapers…" />
        ) : wallpapersError ? (
          <ErrorState error={wallpapersError} />
        ) : wallpapers.length === 0 ? (
          <p className="text-body-sm text-ink-soft py-xl">No published wallpapers yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
            {wallpapers.map((wallpaper) => (
              <WallpaperCard
                key={wallpaper.id}
                wallpaper={wallpaper}
                showFavorite={false}
                showDownload={false}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
