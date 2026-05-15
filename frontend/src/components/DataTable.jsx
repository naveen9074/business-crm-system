/**
 * Reusable data table with search, status badge rendering.
 */
import { useState } from 'react'

function getBadgeClass(value) {
  if (!value) return 'badge badge-neutral'
  const v = String(value).toLowerCase()
  if (['active', 'completed', 'delivered', 'paid', 'in_stock', 'verified', 'stored', 'received'].includes(v))
    return 'badge badge-success'
  if (['pending', 'draft', 'in_progress', 'low_stock', 'inspected'].includes(v))
    return 'badge badge-warning'
  if (['inactive', 'deactivated', 'cancelled', 'failed', 'out_of_stock', 'rejected', 'overdue'].includes(v))
    return 'badge badge-danger'
  if (['confirmed', 'shipped', 'in_transit', 'issued', 'forwarded'].includes(v))
    return 'badge badge-info'
  return 'badge badge-neutral'
}

export default function DataTable({ columns, data, actions, searchKeys = [] }) {
  const [search, setSearch] = useState('')

  const filtered = search && searchKeys.length > 0
    ? data.filter(row =>
        searchKeys.some(key => {
          const val = row[key]
          return val && String(val).toLowerCase().includes(search.toLowerCase())
        })
      )
    : data

  const statusColumns = columns.filter(c => c.key?.includes('status'))

  return (
    <div>
      {/* Search */}
      {searchKeys.length > 0 && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field max-w-xs"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl glass-light">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              {actions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center py-8 text-slate-500">
                  No records found
                </td>
              </tr>
            ) : (
              filtered.map((row, idx) => (
                <tr key={row.id || row[columns[0]?.key] || idx}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render ? col.render(row[col.key], row) :
                        statusColumns.some(sc => sc.key === col.key) ? (
                          <span className={getBadgeClass(row[col.key])}>
                            {String(row[col.key] || '—').replace(/_/g, ' ')}
                          </span>
                        ) : (
                          row[col.key] ?? '—'
                        )
                      }
                    </td>
                  ))}
                  {actions && (
                    <td>
                      <div className="flex gap-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500 mt-2">
        Showing {filtered.length} of {data.length} records
      </p>
    </div>
  )
}
