import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient.js'
import { usePendingWallpapers } from '../../hooks/useAdminData.js'

export default function Moderation() {
  const { wallpapers, loading, error, refresh } = usePendingWallpapers()
  const [busyId, setBusyId] = useState(null)
  const [actionError, setActionError] = useState(null)

  async function setStatus(id, status) {
    setBusyId(id)
    setActionError(null)
    const { error: updateError } = await supabase.from('wallpapers').update({ status }).eq('id', id)
    setBusyId(null)
    if (updateError) {
      setActionError(updateError.message)
      return
    }
    await refresh()
  }

  async function deleteWallpaper(wallpaper) {
    if (!confirm(`Permanently delete “${wallpaper.title}”? This cannot be undone.`)) return

    setBusyId(wallpaper.id)
    setActionError(null)
    const { error: deleteError } = await supabase.from('wallpapers').delete().eq('id', wallpaper.id)
    setBusyId(null)

    if (deleteError) {
      setActionError(deleteError.message)
      return
    }
    await refresh()
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-lg mb-xl">
        <div>
          <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-xs">Content control</p>
          <h1 className="font-display text-h1">Moderation queue</h1>
        </div>
        <Link to="/admin" className="text-label text-ink-soft hover:text-ink">← Dashboard</Link>
      </div>

      {actionError && <p className="text-body-sm text-accent-2 mb-lg">{actionError}</p>}
      {loading && <p className="text-body-sm text-ink-soft">Loading…</p>}
      {error && <p className="text-body-sm text-accent-2">{error.message}</p>}
      {!loading && !error && wallpapers.length === 0 && (
        <div className="border border-line bg-surface rounded-md p-2xl">
          <p className="font-display text-h3 mb-xs">Nothing pending</p>
          <p className="text-body-sm text-ink-soft">All uploaded wallpapers have been reviewed.</p>
        </div>
      )}

      <div className="flex flex-col gap-md">
        {wallpapers.map((w) => (
          <div key={w.id} className="bg-surface border border-line rounded-md p-lg flex flex-col lg:flex-row lg:items-center gap-lg">
            <Link to={`/wallpaper/${w.id}`} className="shrink-0">
              <img
                src={w.imageUrl}
                alt={w.title}
                className={`object-contain bg-bg rounded-sm border border-line ${w.orientation === 'phone' ? 'w-24 h-36' : w.orientation === 'tablet' ? 'w-32 h-24' : 'w-40 h-24'}`}
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link to={`/wallpaper/${w.id}`} className="text-body hover:underline">{w.title}</Link>
              <p className="text-label text-ink-soft mt-xs">
                {w.orientation === 'phone' ? 'Mobile · 9:16' : w.orientation === 'tablet' ? 'Tablet · 4:3' : 'Desktop · 16:9'}
                {w.resolution ? ` · ${w.resolution}` : ''}
                {w.category ? ` · ${w.category}` : ''}
              </p>
              {w.uploader && <p className="text-label text-ink-soft mt-xs">Uploaded by @{w.uploader}</p>}
            </div>
            <div className="flex flex-wrap gap-sm shrink-0">
              <button type="button" disabled={busyId === w.id} onClick={() => setStatus(w.id, 'approved')} className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body-sm font-medium disabled:opacity-60">
                {busyId === w.id ? 'Saving…' : 'Approve'}
              </button>
              <button type="button" disabled={busyId === w.id} onClick={() => setStatus(w.id, 'rejected')} className="border border-accent-2 text-accent-2 rounded-md px-lg py-sm text-body-sm disabled:opacity-60">
                Reject
              </button>
              <button type="button" disabled={busyId === w.id} onClick={() => deleteWallpaper(w)} className="border border-line text-accent-2 rounded-md p-sm disabled:opacity-50" aria-label={`Delete ${w.title}`}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
