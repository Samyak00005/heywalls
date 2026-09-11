import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Compass,
  Upload,
  Heart,
  Image,
  FolderHeart,
  ShieldCheck,
  UserCircle,
  LogOut,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = profile?.role === "admin";

  async function handleSignOut() {
    setMenuOpen(false);
    await signOut();
    navigate("/");
  }

  const closeMenu = () => setMenuOpen(false);

  const isActive = (path) =>
    path === "/explore"
      ? location.pathname === "/explore"
      : location.pathname === path || location.pathname.startsWith(`${path}/`);

  const links = [
    {
      to: "/explore",
      label: "Explore",
      icon: Compass,
    },

    ...(user
      ? [
          {
            to: "/upload",
            label: "Upload",
            icon: Upload,
          },
          {
            to: "/account/favorites",
            label: "Saved",
            icon: Heart,
          },
          {
            to: "/account/uploads",
            label: "My uploads",
            icon: Image,
          },
          {
            to: "/collections",
            label: "Collections",
            icon: FolderHeart,
          },
        ]
      : []),

    ...(isAdmin
      ? [
          {
            to: "/admin",
            label: "Admin",
            icon: ShieldCheck,
          },
        ]
      : []),
  ];

  return (
    <header className="relative z-50 border-b border-line bg-bg">
      {/* =========================
          MAIN HEADER
      ========================== */}
      <div className="container-page flex items-center justify-between py-sm md:py-lg">
        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-sm shrink-0"
        >
          <img src={logo} alt="HeyWalls" className="h-9 w-auto" />

          <span className="font-display italic text-h2 text-ink">HeyWalls</span>
        </Link>

        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}
        <nav className="hidden md:flex items-center gap-xl text-body-sm text-ink-soft">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`
                transition-colors
                hover:text-ink
                ${isActive(to) ? "text-ink font-medium" : "text-ink-soft"}
              `}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* =========================
            RIGHT SIDE
        ========================== */}
        <div className="flex items-center gap-sm md:gap-lg">
          {/* Username */}
          {user && (
            <Link
              to="/account/settings"
              className="
                hidden sm:inline
                text-body-sm
                text-ink
                hover:text-ink-soft
                truncate
                max-w-[150px]
              "
            >
              @{profile?.username || "account"}
            </Link>
          )}

          {/* =========================
              DESKTOP AUTH BUTTON
          ========================== */}
          <div className="hidden md:block">
            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="
                  group
                  flex items-center gap-xs
                  text-body-sm
                  border border-ink
                  text-ink
                  rounded-md
                  px-lg py-sm
                  transition-all duration-200
                  hover:bg-red-600
                  hover:border-red-600
                  hover:text-white
                "
              >
                <span>Sign out</span>
                <LogOut size={17} strokeWidth={1.8} />
              </button>
            ) : (
              <Link
                to="/login"
                className="
                  text-body-sm
                  border border-ink
                  text-ink
                  rounded-md
                  px-lg py-sm
                  transition-colors
                  hover:bg-ink
                  hover:text-bg
                "
              >
                Sign in
              </Link>
            )}
          </div>

          {/* =========================
              MOBILE MENU BUTTON
          ========================== */}
          <button
            type="button"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="
              md:hidden
              flex items-center justify-center
              border border-line
              rounded-md
              p-sm
              text-ink
              bg-surface
              transition-colors
              hover:bg-surface/80
            "
          >
            {menuOpen ? (
              <X size={21} strokeWidth={1.8} />
            ) : (
              <Menu size={21} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {/* =========================
          MOBILE NAVIGATION
      ========================== */}
      {menuOpen && (
        <div
          className="
            md:hidden
            absolute
            left-0
            right-0
            top-full
            z-[100]
            border-b
            border-line
            bg-bg
            shadow-hung
          "
        >
          <nav className="container-page py-sm flex flex-col">
            {/* Main navigation */}
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={closeMenu}
                className={`
                  flex items-center gap-md
                  px-sm py-md
                  border-b border-line
                  text-body-sm
                  transition-colors
                  hover:text-ink
                  hover:bg-surface
                  ${isActive(to) ? "text-ink font-medium" : "text-ink-soft"}
                `}
              >
                <Icon size={18} strokeWidth={1.8} className="shrink-0" />

                <span>{label}</span>
              </Link>
            ))}

            {/* =========================
                ACCOUNT
            ========================== */}
            {user && (
              <Link
                to="/account/settings"
                onClick={closeMenu}
                className={`
                  flex items-center gap-md
                  px-sm py-md
                  border-b border-line
                  text-body-sm
                  transition-colors
                  hover:text-ink
                  hover:bg-surface
                  ${
                    isActive("/account/settings")
                      ? "text-ink font-medium"
                      : "text-ink-soft"
                  }
                `}
              >
                <UserCircle size={18} strokeWidth={1.8} className="shrink-0" />

                <span>Account settings</span>
              </Link>
            )}

            {/* =========================
                MOBILE SIGN OUT
            ========================== */}
            {user && (
              <button
                type="button"
                onClick={handleSignOut}
                className="
                  group
                  w-full
                  flex items-center gap-md
                  px-sm py-md
                  mt-sm
                  text-body-sm
                  text-left
                  text-ink
                  text-red-600
                  font-medium
                  transition-all duration-200

                  hover:bg-red-600
                  hover:border-red-600
                  hover:text-white
                "
              >
                <LogOut
                  size={18}
                  strokeWidth={1.8}
                  className="
                  shrink-0
                  transition-colors
                  "
                />
                <span>Sign out</span>
              </button>
            )}

            {/* =========================
                MOBILE SIGN IN
            ========================== */}
            {!user && (
              <Link
                to="/login"
                onClick={closeMenu}
                className="
                  flex items-center gap-md
                  px-sm py-md
                  text-body-sm
                  text-ink
                  rounded-md
                  transition-colors
                  hover:bg-surface
                "
              >
                <UserCircle size={18} strokeWidth={1.8} className="shrink-0" />

                <span>Sign in</span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
