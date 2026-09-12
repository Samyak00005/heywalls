import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

/**
 * A password field with a show/hide toggle. Used everywhere a password
 * is entered (login, signup, confirm password, update password) so the
 * behavior is identical across the app.
 */
export default function PasswordInput({ value, onChange, placeholder, minLength, autoComplete }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        required
        minLength={minLength}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="bg-surface border border-line rounded-sm px-lg py-sm text-body w-full pr-[40px]"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        className="absolute right-sm top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}
