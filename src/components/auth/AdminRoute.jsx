import { Navigate } from 'react-router-dom'
import { LoadingState } from '../common/DataState.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminRoute({ children }) {
  const { user, profile, loading, profileLoading } = useAuth()

  if (loading || (user && profileLoading)) return <LoadingState label="Checking access…" />
  if (!user || profile?.role !== 'admin') return <Navigate to="/" replace />

  return children
}
