/**
 * Employee — Add Order page with customer/product/supplier dropdowns.
 */
import { useState, useEffect } from 'react'
import api from '../../api/axios'
import PageHeader from '../../components/PageHeader'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import SearchBar from '../../components/SearchBar'

export default function EmpOrdersPage() {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ cust_id: '', product_id: '', sup_id: '', quantity: 1, order_date: '' })
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const [ordRes, custRes, prodRes] = await Promise.all([
        api.get('/employee/orders'),
        api.get('/employee/customers'),
        api.get('/employee/products'),
      ])
      setOrders(ordRes.data.orders || [])
      setCustomers(custRes.data.customers || [])
      setProducts(prodRes.data.products || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleProductChange = (productId) => {
    const product = products.find(p => String(p.product_id) === String(productId))
    setForm({ ...form, product_id: productId, sup_id: product?.sup_id || '' })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/employee/orders', {
        cust_id: parseInt(form.cust_id),
        product_id: parseInt(form.product_id),
        sup_id: form.sup_id ? parseInt(form.sup_id) : null,
        quantity: parseInt(form.quantity),
        order_date: form.order_date || null,
      })
      setModalOpen(false)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to create order')
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    { key: 'order_id', label: 'ID' },
    { key: 'customer_name', label: 'Customer' },
    { key: 'product_name', label: 'Product' },
    { key: 'quantity', label: 'Qty' },
    { key: 'order_status', label: 'Status' },
    { key: 'order_date', label: 'Date' },
  ]

  return (
    <div>
      <PageHeader
        title="Orders"
        subtitle="Create and track your orders"
        action={<button onClick={() => { setForm({ cust_id: '', product_id: '', sup_id: '', quantity: 1, order_date: '' }); setModalOpen(true) }} className="btn-primary">+ Add Order</button>}
      />

      <div className="mb-5">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search orders..."
          className="w-full sm:w-80"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500">Loading...</div>
      ) : (
        <DataTable
          columns={columns}
          data={orders}
          isLoading={loading}
          searchable={true}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          emptyStateMessage="No orders found"
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add New Order">
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Customer</label>
            <select className="input-field" value={form.cust_id} onChange={(e) => setForm({ ...form, cust_id: e.target.value })} required>
              <option value="">Select customer...</option>
              {customers.map(c => <option key={c.cust_id} value={c.cust_id}>{c.customer_name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Product</label>
            <select className="input-field" value={form.product_id} onChange={(e) => handleProductChange(e.target.value)} required>
              <option value="">Select product...</option>
              {products.map(p => <option key={p.product_id} value={p.product_id}>{p.product_name} — ₹{p.price}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Quantity</label>
            <input type="number" className="input-field" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} min="1" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Order Date</label>
            <input type="date" className="input-field" value={form.order_date} onChange={(e) => setForm({ ...form, order_date: e.target.value })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">{saving ? 'Creating...' : 'Create Order'}</button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
