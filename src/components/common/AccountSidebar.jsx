import { Link } from "react-router-dom";

const LINK_CLASS = "block text-ink hover:underline";

const VARIANTS = {
  profile: {
    eyebrow: "Your HeyWalls",
    title: "Account hub",
    description:
      "Manage your wallpapers, favourites, collections, and account from one place.",
    links: [
      { label: "Favourites →", to: "/account/favorites" },
      { label: "Upload a wallpaper →", to: "/upload" },
      { label: "Forgot password →", to: "/forgot-password" },
    ],
    deleteDivider: true,
  },
  wallpapers: {
    eyebrow: "Creator space",
    title: "Your wallpapers",
    description:
      "Manage your uploaded wallpapers, collections, and account from one place.",
    links: [
      { label: "My Uploads →", to: "/account/uploads" },
      { label: "Collections →", to: "/collections" },
    ],
  },
  favorites: {
    eyebrow: "Your HeyWalls",
    title: "Favourites",
    description: "Keep track of the wallpapers you want to come back to.",
    links: [
      { label: "My wallpapers →", to: "/account/uploads" },
      { label: "My account →", to: "/profile" },
    ],
  },
  collections: {
    eyebrow: "Your space",
    title: "Your wallpapers",
    description: "Organise your saved wallpaper ideas into collections.",
    links: [
      { label: "My wallpapers →", to: "/account/uploads" },
      { label: "Favourites →", to: "/account/favorites" },
      { label: "My account →", to: "/profile" },
    ],
  },
};

export default function AccountSidebar({
  onDeleteAccount,
  username,
  showAdminDashboard = false,
  variant = "profile",
}) {
  const profilePath = username ? `/profile/${username}` : "/profile";
  const config = VARIANTS[variant] || VARIANTS.profile;
  const links = config.links.map((link) => {
    if (link.label === "My account →") return { ...link, to: profilePath };
    return link;
  });

  return (
    <aside className="hidden lg:block border-l border-line pl-2xl sticky top-xl">
      <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-sm">
        {config.eyebrow}
      </p>
      <h2 className="font-display text-h2 mb-sm">{config.title}</h2>
      <p className="text-body-sm text-ink-soft mb-xl">{config.description}</p>

      <nav className="space-y-sm text-body-sm">
        {links.map((link) => {
          const isHash = link.to.startsWith("#");
          return isHash ? (
            <a key={link.label} href={link.to} className={LINK_CLASS}>
              {link.label}
            </a>
          ) : (
            <Link key={link.label} to={link.to} className={LINK_CLASS}>
              {link.label}
            </Link>
          );
        })}

        {showAdminDashboard && variant === "profile" && (
          <Link to="/admin" className={LINK_CLASS}>
            Admin Dashboard →
          </Link>
        )}

        {config.deleteDivider && (
          <div className="border-t border-line pt-md mt-md">
            {onDeleteAccount ? (
              <button
                type="button"
                onClick={onDeleteAccount}
                className="block text-left text-accent-2 hover:underline"
              >
                Delete account →
              </button>
            ) : (
              <a
                href={`${profilePath}#delete-account`}
                className="block text-accent-2 hover:underline"
              >
                Delete account →
              </a>
            )}
          </div>
        )}
      </nav>
    </aside>
  );
}
