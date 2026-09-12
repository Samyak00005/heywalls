export function LoadingState({ label = 'Loading wallpapers…' }) {
  return (
    <p className="text-body-sm text-ink-soft py-2xl text-center">{label}</p>
  )
}

export function ErrorState({ error }) {
  return (
    <div className="border border-line rounded-md p-xl text-center">
      <p className="text-body text-ink mb-sm">Couldn't load wallpapers.</p>
      <p className="text-body-sm text-ink-soft max-w-[420px] mx-auto">
        This usually means Supabase isn't configured yet — check that{' '}
        <code>.env</code> has your project URL and anon key, and that the
        migration + seed SQL have been run. See the README for setup steps.
      </p>
      {error?.message && (
        <p className="text-label text-ink-soft mt-sm">({error.message})</p>
      )}
    </div>
  )
}
