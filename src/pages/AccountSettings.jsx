import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'

export default function AccountSettings() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '')
      setBio(profile.bio || '')
    }
  }, [profile])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)

    const { data, error } = await supabase
      .from('profiles')
      .update({ username, bio })
      .eq('id', user.id)
      .select()
      .single()

    setSaving(false)
    if (error) {
      // .single() errors if zero rows came back — e.g. RLS silently
      // blocked the write — instead of falsely reporting success.
      setError(error.message)
    } else {
      setSaved(true)
      setUsername(data.username || '')
      setBio(data.bio || '')
      refreshProfile()
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <h1 className="font-display text-h1 mb-lg">Account settings</h1>

      <form onSubmit={handleSave} className="flex flex-col gap-lg max-w-[420px]">
        <label className="flex flex-col gap-xs">
          <span className="text-label text-ink-soft">Email</span>
          <input
            type="email"
            disabled
            value={user?.email || ''}
            className="bg-surface border border-line rounded-sm px-lg py-sm text-body text-ink-soft"
          />
        </label>

        <label className="flex flex-col gap-xs">
          <span className="text-label text-ink-soft">Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-surface border border-line rounded-sm px-lg py-sm text-body"
          />
        </label>

        <label className="flex flex-col gap-xs">
          <span className="text-label text-ink-soft">Bio</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="bg-surface border border-line rounded-sm px-lg py-sm text-body resize-none"
          />
        </label>

        {error && <p className="text-body-sm text-accent-2">{error}</p>}
        {saved && <p className="text-body-sm text-ink-soft">Saved.</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body font-medium disabled:opacity-60 self-start"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>

      <button
        onClick={handleSignOut}
        className="border border-ink text-ink rounded-md px-lg py-sm text-body mt-3xl"
      >
        Sign out
      </button>
    </div>
  )
}
