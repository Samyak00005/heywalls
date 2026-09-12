import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Users() {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  async function load() {
    setLoading(true)
    setError(null)

    const { data, error: loadError } = await supabase
      .from('profiles')
      .select('id, username, role, created_at')
      .order('created_at', { ascending: false })

    if (loadError) {
      setError(loadError.message)
      setUsers([])
    } else {
      setUsers(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function toggleRole(profile) {
    if (profile.id === user?.id) {
      setError('You cannot change your own admin role from this page.')
      return
    }

    setBusyId(profile.id)
    setError(null)

    const newRole = profile.role === 'admin' ? 'user' : 'admin'
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', profile.id)

    setBusyId(null)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setUsers((current) =>
      current.map((item) =>
        item.id === profile.id ? { ...item, role: newRole } : item,
      ),
    )
  }

  const filteredUsers = users.filter((profile) =>
    `${profile.username || ''} ${profile.role || ''}`.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-lg mb-xl">
        <div>
          <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-xs">Access control</p>
          <h1 className="font-display text-h1">Users</h1>
        </div>
        <span className="text-label text-ink-soft">{users.length} users</span>
      </div>

      {error && <p className="text-body-sm text-accent-2 mb-lg">{error}</p>}
      {loading && <p className="text-body-sm text-ink-soft">Loading…</p>}

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users or roles…"
        className="bg-surface border border-line rounded-sm px-lg py-sm text-body-sm w-full max-w-[560px] mb-lg"
      />

      <div className="flex flex-col gap-sm max-w-[900px]">
        {filteredUsers.map((profile) => (
          <div
            key={profile.id}
            className="bg-surface border border-line rounded-md px-lg py-sm flex items-center justify-between gap-lg"
          >
            <div className="min-w-0">
              <span className="text-body-sm truncate">@{profile.username}</span>
              <span className="text-label text-ink-soft ml-sm">{profile.role}</span>
            </div>
            <button
              type="button"
              disabled={busyId === profile.id || profile.id === user?.id}
              onClick={() => toggleRole(profile)}
              className="text-label border border-line rounded-sm px-md py-xs disabled:opacity-60 shrink-0"
            >
              {profile.id === user?.id
                ? 'Current admin'
                : profile.role === 'admin'
                  ? 'Remove admin'
                  : 'Make admin'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
