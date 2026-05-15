/**
 * Admin Dashboard — overview stats and quick links.
 */
import { useState, useEffect } from 'react'
import { useAuth } from '../../store/AuthContext'
import api from '../../api/axios'
import StatCard from '../../components/StatCard'

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({})

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [mgrs, emps, custs, sups, equip, payments] = await Promise.all([
          api.get('/admin/managers'),
          api.get('/admin/employees'),
          api.get('/admin/customers'),
          api.get('/admin/suppliers'),
          api.get('/admin/import-equipment'),
          api.get('/admin/payments'),
        ])
        setStats({
          managers: mgrs.data.managers?.length || 0,
          employees: emps.data.employees?.length || 0,
          customers: custs.data.customers?.length || 0,
          suppliers: sups.data.suppliers?.length || 0,
          equipment: equip.data.equipment?.length || 0,
          payments: payments.data.payments?.length || 0,
        })
      } catch (e) {
        console.error(e)
      }
    }
    fetchStats()
  }, [])

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{user?.name}</span>
        </h1>
        <p className="text-slate-400 mt-1">Here's your admin overview for today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <StatCard icon="👔" label="Total Managers" value={stats.managers} color="indigo" />
        <StatCard icon="👤" label="Total Employees" value={stats.employees} color="purple" />
        <StatCard icon="🏢" label="Total Customers" value={stats.customers} color="blue" />
        <StatCard icon="🏭" label="Total Suppliers" value={stats.suppliers} color="green" />
        <StatCard icon="📦" label="Import Equipment" value={stats.equipment} color="orange" />
        <StatCard icon="💳" label="Total Payments" value={stats.payments} color="red" />
      </div>

      {/* Quick Info */}
      <div className="glass p-6 animate-fade-in-up">
        <h2 className="text-lg font-semibold text-white mb-4">System Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-light p-4">
            <h3 className="text-sm font-medium text-indigo-300 mb-2">Admin Capabilities</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Manage Managers & Employees (CRUD)</li>
              <li>• View all Customers (read-only)</li>
              <li>• Manage Suppliers & Import Equipment</li>
              <li>• View Stock & Payment records</li>
            </ul>
          </div>
          <div className="glass-light p-4">
            <h3 className="text-sm font-medium text-purple-300 mb-2">Quick Actions</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Navigate using the sidebar menu</li>
              <li>• Use search to filter records</li>
              <li>• Click "Add" buttons to create new records</li>
              <li>• Edit or deactivate entries as needed</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
