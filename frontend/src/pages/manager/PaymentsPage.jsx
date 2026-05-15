import CrudPage from '../../components/CrudPage'

const columns = [
  { key: 'payment_id', label: 'ID' },
  { key: 'order_id', label: 'Order' },
  { key: 'inv_id', label: 'Invoice' },
  { key: 'amount', label: 'Amount' },
  { key: 'payment_method', label: 'Method' },
  { key: 'payment_status', label: 'Status' },
  { key: 'payment_date', label: 'Date' },
]

export default function MgrPaymentsPage() {
  return (
    <CrudPage
      title="View Payments"
      subtitle="Read-only payment records"
      apiBase="/manager/payments"
      listKey="payments"
      idKey="payment_id"
      columns={columns}
      searchKeys={['payment_id', 'order_id']}
      canCreate={false} canEdit={false} canDelete={false}
    />
  )
}
