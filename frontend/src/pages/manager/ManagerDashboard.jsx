/**
 * Manager Dashboard — overview with customer, order, delivery, and alert stats.
 */
import { useState, useEffect } from 'react'
import { useAuth } from '../../store/AuthContext'
import api from '../../api/axios'
import StatCard from '../../components/StatCard'

export default function ManagerDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({})

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [custs, orders, deliveries, alerts, invoices] = await Promise.all([
          api.get('/manager/customers'),
          api.get('/manager/orders'),
          api.get('/manager/deliveries'),
          api.get('/manager/alerts'),
          api.get('/manager/invoices'),
        ])
        const orderData = orders.data.orders || []
        const deliveryData = deliveries.data.deliveries || []
        setStats({
          customers: custs.data.customers?.length || 0,
          activeOrders: orderData.filter(o => o.order_status !== 'delivered' && o.order_status !== 'cancelled').length,
          pendingDeliveries: deliveryData.filter(d => d.delivery_status !== 'delivered').length,
          alerts: alerts.data.alerts?.length || 0,
          invoices: invoices.data.invoices?.length || 0,
          totalOrders: orderData.length,
        })
      } catch (e) { console.error(e) }
    }
    fetchStats()
  }, [])

  return (
    <div>
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-bold text-white">
          Welcome, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{user?.name}</span>
        </h1>
        <p className="text-slate-400 mt-1">Manager dashboard — track orders, invoices, and alerts</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <StatCard icon="🏢" label="Total Customers" value={stats.customers} color="blue" />
        <StatCard icon="🛒" label="Active Orders" value={stats.activeOrders} color="indigo" />
        <StatCard icon="🚚" label="Pending Deliveries" value={stats.pendingDeliveries} color="orange" />
        <StatCard icon="🧾" label="Invoices Generated" value={stats.invoices} color="green" />
        <StatCard icon="🔔" label="Verified Alerts" value={stats.alerts} color="purple" />
        <StatCard icon="📦" label="Total Orders" value={stats.totalOrders} color="red" />
      </div>

      <div className="glass p-6 animate-fade-in-up">
        <h2 className="text-lg font-semibold text-white mb-4">Manager Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-light p-4">
            <h3 className="text-sm font-medium text-purple-300 mb-2">Full Control</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Add/Edit/Delete Customers</li>
              <li>• Generate Invoices with tax calculation</li>
            </ul>
          </div>
          <div className="glass-light p-4">
            <h3 className="text-sm font-medium text-pink-300 mb-2">View Access</h3>
            <ul className="text-sm text-slate-400 space-y-1">
              <li>• Products, Orders, Stock, Deliveries, Payments</li>
              <li>• Schedule Follow-ups & Verified Alerts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
