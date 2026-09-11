import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await resetPassword(email)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <AuthLayout>
        <h1 className="font-display text-h1 mb-lg">Check your email</h1>
        <p className="text-body-sm text-ink-soft">
          If an account exists for {email}, a password reset link is on its
          way.
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-h1 mb-lg">Reset your password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
        <label className="flex flex-col gap-xs">
          <span className="text-label text-ink-soft">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-surface border border-line rounded-sm px-lg py-sm text-body"
          />
        </label>

        {error && <p className="text-body-sm text-accent-2">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body font-medium disabled:opacity-60"
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>
      <Link to="/login" className="text-body-sm text-ink-soft hover:text-ink mt-lg inline-block">
        Back to sign in
      </Link>
    </AuthLayout>
  )
}
