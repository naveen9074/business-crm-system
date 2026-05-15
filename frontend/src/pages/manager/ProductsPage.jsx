import CrudPage from '../../components/CrudPage'

const columns = [
  { key: 'product_id', label: 'ID' },
  { key: 'product_name', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'supplier_name', label: 'Supplier' },
  { key: 'status', label: 'Status' },
]

export default function MgrProductsPage() {
  return (
    <CrudPage
      title="View Products"
      subtitle="Read-only view of all products"
      apiBase="/manager/products"
      listKey="products"
      idKey="product_id"
      columns={columns}
      searchKeys={['product_name', 'category', 'supplier_name']}
      canCreate={false} canEdit={false} canDelete={false}
    />
  )
}
