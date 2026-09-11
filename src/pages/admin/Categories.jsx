import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient.js'
import { useCategories } from '../../hooks/useCategories.js'

export default function Categories() {
  const { categories, loading, error } = useCategories()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)

  async function handleAdd(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setFormError(null)
    const slug = name.trim().toLowerCase().replace(/\s+/g, '-')
    const { error } = await supabase.from('categories').insert({ name: name.trim(), slug })
    setSaving(false)
    if (error) setFormError(error.message)
    else {
      setName('')
      window.location.reload()
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this category? Wallpapers using it will lose the tag.')) return
    await supabase.from('categories').delete().eq('id', id)
    window.location.reload()
  }

  return (
    <div>
      <h1 className="font-display text-h1 mb-xl">Categories</h1>

      <form onSubmit={handleAdd} className="flex gap-sm mb-2xl max-w-[420px]">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="bg-surface border border-line rounded-sm px-lg py-sm text-body flex-1"
        />
        <button
          type="submit"
          disabled={saving}
          className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body-sm font-medium disabled:opacity-60"
        >
          Add
        </button>
      </form>
      {formError && <p className="text-body-sm text-accent-2 mb-lg">{formError}</p>}

      {loading && <p className="text-body-sm text-ink-soft">Loading…</p>}
      {error && <p className="text-body-sm text-accent-2">{error.message}</p>}

      <div className="flex flex-col gap-sm max-w-[420px]">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-surface border border-line rounded-md px-lg py-sm flex items-center justify-between"
          >
            <span className="text-body-sm">{c.name}</span>
            <button
              onClick={() => handleDelete(c.id)}
              className="text-label text-accent-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
