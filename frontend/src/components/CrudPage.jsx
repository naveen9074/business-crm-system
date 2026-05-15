/**
 * Generic CRUD page — handles listing, search, add/edit modal for any entity.
 * Reduces duplication across Admin/Manager/Employee modules.
 */
import { useState, useEffect } from 'react'
import api from '../api/axios'
import PageHeader from './PageHeader'
import DataTable from './DataTable'
import Modal from './Modal'

export default function CrudPage({
  title,
  subtitle,
  apiBase,         // e.g. '/admin/managers'
  listKey,         // e.g. 'managers' — key in API response for the array
  idKey,           // e.g. 'user_id' — primary key field name
  columns,         // DataTable columns
  searchKeys,      // keys to search on
  formFields,      // array of { name, label, type, required, options? }
  canCreate = true,
  canEdit = true,
  canDelete = true,
  createLabel = 'Add New',
  extraActions,    // (row) => JSX for custom action buttons
}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get(apiBase)
      setData(res.data[listKey] || [])
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [apiBase])

  const openCreate = () => {
    setEditItem(null)
    const initial = {}
    formFields?.forEach(f => { initial[f.name] = f.defaultValue ?? '' })
    setForm(initial)
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditItem(row)
    const initial = {}
    formFields?.forEach(f => { initial[f.name] = row[f.name] ?? '' })
    setForm(initial)
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editItem) {
        await api.put(`${apiBase}/${editItem[idKey]}`, form)
      } else {
        await api.post(apiBase, form)
      }
      setModalOpen(false)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.detail || 'Operation failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (row) => {
    if (!confirm('Are you sure you want to delete this record?')) return
    try {
      await api.delete(`${apiBase}/${row[idKey]}`)
      fetchData()
    } catch (err) {
      alert(err.response?.data?.detail || 'Delete failed')
    }
  }

  const actions = (canEdit || canDelete || extraActions) ? (row) => (
    <>
      {canEdit && formFields && (
        <button onClick={() => openEdit(row)} className="btn-secondary !py-1.5 !px-3 !text-xs">
          Edit
        </button>
      )}
      {canDelete && (
        <button onClick={() => handleDelete(row)} className="btn-danger !py-1.5 !px-3 !text-xs">
          Delete
        </button>
      )}
      {extraActions && extraActions(row)}
    </>
  ) : undefined

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={canCreate && formFields && (
          <button onClick={openCreate} className="btn-primary">{createLabel}</button>
        )}
      />

      {loading ? (
        <div className="text-center py-16 text-slate-500">Loading...</div>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          searchKeys={searchKeys}
          actions={actions}
        />
      )}

      {/* Add/Edit Modal */}
      {formFields && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Record' : 'Add New'}>
          <form onSubmit={handleSave} className="space-y-4">
            {formFields.filter(f => editItem ? !f.createOnly : !f.editOnly).map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-slate-300 mb-1">{field.label}</label>
                {field.type === 'select' ? (
                  <select
                    className="input-field"
                    value={form[field.name] || ''}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    required={field.required}
                  >
                    <option value="">Select...</option>
                    {field.options?.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    className="input-field min-h-[80px]"
                    value={form[field.name] || ''}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    required={field.required}
                    placeholder={field.placeholder}
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    className="input-field"
                    value={form[field.name] || ''}
                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                    required={field.required}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-50">
                {saving ? 'Saving...' : editItem ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
