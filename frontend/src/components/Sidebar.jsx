/**
 * Sidebar navigation — adapts links based on user role (admin/manager/employee).
 */
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext'

const adminLinks = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/managers', label: 'Managers', icon: '👔' },
  { to: '/admin/employees', label: 'Employees', icon: '👤' },
  { to: '/admin/customers', label: 'Customers', icon: '🏢' },
  { to: '/admin/suppliers', label: 'Suppliers', icon: '🏭' },
  { to: '/admin/import-equipment', label: 'Import Equipment', icon: '📦' },
  { to: '/admin/stock', label: 'Stock', icon: '📋' },
  { to: '/admin/payments', label: 'Payments', icon: '💳' },
]

const managerLinks = [
  { to: '/manager', label: 'Dashboard', icon: '📊' },
  { to: '/manager/customers', label: 'Customers', icon: '🏢' },
  { to: '/manager/products', label: 'Products', icon: '📦' },
  { to: '/manager/orders', label: 'Orders', icon: '🛒' },
  { to: '/manager/stock', label: 'Stock', icon: '📋' },
  { to: '/manager/deliveries', label: 'Deliveries', icon: '🚚' },
  { to: '/manager/payments', label: 'Payments', icon: '💳' },
  { to: '/manager/invoices', label: 'Invoices', icon: '🧾' },
  { to: '/manager/follow-ups', label: 'Follow-ups', icon: '📅' },
  { to: '/manager/alerts', label: 'Alerts', icon: '🔔' },
]

const employeeLinks = [
  { to: '/employee', label: 'Dashboard', icon: '📊' },
  { to: '/employee/customers', label: 'Customers', icon: '🏢' },
  { to: '/employee/orders', label: 'Orders', icon: '🛒' },
  { to: '/employee/products', label: 'Products', icon: '📦' },
  { to: '/employee/stock', label: 'Stock', icon: '📋' },
  { to: '/employee/deliveries', label: 'Deliveries', icon: '🚚' },
  { to: '/employee/preferences', label: 'Scraping Prefs', icon: '🔍' },
  { to: '/employee/alerts', label: 'Alerts', icon: '🔔' },
  { to: '/employee/follow-ups', label: 'Follow-ups', icon: '📅' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const links = user?.role === 'admin' ? adminLinks
    : user?.role === 'manager' ? managerLinks
    : employeeLinks

  const roleLabel = user?.role === 'admin' ? 'Admin Panel'
    : user?.role === 'manager' ? 'Manager Panel'
    : 'Employee Panel'

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-40"
      style={{
        background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(30,27,75,0.95) 100%)',
        borderRight: '1px solid rgba(99,102,241,0.12)',
        backdropFilter: 'blur(20px)',
      }}>
      {/* Logo */}
      <div className="p-5 border-b border-white/5">
        <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          CRMS
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">{roleLabel}</p>
      </div>

      {/* User Info */}
      <div className="px-5 py-3 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">{user?.name}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === `/${user?.role}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-all duration-200
              ${isActive
                ? 'bg-indigo-500/15 text-indigo-300 shadow-sm shadow-indigo-500/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`
            }
          >
            <span className="text-base">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  )
}
