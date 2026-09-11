import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthForm from '../components/auth/AuthForm.jsx'
import AuthLayout from '../components/auth/AuthLayout.jsx'
import { useToast } from '../components/common/ToastContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const [notice] = useState(location.state?.prefillEmail ? 'Sign in below to continue.' : null)

  return (
    <AuthLayout>
      <h1 className="font-display text-h1 mb-lg">Sign in</h1>
      {notice && <p className="text-body-sm text-ink-soft mb-lg">{notice}</p>}
      <AuthForm
        mode="login"
        prefillEmail={location.state?.prefillEmail}
        onSuccess={() => {
          showToast('Welcome back to HeyWalls.')
          navigate('/')
        }}
      />
      <div className="flex flex-col gap-xs mt-lg text-body-sm text-ink-soft">
        <Link to="/forgot-password" className="hover:text-ink">
          Forgot your password?
        </Link>
        <span>
          New here?{' '}
          <Link to="/signup" className="text-ink underline">
            Create an account
          </Link>
        </span>
      </div>
    </AuthLayout>
  )
}
