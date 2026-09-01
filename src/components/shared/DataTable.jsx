import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({
  columns = [],
  data = [],
  keyField = 'id',
  onRowClick,
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchKeys = [],
  defaultSortKey = null,
  defaultSortDirection = 'asc',
  pageSize = 10,
  filters = null,
  activeFilter = 'ALL',
  onFilterChange,
  extraHeaderActions = null,
  emptyMessage = 'No records found',
  className = ''
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState(defaultSortKey || (columns[0]?.key || ''));
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);
  const [currentPage, setCurrentPage] = useState(1);

  // Handle sorting toggles
  const handleSort = (key, sortable) => {
    if (sortable === false) return;
    if (sortKey === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Filter and search
  const filteredData = useMemo(() => {
    let result = [...data];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(row => {
        if (searchKeys.length > 0) {
          return searchKeys.some(k => String(row[k] ?? '').toLowerCase().includes(q));
        }
        return Object.values(row).some(v => 
          typeof v === 'string' || typeof v === 'number' 
            ? String(v).toLowerCase().includes(q) 
            : false
        );
      });
    }

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA === valB) return 0;
        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, searchKeys, sortKey, sortDirection]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <div className={`bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden ${className}`}>
      {/* Header controls toolbar */}
      {(searchable || filters || extraHeaderActions) && (
        <div className="p-3.5 border-b border-stone-200 bg-stone-50/70 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
            {searchable && (
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={searchPlaceholder}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-stone-900 placeholder:text-stone-400"
                />
              </div>
            )}

            {filters && (
              <div className="flex items-center gap-1 overflow-x-auto py-0.5">
                {filters.map(filter => (
                  <button
                    key={filter.id || filter.label}
                    onClick={() => {
                      onFilterChange?.(filter.id);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                      activeFilter === filter.id
                        ? 'bg-[#141412] text-white shadow-xs'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {filter.label} {filter.count !== undefined && `(${filter.count})`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {extraHeaderActions && (
            <div className="flex items-center gap-2">
              {extraHeaderActions}
            </div>
          )}
        </div>
      )}

      {/* Table container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase font-semibold text-[11px] tracking-wider">
              {columns.map(col => {
                const isSorted = sortKey === col.key;
                const isSortable = col.sortable !== false;

                return (
                  <th
                    key={col.key}
                    onClick={() => isSortable && handleSort(col.key, isSortable)}
                    style={{ width: col.width }}
                    className={`px-3.5 py-2.5 ${isSortable ? 'cursor-pointer hover:bg-stone-100/80 select-none' : ''} ${
                      col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                    }`}
                  >
                    <div className={`inline-flex items-center gap-1.5 ${
                      col.align === 'right' ? 'justify-end w-full' : col.align === 'center' ? 'justify-center w-full' : ''
                    }`}>
                      <span>{col.label}</span>
                      {isSortable && (
                        <span className="text-stone-400">
                          {isSorted ? (
                            sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5 text-stone-900" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-900" />
                          ) : (
                            <ChevronsUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr
                  key={row[keyField] || rowIdx}
                  onClick={() => onRowClick?.(row)}
                  className={`group transition-colors ${
                    onRowClick ? 'cursor-pointer hover:bg-blue-50/30' : 'hover:bg-stone-50/50'
                  }`}
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className={`px-3.5 py-2.5 text-stone-800 font-medium ${
                        col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'
                      }`}
                    >
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-stone-500">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <p className="text-sm font-medium text-stone-700">{emptyMessage}</p>
                    {searchQuery && (
                      <p className="text-xs text-stone-400">No results matching "{searchQuery}"</p>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-3.5 py-2.5 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between text-xs text-stone-500">
        <div>
          Showing <span className="font-semibold text-stone-800">{filteredData.length > 0 ? startIndex + 1 : 0}</span> to{' '}
          <span className="font-semibold text-stone-800">
            {Math.min(startIndex + pageSize, filteredData.length)}
          </span>{' '}
          of <span className="font-semibold text-stone-800">{filteredData.length}</span> records
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={validCurrentPage <= 1}
            className="p-1 rounded border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 font-medium text-stone-700">
            Page {validCurrentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={validCurrentPage >= totalPages}
            className="p-1 rounded border border-stone-200 bg-white hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
