import {
  ArrowLeft,
  BarChart3,
  ClipboardCheck,
  FolderTree,
  Image,
  Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import Footer from "../common/Footer.jsx";

const items = [
  { to: "/admin", label: "Dashboard", icon: BarChart3 },
  { to: "/admin/moderation", label: "Moderation", icon: ClipboardCheck },
  { to: "/admin/wallpapers", label: "Wallpapers", icon: Image },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/users", label: "Users", icon: Users },
];

export default function AdminLayout({ children }) {
  const location = useLocation();

  const isActive = (to) =>
    to === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(to);

  return (
    <div className="admin-theme min-h-screen bg-bg text-ink">
      <header className="border-b border-line">
        <div className="container-page py-md lg:py-lg">
          <div className="admin-header-row">
            <Link to="/admin" className="admin-brand shrink-0">
              <img src={logo} alt="HeyWalls" className="h-8 w-auto" />
              <div className="leading-none">
                <span className="font-display italic text-h3 block">
                  HeyWalls
                </span>
                <span className="admin-brand-subtitle">Admin</span>
              </div>
            </Link>

            <nav className="admin-nav" aria-label="Admin navigation">
              {items.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  aria-current={isActive(to) ? "page" : undefined}
                  className={`admin-nav-item ${isActive(to) ? "is-active" : ""}`}
                >
                  <Icon size={16} strokeWidth={1.8} />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>

            <Link
              to="/"
              className="admin-back text-label text-ink-soft hover:text-ink inline-flex items-center gap-xs shrink-0"
            >
              <ArrowLeft size={14} strokeWidth={1.8} />
              <span>Back to site</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="container-page py-xl lg:py-2xl">{children}</main>
      <Footer />
    </div>
  );
}
