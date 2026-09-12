import { Navigate, Route, Routes } from 'react-router-dom'
import AdminRoute from '../components/auth/AdminRoute.jsx'
import ProtectedRoute from '../components/auth/ProtectedRoute.jsx'
import AdminLayout from '../components/admin/AdminLayout.jsx'
import AccountSettings from '../pages/AccountSettings.jsx'
import Category from '../pages/Category.jsx'
import CollectionDetail from '../pages/CollectionDetail.jsx'
import Collections from '../pages/Collections.jsx'
import Creators from '../pages/Creators.jsx'
import Explore from '../pages/Explore.jsx'
import Favorites from '../pages/Favorites.jsx'
import ForgotPassword from '../pages/ForgotPassword.jsx'
import Home from '../pages/Home.jsx'
import Login from '../pages/Login.jsx'
import MyUploads from '../pages/MyUploads.jsx'
import Profile from '../pages/Profile.jsx'
import Signup from '../pages/Signup.jsx'
import UpdatePassword from '../pages/UpdatePassword.jsx'
import Upload from '../pages/Upload.jsx'
import WallpaperDetail from '../pages/WallpaperDetail.jsx'
import AdminCategories from '../pages/admin/Categories.jsx'
import AdminDashboard from '../pages/admin/Dashboard.jsx'
import AdminModeration from '../pages/admin/Moderation.jsx'
import AdminUsers from '../pages/admin/Users.jsx'
import AdminWallpapers from '../pages/admin/Wallpapers.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/creators" element={<Creators />} />
      <Route path="/category/:slug" element={<Category />} />
      <Route path="/wallpaper/:id" element={<WallpaperDetail />} />

      <Route
        path="/collections"
        element={
          <ProtectedRoute>
            <Collections />
          </ProtectedRoute>
        }
      />
      <Route
        path="/collections/:id"
        element={
          <ProtectedRoute>
            <CollectionDetail />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />

      <Route path="/profile/:username" element={<Profile />} />
      <Route
        path="/account/edit-profile"
        element={
          <ProtectedRoute>
            <AccountSettings />
          </ProtectedRoute>
        }
      />
      <Route path="/account/settings" element={<Navigate to="/account/edit-profile" replace />} />

      <Route
        path="/account/uploads"
        element={
          <ProtectedRoute>
            <MyUploads />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/favorites"
        element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/wallpapers"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminWallpapers />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/moderation"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminModeration />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminCategories />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </AdminRoute>
        }
      />
    </Routes>
  )
}
