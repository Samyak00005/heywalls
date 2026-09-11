import { Navigate, useLocation } from 'react-router-dom'
import { LoadingState } from '../common/DataState.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingState label="Checking your session…" />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  return children
}
