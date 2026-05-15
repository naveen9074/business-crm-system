/**
 * Employee — Verify Alerts page.
 */
import { useState, useEffect } from 'react'
import api from '../../api/axios'
import PageHeader from '../../components/PageHeader'

export default function EmpAlertsPage() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAlerts = async () => {
    setLoading(true)
    try { const res = await api.get('/employee/alerts'); setAlerts(res.data.alerts || []) }
    catch (e) { console.error(e) }
    setLoading(false)
  }
  useEffect(() => { fetchAlerts() }, [])

  const handleVerify = async (id, status) => {
    try { await api.put(`/employee/alerts/${id}`, { alert_status: status }); fetchAlerts() }
    catch (err) { alert(err.response?.data?.detail || 'Failed') }
  }

  return (
    <div>
      <PageHeader title="Verify Alerts" subtitle="Review pending alerts" />
      {loading ? <div className="text-center py-16 text-slate-500">Loading...</div>
       : alerts.length === 0 ? <div className="text-center py-16"><p className="text-slate-400">No pending alerts</p></div>
       : <div className="space-y-3">{alerts.map(a => (
        <div key={a.alert_id} className="glass p-5 animate-fade-in-up">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <span className="badge badge-warning">Pending</span>
              <p className="text-sm text-slate-300 mt-2">{a.message || 'No message'}</p>
              <p className="text-xs text-slate-500 mt-1">Alert #{a.alert_id}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => handleVerify(a.alert_id, 'verified')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500/15 text-green-400 hover:bg-green-500/25">✓ Approve</button>
              <button onClick={() => handleVerify(a.alert_id, 'rejected')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/15 text-red-400 hover:bg-red-500/25">✕ Reject</button>
              <button onClick={() => handleVerify(a.alert_id, 'filtered')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-500/15 text-slate-400 hover:bg-slate-500/25">Filter</button>
            </div>
          </div>
        </div>
      ))}</div>}
    </div>
  )
}
