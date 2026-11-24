import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page py-2xl md:py-3xl">
        <div className="grid gap-2xl md:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,1fr))]">
          <div>
            <Link to="/" className="inline-flex items-center gap-sm">
              <img src={logo} alt="HeyWalls" className="h-7 w-auto" />
              <span className="font-display italic text-h3 text-ink">HeyWalls</span>
            </Link>
            <p className="mt-md max-w-[420px] text-body-sm text-ink-soft">
              A personal home for wallpapers worth living with. Save favorites in this browser and return to them anytime.
            </p>
          </div>

          <div>
            <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-md">Browse</p>
            <nav className="flex flex-col gap-sm text-body-sm">
              <Link to="/explore" className="hover:text-ink">Explore wallpapers</Link>
              <Link to="/categories" className="hover:text-ink">All categories</Link>
              <Link to="/category/nature" className="hover:text-ink">Nature</Link>
              <Link to="/category/anime" className="hover:text-ink">Anime</Link>
            </nav>
          </div>

          <div>
            <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-md">Your library</p>
            <nav className="flex flex-col gap-sm text-body-sm">
              <Link to="/saved" className="hover:text-ink">Saved wallpapers</Link>
              <Link to="/about" className="hover:text-ink">About HeyWalls</Link>
              <a href="https://wallhaven.cc" target="_blank" rel="noreferrer" className="hover:text-ink">Wallpaper source: Wallhaven</a>
            </nav>
          </div>
        </div>

        <div className="mt-2xl flex flex-col gap-sm border-t border-line pt-lg text-label text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <span>Images and wallpaper pages link to their original Wallhaven sources.</span>
          <span>© {new Date().getFullYear()} HeyWalls</span>
        </div>
      </div>
    </footer>
  )
}
