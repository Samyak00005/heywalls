/**
 * Category chip. Per HeyWalls-Color-Rule.md: category color is never a
 * background fill. Inactive = neutral outline, active = the one place
 * accent color shows up in a filter bar.
 */
export default function SwatchTag({ label, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'inline-flex items-center border rounded-md px-lg py-sm text-body-sm transition-colors ' +
        (active
          ? 'bg-accent text-accent-contrast border-accent'
          : 'bg-surface text-ink border-line hover:border-ink-soft')
      }
    >
      {label}
    </button>
  )
}
