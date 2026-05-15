/**
 * Employee Dashboard — stats for assigned work items.
 */
import { useState, useEffect } from 'react'
import { useAuth } from '../../store/AuthContext'
import api from '../../api/axios'
import StatCard from '../../components/StatCard'

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({})

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [custs, orders, alerts, followups, stock] = await Promise.all([
          api.get('/employee/customers'),
          api.get('/employee/orders'),
          api.get('/employee/alerts'),
          api.get('/employee/follow-ups'),
          api.get('/employee/stock'),
        ])
        setStats({
          customers: custs.data.customers?.length || 0,
          orders: orders.data.orders?.length || 0,
          pendingAlerts: alerts.data.alerts?.length || 0,
          followups: followups.data.follow_ups?.length || 0,
          stockItems: stock.data.stock?.length || 0,
        })
      } catch (e) { console.error(e) }
    }
    fetchStats()
  }, [])

  return (
    <div>
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white">
          Welcome, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{user?.name}</span>
        </h1>
        <p className="text-slate-400 mt-1">Employee dashboard — manage your daily operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <StatCard icon="🏢" label="Customers" value={stats.customers} color="blue" />
        <StatCard icon="🛒" label="My Orders" value={stats.orders} color="indigo" />
        <StatCard icon="🔔" label="Pending Alerts" value={stats.pendingAlerts} color="orange" />
        <StatCard icon="📅" label="My Follow-ups" value={stats.followups} color="green" />
        <StatCard icon="📋" label="Stock Items" value={stats.stockItems} color="purple" />
      </div>

      {stats.pendingAlerts > 0 && (
        <div className="glass p-5 border-l-4 border-orange-500 animate-fade-in-up mb-6">
          <h3 className="text-orange-300 font-semibold">⚠ Pending Alerts</h3>
          <p className="text-sm text-slate-400 mt-1">
            You have {stats.pendingAlerts} alert(s) waiting for verification. Go to Alerts to review.
          </p>
        </div>
      )}

      <div className="glass p-6 animate-fade-in-up">
        <h2 className="text-lg font-semibold text-white mb-4">Your Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-light p-4">
            <h3 className="text-sm font-medium text-cyan-300 mb-2">Create & Update</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Add new Orders & Products</li>
              <li>• Update Stock quantities</li>
              <li>• Update Delivery status</li>
              <li>• Manage Follow-ups</li>
            </ul>
          </div>
          <div className="glass-light p-4">
            <h3 className="text-sm font-medium text-blue-300 mb-2">Verify & Configure</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Set Web Scraping Preferences</li>
              <li>• Verify/Reject Alerts</li>
              <li>• Forward alerts to Manager</li>
              <li>• View Customer records</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
