import {
  CheckCircle2,
  Clock3,
  FolderTree,
  Image,
  ShieldAlert,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient.js";
import {
  mapWallpaperRow,
  WALLPAPER_SELECT,
} from "../../lib/wallpaperMapper.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      const [
        total,
        pending,
        approved,
        rejected,
        users,
        categories,
        recentResult,
      ] = await Promise.all([
        supabase.from("wallpapers").select("*", { count: "exact", head: true }),
        supabase
          .from("wallpapers")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("wallpapers")
          .select("*", { count: "exact", head: true })
          .eq("status", "approved"),
        supabase
          .from("wallpapers")
          .select("*", { count: "exact", head: true })
          .eq("status", "rejected"),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase
          .from("wallpapers")
          .select(WALLPAPER_SELECT + ", status")
          .order("created_at", { ascending: false })
          .limit(6),
      ]);

      if (!active) return;

      const firstError = [
        total.error,
        pending.error,
        approved.error,
        rejected.error,
        users.error,
        categories.error,
        recentResult.error,
      ].find(Boolean);

      if (firstError) {
        setError(firstError);
        setStats(null);
        setRecent([]);
      } else {
        setStats({
          total: total.count ?? 0,
          pending: pending.count ?? 0,
          approved: approved.count ?? 0,
          rejected: rejected.count ?? 0,
          users: users.count ?? 0,
          categories: categories.count ?? 0,
        });
        setRecent((recentResult.data || []).map(mapWallpaperRow));
      }

      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-lg mb-xl">
        <div>
          <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-xs">
            Overview
          </p>
          <h1 className="font-display text-h1">Dashboard</h1>
        </div>
      </div>

      {error && (
        <p className="text-body-sm text-accent-2 mb-lg">{error.message}</p>
      )}

      {loading ? (
        <p className="text-body-sm text-ink-soft">Loading dashboard…</p>
      ) : (
        <>
          <div className="admin-stats-grid mb-2xl">
            <StatCard
              icon={Image}
              label="Total wallpapers"
              value={stats.total}
            />
            <StatCard
              icon={Clock3}
              label="Pending review"
              value={stats.pending}
              tone={stats.pending ? "attention" : "normal"}
            />
            <StatCard
              icon={CheckCircle2}
              label="Published"
              value={stats.approved}
            />
            <StatCard
              icon={ShieldAlert}
              label="Rejected"
              value={stats.rejected}
            />
            <StatCard icon={Users} label="Users" value={stats.users} />
            <StatCard
              icon={FolderTree}
              label="Categories"
              value={stats.categories}
            />
          </div>

          <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-2xl lg:gap-4xl">
            <section>
              <div className="flex items-baseline justify-between mb-lg">
                <h2 className="font-display text-h2">Recent uploads</h2>
                <Link
                  to="/admin/moderation"
                  className="text-label text-ink-soft hover:text-ink"
                >
                  Moderation →
                </Link>
              </div>

              <div className="border border-line rounded-md overflow-hidden">
                {recent.map((w) => (
                  <div
                    key={w.id}
                    className="bg-surface border-b border-line last:border-b-0 p-md lg:p-lg flex items-center gap-md"
                  >
                    <img
                      src={w.imageUrl}
                      alt={w.title}
                      className={`shrink-0 object-contain bg-bg border border-line rounded-sm ${w.orientation === "phone" ? "w-12 h-16" : "w-20 h-12"}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-body-sm truncate">{w.title}</p>
                      <p className="text-label text-ink-soft">
                        {w.status || "unknown"} ·{" "}
                        {w.orientation === "phone" ? "Mobile" : "Desktop"}
                        {w.resolution
                          ? ` · ${w.resolution}`
                          : " · Resolution unavailable"}
                      </p>
                    </div>
                    <Link
                      to={`/wallpaper/${w.id}`}
                      className="text-label text-ink underline shrink-0"
                    >
                      View
                    </Link>
                  </div>
                ))}
                {recent.length === 0 && (
                  <p className="p-lg text-body-sm text-ink-soft">
                    No wallpapers yet.
                  </p>
                )}
              </div>
            </section>

            <aside className="border-l border-line pl-2xl">
              <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-sm">
                Management
              </p>
              <h2 className="font-display text-h2 mb-lg">Admin tools</h2>
              <div className="space-y-md text-body-sm">
                <Link
                  to="/admin/moderation"
                  className="block text-ink hover:underline"
                >
                  Review pending uploads →
                </Link>
                <Link
                  to="/admin/wallpapers"
                  className="block text-ink hover:underline"
                >
                  Manage the full wallpaper library →
                </Link>
                <Link
                  to="/admin/categories"
                  className="block text-ink hover:underline"
                >
                  Create, rename or remove categories →
                </Link>
                <Link
                  to="/admin/users"
                  className="block text-ink hover:underline"
                >
                  Manage user roles →
                </Link>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tone = "normal" }) {
  return (
    <div className="admin-stat-card bg-surface border border-line rounded-md">
      <div className="flex items-center justify-between gap-md">
        <p className="text-label text-ink-soft">{label}</p>
        <Icon
          size={17}
          className={tone === "attention" ? "text-accent-2" : "text-ink-soft"}
        />
      </div>
      <p className="admin-stat-value">{value}</p>
    </div>
  );
}
