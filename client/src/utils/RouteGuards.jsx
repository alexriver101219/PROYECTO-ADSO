import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../AuthContext'

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useContext(AuthContext)

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Cargando...</div>
  
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function NotFound() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>404</h1>
      <p>Página no encontrada</p>
      <a href="/login">Volver al inicio</a>
    </div>
  )
}
