import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { mapWallpaperRow, WALLPAPER_SELECT } from "../lib/wallpaperMapper.js";

export function usePendingWallpapers() {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: queryError } = await supabase
      .from("wallpapers")
      .select(WALLPAPER_SELECT + ", status")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (queryError) {
      setError(queryError);
      setWallpapers([]);
    } else {
      setWallpapers((data || []).map(mapWallpaperRow));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;

    async function initialLoad() {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from("wallpapers")
        .select(WALLPAPER_SELECT + ", status")
        .eq("status", "pending")
        .order("created_at", { ascending: true });

      if (!active) return;

      if (queryError) {
        setError(queryError);
        setWallpapers([]);
      } else {
        setWallpapers((data || []).map(mapWallpaperRow));
      }
      setLoading(false);
    }

    initialLoad();
    return () => {
      active = false;
    };
  }, []);

  return { wallpapers, loading, error, refresh: load };
}

export function useAdminStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      const results = await Promise.all([
        supabase.from("wallpapers").select("*", { count: "exact", head: true }),
        supabase
          .from("wallpapers")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ]);

      if (!active) return;

      const firstError = results.find((result) => result.error)?.error;
      if (firstError) {
        setError(firstError);
        setStats(null);
      } else {
        setStats({
          total: results[0].count ?? 0,
          pending: results[1].count ?? 0,
          users: results[2].count ?? 0,
        });
      }
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return { stats, loading, error };
}
