import { Route, Routes } from "react-router-dom";
import Category from "../pages/Category.jsx";
import Explore from "../pages/Explore.jsx";
import Home from "../pages/Home.jsx";
import WallpaperDetail from "../pages/WallpaperDetail.jsx";

// Phase 3+ will add auth pages, account pages, and the /admin/* routes
// here as each phase lands.
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/category/:slug" element={<Category />} />
      <Route path="/wallpaper/:id" element={<WallpaperDetail />} />
    </Routes>
  );
}
