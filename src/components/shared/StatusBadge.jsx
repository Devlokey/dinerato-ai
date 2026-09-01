import React from 'react';

const STATUS_STYLES = {
  // PO & Delivery Statuses
  'OVERDUE': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500'
  },
  'AT RISK': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500'
  },
  'ON TRACK': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500'
  },
  'DELIVERED': {
    bg: 'bg-stone-100',
    text: 'text-stone-700',
    border: 'border-stone-200',
    dot: 'bg-stone-400'
  },
  'UPDATED': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500'
  },
  'CONFIRMED SEP 15': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500'
  },
  'DELAYED': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500'
  },
  'IN TRANSIT': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500'
  },

  // RFQ Statuses
  'SENT': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500'
  },
  'RESPONDED': {
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    border: 'border-indigo-200',
    dot: 'bg-indigo-500'
  },
  'PENDING': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500'
  },
  'EXPIRED': {
    bg: 'bg-stone-100',
    text: 'text-stone-600',
    border: 'border-stone-200',
    dot: 'bg-stone-400'
  },

  // Risk Levels
  'HIGH': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500'
  },
  'HIGH RISK': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500'
  },
  'MEDIUM': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500'
  },
  'MEDIUM RISK': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500'
  },
  'LOW': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500'
  },
  'LOW RISK': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500'
  },

  // Inventory Statuses
  'IN STOCK': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500'
  },
  'LOW STOCK': {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500'
  },
  'REORDER REQUIRED': {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500'
  },

  // General Statuses
  'ACTIVE': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500'
  },
  'INACTIVE': {
    bg: 'bg-stone-100',
    text: 'text-stone-600',
    border: 'border-stone-200',
    dot: 'bg-stone-400'
  },
  'SUCCESS': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500'
  },
  'COMPLETED': {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500'
  }
};

export default function StatusBadge({ 
  status, 
  size = 'md', 
  showDot = true, 
  className = '' 
}) {
  if (!status) return null;

  const normalized = String(status).toUpperCase().trim();
  const style = STATUS_STYLES[normalized] || {
    bg: 'bg-stone-100',
    text: 'text-stone-700',
    border: 'border-stone-200',
    dot: 'bg-stone-400'
  };

  const sizeClasses = size === 'sm' 
    ? 'px-1.5 py-0.5 text-[11px] font-medium' 
    : size === 'lg'
    ? 'px-3 py-1 text-sm font-semibold'
    : 'px-2.5 py-0.5 text-xs font-semibold';

  return (
    <span 
      className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses} tracking-tight ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
      )}
      <span>{status}</span>
    </span>
  );
}
