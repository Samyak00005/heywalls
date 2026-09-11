import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountSidebar from "../components/common/AccountSidebar.jsx";
import { LoadingState } from "../components/common/DataState.jsx";
import LibraryFilters, {
  applyLibraryFilters,
  DEFAULT_LIBRARY_FILTERS,
} from "../components/wallpaper/LibraryFilters.jsx";
import OptimizedImage from "../components/wallpaper/OptimizedImage.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useCategories } from "../hooks/useCategories.js";
import { supabase } from "../lib/supabaseClient.js";
import { mapWallpaperRow, WALLPAPER_SELECT } from "../lib/wallpaperMapper.js";

const STATUS_LABEL = {
  pending: "Pending review",
  approved: "Live",
  rejected: "Not approved",
};

export default function MyUploads() {
  const { user, profile } = useAuth();
  const [uploads, setUploads] = useState(null);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_LIBRARY_FILTERS);
  const [status, setStatus] = useState("all");
  const { categories } = useCategories();

  useEffect(() => {
    let active = true;
    if (!user) return undefined;

    async function loadUploads() {
      const { data, error: queryError } = await supabase
        .from("wallpapers")
        .select(WALLPAPER_SELECT + ", status")
        .eq("uploader_id", user.id)
        .order("created_at", { ascending: false });

      if (!active) return;
      if (queryError) {
        setError(queryError);
        setUploads([]);
      } else {
        setUploads((data || []).map(mapWallpaperRow));
      }
    }

    loadUploads();
    return () => {
      active = false;
    };
  }, [user]);

  const filteredUploads = applyLibraryFilters(uploads || [], filters).filter(
    (w) => status === "all" || w.status === status,
  );

  if (!uploads) {
    return (
      <div className="container-page pt-xl pb-3xl">
        <LoadingState label="Loading your HeyWalls space…" />
      </div>
    );
  }

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px] gap-2xl lg:gap-4xl items-start">
        <section className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-lg mb-xl">
            <div>
              <h1 className="font-display text-h1 mb-sm">My uploads</h1>
              <p className="text-body-sm text-ink-soft">
                Your wallpapers, review status, and published work.
              </p>
              <p className="text-label text-ink-soft mt-sm">
                {filteredUploads.length} shown · {uploads.length} total
              </p>
            </div>
            <Link
              to="/upload"
              className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body-sm font-medium"
            >
              Upload wallpaper
            </Link>
          </div>

          <LibraryFilters
            filters={filters}
            onChange={setFilters}
            categories={categories}
            showStatus
            status={status}
            onStatusChange={setStatus}
          />

          {error && (
            <p className="text-body-sm text-accent-2 mb-lg">{error.message}</p>
          )}

          {uploads.length === 0 ? (
            <div className="border border-line bg-surface rounded-md p-2xl text-center">
              <p className="text-body-sm text-ink-soft mb-lg">
                No uploads yet.
              </p>
              <Link to="/upload" className="text-ink underline">
                Upload your first wallpaper
              </Link>
            </div>
          ) : filteredUploads.length === 0 ? (
            <div className="border border-line bg-surface rounded-md p-xl text-center">
              <p className="text-body-sm text-ink-soft">
                No uploads match these filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-md lg:gap-lg items-start">
              {filteredUploads.map((w) =>
                w.orientation === "phone" ? (
                  <PhoneUploadCard key={w.id} wallpaper={w} />
                ) : (
                  <DesktopUploadCard key={w.id} wallpaper={w} />
                ),
              )}
            </div>
          )}
        </section>

        <AccountSidebar username={profile?.username} variant="wallpapers" />
      </div>
    </div>
  );
}

function UploadStatus({ status }) {
  return (
    <span className="absolute top-sm left-sm bg-bg/90 border border-line rounded-sm px-sm py-xs text-label">
      {STATUS_LABEL[status] || status}
    </span>
  );
}

function UploadMeta({ wallpaper }) {
  return (
    <div className="upload-card-meta">
      <p className="upload-card-title">{wallpaper.title}</p>
      <div className="upload-card-subline">
        <span>{wallpaper.orientation === "phone" ? "Mobile" : "Desktop"}</span>
        <span>{wallpaper.category || "Uncategorized"}</span>
      </div>
    </div>
  );
}

function PhoneUploadCard({ wallpaper }) {
  return (
    <Link
      to={`/wallpaper/${wallpaper.id}`}
      className="group self-start bg-surface border border-line rounded-md overflow-hidden block"
    >
      <div className="relative aspect-[9/16]">
        <OptimizedImage
          src={wallpaper.imageUrl}
          alt={wallpaper.title}
          width={520}
          className="w-full h-full object-cover block transition-transform duration-200 group-hover:scale-[1.02]"
        />
        <UploadStatus status={wallpaper.status} />
      </div>
      <UploadMeta wallpaper={wallpaper} />
    </Link>
  );
}

function DesktopUploadCard({ wallpaper }) {
  return (
    <Link
      to={`/wallpaper/${wallpaper.id}`}
      className="group self-start bg-surface border border-line rounded-md overflow-hidden block"
    >
      <div className="relative aspect-[16/9]">
        <OptimizedImage
          src={wallpaper.imageUrl}
          alt={wallpaper.title}
          width={520}
          className="w-full h-full object-cover block transition-transform duration-200 group-hover:scale-[1.02]"
        />
        <UploadStatus status={wallpaper.status} />
      </div>
      <UploadMeta wallpaper={wallpaper} />
    </Link>
  );
}
