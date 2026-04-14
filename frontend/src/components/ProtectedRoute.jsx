import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ color: 'var(--muted)', fontFamily: 'Georgia, serif' }}>Loading...</div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}