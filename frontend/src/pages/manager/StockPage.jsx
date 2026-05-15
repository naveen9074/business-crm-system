import CrudPage from '../../components/CrudPage'

const columns = [
  { key: 'stock_id', label: 'ID' },
  { key: 'product_name', label: 'Product' },
  { key: 'quantity_available', label: 'Available' },
  { key: 'minimum_stock_level', label: 'Min Level' },
  { key: 'stock_status', label: 'Status' },
]

export default function MgrStockPage() {
  return (
    <CrudPage
      title="View Stock"
      subtitle="Read-only stock overview"
      apiBase="/manager/stock"
      listKey="stock"
      idKey="stock_id"
      columns={columns}
      searchKeys={['product_name']}
      canCreate={false} canEdit={false} canDelete={false}
    />
  )
}
