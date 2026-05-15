/**
 * Admin — View Customers (read-only).
 */
import CrudPage from '../../components/CrudPage'

const columns = [
  { key: 'cust_id', label: 'ID' },
  { key: 'customer_name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'organization_name', label: 'Organization' },
  { key: 'customer_type', label: 'Type' },
  { key: 'status', label: 'Status' },
]

export default function AdminCustomersPage() {
  return (
    <CrudPage
      title="View Customers"
      subtitle="Read-only view of all customers in the system"
      apiBase="/admin/customers"
      listKey="customers"
      idKey="cust_id"
      columns={columns}
      searchKeys={['customer_name', 'email', 'organization_name']}
      canCreate={false}
      canEdit={false}
      canDelete={false}
    />
  )
}
