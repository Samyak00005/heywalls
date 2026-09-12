import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthForm from '../components/auth/AuthForm.jsx'
import AuthLayout from '../components/auth/AuthLayout.jsx'

export default function Signup() {
  const [done, setDone] = useState(false)
  const navigate = useNavigate()

  function handleSuccess(data) {
    // If the Supabase project has email confirmation off, signUp returns
    // a session immediately and the person is already logged in.
    if (data?.session) {
      navigate('/')
    } else {
      setDone(true)
    }
  }

  if (done) {
    return (
      <AuthLayout>
        <h1 className="font-display text-h1 mb-lg">Check your email</h1>
        <p className="text-body-sm text-ink-soft">
          We've sent a confirmation link — click it to activate your
          account, then come back and sign in.
        </p>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <h1 className="font-display text-h1 mb-lg">Create an account</h1>
      <AuthForm mode="signup" onSuccess={handleSuccess} />
      <p className="text-body-sm text-ink-soft mt-lg">
        Already have an account?{' '}
        <Link to="/login" className="text-ink underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}
