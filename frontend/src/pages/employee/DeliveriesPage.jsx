/**
 * Employee — View/Update Delivery status.
 */
import { useState, useEffect } from 'react'
import api from '../../api/axios'
import PageHeader from '../../components/PageHeader'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import SearchBar from '../../components/SearchBar'

export default function EmpDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/employee/deliveries')
      setDeliveries(res.data.deliveries || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const openUpdate = (row) => {
    setEditItem(row)
    setStatus(row.delivery_status || 'pending')
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.put(`/employee/deliveries/${editItem.delivery_id}`, { delivery_status: status })
      setModalOpen(false)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.detail || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    { key: 'delivery_id', label: 'ID' },
    { key: 'order_id', label: 'Order' },
    { key: 'customer_name', label: 'Customer' },
    { key: 'delivery_status', label: 'Status' },
    { key: 'delivery_date', label: 'Date' },
  ]

  return (
    <div>
      <PageHeader title="Deliveries" subtitle="Track and update delivery statuses" />

      <div className="mb-5">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search deliveries..."
          className="w-full sm:w-80"
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
          actions={(row) => (
            <button onClick={() => openUpdate(row)} className="btn btn-secondary !py-1.5 !px-3 !text-xs !rounded-xl">Update Status</button>
          )}
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Update Delivery Status">
        <form onSubmit={handleSave} className="space-y-4">
          {editItem && (
            <div className="glass-light p-3">
              <p className="text-sm text-slate-300">Delivery #{editItem.delivery_id} — Order #{editItem.order_id}</p>
              <p className="text-xs text-slate-500">Customer: {editItem.customer_name}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Delivery Status</label>
            <select className="input-field" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Updating...' : 'Update'}</button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
