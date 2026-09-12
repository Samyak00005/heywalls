import { ArrowUpRight, Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorState, LoadingState } from '../components/common/DataState.jsx'
import { supabase } from '../lib/supabaseClient.js'

export default function Creators() {
  const [creators, setCreators] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let active = true

    async function loadCreators() {
      setLoading(true)
      setError(null)

      const { data, error: queryError } = await supabase
        .from('wallpapers')
        .select('uploader_id, profiles(id, username, display_name, avatar_url, bio)')
        .eq('status', 'approved')
        .not('uploader_id', 'is', null)
        .limit(1000)

      if (!active) return

      if (queryError) {
        setError(queryError)
        setCreators([])
        setLoading(false)
        return
      }

      const byId = new Map()

      for (const row of data || []) {
        const profile = row.profiles
        if (!profile?.id || !profile.username) continue

        const existing = byId.get(profile.id)
        if (existing) {
          existing.wallpaperCount += 1
        } else {
          byId.set(profile.id, {
            ...profile,
            wallpaperCount: 1,
          })
        }
      }

      setCreators(
        Array.from(byId.values()).sort((a, b) => {
          if (b.wallpaperCount !== a.wallpaperCount) {
            return b.wallpaperCount - a.wallpaperCount
          }
          return (a.display_name || a.username).localeCompare(b.display_name || b.username)
        }),
      )
      setLoading(false)
    }

    loadCreators()

    return () => {
      active = false
    }
  }, [])

  const filteredCreators = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return creators

    return creators.filter((creator) =>
      [creator.username, creator.display_name, creator.bio]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(value)),
    )
  }, [creators, query])

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <div className="flex flex-wrap items-end justify-between gap-lg mb-xl">
        <div>
          <p className="text-label text-ink-soft uppercase tracking-[0.08em] mb-xs">Community</p>
          <h1 className="font-display text-h1">Creators</h1>
          <p className="text-body-sm text-ink-soft mt-sm">
            Discover people sharing wallpapers on HeyWalls.
          </p>
        </div>

        <label className="relative block w-full sm:w-[300px]">
          <Search
            size={16}
            strokeWidth={1.8}
            aria-hidden="true"
            className="absolute left-md top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none"
          />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search creators…"
            aria-label="Search creators"
            className="admin-form-control library-search-input"
          />
        </label>
      </div>

      {loading && <LoadingState label="Loading creators…" />}
      {error && <ErrorState error={error} />}

      {!loading && !error && (
        <>
          {filteredCreators.length === 0 ? (
            <div className="py-3xl text-center">
              <p className="font-display text-h2">No creators found</p>
              <p className="text-body-sm text-ink-soft mt-sm">
                Try another name or username.
              </p>
            </div>
          ) : (
            <div className="border-t border-line">
              {filteredCreators.map((creator) => {
                const displayName = creator.display_name?.trim() || creator.username
                const initials = displayName.charAt(0).toUpperCase()

                return (
                  <Link
                    key={creator.id}
                    to={`/creator/${creator.username}`}
                    className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-md border-b border-line py-lg"
                  >
                    <div className="w-12 h-12 rounded-full border border-line bg-surface flex items-center justify-center shrink-0 overflow-hidden">
                      {creator.avatar_url ? (
                        <img src={creator.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-display text-h3">{initials}</span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-sm gap-y-0">
                        <h2 className="font-display text-h3 truncate group-hover:underline underline-offset-4">{displayName}</h2>
                        <span className="text-body-sm text-ink-soft">@{creator.username}</span>
                      </div>
                      {creator.bio?.trim() && (
                        <p className="text-body-sm text-ink-soft mt-xs line-clamp-1 max-w-[720px]">{creator.bio.trim()}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-lg">
                      <span className="hidden sm:inline text-label text-ink-soft whitespace-nowrap">
                        {creator.wallpaperCount} {creator.wallpaperCount === 1 ? 'wallpaper' : 'wallpapers'}
                      </span>
                      <ArrowUpRight size={18} strokeWidth={1.7} className="text-ink-soft transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
