import { Link } from 'react-router-dom'

export default function AccountSidebar({ onDeleteAccount, username }) {
  return (
    <aside className="hidden lg:block border-l border-line pl-2xl sticky top-xl">
      <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-sm">
        Your HeyWalls
      </p>
      <h2 className="font-display text-h2 mb-sm">Account hub</h2>
      <p className="text-body-sm text-ink-soft mb-xl">
        Manage your wallpapers, saved work, collections, and account from one place.
      </p>
      <nav className="space-y-sm text-body-sm">
        <Link to={username ? `/profile/${username}#published-wallpapers` : '#published-wallpapers'} className="block text-ink hover:underline">
          Published wallpapers →
        </Link>
        <Link to="/account/favorites" className="block text-ink hover:underline">
          Saved wallpapers →
        </Link>
        <Link to="/collections" className="block text-ink hover:underline">
          My collections →
        </Link>
        <Link to="/upload" className="block text-ink hover:underline">
          Upload a wallpaper →
        </Link>
        <Link to="/forgot-password" className="block text-ink hover:underline">
          Forgot password →
        </Link>
        <div className="border-t border-line pt-md mt-md">
          <button
            type="button"
            onClick={onDeleteAccount}
            className="block text-left text-accent-2 hover:underline"
          >
            Delete account →
          </button>
        </div>
      </nav>
    </aside>
  )
}
