import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useCategories } from "../../hooks/useCategories.js";
import { supabase } from "../../lib/supabaseClient.js";

function makeSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function Categories() {
  const { categories, setCategories, loading, error } = useCategories();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [formError, setFormError] = useState(null);

  async function handleAdd(e) {
    e.preventDefault();
    const trimmedName = name.trim();
    const slug = makeSlug(trimmedName);

    if (!trimmedName || !slug) {
      setFormError("Enter a category name using letters or numbers.");
      return;
    }

    setSaving(true);
    setFormError(null);
    const { data, error: insertError } = await supabase
      .from("categories")
      .insert({ name: trimmedName, slug })
      .select("id, name, slug, hex_color")
      .single();
    setSaving(false);

    if (insertError) {
      setFormError(
        insertError.code === "23505"
          ? "A category with that name or slug already exists."
          : insertError.message,
      );
      return;
    }

    setName("");
    setCategories((current) =>
      [...current, data].sort((a, b) => a.name.localeCompare(b.name)),
    );
  }

  function beginEdit(category) {
    setEditingId(category.id);
    setEditingName(category.name);
    setFormError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingName("");
  }

  async function saveEdit(category) {
    const trimmed = editingName.trim();
    const slug = makeSlug(trimmed);
    if (!trimmed || !slug) {
      setFormError("Enter a valid category name.");
      return;
    }

    setFormError(null);
    const { data, error: updateError } = await supabase
      .from("categories")
      .update({ name: trimmed, slug })
      .eq("id", category.id)
      .select("id, name, slug, hex_color")
      .single();

    if (updateError) {
      setFormError(
        updateError.code === "23505"
          ? "A category with that name or slug already exists."
          : updateError.message,
      );
      return;
    }

    setCategories((current) =>
      current
        .map((item) => (item.id === category.id ? data : item))
        .sort((a, b) => a.name.localeCompare(b.name)),
    );
    cancelEdit();
  }

  async function handleDelete(id) {
    if (
      !confirm("Delete this category? Wallpapers using it will lose the tag.")
    )
      return;

    setDeletingId(id);
    setFormError(null);
    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);
    setDeletingId(null);

    if (deleteError) {
      setFormError(deleteError.message);
      return;
    }
    setCategories((current) =>
      current.filter((category) => category.id !== id),
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-lg mb-xl">
        <div>
          <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-xs">
            Management
          </p>
          <h1 className="font-display text-h1">Categories</h1>
        </div>
        <span className="text-label text-ink-soft">
          {categories.length} categories
        </span>
      </div>

      <form onSubmit={handleAdd} className="flex gap-sm mb-2xl max-w-[640px]">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="bg-surface border border-line rounded-sm px-lg py-sm text-body flex-1"
          disabled={saving}
        />
        <button
          type="submit"
          disabled={saving}
          className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body-sm font-medium disabled:opacity-60"
        >
          {saving ? "Adding…" : "Add category"}
        </button>
      </form>

      {formError && (
        <p className="text-body-sm text-accent-2 mb-lg">{formError}</p>
      )}
      {error && (
        <p className="text-body-sm text-accent-2 mb-lg">{error.message}</p>
      )}
      {loading && <p className="text-body-sm text-ink-soft">Loading…</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-md lg:gap-lg">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-surface border border-line rounded-md p-lg"
          >
            {editingId === c.id ? (
              <div className="flex gap-sm">
                <input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="bg-bg border border-line rounded-sm px-md py-sm text-body-sm min-w-0 flex-1"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => saveEdit(c)}
                  className="border border-ink rounded-sm p-sm"
                  aria-label="Save category"
                >
                  <Check size={15} />
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="border border-line rounded-sm p-sm"
                  aria-label="Cancel edit"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-lg">
                <div className="min-w-0">
                  <p className="text-body-sm truncate">{c.name}</p>
                  <p className="text-label text-ink-soft mt-xs">/{c.slug}</p>
                </div>
                <div className="flex items-center gap-sm shrink-0">
                  <button
                    type="button"
                    onClick={() => beginEdit(c)}
                    className="border border-line rounded-sm p-sm"
                    aria-label={`Edit ${c.name}`}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    disabled={deletingId === c.id}
                    onClick={() => handleDelete(c.id)}
                    className="border border-line text-accent-2 rounded-sm p-sm disabled:opacity-50"
                    aria-label={`Delete ${c.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
