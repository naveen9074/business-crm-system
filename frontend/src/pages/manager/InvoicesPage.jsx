/**
 * Manager — Generate Invoice page with tax calculations and preview.
 */
import { useState, useEffect } from 'react'
import api from '../../api/axios'
import PageHeader from '../../components/PageHeader'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import SearchBar from '../../components/SearchBar'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ order_id: '', cust_id: '', payment_id: '', tax_percent: 18 })
  const [preview, setPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const [invRes, ordRes] = await Promise.all([
        api.get('/manager/invoices'),
        api.get('/manager/orders'),
      ])
      setInvoices(invRes.data.invoices || [])
      setOrders(ordRes.data.orders || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleOrderSelect = (orderId) => {
    const order = orders.find(o => String(o.order_id) === String(orderId))
    if (order) {
      setForm({ ...form, order_id: orderId, cust_id: order.cust_id })
      // Calculate preview
      const total = (order.quantity || 1) * 100 // price comes from backend
      const tax = (total * form.tax_percent) / 100
      setPreview({ total, tax, final: total + tax, customer: order.customer_name, product: order.product_name, qty: order.quantity })
    }
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.post('/manager/invoices', {
        order_id: parseInt(form.order_id),
        cust_id: parseInt(form.cust_id),
        payment_id: form.payment_id ? parseInt(form.payment_id) : null,
        tax_percent: parseFloat(form.tax_percent),
      })
      alert(`Invoice ${res.data.invoice_number} created!\nFinal Amount: ₹${res.data.final_amount}`)
      setModalOpen(false)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to generate invoice')
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    { key: 'inv_id', label: 'ID' },
    { key: 'invoice_number', label: 'Invoice #' },
    { key: 'customer_name', label: 'Customer' },
    { key: 'total_amount', label: 'Subtotal' },
    { key: 'tax_amount', label: 'Tax' },
    { key: 'final_amount', label: 'Final' },
    { key: 'invoice_status', label: 'Status' },
    { key: 'invoice_date', label: 'Date' },
  ]

  return (
    <div>
      <PageHeader
        title="Invoices"
        subtitle="Generate and view invoices with tax calculations"
        action={<button onClick={() => { setForm({ order_id: '', cust_id: '', payment_id: '', tax_percent: 18 }); setPreview(null); setModalOpen(true) }} className="btn-primary">+ Generate Invoice</button>}
      />

      <div className="mb-5">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search invoices..."
          className="w-full sm:w-80"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500">Loading...</div>
      ) : (
        <DataTable
          columns={columns}
          data={invoices}
          isLoading={loading}
          searchable={true}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          emptyStateMessage="No invoices found"
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Generate Invoice">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Select Order</label>
            <select className="input-field" value={form.order_id}
              onChange={(e) => handleOrderSelect(e.target.value)} required>
              <option value="">Select an order...</option>
              {orders.map(o => (
                <option key={o.order_id} value={o.order_id}>
                  #{o.order_id} — {o.customer_name} — {o.product_name} (x{o.quantity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Tax Percentage (%)</label>
            <input type="number" className="input-field" value={form.tax_percent}
              onChange={(e) => setForm({ ...form, tax_percent: e.target.value })} step="0.01" min="0" max="100" />
          </div>

          {preview && (
            <div className="glass-light p-4 space-y-2">
              <h4 className="text-sm font-semibold text-indigo-300">Invoice Preview</h4>
              <p className="text-xs text-slate-400">Customer: {preview.customer}</p>
              <p className="text-xs text-slate-400">Product: {preview.product} × {preview.qty}</p>
              <div className="border-t border-white/10 pt-2 mt-2 space-y-1">
                <p className="text-sm text-slate-300">Tax ({form.tax_percent}%) will be calculated by the server</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
              {saving ? 'Generating...' : 'Generate Invoice'}
            </button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
