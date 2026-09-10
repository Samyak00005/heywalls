import { Route, Routes } from 'react-router-dom'
import Explore from '../pages/Explore.jsx'
import Home from '../pages/Home.jsx'

// Phase 2+ will add Category, WallpaperDetail, auth pages, account pages,
// and the /admin/* routes here as each phase lands.
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
    </Routes>
  )
}
