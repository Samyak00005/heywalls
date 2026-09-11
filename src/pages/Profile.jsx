import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { LoadingState } from '../components/common/DataState.jsx'
import AccountSidebar from '../components/common/AccountSidebar.jsx'
import WallpaperCard from '../components/wallpaper/WallpaperCard.jsx'
import { useProfile } from '../hooks/useProfile.js'
import { useAuth } from '../context/AuthContext.jsx'
import { mapWallpaperRow, WALLPAPER_SELECT } from '../lib/wallpaperMapper.js'
import { supabase } from '../lib/supabaseClient.js'

const PROFILE_UPLOAD_LIMIT = 5

export default function Profile() {
  const { username } = useParams()
  const location = useLocation()
  const { profile, loading, error } = useProfile(username)
  const { user, profile: currentProfile, signOut } = useAuth()
  const [uploads, setUploads] = useState([])
  const [collections, setCollections] = useState([])
  const [uploadsLoading, setUploadsLoading] = useState(false)
  const [collectionsLoading, setCollectionsLoading] = useState(false)
  const [accountError, setAccountError] = useState(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let active = true

    if (!profile?.id) {
      setUploads([])
      setCollections([])
      return undefined
    }

    setUploadsLoading(true)

    async function loadUploads() {
      const { data, error: queryError } = await supabase
        .from('wallpapers')
        .select(WALLPAPER_SELECT)
        .eq('uploader_id', profile.id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (!active) return
      setUploads(queryError ? [] : (data || []).map(mapWallpaperRow))
      setUploadsLoading(false)
    }

    loadUploads()
    return () => { active = false }
  }, [profile?.id])

  const isOwnProfile = Boolean(currentProfile?.id && profile?.id === currentProfile.id)

  useEffect(() => {
    let active = true
    if (!isOwnProfile || !profile?.id) {
      setCollections([])
      setCollectionsLoading(false)
      return undefined
    }

    setCollectionsLoading(true)
    async function loadCollections() {
      const { data, error: queryError } = await supabase
        .from('collections')
        .select('id, name, description, created_at, collection_wallpapers(count)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })

      if (!active) return
      setCollections(queryError ? [] : (data || []))
      setCollectionsLoading(false)
    }

    loadCollections()
    return () => { active = false }
  }, [isOwnProfile, profile?.id])

  const displayName = profile?.display_name?.trim() || profile?.username || username
  const initials = useMemo(() => displayName?.charAt(0)?.toUpperCase() || '?', [displayName])
  const visibleUploads = uploads.slice(0, PROFILE_UPLOAD_LIMIT)

  function openDeleteAccount() {
    setAccountError(null)
    setDeletePassword('')
    setDeleteConfirmation('')
    setDeleteOpen(true)
  }

  function closeDeleteAccount() {
    if (deleting) return
    setDeleteOpen(false)
    setDeletePassword('')
    setDeleteConfirmation('')
    setAccountError(null)
  }

  useEffect(() => {
    if (isOwnProfile && location.hash === '#delete-account') {
      openDeleteAccount()
    }
  }, [isOwnProfile, location.hash])

  async function handleDeleteAccount(e) {
    e.preventDefault()
    if (deleteConfirmation.trim() !== 'DELETE') {
      setAccountError('Enter DELETE exactly to confirm account deletion.')
      return
    }

    setDeleting(true)
    setAccountError(null)

    const { error: passwordError } = await supabase.auth.signInWithPassword({
      email: user?.email || '',
      password: deletePassword,
    })

    if (passwordError) {
      setAccountError('Incorrect password. Please try again.')
      setDeleting(false)
      return
    }

    const { error: deleteError } = await supabase.functions.invoke('delete-account')
    if (deleteError) {
      setAccountError(deleteError.message || 'Unable to delete your account.')
      setDeleting(false)
      return
    }

    await signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="container-page pt-xl pb-3xl">
        <LoadingState label="Loading profile…" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="container-page pt-xl pb-3xl">
        <p className="text-body text-ink-soft text-center py-2xl">
          No profile found for @{username}.
        </p>
      </div>
    )
  }

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-2xl lg:gap-4xl items-start">
        <section className="min-w-0">
          <section className="border-b border-line pb-2xl mb-2xl">
            <div className="flex items-start justify-between gap-lg">
              <div className="flex items-start gap-lg min-w-0">
                <div className="w-20 h-20 rounded-full bg-surface border border-line flex items-center justify-center shrink-0">
                  <span className="font-display text-h2 text-ink">{initials}</span>
                </div>
                <div className="min-w-0 flex-1 pt-xs">
                  <h1 className="font-display text-h1 leading-tight">{displayName}</h1>
                  <p className="text-body-sm text-ink-soft mt-xs">@{profile.username}</p>
                  {profile.bio?.trim() && (
                    <p className="profile-bio text-body-sm text-ink-soft mt-sm">{profile.bio.trim()}</p>
                  )}
                </div>
              </div>

              {isOwnProfile && (
                <Link
                  to="/account/settings"
                  className="shrink-0 border border-ink text-ink rounded-md px-lg py-sm text-body-sm hover:bg-ink hover:text-bg"
                >
                  Edit profile
                </Link>
              )}
            </div>
            <div className="profile-bio-row">
              <p className="text-label text-ink-soft mt-sm">
                {uploads.length} {uploads.length === 1 ? 'wallpaper' : 'wallpapers'} published
              </p>
            </div>
          </section>

          <section id="published-wallpapers" className="mb-3xl scroll-mt-xl">
            <div className="flex items-end justify-between gap-lg mb-lg">
              <div>
                <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-xs">Show</p>
                <h2 className="font-display text-h2">Published wallpapers</h2>
              </div>
              <Link
                to="/account/uploads"
                className="shrink-0 text-body-sm text-ink hover:underline"
              >
                Show more →
              </Link>
            </div>

            {uploadsLoading ? (
              <LoadingState label="Loading wallpapers…" />
            ) : visibleUploads.length === 0 ? (
              <p className="text-body-sm text-ink-soft py-xl">No published wallpapers yet.</p>
            ) : (
              <div className="profile-single-row">
                {visibleUploads.map((wallpaper) => (
                  <div key={wallpaper.id} className="profile-row-card">
                    <WallpaperCard wallpaper={wallpaper} showFavorite={false} showDownload={false} />
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="border-t border-line pt-2xl" id="collections">
            <div className="mb-lg">
              <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-xs">Show</p>
              <h2 className="font-display text-h2">Collections</h2>
            </div>

            {!isOwnProfile ? (
              <p className="text-body-sm text-ink-soft py-lg">Collections are private.</p>
            ) : collectionsLoading ? (
              <LoadingState label="Loading collections…" />
            ) : collections.length === 0 ? (
              <p className="text-body-sm text-ink-soft py-lg">No collections yet.</p>
            ) : (
              <div className="profile-collection-row">
                {collections.map((collection) => {
                  const count = collection.collection_wallpapers?.[0]?.count ?? 0
                  return (
                    <Link
                      key={collection.id}
                      to={`/collections/${collection.id}`}
                      className="profile-collection-card"
                    >
                      <h3 className="font-display text-h3 mb-xs truncate">{collection.name}</h3>
                      <p className="text-label text-ink-soft">
                        {count} {count === 1 ? 'wallpaper' : 'wallpapers'}
                      </p>
                      {collection.description && (
                        <p className="text-body-sm text-ink-soft mt-md line-clamp-2">
                          {collection.description}
                        </p>
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </section>

          {accountError && <p className="text-body-sm text-accent-2 mt-lg">{accountError}</p>}
        </section>

        {isOwnProfile ? (
          <AccountSidebar onDeleteAccount={openDeleteAccount} username={profile.username} showAdminDashboard={currentProfile?.role === 'admin'} variant="profile" />
        ) : (
          <aside className="hidden lg:block border-l border-line pl-2xl sticky top-xl">
            <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-sm">Creator</p>
            <h2 className="font-display text-h2 mb-sm">{displayName}</h2>
            <p className="text-body-sm text-ink-soft">
              {uploads.length} published {uploads.length === 1 ? 'wallpaper' : 'wallpapers'}.
            </p>
          </aside>
        )}
      </div>

      {deleteOpen && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-[rgba(32,30,27,0.35)] px-lg"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <div className="w-full max-w-[520px] border border-line bg-bg p-2xl shadow-hung">
            <div className="flex items-start justify-between gap-lg">
              <div>
                <p className="text-label uppercase tracking-[0.08em] text-accent-2 mb-xs">Danger zone</p>
                <h2 id="delete-account-title" className="font-display text-h2">Delete account</h2>
              </div>
              <button
                type="button"
                onClick={closeDeleteAccount}
                disabled={deleting}
                aria-label="Close delete account dialog"
                className="border border-line rounded-md px-md py-xs text-body-sm hover:bg-surface"
              >
                ×
              </button>
            </div>

            <p className="text-body-sm text-ink-soft mt-lg">
              This permanently deletes your HeyWalls account, profile, uploads, favourite wallpapers, and collections. This cannot be undone.
            </p>

            <form onSubmit={handleDeleteAccount} className="flex flex-col gap-lg mt-xl">
              <label className="flex flex-col gap-xs">
                <span className="text-label text-ink-soft">Password</span>
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="bg-surface border border-line rounded-sm px-lg py-sm text-body"
                />
              </label>

              <label className="flex flex-col gap-xs">
                <span className="text-label text-ink-soft">Type DELETE to confirm</span>
                <input
                  type="text"
                  required
                  autoComplete="off"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE"
                  className="bg-surface border border-line rounded-sm px-lg py-sm text-body"
                />
              </label>

              {accountError && <p className="text-body-sm text-accent-2">{accountError}</p>}

              <div className="flex flex-wrap justify-end gap-md pt-xs">
                <button
                  type="button"
                  onClick={closeDeleteAccount}
                  disabled={deleting}
                  className="border border-ink text-ink rounded-md px-lg py-sm text-body-sm hover:bg-surface disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleting || !deletePassword || deleteConfirmation.trim() !== 'DELETE'}
                  className="bg-accent-2 text-accent-contrast rounded-md px-lg py-sm text-body-sm font-medium disabled:opacity-50"
                >
                  {deleting ? 'Deleting…' : 'Delete account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
