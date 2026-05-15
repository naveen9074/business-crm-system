import CrudPage from '../../components/CrudPage'

const columns = [
  { key: 'alert_id', label: 'ID' },
  { key: 'message', label: 'Message' },
  { key: 'alert_status', label: 'Status' },
  { key: 'verified_by_name', label: 'Verified By' },
  { key: 'created_at', label: 'Date' },
]

export default function MgrAlertsPage() {
  return (
    <CrudPage
      title="Verified Alerts"
      subtitle="Alerts verified and forwarded by employees"
      apiBase="/manager/alerts"
      listKey="alerts"
      idKey="alert_id"
      columns={columns}
      searchKeys={['message']}
      canCreate={false} canEdit={false} canDelete={false}
    />
  )
}
