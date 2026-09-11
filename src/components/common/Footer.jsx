import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="container-page py-2xl md:py-3xl">
        <div className="grid gap-2xl md:grid-cols-[minmax(0,1.5fr)_repeat(2,minmax(0,1fr))]">
          <div>
            <Link to="/" className="inline-flex items-center gap-sm">
              <img src={logo} alt="HeyWalls" className="h-7 w-auto" />
              <span className="font-display italic text-h3 text-ink">HeyWalls</span>
            </Link>
            <p className="mt-md max-w-[420px] text-body-sm text-ink-soft">
              Walls worth living with. A simple home for desktop and phone wallpapers,
              curated by us and shared by the community.
            </p>
          </div>

          <div>
            <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-md">Explore</p>
            <nav className="flex flex-col gap-sm text-body-sm">
              <Link to="/explore" className="hover:text-ink">Browse wallpapers</Link>
              <Link to="/category/nature" className="hover:text-ink">Browse by mood</Link>
            </nav>
          </div>

          <div>
            <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-md">Your space</p>
            <nav className="flex flex-col gap-sm text-body-sm">
              <Link to="/upload" className="hover:text-ink">Upload a wallpaper</Link>
              <Link to="/account/uploads" className="hover:text-ink">My uploads</Link>
              <Link to="/collections" className="hover:text-ink">Collections</Link>
            </nav>
          </div>
        </div>

        <div className="mt-2xl flex flex-col gap-sm border-t border-line pt-lg text-label text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <span>Desktop &amp; phone · 9:16 and 16:9</span>
          <span>© {new Date().getFullYear()} HeyWalls</span>
        </div>
      </div>
    </footer>
  )
}
