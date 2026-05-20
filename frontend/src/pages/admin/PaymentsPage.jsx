/**
 * Admin — View Payments (read-only) with Send Reminder for pending payments.
 */
import { useState, useEffect } from 'react'
import api from '../../api/axios'
import PageHeader from '../../components/PageHeader'
import DataTable from '../../components/DataTable'
import SearchBar from '../../components/SearchBar'
import ConfirmDialog from '../../components/ConfirmDialog'

const STATUS_BADGES = {
  pending:   'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  failed:    'bg-red-100 text-red-700',
  refunded:  'bg-violet-100 text-violet-700',
}

const STATUS_DOTS = {
  pending:   'bg-amber-400',
  completed: 'bg-emerald-400',
  failed:    'bg-red-400',
  refunded:  'bg-violet-400',
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [reminderConfirm, setReminderConfirm] = useState({ isOpen: false, row: null })
  const [sending, setSending] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/payments')
      setPayments(res.data.payments || [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleSendReminder = async () => {
    const row = reminderConfirm.row
    if (!row) return
    setSending(true)
    try {
      const res = await api.post(`/admin/payments/${row.payment_id}/send-reminder`)
      setSuccessMsg(res.data.message || 'Reminder sent successfully!')
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to send reminder')
    } finally {
      setSending(false)
      setReminderConfirm({ isOpen: false, row: null })
    }
  }

  const renderStatusBadge = (val) => {
    const status = (val || 'pending').toLowerCase()
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${STATUS_BADGES[status] || 'bg-gray-100 text-gray-600'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOTS[status] || 'bg-gray-400'}`} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const columns = [
    { key: 'payment_id', label: 'ID' },
    { key: 'order_id', label: 'Order' },
    { key: 'customer_name', label: 'Customer' },
    { key: 'invoice_number', label: 'Invoice' },
    { key: 'amount', label: 'Amount', render: (val) => val ? `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '-' },
    { key: 'payment_method', label: 'Method', render: (val) => val ? val.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) : '-' },
    { key: 'payment_status', label: 'Status', render: renderStatusBadge },
    { key: 'payment_date', label: 'Date' },
  ]

  return (
    <div className="animate-page-enter">
      <PageHeader
        title="View Payments"
        subtitle="Read-only view of all payment records"
      />

      {/* Success toast */}
      {successMsg && (
        <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium flex items-center gap-2 animate-fade-in-up">
          <span className="w-2 h-2 bg-emerald-400 rounded-full" />
          {successMsg}
        </div>
      )}

      <div className="mb-5">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by customer, order, invoice, status..."
          className="w-full sm:w-96"
        />
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-500">Loading...</div>
      ) : (
        <DataTable
          columns={columns}
          data={payments}
          isLoading={loading}
          searchable={true}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          emptyStateMessage="No payments found"
          customActions={[
            {
              id: 'send-reminder',
              label: '🔔 Send Reminder',
              onClick: (row) => {
                if (row.payment_status === 'pending' || row.payment_status === 'failed') {
                  setReminderConfirm({ isOpen: true, row })
                } else {
                  alert('Reminders can only be sent for pending or failed payments.')
                }
              }
            }
          ]}
        />
      )}

      {/* Send Reminder Confirmation */}
      <ConfirmDialog
        isOpen={reminderConfirm.isOpen}
        title="Send Payment Reminder"
        message={
          reminderConfirm.row
            ? `Send a payment reminder to all managers for Payment #${reminderConfirm.row.payment_id} (Order #${reminderConfirm.row.order_id}${reminderConfirm.row.customer_name ? ` — ${reminderConfirm.row.customer_name}` : ''})?`
            : ''
        }
        confirmText={sending ? 'Sending...' : 'Send Reminder'}
        cancelText="Cancel"
        variant="warning"
        onConfirm={handleSendReminder}
        onCancel={() => setReminderConfirm({ isOpen: false, row: null })}
      />
    </div>
  )
}
