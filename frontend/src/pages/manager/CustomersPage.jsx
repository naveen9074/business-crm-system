/**
 * Manager — Manage Customers (CRUD).
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

const formFields = [
  { name: 'customer_name', label: 'Customer Name', required: true, placeholder: 'John Corp' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'contact@example.com' },
  { name: 'phone', label: 'Phone', placeholder: '9876543210' },
  { name: 'address', label: 'Address', type: 'textarea', placeholder: '123 Business St' },
  { name: 'organization_name', label: 'Organization', placeholder: 'Acme Inc' },
  { name: 'customer_type', label: 'Customer Type', type: 'select', options: [
    { value: 'Individual', label: 'Individual' },
    { value: 'Corporate', label: 'Corporate' },
    { value: 'Wholesale', label: 'Wholesale' },
  ]},
  { name: 'status', label: 'Status', type: 'select', editOnly: true, options: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]},
]

export default function MgrCustomersPage() {
  return (
    <CrudPage
      title="Manage Customers"
      subtitle="Add, edit, and manage customer records"
      apiBase="/manager/customers"
      listKey="customers"
      idKey="cust_id"
      columns={columns}
      searchKeys={['customer_name', 'email', 'organization_name']}
      formFields={formFields}
      createLabel="+ Add Customer"
    />
  )
}
