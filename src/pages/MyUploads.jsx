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

  useEffect(() => {
    if (!user) return
    supabase
      .from('wallpapers')
      .select(WALLPAPER_SELECT + ', status')
      .eq('uploader_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setUploads((data || []).map(mapWallpaperRow)))
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
      <h1 className="font-display text-h1 mb-xl">My uploads</h1>

      {uploads.length === 0 ? (
        <p className="text-body-sm text-ink-soft py-xl">
          No uploads yet.{' '}
          <Link to="/upload" className="text-ink underline">
            Upload your first wallpaper
          </Link>
          .
        </p>
      ) : (
        <div className="flex flex-col gap-sm max-w-[560px]">
          {uploads.map((w) => (
            <div
              key={w.id}
              className="bg-surface border border-line rounded-md px-lg py-sm flex items-center gap-lg"
            >
              <img src={w.imageUrl} alt={w.title} className="w-12 h-12 object-cover rounded-sm shrink-0" />
              <span className="text-body-sm flex-1">{w.title}</span>
              <span className="text-label text-ink-soft">{STATUS_LABEL[w.status] || w.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
