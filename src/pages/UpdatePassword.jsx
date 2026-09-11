import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout.jsx'
import PasswordInput from '../components/auth/PasswordInput.jsx'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * Reached via the link in the password-reset email. Supabase parses the
 * recovery token from the URL and sets a temporary session automatically
 * (handled by supabase-js) before this page renders.
 */
export default function UpdatePassword() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await updatePassword(password)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      navigate('/')
    }
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-h1 mb-lg">Set a new password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
        <label className="flex flex-col gap-xs">
          <span className="text-label text-ink-soft">New password</span>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            autoComplete="new-password"
          />
        </label>

        {error && <p className="text-body-sm text-accent-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body font-medium disabled:opacity-60"
        >
          {loading ? 'Saving…' : 'Update password'}
        </button>
      </form>
    </AuthLayout>
  )
}
