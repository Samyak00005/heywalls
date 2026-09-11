import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../components/auth/PasswordInput.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { supabase } from "../lib/supabaseClient.js";

export default function AccountSettings() {
  const { user, profile, signOut, updatePassword, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState(null);
  const [pwSaved, setPwSaved] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const { data, error } = await supabase
      .from("profiles")
      .update({ username, bio })
      .eq("id", user.id)
      .select()
      .single();

    setSaving(false);
    if (error) {
      // Postgres unique_violation — friendlier than the raw DB message.
      setError(
        error.code === "23505"
          ? "That username is already taken — try another."
          : error.message,
      );
    } else {
      setSaved(true);
      setUsername(data.username || "");
      setBio(data.bio || "");
      refreshProfile();
    }
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPwSaving(true);
    setPwError(null);
    setPwSaved(false);
    const { error } = await updatePassword(newPassword);
    setPwSaving(false);
    if (error) setPwError(error.message);
    else {
      setPwSaved(true);
      setNewPassword("");
    }
  }

  async function handleDeleteAccount() {
    if (
      !confirm(
        "This permanently deletes your account and cannot be undone. Continue?",
      )
    ) {
      return;
    }
    setDeleting(true);
    setDeleteError(null);
    const { error } = await supabase.functions.invoke("delete-account");
    if (error) {
      setDeleteError(error.message);
      setDeleting(false);
      return;
    }
    await signOut();
    navigate("/");
  }

  return (
    <div className="container-page pt-xl pb-3xl md:pb-4xl">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] gap-2xl lg:gap-4xl items-start">
        <section className="min-w-0">
          <h1 className="font-display text-h1 mb-lg">Account settings</h1>

          <div className="flex flex-wrap gap-lg mb-2xl text-body-sm">
            <Link to="/account/uploads" className="text-ink underline">
              My uploads
            </Link>
            <Link to="/account/favorites" className="text-ink underline">
              Favorites
            </Link>
            <Link to="/collections" className="text-ink underline">
              Collections
            </Link>
          </div>

          <form
            onSubmit={handleSave}
            className="flex flex-col gap-lg mb-3xl max-w-[720px]"
          >
            <label className="flex flex-col gap-xs">
              <span className="text-label text-ink-soft">Email</span>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="bg-surface border border-line rounded-sm px-lg py-sm text-body text-ink-soft"
              />
            </label>

            <label className="flex flex-col gap-xs">
              <span className="text-label text-ink-soft">Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-surface border border-line rounded-sm px-lg py-sm text-body"
              />
            </label>

            <label className="flex flex-col gap-xs">
              <span className="text-label text-ink-soft">Bio</span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="bg-surface border border-line rounded-sm px-lg py-sm text-body resize-none"
              />
            </label>

            {error && <p className="text-body-sm text-accent-2">{error}</p>}
            {saved && <p className="text-body-sm text-ink-soft">Saved.</p>}

            <button
              type="submit"
              disabled={saving}
              className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body font-medium disabled:opacity-60 self-start"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </form>

          <h2 className="font-display text-h3 mb-lg">Change password</h2>
          <form
            onSubmit={handlePasswordChange}
            className="flex flex-col gap-lg mb-3xl max-w-[720px]"
          >
            <label className="flex flex-col gap-xs">
              <span className="text-label text-ink-soft">New password</span>
              <PasswordInput
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                autoComplete="new-password"
              />
            </label>

            {pwError && <p className="text-body-sm text-accent-2">{pwError}</p>}
            {pwSaved && (
              <p className="text-body-sm text-ink-soft">Password updated.</p>
            )}

            <button
              type="submit"
              disabled={pwSaving}
              className="border border-ink text-ink rounded-md px-lg py-sm text-body disabled:opacity-60 self-start"
            >
              {pwSaving ? "Saving…" : "Update password"}
            </button>
          </form>

          <div className="border-t border-line pt-xl max-w-[720px]">
            <h2 className="font-display text-h3 mb-sm">Delete account</h2>
            <p className="text-body-sm text-ink-soft mb-lg">
              Permanently deletes your account. This cannot be undone.
            </p>
            {deleteError && (
              <p className="text-body-sm text-accent-2 mb-lg">{deleteError}</p>
            )}
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className="border border-accent-2 text-accent-2 rounded-md px-lg py-sm text-body disabled:opacity-60"
            >
              {deleting ? "Deleting…" : "Delete my account"}
            </button>
          </div>
        </section>

        <aside className="hidden lg:block border-l border-line pl-2xl sticky top-xl">
          <p className="text-label uppercase tracking-[0.08em] text-ink-soft mb-sm">
            Your HeyWalls
          </p>
          <h2 className="font-display text-h2 mb-sm">Account hub</h2>
          <p className="text-body-sm text-ink-soft mb-xl">
            Manage your profile, uploads, saved wallpapers, and collections from
            one place.
          </p>
          <nav className="space-y-sm text-body-sm">
            <Link
              to="/account/uploads"
              className="block text-ink hover:underline"
            >
              My uploads →
            </Link>
            <Link
              to="/account/favorites"
              className="block text-ink hover:underline"
            >
              Saved wallpapers →
            </Link>
            <Link to="/collections" className="block text-ink hover:underline">
              Collections →
            </Link>
            <Link to="/upload" className="block text-ink hover:underline">
              Upload a wallpaper →
            </Link>
          </nav>
        </aside>
      </div>
    </div>
  );
}
