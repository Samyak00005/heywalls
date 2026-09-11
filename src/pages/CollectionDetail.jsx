import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { LoadingState } from "../components/common/DataState.jsx";
import WallpaperGrid from "../components/wallpaper/WallpaperGrid.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";
import { mapWallpaperRow, WALLPAPER_SELECT } from "../lib/wallpaperMapper.js";

export default function CollectionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [collection, setCollection] = useState(null);
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!user || !id) return;
      setLoading(true);
      setError(null);

      const { data: collectionData, error: collectionError } = await supabase
        .from("collections")
        .select("id, name, description, created_at")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (collectionError) {
        if (active) {
          setError(collectionError);
          setLoading(false);
        }
        return;
      }

      const { data: memberships, error: membershipError } = await supabase
        .from("collection_wallpapers")
        .select("wallpaper_id, created_at")
        .eq("collection_id", id)
        .order("created_at", { ascending: false });

      if (membershipError) {
        if (active) {
          setError(membershipError);
          setLoading(false);
        }
        return;
      }

      const ids = (memberships || []).map((row) => row.wallpaper_id);
      let wallpaperData = [];

      if (ids.length) {
        const { data, error: wallpaperError } = await supabase
          .from("wallpapers")
          .select(WALLPAPER_SELECT)
          .in("id", ids);

        if (wallpaperError) {
          if (active) {
            setError(wallpaperError);
            setLoading(false);
          }
          return;
        }
        wallpaperData = data || [];
      }

      const byId = new Map(
        wallpaperData.map((row) => [row.id, mapWallpaperRow(row)]),
      );
      const ordered = ids
        .map((wallpaperId) => byId.get(wallpaperId))
        .filter(Boolean);

      if (active) {
        setCollection(collectionData);
        setWallpapers(ordered);
        setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [user, id]);

  if (loading) {
    return (
      <div className="container-page pt-xl pb-3xl">
        <LoadingState label="Loading collection…" />
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="container-page pt-xl pb-3xl">
        <p className="text-body-sm text-ink-soft py-xl">
          This collection could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <Link
        to="/collections"
        className="text-label text-ink-soft inline-block mb-lg"
      >
        ← All collections
      </Link>
      <div className="flex items-end justify-between gap-lg mb-xl">
        <div>
          <h1 className="font-display text-h1 mb-xs">{collection.name}</h1>
          {collection.description && (
            <p className="text-body-sm text-ink-soft">
              {collection.description}
            </p>
          )}
        </div>
        <span className="text-label text-ink-soft">
          {wallpapers.length}{" "}
          {wallpapers.length === 1 ? "wallpaper" : "wallpapers"}
        </span>
      </div>
      {wallpapers.length ? (
        <WallpaperGrid wallpapers={wallpapers} columns={4} />
      ) : (
        <p className="text-body-sm text-ink-soft py-xl">
          This collection is empty. Open a wallpaper and choose “Collection”.
        </p>
      )}
    </div>
  );
}
