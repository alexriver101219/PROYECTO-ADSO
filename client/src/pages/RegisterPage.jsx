import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../AuthContext'

export default function RegisterPage() {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState('admin')
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const { register } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    if (!fullname || !email || !password || !confirm) {
      setStatus({ msg: 'Todos los campos obligatorios', type: 'error' })
      setLoading(false)
      return
    }
    if (password !== confirm) {
      setStatus({ msg: 'Las contraseñas no coinciden', type: 'error' })
      setLoading(false)
      return
    }
    if (password.length < 8) {
      setStatus({ msg: 'La contraseña debe tener al menos 8 caracteres', type: 'error' })
      setLoading(false)
      return
    }

    const result = await register(fullname, email, password, role)
    if (result.success) {
      setStatus({ msg: 'Registro exitoso. Redirigiendo...', type: 'success' })
      setTimeout(() => navigate('/landing'), 1000)
    } else {
      setStatus({ msg: result.message, type: 'error' })
    }
    setLoading(false)
  }

  return (
    <section className="auth-section">
      <h2>Crear cuenta</h2>
      {status && <div className={`alert alert-${status.type}`}>{status.msg}</div>}
      <form onSubmit={handleSubmit} className="form-grid">
        <input 
          placeholder="Nombre completo" 
          value={fullname} 
          onChange={(e) => setFullname(e.target.value)} 
          disabled={loading}
          required 
        />
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
          minLength={8} 
        />
        <input 
          type="password" 
          placeholder="Confirmar contraseña" 
          value={confirm} 
          onChange={(e) => setConfirm(e.target.value)} 
          disabled={loading}
          required 
          minLength={8} 
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} disabled={loading}>
          <option value="admin">Administrador</option>
          <option value="manager">Gerente</option>
          <option value="staff">Colaborador</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Crear cuenta'}
        </button>
      </form>
    </section>
  )
}
