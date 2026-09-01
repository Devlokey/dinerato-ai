import React from 'react';

export default function MetricCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendDirection = 'neutral', // 'up' | 'down' | 'alert' | 'warning' | 'success' | 'neutral'
  badge,
  variant = 'default', // 'default' | 'danger' | 'warning' | 'success' | 'info'
  onClick,
  className = ''
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'border-red-200 bg-red-50/40 hover:bg-red-50/70';
      case 'warning':
        return 'border-amber-200 bg-amber-50/40 hover:bg-amber-50/70';
      case 'success':
        return 'border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50/70';
      case 'info':
        return 'border-blue-200 bg-blue-50/40 hover:bg-blue-50/70';
      default:
        return 'border-stone-200 bg-white hover:border-stone-300';
    }
  };

  const getTrendBadge = () => {
    if (!trend) return null;

    let color = 'bg-stone-100 text-stone-700 border-stone-200';
    if (trendDirection === 'alert' || trendDirection === 'down-bad') {
      color = 'bg-red-100 text-red-700 border-red-200';
    } else if (trendDirection === 'warning') {
      color = 'bg-amber-100 text-amber-700 border-amber-200';
    } else if (trendDirection === 'success' || trendDirection === 'up-good') {
      color = 'bg-emerald-100 text-emerald-700 border-emerald-200';
    } else if (trendDirection === 'info') {
      color = 'bg-blue-100 text-blue-700 border-blue-200';
    }

    return (
      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold border ${color}`}>
        {trend}
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`relative p-4 rounded-lg border transition-all duration-150 shadow-xs ${getVariantStyles()} ${
        onClick ? 'cursor-pointer hover:shadow-sm' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 truncate">
          {title}
        </span>
        {Icon && (
          <div className="p-1.5 rounded-md bg-stone-100 text-stone-700 shrink-0">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl font-bold tracking-tight text-stone-900 font-sans">
          {value}
        </div>
        {badge || getTrendBadge()}
      </div>

      {subtext && (
        <div className="mt-1.5 text-xs text-stone-500 line-clamp-1">
          {subtext}
        </div>
      )}
    </div>
  );
}
