import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { LoadingState } from '../components/common/DataState.jsx'
import WallpaperGrid from '../components/wallpaper/WallpaperGrid.jsx'
import { useProfile } from '../hooks/useProfile.js'
import { useWallpapers } from '../hooks/useWallpapers.js'

export default function Profile() {
  const { username } = useParams()
  const { profile, loading, error } = useProfile(username)
  const { wallpapers } = useWallpapers()

  const uploads = useMemo(
    () => wallpapers.filter((w) => w.uploader === username),
    [wallpapers, username]
  )

  if (loading) {
    return (
      <div className="container-page pt-xl pb-3xl">
        <LoadingState label="Loading profile…" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="container-page pt-xl pb-3xl">
        <p className="text-body text-ink-soft text-center py-2xl">
          No profile found for @{username}.
        </p>
      </div>
    )
  }

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <div className="flex items-center gap-lg mb-2xl">
        <div className="w-16 h-16 rounded-md bg-surface border border-line shrink-0" />
        <div>
          <h1 className="font-display text-h1">@{profile.username}</h1>
          {profile.bio && (
            <p className="text-body-sm text-ink-soft mt-xs">{profile.bio}</p>
          )}
        </div>
      </div>

      <h2 className="font-display text-h2 mb-lg">Uploads</h2>
      {uploads.length === 0 ? (
        <p className="text-body-sm text-ink-soft py-xl">
          No uploads yet — uploading lands in Phase 4.
        </p>
      ) : (
        <WallpaperGrid wallpapers={uploads} />
      )}
    </div>
  )
}
