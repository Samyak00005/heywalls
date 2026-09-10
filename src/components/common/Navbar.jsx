import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="border-b border-line">
      <div className="container-page flex items-center justify-between py-sm md:py-lg">
        <Link to="/" className="font-display italic text-h2 text-ink">
          HeyWalls
        </Link>

        <nav className="hidden md:flex items-center gap-xl text-body-sm text-ink-soft">
          <Link to="/explore" className="hover:text-ink">
            Explore
          </Link>
          <span className="cursor-default">Categories</span>
          <span className="cursor-default">Upload</span>
        </nav>

        <button className="text-body-sm border border-ink text-ink rounded-md px-lg py-sm">
          Sign in
        </button>
      </div>
    </header>
  )
}
