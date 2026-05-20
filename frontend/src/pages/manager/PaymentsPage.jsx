/**
 * Manager — Payments page with Add/Edit/Status badges/Search.
 * Manager can create new payments and update payment status.
 */
import { useState, useEffect } from 'react'
import api from '../../api/axios'
import PageHeader from '../../components/PageHeader'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import SearchBar from '../../components/SearchBar'

const STATUS_BADGES = {
  pending:   'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  failed:    'bg-red-100 text-red-700',
  refunded:  'bg-violet-100 text-violet-700',
}

const STATUS_DOTS = {
  pending:   'bg-amber-400',
  completed: 'bg-emerald-400',
  failed:    'bg-red-400',
  refunded:  'bg-violet-400',
}

export default function MgrPaymentsPage() {
  const [payments, setPayments] = useState([])
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // Add modal
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    order_id: '', cust_id: '', inv_id: '', amount: '',
    payment_method: '', payment_status: 'pending', payment_date: '', remarks: ''
  })
  const [saving, setSaving] = useState(false)

  // Edit modal
  const [editOpen, setEditOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [editForm, setEditForm] = useState({
    payment_status: '', payment_method: '', amount: '', payment_date: '', inv_id: '', remarks: ''
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [payRes, custRes, ordRes, invRes] = await Promise.all([
        api.get('/manager/payments'),
        api.get('/manager/customers'),
        api.get('/manager/orders'),
        api.get('/manager/invoices'),
      ])
      setPayments(payRes.data.payments || [])
      setCustomers(custRes.data.customers || [])
      setOrders(ordRes.data.orders || [])
      setInvoices(invRes.data.invoices || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  // Auto-fill customer when order selected
  const handleOrderChange = (orderId) => {
    const order = orders.find(o => String(o.order_id) === String(orderId))
    setAddForm(prev => ({
      ...prev,
      order_id: orderId,
      cust_id: order ? String(order.cust_id) : prev.cust_id
    }))
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/manager/payments', {
        order_id: parseInt(addForm.order_id),
        cust_id: parseInt(addForm.cust_id),
        inv_id: addForm.inv_id ? parseInt(addForm.inv_id) : null,
        amount: parseFloat(addForm.amount),
        payment_method: addForm.payment_method || null,
        payment_status: addForm.payment_status || 'pending',
        payment_date: addForm.payment_date || null,
        remarks: addForm.remarks || null,
      })
      setAddOpen(false)
      setAddForm({ order_id: '', cust_id: '', inv_id: '', amount: '', payment_method: '', payment_status: 'pending', payment_date: '', remarks: '' })
      fetchData()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to add payment')
    } finally {
      setSaving(false)
    }
  }

  const openEdit = (row) => {
    setEditItem(row)
    setEditForm({
      payment_status: row.payment_status || 'pending',
      payment_method: row.payment_method || '',
      amount: row.amount || '',
      payment_date: row.payment_date || '',
      inv_id: row.inv_id || '',
      remarks: row.remarks || '',
    })
    setEditOpen(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {}
      if (editForm.payment_status) payload.payment_status = editForm.payment_status
      if (editForm.payment_method) payload.payment_method = editForm.payment_method
      if (editForm.amount) payload.amount = parseFloat(editForm.amount)
      if (editForm.payment_date) payload.payment_date = editForm.payment_date
      if (editForm.inv_id) payload.inv_id = parseInt(editForm.inv_id)
      if (editForm.remarks !== undefined) payload.remarks = editForm.remarks || null
      await api.put(`/manager/payments/${editItem.payment_id}`, payload)
      setEditOpen(false)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update payment')
    } finally {
      setSaving(false)
    }
  }

  const renderStatusBadge = (val) => {
    const status = (val || 'pending').toLowerCase()
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_BADGES[status] || 'bg-gray-100 text-gray-600'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[status] || 'bg-gray-400'}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const columns = [
    { key: 'payment_id', label: 'ID' },
    { key: 'order_id', label: 'Order' },
    { key: 'customer_name', label: 'Customer' },
    { key: 'invoice_number', label: 'Invoice' },
    { key: 'amount', label: 'Amount', render: (val) => val ? `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-' },
    { key: 'payment_method', label: 'Method', render: (val) => val ? val.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : '-' },
    { key: 'payment_status', label: 'Status', render: renderStatusBadge },
    { key: 'payment_date', label: 'Date' },
  ]

  return (
    <div className="animate-page-enter">
      <PageHeader
        title="Payments"
        subtitle="Create, view and update payment records"
        action={
          <button onClick={() => setAddOpen(true)} className="btn btn-primary rounded-xl">
            + Add Payment
          </button>
        }
      />

      <div className="mb-5">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by customer, order, invoice, status..."
          className="w-full sm:w-96"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500">Loading...</div>
      ) : (
        <DataTable
          columns={columns}
          data={payments}
          isLoading={loading}
          searchable={true}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onEdit={openEdit}
          emptyStateMessage="No payments found"
        />
      )}

      {/* ── Add Payment Modal ── */}
      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Add Payment">
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

          {/* Customer */}
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

          {/* Invoice (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Invoice <span className="text-gray-400">(optional)</span></label>
            <select className="input-field" value={addForm.inv_id}
              onChange={(e) => setAddForm({ ...addForm, inv_id: e.target.value })}>
              <option value="">None</option>
              {invoices.map(inv => (
                <option key={inv.inv_id} value={inv.inv_id}>
                  {inv.invoice_number} — {inv.customer_name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount *</label>
            <input type="number" step="0.01" min="0" className="input-field" value={addForm.amount}
              onChange={(e) => setAddForm({ ...addForm, amount: e.target.value })} required
              placeholder="0.00" />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Method</label>
            <select className="input-field" value={addForm.payment_method}
              onChange={(e) => setAddForm({ ...addForm, payment_method: e.target.value })}>
              <option value="">Select method...</option>
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Status</label>
            <select className="input-field" value={addForm.payment_status}
              onChange={(e) => setAddForm({ ...addForm, payment_status: e.target.value })}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Date</label>
            <input type="date" className="input-field" value={addForm.payment_date}
              onChange={(e) => setAddForm({ ...addForm, payment_date: e.target.value })} />
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
              {saving ? 'Saving...' : 'Add Payment'}
            </button>
            <button type="button" onClick={() => setAddOpen(false)} className="btn btn-secondary flex-1 rounded-xl">Cancel</button>
          </div>
        </form>
      </Modal>

      {/* ── Edit Payment Modal ── */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)} title="Update Payment">
        <form onSubmit={handleUpdate} className="space-y-4">
          {editItem && (
            <div className="glass-card p-4 !rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Payment #{editItem.payment_id}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Order #{editItem.order_id} • {editItem.customer_name || 'Unknown'}</p>
                </div>
                {renderStatusBadge(editItem.payment_status)}
              </div>
            </div>
          )}

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Status</label>
            <select className="input-field" value={editForm.payment_status}
              onChange={(e) => setEditForm({ ...editForm, payment_status: e.target.value })}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Method</label>
            <select className="input-field" value={editForm.payment_method}
              onChange={(e) => setEditForm({ ...editForm, payment_method: e.target.value })}>
              <option value="">Select method...</option>
              <option value="cash">Cash</option>
              <option value="credit_card">Credit Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
            <input type="number" step="0.01" min="0" className="input-field" value={editForm.amount}
              onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
              placeholder="0.00" />
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Date</label>
            <input type="date" className="input-field" value={editForm.payment_date}
              onChange={(e) => setEditForm({ ...editForm, payment_date: e.target.value })} />
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
              {saving ? 'Updating...' : 'Update Payment'}
            </button>
            <button type="button" onClick={() => setEditOpen(false)} className="btn btn-secondary flex-1 rounded-xl">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
