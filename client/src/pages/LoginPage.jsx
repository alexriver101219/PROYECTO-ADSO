import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    if (!email || !password) {
      setStatus({ msg: 'Email y contraseña requeridos', type: 'error' })
      setLoading(false)
      return
    }

    const result = await login(email, password)
    if (result.success) {
      setStatus({ msg: 'Login exitoso. Redirigiendo...', type: 'success' })
      setTimeout(() => navigate('/landing'), 1000)
    } else {
      setStatus({ msg: result.message, type: 'error' })
    }
    setLoading(false)
  }

  return (
    <section className="auth-section">
      <h2>Iniciar sesión</h2>
      {status && <div className={`alert alert-${status.type}`}>{status.msg}</div>}
      <form onSubmit={handleSubmit} className="form-grid">
        <input 
          type="email" 
          placeholder="Correo" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          disabled={loading}
          required 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          disabled={loading}
          required 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
      </form>
    </section>
  )
}
