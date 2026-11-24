export function WallpaperDetailSkeleton() {
  return (
    <div className="container-page animate-pulse pt-xl pb-3xl md:pb-4xl" role="status" aria-label="Loading wallpaper details" aria-busy="true">
      <div className="mb-lg h-3 w-32 rounded bg-line/60" />
      <div className="grid items-start gap-2xl lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-4xl">
        <div className="aspect-[4/3] min-h-[280px] rounded-md bg-surface lg:aspect-auto lg:h-[68vh]" />
        <div className="space-y-lg">
          <div className="h-8 w-4/5 rounded bg-line/60" />
          <div className="h-3 w-full rounded bg-line/50" />
          <div className="h-3 w-2/3 rounded bg-line/50" />
          <div className="mt-xl space-y-sm border-t border-line pt-lg">
            <div className="h-3 w-1/2 rounded bg-line/50" />
            <div className="h-3 w-2/3 rounded bg-line/50" />
            <div className="h-3 w-1/3 rounded bg-line/50" />
          </div>
          <span className="sr-only">Loading wallpaper details…</span>
        </div>
      </div>
    </div>
  )
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="border border-line rounded-md p-xl text-center" role="alert" aria-live="assertive">
      <p className="text-body text-ink mb-sm">The wallpaper feed is unavailable right now.</p>
      <p className="text-body-sm text-ink-soft max-w-[420px] mx-auto">
        Check your connection or try again in a moment.
      </p>
      {error?.message && (
        <p className="text-label text-ink-soft mt-sm">({error.message})</p>
      )}
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-lg rounded-md border border-line bg-surface px-lg py-sm text-body-sm text-ink hover:border-ink-soft">
          Try again
        </button>
      )}
    </div>
  )
}
