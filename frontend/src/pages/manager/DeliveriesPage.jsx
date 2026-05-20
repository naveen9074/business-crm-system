/**
 * Manager — View Deliveries (read-only) with status badges and rich display.
 */
import { useState, useEffect } from 'react'
import api from '../../api/axios'
import PageHeader from '../../components/PageHeader'
import DataTable from '../../components/DataTable'
import SearchBar from '../../components/SearchBar'

const STATUS_BADGES = {
  pending:    'bg-amber-100 text-amber-700',
  in_transit: 'bg-blue-100 text-blue-700',
  delivered:  'bg-emerald-100 text-emerald-700',
  failed:     'bg-red-100 text-red-700',
}

const STATUS_DOTS = {
  pending:    'bg-amber-400',
  in_transit: 'bg-blue-400',
  delivered:  'bg-emerald-400',
  failed:     'bg-red-400',
}

const STATUS_LABELS = {
  pending:    'Pending',
  in_transit: 'In Transit',
  delivered:  'Delivered',
  failed:     'Failed',
}

export default function MgrDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/manager/deliveries')
      setDeliveries(res.data.deliveries || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const renderStatusBadge = (val) => {
    const status = (val || 'pending').toLowerCase()
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_BADGES[status] || 'bg-gray-100 text-gray-600'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[status] || 'bg-gray-400'}`} />
        {STATUS_LABELS[status] || status}
      </span>
    )
  }

  const columns = [
    { key: 'delivery_id', label: 'ID' },
    { key: 'order_id', label: 'Order' },
    { key: 'customer_name', label: 'Customer' },
    { key: 'delivery_address', label: 'Address', render: (val) => val ? (val.length > 30 ? val.substring(0, 30) + '...' : val) : '-' },
    { key: 'delivery_date', label: 'Date' },
    { key: 'delivery_status', label: 'Status', render: renderStatusBadge },
    { key: 'remarks', label: 'Remarks', render: (val) => val ? (val.length > 25 ? val.substring(0, 25) + '...' : val) : '-' },
  ]

  return (
    <div className="animate-page-enter">
      <PageHeader
        title="View Deliveries"
        subtitle="Read-only delivery tracking — managed by employees"
      />

      <div className="mb-5">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by customer, order, status..."
          className="w-full sm:w-96"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500">Loading...</div>
      ) : (
        <DataTable
          columns={columns}
          data={deliveries}
          isLoading={loading}
          searchable={true}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          emptyStateMessage="No deliveries found"
        />
      )}
    </div>
  )
}
