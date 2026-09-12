import { Plus, Check, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function CollectionButton({ wallpaperId }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [collections, setCollections] = useState([])
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!open || !user) return
    let active = true

    async function load() {
      setLoading(true)
      const [{ data: collectionRows }, { data: membershipRows }] = await Promise.all([
        supabase
          .from('collections')
          .select('id, name')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('collection_wallpapers')
          .select('collection_id')
          .eq('wallpaper_id', wallpaperId),
      ])

      if (!active) return
      setCollections(collectionRows || [])
      setSelectedIds(new Set((membershipRows || []).map((row) => row.collection_id)))
      setLoading(false)
    }

    load()
    return () => { active = false }
  }, [open, user, wallpaperId])

  async function toggleCollection(collectionId) {
    if (!user) return
    setMessage('')

    if (selectedIds.has(collectionId)) {
      const { error } = await supabase
        .from('collection_wallpapers')
        .delete()
        .eq('collection_id', collectionId)
        .eq('wallpaper_id', wallpaperId)

      if (error) {
        setMessage(error.message)
        return
      }

      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(collectionId)
        return next
      })
      return
    }

    const { error } = await supabase
      .from('collection_wallpapers')
      .insert({ collection_id: collectionId, wallpaper_id: wallpaperId })

    if (error) {
      setMessage(error.message)
      return
    }

    setSelectedIds((prev) => new Set(prev).add(collectionId))
  }

  async function createCollection(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed || !user) return

    setLoading(true)
    setMessage('')

    const { data, error } = await supabase
      .from('collections')
      .insert({ user_id: user.id, name: trimmed })
      .select('id, name')
      .single()

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setCollections((prev) => [data, ...prev])
    setSelectedIds((prev) => new Set(prev).add(data.id))
    setName('')
    setLoading(false)
  }

  if (!user) return null

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="border border-ink text-ink rounded-md px-lg py-sm text-body font-medium inline-flex items-center gap-sm"
      >
        <Plus size={16} />
        Collection
      </button>

      {open && (
        <div className="absolute z-20 top-full mt-sm right-0 w-[300px] bg-bg border border-line rounded-md shadow-hung p-lg">
          <div className="flex items-center justify-between mb-md">
            <span className="font-display text-h3">Add to collection</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close">
              <X size={16} />
            </button>
          </div>

          {loading && collections.length === 0 ? (
            <p className="text-label text-ink-soft py-sm">Loading collections…</p>
          ) : collections.length === 0 ? (
            <p className="text-body-sm text-ink-soft mb-md">
              Create your first collection below.
            </p>
          ) : (
            <div className="flex flex-col gap-xs mb-md max-h-[180px] overflow-auto">
              {collections.map((collection) => {
                const selected = selectedIds.has(collection.id)
                return (
                  <button
                    key={collection.id}
                    type="button"
                    onClick={() => toggleCollection(collection.id)}
                    className="flex items-center justify-between text-left px-sm py-sm rounded-sm hover:bg-surface"
                  >
                    <span className="text-body-sm truncate">{collection.name}</span>
                    {selected && <Check size={15} />}
                  </button>
                )
              })}
            </div>
          )}

          <form onSubmit={createCollection} className="flex gap-xs border-t border-line pt-md">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New collection"
              className="min-w-0 flex-1 bg-surface border border-line rounded-sm px-sm py-sm text-body-sm"
            />
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="bg-accent text-accent-contrast rounded-sm px-md text-body-sm disabled:opacity-50"
            >
              Create
            </button>
          </form>

          {message && <p className="text-label text-accent-2 mt-sm">{message}</p>}
        </div>
      )}
    </div>
  )
}
