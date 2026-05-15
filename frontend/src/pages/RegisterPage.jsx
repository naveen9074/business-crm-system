/**
 * Register page — creates new user accounts.
 */
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', username: '', email: '', password: '', role: 'employee', phone: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    const result = await register(form)
    if (result.success) {
      setSuccess('Registration successful! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
    } else {
      setError(result.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)' }}>

      <div className="fixed top-20 right-20 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px]" />
      <div className="fixed bottom-20 left-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px]" />

      <div className="w-full max-w-md animate-fade-in-up relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30">
            📝
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 mt-2 text-sm">Register for CRM access</p>
        </div>

        <form onSubmit={handleSubmit} className="glass p-8 space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
          {success && <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">{success}</div>}

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
            <input id="register-name" className="input-field" placeholder="John Doe"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
              <input id="register-username" className="input-field" placeholder="johndoe"
                value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
              <input id="register-phone" className="input-field" placeholder="9876543210"
                value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input id="register-email" type="email" className="input-field" placeholder="john@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
            <input id="register-password" type="password" className="input-field" placeholder="••••••••"
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
            <select id="register-role" className="input-field"
              value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button id="register-submit" type="submit" disabled={loading}
            className="btn-primary w-full py-3 text-base disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-slate-400">
            Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
