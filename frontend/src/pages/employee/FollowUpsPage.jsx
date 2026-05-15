/**
 * Employee — Manage Follow-ups.
 */
import CrudPage from '../../components/CrudPage'

const columns = [
  { key: 'followup_id', label: 'ID' },
  { key: 'customer_name', label: 'Customer' },
  { key: 'follow_up_date', label: 'Date' },
  { key: 'follow_up_note', label: 'Note' },
  { key: 'status', label: 'Status' },
]

const formFields = [
  { name: 'cust_id', label: 'Customer ID', type: 'number', required: true, placeholder: '1' },
  { name: 'follow_up_date', label: 'Follow-up Date', type: 'date', required: true },
  { name: 'follow_up_note', label: 'Note', type: 'textarea', placeholder: 'Follow-up details...' },
  { name: 'status', label: 'Status', type: 'select', editOnly: true, options: [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ]},
]

export default function EmpFollowUpsPage() {
  return (
    <CrudPage
      title="Follow-ups"
      subtitle="Schedule and manage customer follow-ups"
      apiBase="/employee/follow-ups"
      listKey="follow_ups"
      idKey="followup_id"
      columns={columns}
      searchKeys={['customer_name', 'follow_up_note']}
      formFields={formFields}
      createLabel="+ Add Follow-up"
      canDelete={false}
    />
  )
}
