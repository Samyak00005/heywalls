import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { mapWallpaperRow, WALLPAPER_SELECT } from "../lib/wallpaperMapper.js";

export function useWallpaper(id) {
  const [wallpaper, setWallpaper] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    if (!id) {
      setWallpaper(null);
      setError(new Error("Wallpaper ID is missing."));
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    setError(null);
    setWallpaper(null);

    async function load() {
      const { data, error: queryError } = await supabase
        .from("wallpapers")
        .select(WALLPAPER_SELECT)
        .eq("id", id)
        .eq("status", "approved")
        .single();

      if (!active) return;

      if (queryError) {
        setError(queryError);
      } else {
        setWallpaper(mapWallpaperRow(data));
      }
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [id]);

  return { wallpaper, loading, error };
}
