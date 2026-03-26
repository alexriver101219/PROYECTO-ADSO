import { createContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar token inicialmente
    const validateToken = async () => {
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        // Validar token con backend (opcional)
        try {
          await axios.get('/api/profile')
        } catch {
          localStorage.removeItem('token')
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }
    validateToken()
  }, [token])

  const login = async (email, password) => {
    try {
      const res = await axios.post('/login', { email, password })
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data
        setToken(newToken)
        setUser(userData)
        localStorage.setItem('token', newToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        return { success: true }
      }
      return { success: false, message: res.data.message }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error de red' }
    }
  }

  const register = async (fullname, email, password, role) => {
    try {
      const res = await axios.post('/register', { fullname, email, password, role })
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data
        setToken(newToken)
        setUser(userData)
        localStorage.setItem('token', newToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
        return { success: true }
      }
      return { success: false, message: res.data.message }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Error de red' }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
