import { Search } from 'lucide-react'

const orientations = [
  { value: 'all', label: 'All' },
  { value: 'desktop', label: 'Landscape' },
  { value: 'phone', label: 'Portrait' },
  { value: 'tablet', label: 'Tablet' },
]

const sorts = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'views', label: 'Most viewed' },
  { value: 'favorites', label: 'Most favorited' },
  { value: 'toplist', label: 'Top this month' },
  { value: 'random', label: 'Random' },
]

function OrientationFilters({ activeOrientation, onOrientationChange }) {
  return (
    <div className="flex flex-wrap gap-sm" role="group" aria-label="Filter by image shape">
      {orientations.map((item) => (
        <button
          key={item.value}
          type="button"
          aria-pressed={activeOrientation === item.value}
          onClick={() => onOrientationChange?.(item.value)}
          className={'px-lg py-sm rounded-md border text-body-sm ' + (activeOrientation === item.value ? 'border-ink text-ink' : 'border-line text-ink-soft')}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export default function FilterBar({
  activeOrientation = 'all',
  onOrientationChange,
  query = '',
  onQueryChange,
  showQuery = true,
  sort = 'newest',
  onSortChange,
}) {
  return (
    <div className="flex flex-col gap-lg mb-2xl">
      {showQuery ? (
        <div className="grid gap-sm sm:grid-cols-[minmax(0,1fr)_190px]">
          <label className="relative block">
            <Search size={16} strokeWidth={1.8} aria-hidden="true" className="absolute left-md top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none" />
            <input
              value={query}
              onChange={(event) => onQueryChange?.(event.target.value)}
              placeholder="Search wallpapers…"
              className="admin-form-control library-search-input"
              aria-label="Search wallpapers"
            />
          </label>
          <select value={sort} onChange={(event) => onSortChange?.(event.target.value)} className="admin-form-control" aria-label="Sort wallpapers">
            {sorts.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-lg">
          <OrientationFilters activeOrientation={activeOrientation} onOrientationChange={onOrientationChange} />
          <select value={sort} onChange={(event) => onSortChange?.(event.target.value)} className="admin-form-control explore-sort-control" aria-label="Sort wallpapers">
            {sorts.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </div>
      )}

      {showQuery && <OrientationFilters activeOrientation={activeOrientation} onOrientationChange={onOrientationChange} />}
    </div>
  )
}
