import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient.js'
import { mapWallpaperRow, WALLPAPER_SELECT } from '../../lib/wallpaperMapper.js'

const FILTERS = ['all', 'pending', 'approved', 'rejected']

export default function AdminWallpapers() {
  const [wallpapers, setWallpapers] = useState([])
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    const { data, error: queryError } = await supabase
      .from('wallpapers')
      .select(WALLPAPER_SELECT + ', status')
      .order('created_at', { ascending: false })

    if (queryError) {
      setError(queryError)
      setWallpapers([])
    } else {
      setWallpapers((data || []).map(mapWallpaperRow))
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return wallpapers.filter((w) => {
      const statusMatch = filter === 'all' || w.status === filter
      const textMatch = !q || `${w.title} ${w.category} ${w.uploader || ''}`.toLowerCase().includes(q)
      return statusMatch && textMatch
    })
  }, [wallpapers, filter, query])

  async function setStatus(id, status) {
    setBusyId(id)
    setError(null)
    const { error: updateError } = await supabase.from('wallpapers').update({ status }).eq('id', id)
    setBusyId(null)
    if (updateError) {
      setError(updateError)
      return
    }
    setWallpapers((current) => current.map((w) => w.id === id ? { ...w, status } : w))
  }

  async function remove(wallpaper) {
    if (!confirm(`Permanently delete “${wallpaper.title}”? This cannot be undone.`)) return
    setBusyId(wallpaper.id)
    setError(null)
    const { error: deleteError } = await supabase.from('wallpapers').delete().eq('id', wallpaper.id)
    setBusyId(null)
    if (deleteError) {
      setError(deleteError)
      return
    }
    setWallpapers((current) => current.filter((w) => w.id !== wallpaper.id))
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-lg mb-xl">
        <div>
          <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-xs">Content library</p>
          <h1 className="font-display text-h1">Wallpapers</h1>
        </div>
        <span className="text-label text-ink-soft">{filtered.length} shown · {wallpapers.length} total</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-sm mb-xl">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search title, category or uploader…"
          className="bg-surface border border-line rounded-sm px-lg py-sm text-body-sm flex-1 max-w-[520px]"
        />
        <div className="flex flex-wrap gap-sm">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`capitalize border rounded-md px-md py-sm text-body-sm ${filter === item ? 'border-ink text-ink' : 'border-line text-ink-soft'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-body-sm text-accent-2 mb-lg">{error.message}</p>}
      {loading && <p className="text-body-sm text-ink-soft">Loading wallpapers…</p>}

      <div className="border border-line rounded-md overflow-hidden">
        {filtered.map((w) => (
          <div key={w.id} className="admin-wallpaper-row bg-surface border-b border-line last:border-b-0">
            <Link to={`/wallpaper/${w.id}`} className="admin-wallpaper-thumb shrink-0" aria-label={`View ${w.title}`}>
              <img src={w.imageUrl} alt={w.title} />
            </Link>

            <div className="admin-wallpaper-info">
              <Link to={`/wallpaper/${w.id}`} className="text-body-sm hover:underline block truncate">{w.title}</Link>
              <p className="text-label text-ink-soft mt-xs truncate">
                {w.status} · {w.orientation === 'phone' ? 'Mobile · 9:16' : 'Desktop · 16:9'}
              </p>
              <p className="text-label text-ink-soft mt-xs truncate">
                Resolution: {w.resolution || 'Unavailable'}
              </p>
              {w.uploader && <p className="text-label text-ink-soft mt-xs truncate">@{w.uploader}</p>}
            </div>

            <div className="admin-wallpaper-actions">
              {w.status !== 'approved' && (
                <button type="button" disabled={busyId === w.id} onClick={() => setStatus(w.id, 'approved')} className="bg-accent text-accent-contrast rounded-md px-md py-sm text-body-sm disabled:opacity-50">
                  Publish
                </button>
              )}
              {w.status === 'approved' && (
                <button type="button" disabled={busyId === w.id} onClick={() => setStatus(w.id, 'rejected')} className="border border-accent-2 text-accent-2 rounded-md px-md py-sm text-body-sm disabled:opacity-50">
                  Unpublish
                </button>
              )}
              {w.status !== 'rejected' && (
                <button type="button" disabled={busyId === w.id} onClick={() => setStatus(w.id, 'rejected')} className="border border-line text-ink rounded-md px-md py-sm text-body-sm disabled:opacity-50">
                  Reject
                </button>
              )}
              <button type="button" disabled={busyId === w.id} onClick={() => remove(w)} className="border border-line text-accent-2 rounded-md p-sm disabled:opacity-50" aria-label={`Delete ${w.title}`}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <p className="p-xl text-body-sm text-ink-soft text-center">No wallpapers match these filters.</p>
        )}
      </div>
    </div>
  )
}
