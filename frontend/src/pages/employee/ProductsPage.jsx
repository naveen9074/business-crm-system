import CrudPage from '../../components/CrudPage'

const columns = [
  { key: 'product_id', label: 'ID' },
  { key: 'product_name', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'supplier_name', label: 'Supplier' },
  { key: 'status', label: 'Status' },
]

const formFields = [
  { name: 'product_name', label: 'Product Name', required: true, placeholder: 'Widget Pro X' },
  { name: 'category', label: 'Category', placeholder: 'Electronics' },
  { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Product details...' },
  { name: 'price', label: 'Price', type: 'number', required: true, placeholder: '999.99' },
  { name: 'sup_id', label: 'Supplier ID', type: 'number', placeholder: '1' },
]

export default function EmpProductsPage() {
  return (
    <CrudPage
      title="Products"
      subtitle="Add new products and view existing ones"
      apiBase="/employee/products"
      listKey="products"
      idKey="product_id"
      columns={columns}
      searchKeys={['product_name', 'category', 'supplier_name']}
      formFields={formFields}
      createLabel="+ Add Product"
      canEdit={false}
      canDelete={false}
    />
  )
}
