import { useState } from 'react'
import './App.css'

function Login({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setStatus({ msg: 'Email y contraseña son requeridos', type: 'error' })
      return
    }

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (data.success) {
        setStatus({ msg: data.message, type: 'success' })
        onSuccess('landing')
      } else {
        setStatus({ msg: data.message, type: 'error' })
      }
    } catch (err) {
      setStatus({ msg: 'Error de red, intenta más tarde', type: 'error' })
    }
  }

  return (
    <section className="auth-section">
      <h2>Iniciar sesión</h2>
      {status && <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'}`}>{status.msg}</div>}
      <form onSubmit={handleSubmit} className="form-grid">
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </section>
  )
}

function Register({ onSuccess }) {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState('admin')
  const [status, setStatus] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fullname || !email || !password || !confirm) {
      setStatus({ msg: 'Todos los campos obligatorios', type: 'error' })
      return
    }
    if (password !== confirm) {
      setStatus({ msg: 'Las contraseñas no coinciden', type: 'error' })
      return
    }

    try {
      const res = await fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullname, email, password, role })
      })
      const data = await res.json()

      if (data.success) {
        setStatus({ msg: data.message, type: 'success' })
        onSuccess('login')
      } else {
        setStatus({ msg: data.message, type: 'error' })
      }
    } catch {
      setStatus({ msg: 'Error de red, intenta más tarde', type: 'error' })
    }
  }

  return (
    <section className="auth-section">
      <h2>Registro</h2>
      {status && <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'}`}>{status.msg}</div>}
      <form onSubmit={handleSubmit} className="form-grid">
        <input placeholder="Nombre completo" value={fullname} onChange={(e) => setFullname(e.target.value)} required />
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
        <input type="password" placeholder="Confirmar contraseña" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">Administrador</option>
          <option value="manager">Gerente</option>
          <option value="staff">Colaborador</option>
        </select>
        <button type="submit">Crear cuenta</button>
      </form>
    </section>
  )
}

function Landing() {
  return (
    <section className="landing-section">
      <h2>Bienvenido a SESHA</h2>
      <p>Plataforma de gestión integral. Tu ruta segura con React + Vite.</p>
      <ul>
        <li>Dashboard en construcción</li>
        <li>API Express conectada</li>
        <li>Proxy Vite /login /register</li>
      </ul>
    </section>
  )
}

function App() {
  const [view, setView] = useState('login')

  return (
    <div className="app-container">
      <nav className="nav-actions">
        <button onClick={() => setView('login')} className={view === 'login' ? 'active' : ''}>Login</button>
        <button onClick={() => setView('register')} className={view === 'register' ? 'active' : ''}>Register</button>
        <button onClick={() => setView('landing')} className={view === 'landing' ? 'active' : ''}>Landing</button>
      </nav>

      {view === 'login' && <Login onSuccess={setView} />}
      {view === 'register' && <Register onSuccess={setView} />}
      {view === 'landing' && <Landing />}
    </div>
  )
}

export default App
