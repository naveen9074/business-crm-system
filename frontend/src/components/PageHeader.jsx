import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Plus, Download, Filter, Search } from 'lucide-react';

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  action,
  searchEnabled = false,
  onSearch,
  filterEnabled = false,
  onFilter,
  searchPlaceholder = 'Search...',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  return (
    <div className="animate-slide-up">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 mb-6 text-sm">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <ChevronRight size={16} className="text-gray-400" />
              )}
              <button
                onClick={() => handleBreadcrumbClick(item.path)}
                className={`transition-colors ${
                  index === breadcrumbs.length - 1
                    ? 'text-gray-900 font-medium'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          {/* Title & Subtitle */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-600">{subtitle}</p>
            )}
          </div>

          {/* Action Buttons */}
          {actions && actions.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {actions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.onClick}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all hover-lift
                    ${
                      action.variant === 'primary'
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                        : action.variant === 'secondary'
                        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:scale-95'
                        : 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
                    }
                  `}
                  title={action.label}
                >
                  {action.icon && <action.icon size={18} />}
                  <span className="hidden sm:inline">{action.label}</span>
                </button>
              ))}
            </div>
          )}
          {/* Single action element support */}
          {!actions && action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      </div>

      {/* Filters & Search Bar */}
      {(searchEnabled || filterEnabled) && (
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col sm:flex-row gap-3 animate-fade-in">
          {/* Search Input */}
          {searchEnabled && (
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus-ring"
              />
            </div>
          )}

          {/* Filter Button */}
          {filterEnabled && (
            <button
              onClick={onFilter}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter size={18} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
