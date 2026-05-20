/**
 * Employee — Update Stock with auto-calculated status.
 */
import { useState, useEffect } from 'react'
import api from '../../api/axios'
import PageHeader from '../../components/PageHeader'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import SearchBar from '../../components/SearchBar'

export default function EmpStockPage() {
  const [stock, setStock] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({ quantity_available: 0, minimum_stock_level: 10 })
  const [saving, setSaving] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/employee/stock')
      setStock(res.data.stock || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const openEdit = (row) => {
    setEditItem(row)
    setForm({ quantity_available: row.quantity_available, minimum_stock_level: row.minimum_stock_level })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.put(`/employee/stock/${editItem.stock_id}`, {
        quantity_available: parseInt(form.quantity_available),
        minimum_stock_level: parseInt(form.minimum_stock_level),
      })
      alert(`Stock updated! Status: ${res.data.stock_status}`)
      setModalOpen(false)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.detail || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  const columns = [
    { key: 'stock_id', label: 'ID' },
    { key: 'product_name', label: 'Product' },
    { key: 'quantity_available', label: 'Available' },
    { key: 'minimum_stock_level', label: 'Min Level' },
    { key: 'stock_status', label: 'Status' },
  ]

  return (
    <div>
      <PageHeader title="Stock Management" subtitle="Update stock quantities — status auto-calculates" />

      <div className="mb-5">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search stock..."
          className="w-full sm:w-80"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500">Loading...</div>
      ) : (
        <DataTable
          columns={columns}
          data={stock}
          isLoading={loading}
          searchable={true}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          emptyStateMessage="No stock found"
          actions={(row) => (
            <button onClick={() => openEdit(row)} className="btn btn-secondary !py-1.5 !px-3 !text-xs !rounded-xl">Update</button>
          )}
        />
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Update Stock">
        <form onSubmit={handleSave} className="space-y-4">
          {editItem && (
            <div className="glass-light p-3 mb-2">
              <p className="text-sm text-slate-300"><strong>Product:</strong> {editItem.product_name}</p>
              <p className="text-xs text-slate-500">Current: {editItem.quantity_available} | Status: {editItem.stock_status}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">New Quantity</label>
            <input type="number" className="input-field" value={form.quantity_available} onChange={(e) => setForm({ ...form, quantity_available: e.target.value })} min="0" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Minimum Stock Level</label>
            <input type="number" className="input-field" value={form.minimum_stock_level} onChange={(e) => setForm({ ...form, minimum_stock_level: e.target.value })} min="0" required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1">{saving ? 'Updating...' : 'Update Stock'}</button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
