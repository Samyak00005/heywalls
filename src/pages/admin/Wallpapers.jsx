import { useEffect, useMemo, useState } from 'react'
import { Edit3, Trash2, X } from 'lucide-react'
import LibraryFilters, { applyLibraryFilters, DEFAULT_LIBRARY_FILTERS } from '../../components/wallpaper/LibraryFilters.jsx'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient.js'
import { mapWallpaperRow, WALLPAPER_SELECT } from '../../lib/wallpaperMapper.js'
import { useCategories } from '../../hooks/useCategories.js'
import { useToast } from '../../components/common/ToastContext.jsx'

const EMPTY_FORM = {
  title: '',
  description: '',
  categoryId: '',
  orientation: 'desktop',
  status: 'pending',
}

export default function AdminWallpapers() {
  const [wallpapers, setWallpapers] = useState([])
  const [filter, setFilter] = useState('all')
  const [libraryFilters, setLibraryFilters] = useState(DEFAULT_LIBRARY_FILTERS)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [editingWallpaper, setEditingWallpaper] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [savingEdit, setSavingEdit] = useState(false)
  const [error, setError] = useState(null)
  const { categories, loading: categoriesLoading } = useCategories()
  const { showToast } = useToast()

  async function load() {
    setLoading(true)
    setError(null)
    const { data, error: queryError } = await supabase
      .from('wallpapers')
      .select(WALLPAPER_SELECT + ', status')
      .order('created_at', { ascending: false })

    if (queryError) {
      setError(queryError)
      setWallpapers([])
    } else {
      setWallpapers((data || []).map(mapWallpaperRow))
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    return applyLibraryFilters(wallpapers, libraryFilters).filter((w) => filter === 'all' || w.status === filter)
  }, [wallpapers, libraryFilters, filter])

  function openEditor(wallpaper) {
    setEditingWallpaper(wallpaper)
    setForm({
      title: wallpaper.title || '',
      description: wallpaper.description || '',
      categoryId: wallpaper.categoryIds?.[0] || '',
      orientation: wallpaper.orientation || 'desktop',
      status: wallpaper.status || 'pending',
    })
    setError(null)
  }

  function closeEditor() {
    if (savingEdit) return
    setEditingWallpaper(null)
    setForm(EMPTY_FORM)
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function saveWallpaper() {
    if (!editingWallpaper) return

    const title = form.title.trim()
    if (!title) {
      setError(new Error('Wallpaper title cannot be empty.'))
      return
    }

    setSavingEdit(true)
    setError(null)

    const { error: updateError } = await supabase
      .from('wallpapers')
      .update({
        title,
        description: form.description.trim() || null,
        orientation: form.orientation,
        status: form.status,
      })
      .eq('id', editingWallpaper.id)

    if (updateError) {
      setSavingEdit(false)
      setError(updateError)
      return
    }

    // The public card design currently displays one category. Replace the
    // wallpaper's category links with the selected category.
    const { error: categoryDeleteError } = await supabase
      .from('wallpaper_categories')
      .delete()
      .eq('wallpaper_id', editingWallpaper.id)

    if (categoryDeleteError) {
      setSavingEdit(false)
      setError(categoryDeleteError)
      return
    }

    if (form.categoryId) {
      const { error: categoryInsertError } = await supabase
        .from('wallpaper_categories')
        .insert({ wallpaper_id: editingWallpaper.id, category_id: form.categoryId })

      if (categoryInsertError) {
        setSavingEdit(false)
        setError(categoryInsertError)
        return
      }
    }

    const selectedCategory = categories.find((category) => category.id === form.categoryId)

    setWallpapers((current) => current.map((wallpaper) => {
      if (wallpaper.id !== editingWallpaper.id) return wallpaper

      return {
        ...wallpaper,
        title,
        description: form.description.trim() || null,
        orientation: form.orientation,
        status: form.status,
        category: selectedCategory?.name || 'Uncategorized',
        categoryIds: form.categoryId ? [form.categoryId] : [],
        categorySlugs: selectedCategory?.slug ? [selectedCategory.slug] : [],
      }
    }))

    setSavingEdit(false)
    setEditingWallpaper(null)
    setForm(EMPTY_FORM)
    showToast('Wallpaper updated successfully.')
  }

  async function setStatus(id, status) {
    setBusyId(id)
    setError(null)
    const { error: updateError } = await supabase.from('wallpapers').update({ status }).eq('id', id)
    setBusyId(null)
    if (updateError) {
      setError(updateError)
      return
    }
    setWallpapers((current) => current.map((w) => w.id === id ? { ...w, status } : w))
    showToast(status === 'approved' ? 'Wallpaper published.' : status === 'rejected' ? 'Wallpaper rejected.' : 'Wallpaper moved to pending.')
  }

  async function remove(wallpaper) {
    if (!confirm(`Permanently delete “${wallpaper.title}”? This cannot be undone.`)) return
    setBusyId(wallpaper.id)
    setError(null)
    const { error: deleteError } = await supabase.from('wallpapers').delete().eq('id', wallpaper.id)
    setBusyId(null)
    if (deleteError) {
      setError(deleteError)
      return
    }
    setWallpapers((current) => current.filter((w) => w.id !== wallpaper.id))
    showToast('Wallpaper deleted.')
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-lg mb-xl">
        <div>
          <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-xs">Content library</p>
          <h1 className="font-display text-h1">Wallpapers</h1>
        </div>
        <span className="text-label text-ink-soft">{filtered.length} shown · {wallpapers.length} total</span>
      </div>

      <LibraryFilters
        filters={libraryFilters}
        onChange={setLibraryFilters}
        categories={categories}
        showStatus
        status={filter}
        onStatusChange={setFilter}
      />

      {error && <p className="text-body-sm text-accent-2 mb-lg">{error.message}</p>}
      {loading && <p className="text-body-sm text-ink-soft">Loading wallpapers…</p>}

      <div className="border border-line rounded-md overflow-hidden">
        {filtered.map((w) => (
          <div key={w.id} className="admin-wallpaper-row bg-surface border-b border-line last:border-b-0">
            <Link to={`/wallpaper/${w.id}`} className="admin-wallpaper-thumb shrink-0" aria-label={`View ${w.title}`}>
              <img src={w.imageUrl} alt={w.title} />
            </Link>

            <div className="admin-wallpaper-info">
              <Link to={`/wallpaper/${w.id}`} className="text-body-sm hover:underline block truncate">{w.title}</Link>
              <p className="text-label text-ink-soft mt-xs truncate">
                {w.status} · {w.orientation === 'phone' ? 'Mobile · 9:16' : w.orientation === 'tablet' ? 'Tablet · 4:3' : w.orientation === 'both' ? 'Mobile + Desktop' : 'Desktop · 16:9'}
                {w.resolution ? ` · ${w.resolution}` : ' · Resolution unavailable'}
              </p>
              <p className="text-label text-ink-soft mt-xs truncate">
                {w.category || 'Uncategorized'}{w.uploader ? ` · @${w.uploader}` : ''}
              </p>
            </div>

            <div className="admin-wallpaper-actions">
              <button
                type="button"
                disabled={busyId === w.id}
                onClick={() => openEditor(w)}
                className="border border-line text-ink rounded-md px-md py-sm text-body-sm inline-flex items-center gap-xs hover:bg-bg disabled:opacity-50"
              >
                <Edit3 size={15} strokeWidth={1.8} />
                <span>Edit</span>
              </button>
              {w.status !== 'approved' && (
                <button type="button" disabled={busyId === w.id} onClick={() => setStatus(w.id, 'approved')} className="bg-accent text-accent-contrast rounded-md px-md py-sm text-body-sm hover:opacity-90 disabled:opacity-50">
                  Publish
                </button>
              )}
              {w.status === 'approved' && (
                <button type="button" disabled={busyId === w.id} onClick={() => setStatus(w.id, 'pending')} className="border border-accent-2 text-accent-2 rounded-md px-md py-sm text-body-sm hover:bg-accent-2 hover:text-accent-contrast disabled:opacity-50">
                  Unpublish
                </button>
              )}
              {w.status !== 'rejected' && (
                <button type="button" disabled={busyId === w.id} onClick={() => setStatus(w.id, 'rejected')} className="border border-line text-ink rounded-md px-md py-sm text-body-sm hover:bg-bg disabled:opacity-50">
                  Reject
                </button>
              )}
              <button type="button" disabled={busyId === w.id} onClick={() => remove(w)} className="border border-line text-accent-2 rounded-md p-sm hover:bg-accent-2 hover:text-accent-contrast disabled:opacity-50" aria-label={`Delete ${w.title}`}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <p className="p-xl text-body-sm text-ink-soft text-center">No wallpapers match these filters.</p>
        )}
      </div>

      {editingWallpaper && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/35 px-md py-lg" role="dialog" aria-modal="true" aria-labelledby="edit-wallpaper-title">
          <div className="w-full max-w-[680px] max-h-[90vh] overflow-y-auto bg-surface border border-line rounded-md shadow-hung">
            <div className="flex items-start justify-between gap-lg p-lg border-b border-line">
              <div>
                <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-xs">Wallpaper editor</p>
                <h2 id="edit-wallpaper-title" className="font-display text-h2">Edit wallpaper</h2>
              </div>
              <button
                type="button"
                onClick={closeEditor}
                disabled={savingEdit}
                className="border border-line rounded-md p-sm text-ink hover:bg-bg disabled:opacity-50"
                aria-label="Close editor"
              >
                <X size={18} strokeWidth={1.8} />
              </button>
            </div>

            <div className="p-lg lg:p-xl space-y-lg">
              <div className="grid lg:grid-cols-[140px_minmax(0,1fr)] gap-lg items-start">
                <div className="w-full h-[140px] flex items-center justify-center border border-line rounded-sm bg-bg overflow-hidden">
                  <img src={editingWallpaper.imageUrl} alt={editingWallpaper.title} className="w-full h-full object-contain" />
                </div>
                <div className="grid gap-lg">
                  <Field label="Title">
                    <input
                      value={form.title}
                      onChange={(e) => updateForm('title', e.target.value)}
                      className="admin-form-control"
                      placeholder="Wallpaper title"
                    />
                  </Field>
                  <Field label="Description">
                    <textarea
                      value={form.description}
                      onChange={(e) => updateForm('description', e.target.value)}
                      rows={3}
                      className="admin-form-control resize-y"
                      placeholder="Short description"
                    />
                  </Field>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-lg">
                <Field label="Category">
                  <select
                    value={form.categoryId}
                    onChange={(e) => updateForm('categoryId', e.target.value)}
                    disabled={categoriesLoading}
                    className="admin-form-control"
                  >
                    <option value="">Uncategorized</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Orientation">
                  <select
                    value={form.orientation}
                    onChange={(e) => updateForm('orientation', e.target.value)}
                    className="admin-form-control"
                  >
                    <option value="desktop">Desktop · 16:9</option>
                    <option value="phone">Mobile · 9:16</option>
                    <option value="tablet">Tablet · 4:3</option>
                    <option value="both">Both</option>
                  </select>
                </Field>
                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(e) => updateForm('status', e.target.value)}
                    className="admin-form-control"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </Field>
              </div>

              <div className="grid sm:grid-cols-3 gap-lg border-t border-line pt-lg">
                <ReadOnlyField label="Resolution" value={editingWallpaper.resolution || 'Unavailable'} />
                <ReadOnlyField label="Uploader" value={editingWallpaper.uploader ? `@${editingWallpaper.uploader}` : 'HeyWalls'} />
                <ReadOnlyField label="Downloads" value={editingWallpaper.downloadCount ?? 0} />
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-sm p-lg border-t border-line">
              <button
                type="button"
                onClick={closeEditor}
                disabled={savingEdit}
                className="border border-line text-ink rounded-md px-lg py-sm text-body-sm hover:bg-bg disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveWallpaper}
                disabled={savingEdit || !form.title.trim()}
                className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {savingEdit ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-label text-ink-soft block mb-xs">{label}</span>
      {children}
    </label>
  )
}

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <p className="text-label text-ink-soft mb-xs">{label}</p>
      <p className="text-body-sm text-ink">{value}</p>
    </div>
  )
}
