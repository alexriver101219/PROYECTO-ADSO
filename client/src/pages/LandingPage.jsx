import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../AuthContext'

const LOGO_SRC = '/sesha-app.png'

function SeshaLogo() {
  return (
    <div className="sesha-logo">
      <img src={LOGO_SRC} alt="SESHA logo" />
      <div>
        <strong>SESHA</strong>
        <p>Gestión empresarial segura</p>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <section className="landing-section">
      <SeshaLogo />
      <h2>Bienvenido a SESHA</h2>
      {user && <p className="user-greeting">Hola, <strong>{user.fullname}</strong></p>}
      <p>Plataforma de gestión integral. Tu ruta segura con React + Vite.</p>
      <ul>
        <li>✓ Dashboard en construcción</li>
        <li>✓ API Express conectada</li>
        <li>✓ Autenticación con JWT</li>
        <li>✓ React Router integrado</li>
      </ul>
      {user && (
        <div className="user-info">
          <h4>Información de usuario:</h4>
          <p>Email: <code>{user.email}</code></p>
          <p>Rol: <code>{user.role}</code></p>
          <button onClick={handleLogout} className="logout-btn">Cerrar sesión</button>
        </div>
      )}
    </section>
  )
}
