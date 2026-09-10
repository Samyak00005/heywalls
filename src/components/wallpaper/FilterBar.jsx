import SwatchTag from "./SwatchTag.jsx";

const orientations = [
  { value: null, label: "All" },
  { value: "desktop", label: "Desktop" },
  { value: "phone", label: "Phone" },
];

export default function FilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  activeOrientation,
  onOrientationChange,
}) {
  return (
    <div className="flex flex-col gap-lg mb-2xl">
      <div className="flex flex-wrap gap-sm">
        <SwatchTag
          label="All"
          active={activeCategory === null}
          onClick={() => onCategoryChange(null)}
        />
        {categories.map((c) => (
          <SwatchTag
            key={c}
            label={c}
            active={activeCategory === c}
            onClick={() => onCategoryChange(c)}
          />
        ))}
      </div>

      <div className="flex gap-sm text-body-sm">
        {orientations.map((o) => (
          <button
            key={o.label}
            onClick={() => onOrientationChange(o.value)}
            className={
              "px-lg py-sm rounded-md border " +
              (activeOrientation === o.value
                ? "border-ink text-ink"
                : "border-line text-ink-soft")
            }
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
