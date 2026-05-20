/**
 * Employee — Deliveries page with Add/Edit/Status badges/Search.
 * Employee can create new deliveries and update delivery details.
 */
import { useState, useEffect } from 'react'
import api from '../../api/axios'
import PageHeader from '../../components/PageHeader'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
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

export default function EmpDeliveriesPage() {
  const [deliveries, setDeliveries] = useState([])
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Add modal
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    order_id: '', cust_id: '', delivery_address: '',
    delivery_date: '', delivery_status: 'pending', remarks: ''
  })
  const [saving, setSaving] = useState(false)

  // Edit modal
  const [editOpen, setEditOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [editForm, setEditForm] = useState({
    delivery_status: '', delivery_address: '', delivery_date: '', remarks: ''
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [delRes, ordRes, custRes] = await Promise.all([
        api.get('/employee/deliveries'),
        api.get('/employee/orders'),
        api.get('/employee/customers'),
      ])
      setDeliveries(delRes.data.deliveries || [])
      setOrders(ordRes.data.orders || [])
      setCustomers(custRes.data.customers || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  // Auto-fill customer and address when order selected
  const handleOrderChange = (orderId) => {
    const order = orders.find(o => String(o.order_id) === String(orderId))
    if (order) {
      const customer = customers.find(c => c.cust_id === order.cust_id)
      setAddForm(prev => ({
        ...prev,
        order_id: orderId,
        cust_id: String(order.cust_id),
        delivery_address: customer?.address || prev.delivery_address
      }))
    } else {
      setAddForm(prev => ({ ...prev, order_id: orderId }))
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/employee/deliveries', {
        order_id: parseInt(addForm.order_id),
        cust_id: parseInt(addForm.cust_id),
        delivery_address: addForm.delivery_address || null,
        delivery_date: addForm.delivery_date || null,
        delivery_status: addForm.delivery_status || 'pending',
        remarks: addForm.remarks || null,
      })
      setAddOpen(false)
      setAddForm({ order_id: '', cust_id: '', delivery_address: '', delivery_date: '', delivery_status: 'pending', remarks: '' })
      fetchData()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add delivery')
    } finally {
      setSaving(false)
    }
  }

  const openEdit = (row) => {
    setEditItem(row)
    setEditForm({
      delivery_status: row.delivery_status || 'pending',
      delivery_address: row.delivery_address || '',
      delivery_date: row.delivery_date || '',
      remarks: row.remarks || '',
    })
    setEditOpen(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {}
      if (editForm.delivery_status) payload.delivery_status = editForm.delivery_status
      if (editForm.delivery_address !== undefined) payload.delivery_address = editForm.delivery_address || null
      if (editForm.delivery_date) payload.delivery_date = editForm.delivery_date
      if (editForm.remarks !== undefined) payload.remarks = editForm.remarks || null
      await api.put(`/employee/deliveries/${editItem.delivery_id}`, payload)
      setEditOpen(false)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update delivery')
    } finally {
      setSaving(false)
    }
  }

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
  ]

  return (
    <div className="animate-page-enter">
      <PageHeader
        title="Deliveries"
        subtitle="Create, track and update delivery records"
        action={
          <button onClick={() => setAddOpen(true)} className="btn btn-primary rounded-xl">
            + Add Delivery
          </button>
        }
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
          onEdit={openEdit}
          emptyStateMessage="No deliveries found"
        />
      )}

      {/* ── Add Delivery Modal ── */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add Delivery">
        <form onSubmit={handleAdd} className="space-y-4">
          {/* Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Order *</label>
            <select className="input-field" value={addForm.order_id}
              onChange={(e) => handleOrderChange(e.target.value)} required>
              <option value="">Select order...</option>
              {orders.map(o => (
                <option key={o.order_id} value={o.order_id}>
                  #{o.order_id} — {o.customer_name} — {o.product_name}
                </option>
              ))}
            </select>
          </div>

          {/* Customer (auto-filled) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Customer *</label>
            <select className="input-field" value={addForm.cust_id}
              onChange={(e) => setAddForm({ ...addForm, cust_id: e.target.value })} required>
              <option value="">Select customer...</option>
              {customers.map(c => (
                <option key={c.cust_id} value={c.cust_id}>{c.customer_name}</option>
              ))}
            </select>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Address</label>
            <textarea className="input-field min-h-[60px]" value={addForm.delivery_address}
              onChange={(e) => setAddForm({ ...addForm, delivery_address: e.target.value })}
              placeholder="Auto-filled from customer address if available" />
          </div>

          {/* Delivery Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Date</label>
            <input type="date" className="input-field" value={addForm.delivery_date}
              onChange={(e) => setAddForm({ ...addForm, delivery_date: e.target.value })} />
          </div>

          {/* Delivery Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Status</label>
            <select className="input-field" value={addForm.delivery_status}
              onChange={(e) => setAddForm({ ...addForm, delivery_status: e.target.value })}>
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Remarks <span className="text-gray-400">(optional)</span></label>
            <textarea className="input-field min-h-[60px]" value={addForm.remarks}
              onChange={(e) => setAddForm({ ...addForm, remarks: e.target.value })}
              placeholder="Any additional notes..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn btn-primary flex-1 rounded-xl disabled:opacity-50">
              {saving ? 'Saving...' : 'Add Delivery'}
            </button>
            <button type="button" onClick={() => setAddOpen(false)} className="btn btn-secondary flex-1 rounded-xl">Cancel</button>
          </div>
        </form>
      </Modal>

      {/* ── Edit Delivery Modal ── */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Update Delivery">
        <form onSubmit={handleUpdate} className="space-y-4">
          {editItem && (
            <div className="glass-card p-4 !rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Delivery #{editItem.delivery_id}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Order #{editItem.order_id} • {editItem.customer_name || 'Unknown'}</p>
                </div>
                {renderStatusBadge(editItem.delivery_status)}
              </div>
            </div>
          )}

          {/* Delivery Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Status</label>
            <select className="input-field" value={editForm.delivery_status}
              onChange={(e) => setEditForm({ ...editForm, delivery_status: e.target.value })}>
              <option value="pending">Pending</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Delivery Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Address</label>
            <textarea className="input-field min-h-[60px]" value={editForm.delivery_address}
              onChange={(e) => setEditForm({ ...editForm, delivery_address: e.target.value })}
              placeholder="Update delivery address..." />
          </div>

          {/* Delivery Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Delivery Date</label>
            <input type="date" className="input-field" value={editForm.delivery_date}
              onChange={(e) => setEditForm({ ...editForm, delivery_date: e.target.value })} />
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Remarks</label>
            <textarea className="input-field min-h-[60px]" value={editForm.remarks}
              onChange={(e) => setEditForm({ ...editForm, remarks: e.target.value })}
              placeholder="Any additional notes..." />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn btn-primary flex-1 rounded-xl disabled:opacity-50">
              {saving ? 'Updating...' : 'Update Delivery'}
            </button>
            <button type="button" onClick={() => setEditOpen(false)} className="btn btn-secondary flex-1 rounded-xl">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
