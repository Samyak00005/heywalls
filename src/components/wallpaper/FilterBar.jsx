import { Search } from 'lucide-react'
import SwatchTag from './SwatchTag.jsx'

const orientations = [
  { value: null, label: 'All' },
  { value: 'desktop', label: 'Desktop' },
  { value: 'phone', label: 'Mobile' },
  { value: 'tablet', label: 'Tablet' },
]

const sorts = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title', label: 'Title A–Z' },
  { value: 'downloads', label: 'Most downloaded' },
]

export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  activeOrientation,
  onOrientationChange,
  query = '',
  onQueryChange,
  sort = 'newest',
  onSortChange,
}) {
  return (
    <div className="flex flex-col gap-lg mb-2xl">
      <div className="grid sm:grid-cols-[minmax(0,1fr)_190px] gap-sm">
        <label className="relative block">
          <Search size={16} strokeWidth={1.8} aria-hidden="true" className="absolute left-md top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none" />
          <input
            value={query}
            onChange={(e) => onQueryChange?.(e.target.value)}
            placeholder="Search wallpapers, categories or creators…"
            className="admin-form-control library-search-input"
            aria-label="Search wallpapers"
          />
        </label>
        <select value={sort} onChange={(e) => onSortChange?.(e.target.value)} className="admin-form-control" aria-label="Sort wallpapers">
          {sorts.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </select>
      </div>

      <div className="flex flex-wrap gap-sm">
        <SwatchTag label="All" active={activeCategory === null} onClick={() => onCategoryChange(null)} />
        {categories.map((c) => (
          <SwatchTag key={c} label={c} active={activeCategory === c} onClick={() => onCategoryChange(c)} />
        ))}
      </div>

      <div className="flex gap-sm text-body-sm">
        {orientations.map((o) => (
          <button key={o.label} onClick={() => onOrientationChange(o.value)} className={'px-lg py-sm rounded-md border ' + (activeOrientation === o.value ? 'border-ink text-ink' : 'border-line text-ink-soft')}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
