import { Navigate, Route, Routes } from 'react-router-dom'
import About from '../pages/About.jsx'
import Category from '../pages/Category.jsx'
import Categories from '../pages/Categories.jsx'
import Explore from '../pages/Explore.jsx'
import Favorites from '../pages/Favorites.jsx'
import Home from '../pages/Home.jsx'
import WallpaperDetail from '../pages/WallpaperDetail.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/about" element={<About />} />
      <Route path="/saved" element={<Favorites />} />
      <Route path="/account/favorites" element={<Navigate to="/saved" replace />} />
      <Route path="/category/:slug" element={<Category />} />
      <Route path="/wallpaper/:id" element={<WallpaperDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
