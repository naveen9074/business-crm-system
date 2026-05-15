/**
 * Auth context — provides user state, login, logout across the app.
 */
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('crms_user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('crms_token'))
  const [loading, setLoading] = useState(false)

  const login = async (username, password) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { username, password })
      const data = res.data
      localStorage.setItem('crms_token', data.token)
      localStorage.setItem('crms_user', JSON.stringify({
        user_id: data.user_id,
        name: data.name,
        role: data.role,
      }))
      setToken(data.token)
      setUser({ user_id: data.user_id, name: data.name, role: data.role })
      return { success: true, role: data.role }
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const register = async (formData) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/register', formData)
      return { success: true, message: res.data.message }
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Registration failed' }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (e) { /* ignore */ }
    localStorage.removeItem('crms_token')
    localStorage.removeItem('crms_user')
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = !!token && !!user

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
