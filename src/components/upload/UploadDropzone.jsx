import { useEffect, useRef, useState } from 'react'

const MAX_SIZE_MB = 15
const ACCEPTED_TYPES = ['image/jpeg', 'image/png']

export default function UploadDropzone({ file, onFileSelect, error }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null)
      return undefined
    }

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  function validateAndSet(selected) {
    if (!selected) return
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      onFileSelect(null, 'Only JPG or PNG files are supported.')
      return
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      onFileSelect(null, `File is too large — max ${MAX_SIZE_MB}MB.`)
      return
    }
    onFileSelect(selected, null)
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        validateAndSet(e.dataTransfer.files?.[0])
      }}
      onClick={(e) => {
        if (e.target === inputRef.current) return
        inputRef.current?.click()
      }}
      className={
        'border border-dashed rounded-lg p-2xl text-center cursor-pointer transition-colors ' +
        (dragging ? 'border-ink bg-surface' : 'border-ink-soft')
      }
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(e) => {
          validateAndSet(e.target.files?.[0])
          e.target.value = ''
        }}
      />
      {file && previewUrl ? (
        <div>
          <img
            src={previewUrl}
            alt="Selected wallpaper"
            className="max-h-[240px] mx-auto rounded-sm mb-md"
          />
          <p className="text-body-sm text-ink-soft">{file.name}</p>
        </div>
      ) : (
        <div>
          <p className="text-body mb-xs">Drop an image here, or click to choose one</p>
          <p className="text-label text-ink-soft">JPG or PNG, up to {MAX_SIZE_MB}MB</p>
        </div>
      )}
      {error && <p className="text-body-sm text-accent-2 mt-md">{error}</p>}
    </div>
  )
}
