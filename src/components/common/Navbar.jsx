import { Compass, Heart, Menu, Search, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { FEATURED_TOPICS, WALLPAPER_TOPICS } from "../../lib/categories.js";

function ExploreLink({ onClick, active = false }) {
  return (
    <Link
      to="/explore"
      onClick={onClick}
      className={`inline-flex items-center gap-xs whitespace-nowrap text-body-sm transition-colors hover:text-ink ${active ? "font-medium text-ink" : "text-ink-soft"}`}
    >
      <Compass size={16} strokeWidth={1.8} aria-hidden="true" />
      <span>Explore</span>
    </Link>
  );
}

function SavedLink({ onClick, className = "", compact = false }) {
  return (
    <Link
      to="/saved"
      onClick={onClick}
      className={`inline-flex items-center gap-xs whitespace-nowrap text-body-sm text-ink-soft transition-colors hover:text-ink ${className}`}
    >
      <Heart size={16} strokeWidth={1.8} aria-hidden="true" />
      <span className={compact ? "hidden md:inline" : ""}>Saved</span>
    </Link>
  );
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(location.search);
    return location.pathname === "/explore" ? params.get("q") || "" : "";
  });
  const [searchFocused, setSearchFocused] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const exploreActive = location.pathname === "/explore";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(
      location.pathname === "/explore" ? params.get("q") || "" : "",
    );
  }, [location.pathname, location.search]);

  function runSearch(value) {
    const query = value.trim();
    if (!query) return;
    navigate(`/explore?q=${encodeURIComponent(query)}`);
    setMobileSearchOpen(false);
    setMenuOpen(false);
    setSearchFocused(false);
  }

  function submitSearch(event) {
    event.preventDefault();
    runSearch(searchQuery);
  }

  function renderSearchForm(mobile = false) {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const suggestions = normalizedQuery
      ? WALLPAPER_TOPICS.filter(({ name, query }) =>
          `${name} ${query}`.toLowerCase().includes(normalizedQuery),
        ).slice(0, 5)
      : FEATURED_TOPICS.slice(0, 5);

    return (
      <form
        onSubmit={submitSearch}
        onFocus={() => setSearchFocused(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            setSearchFocused(false);
        }}
        className={`relative ${mobile ? "w-full" : "hidden w-56 shrink-0 xl:block"}`}
        role="search"
      >
        <Search
          size={16}
          strokeWidth={1.8}
          aria-hidden="true"
          className="pointer-events-none absolute left-md top-1/2 -translate-y-1/2 text-ink-soft"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search wallpapers…"
          aria-label="Search wallpapers"
          aria-autocomplete="list"
          aria-expanded={searchFocused}
          autoFocus={mobile}
          className="global-search-input w-full rounded-md border border-line bg-bg py-sm pl-2xl pr-md text-body-sm text-ink placeholder:text-ink-soft focus:bg-accent-contrast focus:outline-none"
        />
        {searchFocused && (
          <div
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-[60] overflow-hidden rounded-md border border-line bg-accent-contrast shadow-hung"
            role="listbox"
            aria-label="Search suggestions"
          >
            {suggestions.map(({ slug, name, query }) => (
              <button
                key={slug}
                type="button"
                role="option"
                aria-selected="false"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => runSearch(query)}
                className="flex w-full items-center gap-sm border-b border-line px-md py-sm text-left text-body-sm text-ink-soft hover:bg-surface hover:text-ink"
              >
                <Search size={14} strokeWidth={1.8} aria-hidden="true" />
                <span>{name}</span>
              </button>
            ))}
            {searchQuery.trim() && (
              <button
                type="submit"
                role="option"
                aria-selected="false"
                onMouseDown={(event) => event.preventDefault()}
                className="flex w-full items-center gap-sm px-md py-sm text-left text-body-sm text-ink hover:bg-surface"
              >
                <Search size={14} strokeWidth={1.8} aria-hidden="true" />
                <span>Search for “{searchQuery.trim()}”</span>
              </button>
            )}
          </div>
        )}
      </form>
    );
  }

  return (
    <header className="relative z-50 border-b border-line bg-surface">
      <div className="container-page flex items-center justify-between gap-md py-sm md:py-lg">
        <Link
          to="/"
          onClick={() => {
            closeMenu();
            setMobileSearchOpen(false);
          }}
          className="flex shrink-0 items-center gap-sm"
        >
          <img src={logo} alt="HeyWalls" className="h-9 w-auto" />
          <span className="font-display italic text-h2 text-ink">HeyWalls</span>
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-sm xl:flex"
          aria-label="Explore wallpapers by topic"
        >
          <ExploreLink active={exploreActive} />
          <span className="h-5 border-l border-line" aria-hidden="true" />
          {FEATURED_TOPICS.map(({ slug, name }) => (
            <Link
              key={slug}
              to={`/category/${slug}`}
              className="whitespace-nowrap rounded-md px-sm py-xs text-label text-ink-soft transition-colors hover:bg-bg hover:text-ink"
            >
              {name}
            </Link>
          ))}
          <Link
            to="/categories"
            className="whitespace-nowrap rounded-md px-sm py-xs text-label text-ink-soft transition-colors hover:bg-bg hover:text-ink"
          >
            Categories
          </Link>
        </nav>

        {renderSearchForm()}

        <div className="ml-auto flex shrink-0 items-center gap-md">
          <SavedLink compact className="rounded-md p-sm" />
          <button
            type="button"
            aria-label={mobileSearchOpen ? "Close search" : "Open search"}
            aria-expanded={mobileSearchOpen}
            onClick={() => {
              setMenuOpen(false);
              setSearchFocused(false);
              setMobileSearchOpen((open) => !open);
            }}
            className="flex items-center justify-center rounded-md border border-line bg-bg p-sm text-ink xl:hidden"
          >
            {mobileSearchOpen ? (
              <X size={20} strokeWidth={1.8} />
            ) : (
              <Search size={20} strokeWidth={1.8} />
            )}
          </button>
          <button
            type="button"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            onClick={() => {
              setMobileSearchOpen(false);
              setMenuOpen((open) => !open);
            }}
            className="flex items-center justify-center rounded-md border border-line bg-bg p-sm text-ink xl:hidden"
          >
            {menuOpen ? (
              <X size={21} strokeWidth={1.8} />
            ) : (
              <Menu size={21} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="absolute left-0 right-0 top-full border-b border-line bg-surface shadow-hung xl:hidden"
          aria-label="Main navigation"
        >
          <div className="container-page flex flex-col py-sm">
            <ExploreLink onClick={closeMenu} active={exploreActive} />
            <div className="my-sm border-t border-line" />
            {FEATURED_TOPICS.map(({ slug, name }) => (
              <Link
                key={slug}
                to={`/category/${slug}`}
                onClick={closeMenu}
                className="flex items-center gap-md border-b border-line px-sm py-md text-body-sm text-ink-soft hover:text-ink"
              >
                <Sparkles size={17} strokeWidth={1.8} aria-hidden="true" />
                <span>{name}</span>
              </Link>
            ))}
            <Link
              to="/categories"
              onClick={closeMenu}
              className="border-b border-line px-sm py-md text-body-sm text-ink-soft hover:text-ink"
            >
              All categories
            </Link>
            <Link
              to="/about"
              onClick={closeMenu}
              className="px-sm py-md text-body-sm text-ink-soft hover:text-ink"
            >
              About HeyWalls
            </Link>
            <SavedLink onClick={closeMenu} className="px-sm py-md" />
          </div>
        </nav>
      )}

      {mobileSearchOpen && (
        <div className="absolute left-0 right-0 top-full z-40 border-b border-line bg-surface py-md shadow-hung xl:hidden">
          <div className="container-page">{renderSearchForm(true)}</div>
        </div>
      )}
    </header>
  );
}
