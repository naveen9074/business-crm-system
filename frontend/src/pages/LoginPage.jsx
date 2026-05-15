/**
 * Login page with premium glassmorphism design.
 */
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const result = await login(form.username, form.password)
    if (result.success) {
      navigate(`/${result.role}`)
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)' }}>

      {/* Decorative orbs */}
      <div className="fixed top-20 left-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px]" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px]" />

      <div className="w-full max-w-md animate-fade-in-up relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30">
            🏢
          </div>
          <h1 className="text-3xl font-bold text-white">Business CRM</h1>
          <p className="text-slate-400 mt-2 text-sm">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass p-8 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Username</label>
            <input
              id="login-username"
              type="text"
              className="input-field"
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <input
              id="login-password"
              type="password"
              className="input-field"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Register
            </Link>
          </p>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 glass-light p-4 text-center">
          <p className="text-xs text-slate-500 mb-2">Demo Credentials</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-indigo-300 font-semibold">Admin</p>
              <p className="text-slate-500">admin / admin123</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-purple-300 font-semibold">Manager</p>
              <p className="text-slate-500">manager1 / manager123</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-cyan-300 font-semibold">Employee</p>
              <p className="text-slate-500">employee1 / employee123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
