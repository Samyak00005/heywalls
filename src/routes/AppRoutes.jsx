import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx'
import AccountSettings from '../pages/AccountSettings.jsx'
import Category from '../pages/Category.jsx'
import Explore from '../pages/Explore.jsx'
import ForgotPassword from '../pages/ForgotPassword.jsx'
import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import Profile from '../pages/Profile.jsx'
import Signup from '../pages/Signup.jsx'
import UpdatePassword from '../pages/UpdatePassword.jsx'
import WallpaperDetail from '../pages/WallpaperDetail.jsx'

// Phase 4+ will add Upload, My uploads, Favorites, and the /admin/*
// routes here as each phase lands.
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/category/:slug" element={<Category />} />
      <Route path="/wallpaper/:id" element={<WallpaperDetail />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />

      <Route path="/profile/:username" element={<Profile />} />
      <Route
        path="/account/settings"
        element={
          <ProtectedRoute>
            <AccountSettings />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
