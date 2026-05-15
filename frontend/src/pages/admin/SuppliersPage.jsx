/**
 * Admin — Manage Suppliers page.
 */
import CrudPage from '../../components/CrudPage'

const columns = [
  { key: 'sup_id', label: 'ID' },
  { key: 'supplier_name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'company_name', label: 'Company' },
  { key: 'status', label: 'Status' },
]

const formFields = [
  { name: 'supplier_name', label: 'Supplier Name', required: true, placeholder: 'Acme Corp' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'contact@acme.com' },
  { name: 'phone', label: 'Phone', placeholder: '9876543210' },
  { name: 'address', label: 'Address', type: 'textarea', placeholder: '123 Main St, City' },
  { name: 'company_name', label: 'Company Name', placeholder: 'Acme Corporation' },
  { name: 'status', label: 'Status', type: 'select', editOnly: true, options: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]},
]

export default function SuppliersPage() {
  return (
    <CrudPage
      title="Manage Suppliers"
      subtitle="Create, edit, and deactivate supplier records"
      apiBase="/admin/suppliers"
      listKey="suppliers"
      idKey="sup_id"
      columns={columns}
      searchKeys={['supplier_name', 'email', 'company_name']}
      formFields={formFields}
      createLabel="+ Add Supplier"
    />
  )
}
