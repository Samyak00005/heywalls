import { RotateCcw, Search } from "lucide-react";

const ORIENTATIONS = [
  { value: "all", label: "All devices" },
  { value: "phone", label: "Mobile" },
  { value: "desktop", label: "Desktop" },
  { value: "both", label: "Both" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title", label: "Title A–Z" },
  { value: "downloads", label: "Most downloaded" },
];

export const DEFAULT_LIBRARY_FILTERS = {
  query: "",
  orientation: "all",
  category: "all",
  sort: "newest",
};

export function applyLibraryFilters(items, filters) {
  const query = filters.query.trim().toLowerCase();
  const filtered = items.filter((item) => {
    const orientationMatch =
      filters.orientation === "all" || item.orientation === filters.orientation;
    const categoryMatch =
      filters.category === "all" ||
      (item.category || "Uncategorized") === filters.category;
    const text =
      `${item.title || ""} ${item.category || ""} ${item.uploader || ""}`.toLowerCase();
    const queryMatch = !query || text.includes(query);
    return orientationMatch && categoryMatch && queryMatch;
  });

  return [...filtered].sort((a, b) => {
    if (filters.sort === "oldest")
      return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    if (filters.sort === "title")
      return (a.title || "").localeCompare(b.title || "");
    if (filters.sort === "downloads")
      return (b.downloadCount || 0) - (a.downloadCount || 0);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });
}

export default function LibraryFilters({
  filters,
  onChange,
  categories = [],
  showStatus = false,
  status = "all",
  onStatusChange,
}) {
  const hasFilters = Boolean(
    filters.query ||
    filters.orientation !== "all" ||
    filters.category !== "all" ||
    filters.sort !== "newest" ||
    (showStatus && status !== "all"),
  );

  function update(field, value) {
    onChange({ ...filters, [field]: value });
  }

  function clear() {
    onChange({ ...DEFAULT_LIBRARY_FILTERS });
    if (showStatus) onStatusChange?.("all");
  }

  return (
    <div className="mb-xl space-y-sm">
      <div className="flex items-center justify-end min-h-[20px]">
        {hasFilters && (
          <button
            type="button"
            onClick={clear}
            className="inline-flex items-center gap-xs text-body-sm text-ink hover:underline"
          >
            <RotateCcw size={13} strokeWidth={1.8} />
            Clear filters
          </button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-[minmax(260px,1fr)_170px_190px_170px] gap-sm">
        <label className="relative block min-w-0">
          <Search
            size={16}
            strokeWidth={1.8}
            aria-hidden="true"
            className="absolute left-md top-1/2 -translate-y-1/2 text-ink-soft pointer-events-none z-10"
          />
          <input
            value={filters.query}
            onChange={(e) => update("query", e.target.value)}
            placeholder="Search title, category or uploader…"
            className="admin-form-control library-search-input"
            aria-label="Search wallpapers"
          />
        </label>

        <select
          value={filters.orientation}
          onChange={(e) => update("orientation", e.target.value)}
          className="admin-form-control"
          aria-label="Filter by device"
        >
          {ORIENTATIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <select
          value={filters.category}
          onChange={(e) => update("category", e.target.value)}
          className="admin-form-control"
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          <option value="Uncategorized">Uncategorized</option>
          {categories.map((category) => {
            const name =
              typeof category === "string" ? category : category.name;
            return (
              <option key={name} value={name}>
                {name}
              </option>
            );
          })}
        </select>

        <select
          value={filters.sort}
          onChange={(e) => update("sort", e.target.value)}
          className="admin-form-control"
          aria-label="Sort wallpapers"
        >
          {SORT_OPTIONS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {showStatus && (
        <div className="flex flex-wrap gap-sm pt-xs">
          {["all", "pending", "approved", "rejected"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onStatusChange?.(item)}
              className={`capitalize border rounded-md px-md py-sm text-body-sm transition-colors ${status === item ? "border-ink text-ink bg-surface" : "border-line text-ink-soft hover:border-ink-soft hover:bg-surface"}`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
