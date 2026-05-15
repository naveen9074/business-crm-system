import React from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

const StatCard = ({
  title,
  value,
  subtitle,
  trend,
  trendPercentage,
  icon: Icon,
  iconBgColor = 'bg-indigo-100',
  iconColor = 'text-indigo-600',
  onClick,
  isLoading = false,
  gradientFrom = 'from-indigo-50',
  gradientTo = 'to-purple-50',
  animated = true,
}) => {
  const isPositiveTrend = trend === 'up';

  if (isLoading) {
    return (
      <div
        className={`bg-white rounded-xl shadow-md p-6 h-full ${
          animated ? 'animate-pulse' : ''
        }`}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
          <div className="w-12 h-6 bg-gray-200 rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl shadow-md p-6 h-full transition-all cursor-pointer group
        ${animated ? 'hover-lift' : ''}
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        {/* Icon */}
        {Icon && (
          <div className={`${iconBgColor} p-3 rounded-lg ${iconColor} transition-transform ${animated ? 'group-hover:scale-110' : ''}`}>
            <Icon size={24} />
          </div>
        )}

        {/* Trend Badge */}
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-lg ${
              isPositiveTrend
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {isPositiveTrend ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            {trendPercentage}%
          </div>
        )}
      </div>

      {/* Title */}
      <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>

      {/* Value */}
      <div className="mb-4">
        <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
        {subtitle && (
          <p className="text-gray-500 text-sm">{subtitle}</p>
        )}
      </div>

      {/* Footer */}
      {onClick && (
        <div className="flex items-center gap-2 text-indigo-600 text-sm font-medium pt-4 border-t border-gray-200/30 group-hover:gap-3 transition-all">
          <span>View Details</span>
          <ArrowRight size={16} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
