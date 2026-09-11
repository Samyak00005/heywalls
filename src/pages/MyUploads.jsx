import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingState } from '../components/common/DataState.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'
import { mapWallpaperRow, WALLPAPER_SELECT } from '../lib/wallpaperMapper.js'

const STATUS_LABEL = {
  pending: 'Pending review',
  approved: 'Live',
  rejected: 'Not approved',
}

export default function MyUploads() {
  const { user } = useAuth()
  const [uploads, setUploads] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true
    if (!user) return undefined

    async function load() {
      const { data, error: queryError } = await supabase
        .from('wallpapers')
        .select(WALLPAPER_SELECT + ', status')
        .eq('uploader_id', user.id)
        .order('created_at', { ascending: false })

      if (!active) return
      if (queryError) {
        setError(queryError)
        setUploads([])
      } else {
        setUploads((data || []).map(mapWallpaperRow))
      }
    }

    load()
    return () => { active = false }
  }, [user])

  if (!uploads) {
    return (
      <div className="container-page pt-xl pb-3xl">
        <LoadingState label="Loading your uploads…" />
      </div>
    )
  }

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-2xl lg:gap-4xl items-start">
        <section className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-lg mb-xl">
            <div>
              <h1 className="font-display text-h1 mb-sm">My uploads</h1>
              <p className="text-body-sm text-ink-soft">
                Your wallpapers, review status, and published work.
              </p>
            </div>
            <Link to="/upload" className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body-sm font-medium">
              Upload wallpaper
            </Link>
          </div>

          {error && (
            <p className="text-body-sm text-accent-2 mb-lg">{error.message}</p>
          )}

          {uploads.length === 0 ? (
            <div className="border border-line bg-surface rounded-md p-2xl text-center">
              <p className="text-body-sm text-ink-soft mb-lg">No uploads yet.</p>
              <Link to="/upload" className="text-ink underline">
                Upload your first wallpaper
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-md lg:gap-lg items-start">
              {uploads.map((w) =>
                w.orientation === 'phone' ? (
                  <PhoneUploadCard key={w.id} wallpaper={w} />
                ) : (
                  <DesktopUploadCard key={w.id} wallpaper={w} />
                )
              )}
            </div>
          )}
        </section>

        <aside className="hidden lg:block border-l border-line pl-2xl sticky top-xl">
          <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-sm">Creator space</p>
          <h2 className="font-display text-h2 mb-sm">Your uploads</h2>
          <p className="text-body-sm text-ink-soft mb-xl">
            New uploads appear here with their moderation status. Open a wallpaper to view its full details.
          </p>
          <div className="border-t border-line pt-lg space-y-sm text-body-sm">
            <Link to="/account/settings" className="block text-ink hover:underline">Account settings →</Link>
            <Link to="/account/favorites" className="block text-ink hover:underline">Saved wallpapers →</Link>
            <Link to="/collections" className="block text-ink hover:underline">Collections →</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}

function UploadStatus({ status }) {
  return (
    <span className="absolute top-sm left-sm bg-bg/90 border border-line rounded-sm px-sm py-xs text-label">
      {STATUS_LABEL[status] || status}
    </span>
  )
}

function UploadMeta({ wallpaper }) {
  return (
    <div className="upload-card-meta">
      <p className="upload-card-title">{wallpaper.title}</p>
      <div className="upload-card-subline">
        <span>{wallpaper.orientation === 'phone' ? 'Mobile' : 'Desktop'}</span>
        <span>{wallpaper.category || 'Uncategorized'}</span>
      </div>
    </div>
  )
}

function PhoneUploadCard({ wallpaper }) {
  return (
    <Link
      to={`/wallpaper/${wallpaper.id}`}
      className="group self-start bg-surface border border-line rounded-md overflow-hidden block"
    >
      <div className="relative aspect-[9/16]">
        <img
          src={wallpaper.imageUrl}
          alt={wallpaper.title}
          className="w-full h-full object-cover block transition-transform duration-200 group-hover:scale-[1.02]"
        />
        <UploadStatus status={wallpaper.status} />
      </div>
      <UploadMeta wallpaper={wallpaper} />
    </Link>
  )
}

function DesktopUploadCard({ wallpaper }) {
  return (
    <Link
      to={`/wallpaper/${wallpaper.id}`}
      className="group self-start bg-surface border border-line rounded-md overflow-hidden block"
    >
      <div className="relative aspect-[16/9]">
        <img
          src={wallpaper.imageUrl}
          alt={wallpaper.title}
          className="w-full h-full object-cover block transition-transform duration-200 group-hover:scale-[1.02]"
        />
        <UploadStatus status={wallpaper.status} />
      </div>
      <UploadMeta wallpaper={wallpaper} />
    </Link>
  )
}
