import Footer from './Footer.jsx'
import Navbar from './Navbar.jsx'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
