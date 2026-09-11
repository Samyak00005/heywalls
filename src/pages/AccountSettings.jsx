import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { supabase } from '../lib/supabaseClient.js'
import { useToast } from '../components/common/ToastContext.jsx'

export default function AccountSettings() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [displayName, setDisplayName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!profile) return
    setDisplayName(profile.display_name || '')
    setUsername(profile.username || '')
    setBio(profile.bio || '')
  }, [profile])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const trimmedUsername = username.trim()
    if (!trimmedUsername) {
      setError('Username is required.')
      setSaving(false)
      return
    }

    const { data, error: updateError } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim() || null,
        username: trimmedUsername,
        bio: bio.trim() || null,
      })
      .eq('id', user.id)
      .select()
      .single()

    setSaving(false)
    if (updateError) {
      setError(
        updateError.code === '23505'
          ? 'That username is already taken — try another.'
          : updateError.message,
      )
      return
    }

    setDisplayName(data.display_name || '')
    setUsername(data.username || '')
    setBio(data.bio || '')
    await refreshProfile()
    showToast('Profile details saved.')
    navigate(`/profile/${data.username}`)
  }

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <section className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-lg mb-xl max-w-[900px]">
            <div>
              <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-xs">My account</p>
              <h1 className="font-display text-h1">Edit profile</h1>
            </div>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-md max-w-[900px]">
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
              <span className="text-label text-ink-soft">Name</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
                maxLength={80}
                className="bg-surface border border-line rounded-sm px-lg py-sm text-body"
              />
            </label>

            <label className="flex flex-col gap-xs">
              <span className="text-label text-ink-soft">Username</span>
              <input
                type="text"
                required
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
                rows={4}
                maxLength={240}
                placeholder="Tell people a little about yourself"
                className="bg-surface border border-line rounded-sm px-lg py-sm text-body resize-none"
              />
            </label>

            {error && <p className="text-body-sm text-accent-2">{error}</p>}

            <div className="flex flex-wrap items-center gap-md pt-xs">
              <button
                type="submit"
                disabled={saving}
                className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body font-medium disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate(profile?.username ? `/profile/${profile.username}` : '/')}
                className="border border-ink text-ink rounded-md px-lg py-sm text-body-sm hover:bg-ink hover:text-bg"
              >
                Cancel
              </button>
            </div>
          </form>
      </section>
    </div>
  )
}
