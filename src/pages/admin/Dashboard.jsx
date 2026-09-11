import { Link } from 'react-router-dom'
import { useAdminStats } from '../../hooks/useAdminData.js'

export default function AdminDashboard() {
  const { stats, loading } = useAdminStats()

  return (
    <div>
      <h1 className="font-display text-h1 mb-xl">Dashboard</h1>

      {loading ? (
        <p className="text-body-sm text-ink-soft">Loading…</p>
      ) : (
        <div className="grid grid-cols-3 gap-lg mb-2xl">
          <StatCard label="Total wallpapers" value={stats.total} />
          <StatCard label="Pending review" value={stats.pending} />
          <StatCard label="Users" value={stats.users} />
        </div>
      )}

      <div className="flex gap-md">
        <Link
          to="/admin/moderation"
          className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body-sm font-medium"
        >
          Review pending uploads
        </Link>
        <Link
          to="/admin/categories"
          className="border border-ink text-ink rounded-md px-lg py-sm text-body-sm"
        >
          Manage categories
        </Link>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="bg-surface border border-line rounded-md p-lg">
      <p className="text-label text-ink-soft mb-xs">{label}</p>
      <p className="font-display text-h1">{value}</p>
    </div>
  )
}
