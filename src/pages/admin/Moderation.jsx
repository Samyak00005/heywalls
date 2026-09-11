import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient.js'
import { usePendingWallpapers } from '../../hooks/useAdminData.js'

export default function Moderation() {
  const { wallpapers, loading, error, refresh } = usePendingWallpapers()
  const [busyId, setBusyId] = useState(null)

  async function setStatus(id, status) {
    setBusyId(id)
    await supabase.from('wallpapers').update({ status }).eq('id', id)
    setBusyId(null)
    refresh()
  }

  return (
    <div>
      <h1 className="font-display text-h1 mb-xl">Moderation queue</h1>

      {loading && <p className="text-body-sm text-ink-soft">Loading…</p>}
      {error && <p className="text-body-sm text-accent-2">{error.message}</p>}
      {!loading && !error && wallpapers.length === 0 && (
        <p className="text-body-sm text-ink-soft py-xl">Nothing pending — all caught up.</p>
      )}

      <div className="flex flex-col gap-md">
        {wallpapers.map((w) => (
          <div
            key={w.id}
            className="bg-surface border border-line rounded-md p-lg flex items-center gap-lg"
          >
            <img
              src={w.imageUrl}
              alt={w.title}
              className="w-20 h-20 object-cover rounded-sm shrink-0"
            />
            <div className="flex-1">
              <p className="text-body">{w.title}</p>
              <p className="text-label text-ink-soft">
                {w.category} · {w.orientation}
                {w.uploader ? ` · @${w.uploader}` : ''}
              </p>
            </div>
            <button
              disabled={busyId === w.id}
              onClick={() => setStatus(w.id, 'approved')}
              className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body-sm font-medium disabled:opacity-60"
            >
              Approve
            </button>
            <button
              disabled={busyId === w.id}
              onClick={() => setStatus(w.id, 'rejected')}
              className="border border-accent-2 text-accent-2 rounded-md px-lg py-sm text-body-sm disabled:opacity-60"
            >
              Reject
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
