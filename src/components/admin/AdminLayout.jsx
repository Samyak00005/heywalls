import { Link } from 'react-router-dom'

export default function AdminLayout({ children }) {
  return (
    <div className="admin-theme bg-bg text-ink min-h-screen">
      <div className="border-b border-line">
        <div className="container-page flex items-center gap-xl py-lg text-body-sm">
          <span className="font-display italic text-h3">HeyWalls admin</span>
          <nav className="flex gap-lg text-ink-soft">
            <Link to="/admin" className="hover:text-ink">Dashboard</Link>
            <Link to="/admin/moderation" className="hover:text-ink">Moderation</Link>
            <Link to="/admin/categories" className="hover:text-ink">Categories</Link>
            <Link to="/admin/users" className="hover:text-ink">Users</Link>
          </nav>
          <Link to="/" className="ml-auto text-ink-soft hover:text-ink">
            ← Back to site
          </Link>
        </div>
      </div>
      <div className="container-page py-xl">{children}</div>
    </div>
  )
}
