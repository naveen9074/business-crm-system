import CrudPage from '../../components/CrudPage'

const columns = [
  { key: 'cust_id', label: 'ID' },
  { key: 'customer_name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'organization_name', label: 'Organization' },
  { key: 'status', label: 'Status' },
]

export default function EmpCustomersPage() {
  return (
    <CrudPage
      title="View Customers"
      subtitle="Read-only customer directory"
      apiBase="/employee/customers"
      listKey="customers"
      idKey="cust_id"
      columns={columns}
      searchKeys={['customer_name', 'email', 'organization_name']}
      canCreate={false} canEdit={false} canDelete={false}
    />
  )
}
