/**
 * Manager — View Follow-ups (read-only with urgency color-coding).
 */
import { useState, useEffect } from 'react'
import api from '../../api/axios'
import PageHeader from '../../components/PageHeader'

export default function MgrFollowUpsPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/manager/follow-ups')
        setData(res.data.follow_ups || [])
      } catch (e) { console.error(e) }
      setLoading(false)
    }
    fetch()
  }, [])

  const getUrgency = (dateStr) => {
    if (!dateStr) return 'neutral'
    const d = new Date(dateStr)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    d.setHours(0, 0, 0, 0)
    if (d < today) return 'overdue'
    if (d.getTime() === today.getTime()) return 'today'
    return 'upcoming'
  }

  const urgencyColors = {
    overdue: 'border-l-4 border-red-500 bg-red-500/5',
    today: 'border-l-4 border-yellow-500 bg-yellow-500/5',
    upcoming: 'border-l-4 border-green-500 bg-green-500/5',
    neutral: 'border-l-4 border-slate-600',
  }

  const urgencyLabels = {
    overdue: { text: 'Overdue', class: 'badge badge-danger' },
    today: { text: 'Today', class: 'badge badge-warning' },
    upcoming: { text: 'Upcoming', class: 'badge badge-success' },
    neutral: { text: '—', class: 'badge badge-neutral' },
  }

  return (
    <div>
      <PageHeader title="Schedule Follow-ups" subtitle="View all follow-ups sorted by date with urgency coloring" />

      {loading ? (
        <div className="text-center py-16 text-slate-500">Loading...</div>
      ) : data.length === 0 ? (
        <div className="text-center py-16 text-slate-500">No follow-ups found</div>
      ) : (
        <div className="space-y-3">
          {data.map((f) => {
            const urgency = f.status === 'completed' ? 'neutral' : getUrgency(f.follow_up_date)
            return (
              <div key={f.followup_id} className={`glass-light p-4 rounded-xl ${urgencyColors[urgency]} animate-fade-in-up`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{f.customer_name || `Customer #${f.cust_id}`}</h3>
                    <p className="text-sm text-slate-400 mt-1">{f.follow_up_note || 'No notes'}</p>
                    <p className="text-xs text-slate-500 mt-1">Date: {f.follow_up_date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={urgencyLabels[urgency].class}>{urgencyLabels[urgency].text}</span>
                    <span className={`badge ${f.status === 'completed' ? 'badge-success' : f.status === 'in_progress' ? 'badge-warning' : 'badge-info'}`}>
                      {f.status}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
