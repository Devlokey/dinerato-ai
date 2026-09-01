// DINE AI — Formatting Utilities (INR & Enterprise Formatting)

/**
 * Format a number into Indian Rupee currency format (e.g. ₹6,00,000)
 * @param {number|string} amount
 * @returns {string} Formatted INR currency string
 */
export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₹0';
  }
  const num = Math.round(Number(amount));
  return '₹' + num.toLocaleString('en-IN');
}

/**
 * Format a number with Indian thousand/lakh separators (e.g. 12,000)
 * @param {number|string} num
 * @returns {string}
 */
export function formatNumber(num) {
  if (num === undefined || num === null || isNaN(Number(num))) {
    return '0';
  }
  return Number(num).toLocaleString('en-IN');
}

/**
 * Format a standard date string into clean display format (e.g. Sep 13, 2026)
 * @param {string|Date} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  if (typeof dateStr === 'string' && (dateStr.includes('Sep') || dateStr.includes('Aug') || dateStr.includes('Oct'))) {
    return dateStr;
  }
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

/**
 * Format percentage string
 * @param {number|string} val
 * @returns {string}
 */
export function formatPercent(val) {
  if (val === undefined || val === null) return '0%';
  const num = typeof val === 'number' ? val : parseFloat(val);
  return `${Math.round(num)}%`;
}
