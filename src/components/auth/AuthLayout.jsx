/**
 * Auth pages (Login, Signup, Forgot/Update Password) are short, focused
 * forms — centering them reads better than the default left-aligned
 * container-page layout used for content-heavy pages.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-lg">
      <div className="w-full max-w-[360px]">{children}</div>
    </div>
  );
}
