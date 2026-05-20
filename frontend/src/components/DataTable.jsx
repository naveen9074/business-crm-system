import React, { useState, useMemo } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Eye,
  MoreVertical,
  Inbox,
} from 'lucide-react';

const DataTable = ({
  columns,
  data = [],
  isLoading = false,
  pageSize = 10,
  onEdit,
  onDelete,
  onView,
  customActions,
  sortable = true,
  searchable = true,
  searchTerm = '',
  onSearchChange,
  emptyStateMessage = 'No data available',
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState(null);

  // Reset to page 1 when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filtering based on searchTerm
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        if (value === null || value === undefined) return false;
        return value
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, columns]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key) => {
    if (!sortable) return;

    setSortConfig((prev) => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      return { key, direction: 'asc' };
    });
  };

  const renderSortIcon = (columnKey) => {
    if (sortConfig?.key !== columnKey) {
      return <ChevronUp size={16} className="text-gray-300" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp size={16} className="text-indigo-600" />
    ) : (
      <ChevronDown size={16} className="text-indigo-600" />
    );
  };

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 border-b border-gray-200/50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-900"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.min(pageSize, 5) }).map((_, idx) => (
                <tr key={idx} className="border-b border-gray-100/50">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      <div className="h-4 rounded-lg skeleton-shimmer w-24" />
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <div className="h-4 rounded-lg skeleton-shimmer w-16" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Empty State
  if (filteredData.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-12 text-center animate-fade-in">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <Inbox size={32} className="text-gray-400" />
        </div>
        <p className="text-gray-700 text-lg font-medium mb-1">{emptyStateMessage}</p>
        <p className="text-gray-500 text-sm">
          {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding a new record'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 overflow-hidden animate-fade-in">
      {/* Table */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          {/* Header */}
          <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 border-b border-gray-200/50">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => sortable && handleSort(col.key)}
                  className={`px-6 py-4 text-left text-sm font-semibold text-gray-900 ${
                    sortable ? 'cursor-pointer hover:bg-gray-200/50 transition-colors' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{col.label}</span>
                    {sortable && col.sortable !== false && renderSortIcon(col.key)}
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100/50">
            {paginatedData.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <tr className="hover:bg-indigo-50/40 transition-colors group">
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-6 py-4 text-sm text-gray-700"
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : row[col.key] || '-'}
                    </td>
                  ))}

                  {/* Actions */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onView && (
                        <button
                          onClick={() => onView(row)}
                          className="p-2 hover:bg-blue-100 text-blue-600 rounded-xl transition-colors"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className="p-2 hover:bg-indigo-100 text-indigo-600 rounded-xl transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className="p-2 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}

                      {/* Custom Actions */}
                      {customActions && customActions.length > 0 && (
                        <div className="relative group/menu">
                          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <MoreVertical size={18} />
                          </button>
                          <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 group-hover/menu:opacity-100 transition-opacity pointer-events-none group-hover/menu:pointer-events-auto z-10">
                            {customActions.map((action) => (
                              <button
                                key={action.id}
                                onClick={() => action.onClick(row)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-xl last:rounded-b-xl"
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="bg-gray-50/50 border-t border-gray-200/50 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing{' '}
            <span className="font-semibold">
              {(currentPage - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="font-semibold">
              {Math.min(currentPage * pageSize, sortedData.length)}
            </span>{' '}
            of <span className="font-semibold">{sortedData.length}</span> results
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, idx) => {
                const page = idx + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-xl font-medium transition-colors ${
                        page === currentPage
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                }

                if (page === 2 || page === totalPages - 1) {
                  return (
                    <span key={`dots-${page}`} className="text-gray-400">
                      ...
                    </span>
                  );
                }

                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
