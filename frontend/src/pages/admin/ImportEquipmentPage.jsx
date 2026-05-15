/**
 * Admin — Manage Import Equipment page.
 */
import CrudPage from '../../components/CrudPage'

const columns = [
  { key: 'imp_id', label: 'ID' },
  { key: 'equipment_name', label: 'Equipment' },
  { key: 'supplier_name', label: 'Supplier' },
  { key: 'quantity', label: 'Qty' },
  { key: 'import_date', label: 'Import Date' },
  { key: 'import_status', label: 'Status' },
]

const formFields = [
  { name: 'equipment_name', label: 'Equipment Name', required: true, placeholder: 'CNC Machine' },
  { name: 'sup_id', label: 'Supplier ID', type: 'number', required: true, placeholder: '1' },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Details about the equipment' },
  { name: 'quantity', label: 'Quantity', type: 'number', required: true, placeholder: '10' },
  { name: 'import_date', label: 'Import Date', type: 'date' },
  { name: 'import_status', label: 'Status', type: 'select', editOnly: true, options: [
    { value: 'pending', label: 'Pending' },
    { value: 'received', label: 'Received' },
    { value: 'inspected', label: 'Inspected' },
    { value: 'stored', label: 'Stored' },
  ]},
]

export default function ImportEquipmentPage() {
  return (
    <CrudPage
      title="Import Equipment"
      subtitle="Manage imported equipment and track their status"
      apiBase="/admin/import-equipment"
      listKey="equipment"
      idKey="imp_id"
      columns={columns}
      searchKeys={['equipment_name', 'supplier_name']}
      formFields={formFields}
      createLabel="+ Add Equipment"
    />
  )
}
