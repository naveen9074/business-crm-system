/**
 * Admin — Manage Managers page.
 */
import CrudPage from '../../components/CrudPage'

const columns = [
  { key: 'user_id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'username', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'status', label: 'Status' },
]

const formFields = [
  { name: 'name', label: 'Full Name', required: true, placeholder: 'John Doe' },
  { name: 'username', label: 'Username', required: true, placeholder: 'johndoe', createOnly: true },
  { name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'john@example.com' },
  { name: 'password', label: 'Password', type: 'password', required: true, placeholder: '••••••••', createOnly: true },
  { name: 'phone', label: 'Phone', placeholder: '9876543210' },
  { name: 'status', label: 'Status', type: 'select', editOnly: true, options: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]},
]

export default function ManagersPage() {
  return (
    <CrudPage
      title="Manage Managers"
      subtitle="Create, edit, and deactivate manager accounts"
      apiBase="/admin/managers"
      listKey="managers"
      idKey="user_id"
      columns={columns}
      searchKeys={['name', 'username', 'email']}
      formFields={formFields}
      createLabel="+ Add Manager"
    />
  )
}
