import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient.js'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('id, username, role, created_at')
      .order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function toggleRole(user) {
    setBusyId(user.id)
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    await supabase.from('profiles').update({ role: newRole }).eq('id', user.id)
    setBusyId(null)
    load()
  }

  return (
    <div>
      <h1 className="font-display text-h1 mb-xl">Users</h1>

      {loading && <p className="text-body-sm text-ink-soft">Loading…</p>}

      <div className="flex flex-col gap-sm max-w-[520px]">
        {users.map((u) => (
          <div
            key={u.id}
            className="bg-surface border border-line rounded-md px-lg py-sm flex items-center justify-between"
          >
            <div>
              <span className="text-body-sm">@{u.username}</span>
              <span className="text-label text-ink-soft ml-sm">{u.role}</span>
            </div>
            <button
              disabled={busyId === u.id}
              onClick={() => toggleRole(u)}
              className="text-label border border-line rounded-sm px-md py-xs disabled:opacity-60"
            >
              {u.role === 'admin' ? 'Remove admin' : 'Make admin'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
