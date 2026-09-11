import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { ADMIN_ONLY_LOGIN } from '../../lib/featureFlags.js'
import { supabase } from '../../lib/supabaseClient.js'
import PasswordInput from './PasswordInput.jsx'

/**
 * mode: 'login' | 'signup'
 * onSuccess: called after a successful sign-in/sign-up
 */
export default function AuthForm({ mode, onSuccess, prefillEmail }) {
  const { signIn, signUp, signOut } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState(prefillEmail || '')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (mode === 'signup' && password !== confirmPassword) {
      setError("Passwords don't match.")
      return
    }

    setLoading(true)

    if (mode === 'login') {
      const { data, error } = await signIn(email, password)
      if (error) {
        setLoading(false)
        setError(error.message)
        return
      }

      if (ADMIN_ONLY_LOGIN) {
        const { data: profileRow } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (profileRow?.role !== 'admin') {
          await signOut()
          setLoading(false)
          setError('HeyWalls is in private beta right now — admin access only.')
          return
        }
      }

      setLoading(false)
      onSuccess?.(data)
      return
    }

    const { data, error } = await signUp(email, password, username || undefined)
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    // Supabase returns a "successful" signUp with an empty identities
    // array when the email is already registered — this is intentional,
    // to avoid leaking which emails exist. Treat it as already-registered
    // and send them to sign in instead of a false "check your email".
    if (data?.user && data.user.identities?.length === 0) {
      setError('You already have an account with us — redirecting you to sign in…')
      setTimeout(() => navigate('/login', { state: { prefillEmail: email } }), 1500)
      return
    }

    onSuccess?.(data)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
      {mode === 'signup' && (
        <label className="flex flex-col gap-xs">
          <span className="text-label text-ink-soft">Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Optional — we'll pick one if left blank"
            className="bg-surface border border-line rounded-sm px-lg py-sm text-body"
          />
        </label>
      )}

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

      <label className="flex flex-col gap-xs">
        <span className="text-label text-ink-soft">Password</span>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        />
      </label>

      {mode === 'signup' && (
        <label className="flex flex-col gap-xs">
          <span className="text-label text-ink-soft">Confirm password</span>
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={6}
            autoComplete="new-password"
          />
        </label>
      )}

      {error && <p className="text-body-sm text-accent-2">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-accent text-accent-contrast rounded-md px-lg py-sm text-body font-medium disabled:opacity-60"
      >
        {loading
          ? 'Please wait…'
          : mode === 'signup'
            ? 'Create account'
            : 'Sign in'}
      </button>
    </form>
  )
}
