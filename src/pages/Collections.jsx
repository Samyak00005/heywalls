import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountSidebar from "../components/common/AccountSidebar.jsx";
import { LoadingState } from "../components/common/DataState.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";

export default function Collections() {
  const { user, profile } = useAuth();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!user) return;
      setLoading(true);
      const { data, error: queryError } = await supabase
        .from("collections")
        .select(
          "id, name, description, created_at, collection_wallpapers(count)",
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!active) return;
      setCollections(data || []);
      setError(queryError);
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [user]);

  async function createCollection(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || !user) return;

    setCreating(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("collections")
      .insert({
        user_id: user.id,
        name: trimmed,
        description: description.trim() || null,
      })
      .select("id, name, description, created_at, collection_wallpapers(count)")
      .single();

    if (insertError) {
      setError(insertError);
    } else {
      setCollections((prev) => [data, ...prev]);
      setName("");
      setDescription("");
    }
    setCreating(false);
  }

  async function deleteCollection(id) {
    if (
      !confirm(
        "Delete this collection? The wallpapers themselves will not be deleted.",
      )
    )
      return;

    const { error: deleteError } = await supabase
      .from("collections")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(deleteError);
      return;
    }

    setCollections((prev) => prev.filter((collection) => collection.id !== id));
  }

  if (loading) {
    return (
      <div className="container-page pt-xl pb-3xl">
        <LoadingState label="Loading collections…" />
      </div>
    );
  }

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-2xl lg:gap-4xl items-start">
        <section className="min-w-0">
          <div className="flex items-end justify-between gap-lg mb-xl">
            <div>
              <h1 className="font-display text-h1 mb-sm">Collections</h1>
              <p className="text-body-sm text-ink-soft">
                Make your own little shelves of wallpapers.
              </p>
            </div>
            <span className="text-label text-ink-soft">
              {collections.length} collections
            </span>
          </div>

          <form
            onSubmit={createCollection}
            className="border border-line bg-surface rounded-md p-lg mb-2xl max-w-[640px]"
          >
            <div className="flex items-center gap-sm mb-md">
              <Plus size={16} />
              <h2 className="font-display text-h3">Create a collection</h2>
            </div>
            <div className="grid md:grid-cols-[1fr_1.4fr_auto] gap-sm">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Collection name"
                className="bg-bg border border-line rounded-sm px-lg py-sm text-body-sm"
              />
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="bg-bg border border-line rounded-sm px-lg py-sm text-body-sm"
              />
              <button
                type="submit"
                disabled={creating}
                className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body-sm font-medium disabled:opacity-50"
              >
                {creating ? "Creating…" : "Create"}
              </button>
            </div>
          </form>

          {error && (
            <p className="text-body-sm text-accent-2 mb-lg">{error.message}</p>
          )}

          {collections.length === 0 ? (
            <p className="text-body-sm text-ink-soft py-xl">
              No collections yet. Create one above, then add wallpapers from
              their detail pages.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-md md:gap-lg">
              {collections.map((collection) => {
                const count = collection.collection_wallpapers?.[0]?.count ?? 0;
                return (
                  <div
                    key={collection.id}
                    className="border border-line bg-surface rounded-md p-lg"
                  >
                    <Link
                      to={`/collections/${collection.id}`}
                      className="block"
                    >
                      <h2 className="font-display text-h2 mb-xs">
                        {collection.name}
                      </h2>
                      <p className="text-label text-ink-soft mb-lg">
                        {count} {count === 1 ? "wallpaper" : "wallpapers"}
                      </p>
                      {collection.description && (
                        <p className="text-body-sm text-ink-soft line-clamp-3">
                          {collection.description}
                        </p>
                      )}
                    </Link>
                    <button
                      type="button"
                      onClick={() => deleteCollection(collection.id)}
                      className="mt-lg text-label text-accent-2 inline-flex items-center gap-xs"
                    >
                      <Trash2 size={14} />
                      Delete collection
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
        <AccountSidebar username={profile?.username} variant="collections" />
      </div>
    </div>
  );
}
