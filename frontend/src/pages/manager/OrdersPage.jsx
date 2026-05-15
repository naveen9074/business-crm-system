import CrudPage from '../../components/CrudPage'

const columns = [
  { key: 'order_id', label: 'ID' },
  { key: 'customer_name', label: 'Customer' },
  { key: 'product_name', label: 'Product' },
  { key: 'quantity', label: 'Qty' },
  { key: 'order_status', label: 'Status' },
  { key: 'order_date', label: 'Date' },
]

export default function MgrOrdersPage() {
  return (
    <CrudPage
      title="View Orders"
      subtitle="Read-only view of all orders"
      apiBase="/manager/orders"
      listKey="orders"
      idKey="order_id"
      columns={columns}
      searchKeys={['customer_name', 'product_name', 'order_id']}
      canCreate={false} canEdit={false} canDelete={false}
    />
  )
}
