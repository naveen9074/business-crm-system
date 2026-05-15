import CrudPage from '../../components/CrudPage'

const columns = [
  { key: 'delivery_id', label: 'ID' },
  { key: 'order_id', label: 'Order' },
  { key: 'customer_name', label: 'Customer' },
  { key: 'delivery_status', label: 'Status' },
  { key: 'delivery_date', label: 'Date' },
]

export default function MgrDeliveriesPage() {
  return (
    <CrudPage
      title="View Deliveries"
      subtitle="Read-only delivery tracking"
      apiBase="/manager/deliveries"
      listKey="deliveries"
      idKey="delivery_id"
      columns={columns}
      searchKeys={['customer_name', 'delivery_id']}
      canCreate={false} canEdit={false} canDelete={false}
    />
  )
}
