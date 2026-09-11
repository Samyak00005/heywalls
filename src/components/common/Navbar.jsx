import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const isAdmin = profile?.role === 'admin'

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <header className="border-b border-line">
      <div className="container-page flex items-center justify-between py-sm md:py-lg">
        <Link to="/" className="flex items-center gap-sm">
          <img src={logo} alt="HeyWalls" className="h-9 w-auto" />
          <span className="font-display italic text-h2 text-ink">HeyWalls</span>
        </Link>

        <nav className="hidden md:flex items-center gap-xl text-body-sm text-ink-soft">
          <Link to="/explore" className="hover:text-ink">
            Explore
          </Link>
          {user && (
            <Link to="/upload" className="hover:text-ink">
              Upload
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="hover:text-ink">
              Admin
            </Link>
          )}
        </nav>

        {user ? (
          <div className="flex items-center gap-lg">
            <Link
              to="/account/settings"
              className="text-body-sm text-ink hover:text-ink-soft"
            >
              @{profile?.username || 'account'}
            </Link>
            <button
              onClick={handleSignOut}
              className="text-body-sm border border-ink text-ink rounded-md px-lg py-sm"
            >
              Sign out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-body-sm border border-ink text-ink rounded-md px-lg py-sm"
          >
            Sign in
          </Link>
        )}
      </div>
    </header>
  )
}
