import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SwatchTag from '../components/wallpaper/SwatchTag.jsx'
import UploadDropzone from '../components/upload/UploadDropzone.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useCategories } from '../hooks/useCategories.js'
import { supabase } from '../lib/supabaseClient.js'

const ORIENTATIONS = ['desktop', 'phone', 'both']

export default function Upload() {
  const { user, profile } = useAuth()
  const { categories } = useCategories()
  const navigate = useNavigate()

  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [orientation, setOrientation] = useState('desktop')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function toggleCategory(id) {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) {
      setError('Choose an image first.')
      return
    }
    setSubmitting(true)
    setError(null)

    try {
      const ext = file.name.split('.').pop()
      const path = `${user.id}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('wallpapers')
        .upload(path, file)
      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage.from('wallpapers').getPublicUrl(path)

      // Admin uploads go live immediately (this is how curated content
      // gets added); everyone else starts pending for review.
      const status = profile?.role === 'admin' ? 'approved' : 'pending'

      const { data: wallpaper, error: insertError } = await supabase
        .from('wallpapers')
        .insert({
          uploader_id: user.id,
          title,
          description,
          image_url: publicUrl,
          thumbnail_url: publicUrl,
          orientation,
          status,
        })
        .select()
        .single()
      if (insertError) throw insertError

      if (selectedCategories.length > 0) {
        await supabase.from('wallpaper_categories').insert(
          selectedCategories.map((category_id) => ({
            wallpaper_id: wallpaper.id,
            category_id,
          }))
        )
      }

      navigate('/account/uploads')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <h1 className="font-display text-h1 mb-lg">Upload a wallpaper</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-lg max-w-[520px]">
        <UploadDropzone
          file={file}
          error={fileError}
          onFileSelect={(f, err) => {
            setFile(f)
            setFileError(err)
          }}
        />

        <label className="flex flex-col gap-xs">
          <span className="text-label text-ink-soft">Title</span>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-surface border border-line rounded-sm px-lg py-sm text-body"
          />
        </label>

        <label className="flex flex-col gap-xs">
          <span className="text-label text-ink-soft">Description (optional)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="bg-surface border border-line rounded-sm px-lg py-sm text-body resize-none"
          />
        </label>

        <div className="flex flex-col gap-xs">
          <span className="text-label text-ink-soft">Orientation</span>
          <div className="flex gap-sm">
            {ORIENTATIONS.map((o) => (
              <button
                key={o}
                type="button"
                onClick={() => setOrientation(o)}
                className={
                  'capitalize px-lg py-sm rounded-md border text-body-sm ' +
                  (orientation === o ? 'border-ink text-ink' : 'border-line text-ink-soft')
                }
              >
                {o}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-xs">
          <span className="text-label text-ink-soft">Categories</span>
          <div className="flex flex-wrap gap-sm">
            {categories.map((c) => (
              <SwatchTag
                key={c.id}
                label={c.name}
                active={selectedCategories.includes(c.id)}
                onClick={() => toggleCategory(c.id)}
              />
            ))}
          </div>
        </div>

        {error && <p className="text-body-sm text-accent-2">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body font-medium disabled:opacity-60 self-start"
        >
          {submitting ? 'Uploading…' : 'Upload'}
        </button>

        {profile?.role !== 'admin' && (
          <p className="text-label text-ink-soft">
            Your upload will be reviewed before it appears publicly.
          </p>
        )}
      </form>
    </div>
  )
}
