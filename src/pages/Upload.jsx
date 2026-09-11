import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SwatchTag from '../components/wallpaper/SwatchTag.jsx'
import UploadDropzone from '../components/upload/UploadDropzone.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../components/common/ToastContext.jsx'
import { useCategories } from '../hooks/useCategories.js'
import { supabase } from '../lib/supabaseClient.js'

const ORIENTATIONS = ['desktop', 'phone', 'both']

export default function Upload() {
  const { user, profile } = useAuth()
  const { showToast } = useToast()
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

      const dimensions = await new Promise((resolve) => {
        const image = new Image()
        const objectUrl = URL.createObjectURL(file)
        const finish = (value) => {
          URL.revokeObjectURL(objectUrl)
          resolve(value)
        }
        image.onload = () => finish({ width: image.naturalWidth, height: image.naturalHeight })
        image.onerror = () => finish({ width: null, height: null })
        image.src = objectUrl
      })

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
          width: dimensions.width,
          height: dimensions.height,
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

      showToast(profile?.role === 'admin' ? 'Wallpaper added and published.' : 'Wallpaper added — pending review.')
      navigate('/account/uploads')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <div className="grid lg:grid-cols-[minmax(0,760px)_minmax(260px,1fr)] gap-2xl lg:gap-4xl items-start">
        <section>
          <div className="mb-xl">
            <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-sm">Creator space</p>
            <h1 className="font-display text-h1 mb-sm">Upload a wallpaper</h1>
            <p className="text-body-sm text-ink-soft">Share a 9:16 phone or 16:9 desktop wallpaper with the HeyWalls community.</p>
          </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
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
        </section>

        <aside className="hidden lg:block border-l border-line pl-2xl sticky top-xl">
          <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-sm">Before you upload</p>
          <h2 className="font-display text-h2 mb-lg">Keep the original ratio</h2>
          <div className="space-y-lg text-body-sm text-ink-soft">
            <div>
              <p className="text-ink mb-xs">Desktop</p>
              <p>Use a 16:9 image such as 1920 × 1080 or 2560 × 1440.</p>
            </div>
            <div>
              <p className="text-ink mb-xs">Phone</p>
              <p>Use a 9:16 image such as 1080 × 1920 or 1440 × 2560.</p>
            </div>
            <div>
              <p className="text-ink mb-xs">Tip</p>
              <p>The uploaded file's real width and height are stored automatically and shown on its detail page.</p>
            </div>
          </div>
          <div className="border-t border-line mt-xl pt-lg">
            <Link to="/account/uploads" className="text-body-sm text-ink underline">View my wallpapers →</Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
