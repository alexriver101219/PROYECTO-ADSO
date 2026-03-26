import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../AuthContext'
import axios from 'axios'

export default function DashboardPage() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({ total: 0, admins: 0, managers: 0, staff: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsers()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users')
      if (res.data.success) {
        setUsers(res.data.users)
        const adminCount = res.data.users.filter(u => u.role === 'admin').length
        const managerCount = res.data.users.filter(u => u.role === 'manager').length
        const staffCount = res.data.users.filter(u => u.role === 'staff').length
        setStats({
          total: res.data.users.length,
          admins: adminCount,
          managers: managerCount,
          staff: staffCount,
        })
      }
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Dashboard SESHA</h1>
        <div className="user-info-header">
          <span>Bienvenido, <strong>{user?.fullname}</strong></span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <h3>Usuarios Totales</h3>
          <p className="stat-value">{stats.total}</p>
        </div>
        <div className="stat-card">
          <h3>Administradores</h3>
          <p className="stat-value">{stats.admins}</p>
        </div>
        <div className="stat-card">
          <h3>Gerentes</h3>
          <p className="stat-value">{stats.managers}</p>
        </div>
        <div className="stat-card">
          <h3>Colaboradores</h3>
          <p className="stat-value">{stats.staff}</p>
        </div>
      </section>

      {user?.role === 'admin' && (
        <section className="users-section">
          <h2>Gestión de Usuarios</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Creado</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.fullname}</td>
                    <td>{u.email}</td>
                    <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {user?.role !== 'admin' && (
        <section className="message-section">
          <p>Tu rol es <strong>{user?.role}</strong>. Solo administradores pueden ver la tabla de usuarios.</p>
        </section>
      )}
    </div>
  )
}
