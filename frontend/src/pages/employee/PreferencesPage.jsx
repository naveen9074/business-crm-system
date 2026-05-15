import CrudPage from '../../components/CrudPage'

const columns = [
  { key: 'preference_id', label: 'ID' },
  { key: 'website_url', label: 'Website URL' },
  { key: 'keyword', label: 'Keyword' },
  { key: 'category', label: 'Category' },
  { key: 'preference_status', label: 'Status' },
]

const formFields = [
  { name: 'website_url', label: 'Website URL', required: true, placeholder: 'https://example.com' },
  { name: 'keyword', label: 'Keyword', required: true, placeholder: 'electrical supplies' },
  { name: 'category', label: 'Category', type: 'select', options: [
    { value: 'product', label: 'Product' },
    { value: 'tender', label: 'Tender' },
    { value: 'quotation', label: 'Quotation' },
  ]},
]

export default function EmpPreferencesPage() {
  return (
    <CrudPage
      title="Web Scraping Preferences"
      subtitle="Configure URLs and keywords for automated monitoring"
      apiBase="/employee/preferences"
      listKey="preferences"
      idKey="preference_id"
      columns={columns}
      searchKeys={['website_url', 'keyword', 'category']}
      formFields={formFields}
      createLabel="+ Add Preference"
      canEdit={false}
    />
  )
}
