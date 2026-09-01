import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../context/ERPContext';
import { useAgent } from '../context/AgentContext';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import { formatINR, formatNumber } from '../utils/formatters';
import {
  Building2,
  Star,
  MapPin,
  PhoneCall,
  Mail,
  User,
  ExternalLink,
  Search,
  LayoutGrid,
  List,
  Sparkles,
  X,
  Send,
  ShoppingCart,
  CheckCircle2,
  TrendingUp,
  Clock
} from 'lucide-react';

export default function Suppliers() {
  const navigate = useNavigate();
  const { suppliers, pos, setActiveContext } = useERP();
  const { setIsPanelOpen, addMessage, setActiveWorkflow } = useAgent();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Sync active Copilot context
  useEffect(() => {
    setActiveContext({
      pageType: 'Suppliers',
      pageData: {
        title: 'Enterprise Suppliers Directory',
        count: suppliers.length,
        topSupplier: 'Vertex Manufacturing (99% On-Time, 4.9★)'
      }
    });
  }, [suppliers, setActiveContext]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(suppliers.map(s => s.category));
    return ['ALL', ...Array.from(cats)];
  }, [suppliers]);

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(sup => {
      const matchesCat = selectedCategory === 'ALL' || sup.category === selectedCategory;
      const matchesSearch = !searchQuery.trim() ||
        sup.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        sup.location.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        sup.category.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchesCat && matchesSearch;
    });
  }, [suppliers, selectedCategory, searchQuery]);

  // Active POs for selected supplier
  const supplierPOs = useMemo(() => {
    if (!selectedSupplier) return [];
    return pos.filter(p => p.supplier === selectedSupplier.name || p.supplierId === selectedSupplier.id);
  }, [selectedSupplier, pos]);

  const handleAskAISupplier = (supplier) => {
    setIsPanelOpen(true);
    addMessage({
      sender: 'user',
      text: `Give me a comprehensive performance assessment for supplier ${supplier.name} (${supplier.category} in ${supplier.location}).`
    });
  };

  const columns = [
    {
      key: 'name',
      label: 'Supplier Name',
      width: '200px',
      render: (val, row) => (
        <div>
          <div className="font-bold text-stone-900 group-hover:text-blue-600">{val}</div>
          <div className="text-[11px] text-stone-500">{row.id} • Est. {row.establishedYear || 2012}</div>
        </div>
      )
    },
    {
      key: 'category',
      label: 'Category',
      width: '180px',
      render: (val) => (
        <span className="font-medium text-stone-700">{val}</span>
      )
    },
    {
      key: 'location',
      label: 'Location',
      width: '160px',
      render: (val) => (
        <div className="flex items-center gap-1 text-stone-600">
          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
          <span>{val}</span>
        </div>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      width: '110px',
      render: (val) => (
        <div className="flex items-center gap-1 font-bold text-amber-600">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{val}</span>
        </div>
      )
    },
    {
      key: 'activePOs',
      label: 'Active POs',
      width: '100px',
      align: 'center',
      render: (val) => (
        <span className="px-2 py-0.5 rounded-full bg-stone-100 font-semibold text-stone-800">
          {val} POs
        </span>
      )
    },
    {
      key: 'onTimeRate',
      label: 'On-Time %',
      width: '110px',
      align: 'right',
      render: (val) => (
        <span className={`font-bold ${val >= 95 ? 'text-emerald-600' : val >= 90 ? 'text-blue-600' : 'text-amber-600'}`}>
          {val}%
        </span>
      )
    },
    {
      key: 'totalSpend',
      label: 'Total Spend',
      width: '130px',
      align: 'right',
      render: (val) => (
        <span className="font-bold text-stone-900">{formatINR(val)}</span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '90px',
      sortable: false,
      align: 'center',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedSupplier(row);
          }}
          className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
        >
          Details
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight font-serif">
            Suppliers Directory
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            25 verified Indian industrial vendors with performance telemetry, contact records, and spend history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsPanelOpen(true);
              setActiveWorkflow('SOURCE_RFQ');
              addMessage({
                sender: 'user',
                text: 'Search suppliers and shortlist top 4 vendors for precision CNC parts.'
              });
            }}
            className="px-3 py-1.5 rounded-md bg-[#141412] hover:bg-stone-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Sourcing Assistant</span>
          </button>
        </div>
      </div>

      {/* Filter and View Controls Toolbar */}
      <div className="bg-white p-3.5 rounded-lg border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by supplier name, city, category..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-stone-900 placeholder:text-stone-400"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-stone-200 rounded-md text-stone-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'ALL' ? 'All Categories (25)' : cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-md border border-stone-200">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded text-xs flex items-center gap-1 ${
              viewMode === 'grid' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-500 hover:text-stone-900'
            }`}
            title="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded text-xs flex items-center gap-1 ${
              viewMode === 'table' ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-500 hover:text-stone-900'
            }`}
            title="Table View"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Table</span>
          </button>
        </div>
      </div>

      {/* Content Rendering: Grid vs Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSuppliers.map((sup) => (
            <div
              key={sup.id}
              onClick={() => setSelectedSupplier(sup)}
              className="bg-white rounded-lg border border-stone-200 hover:border-stone-400 p-4 shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between group space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 group-hover:text-blue-600 transition-colors">
                      {sup.name}
                    </h3>
                    <div className="text-[11px] text-stone-500 font-medium">{sup.category}</div>
                  </div>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold shrink-0">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{sup.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-stone-500 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">{sup.location}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400">On-Time %</span>
                    <p className={`font-bold ${sup.onTimeRate >= 95 ? 'text-emerald-600' : 'text-blue-600'}`}>
                      {sup.onTimeRate}%
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400">Active POs</span>
                    <p className="font-bold text-stone-900">{sup.activePOs} POs</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-50">
                  <span className="text-stone-500">Total Spend:</span>
                  <span className="font-bold text-stone-900">{formatINR(sup.totalSpend)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredSuppliers}
          keyField="id"
          onRowClick={(row) => setSelectedSupplier(row)}
          searchable={false}
          defaultSortKey="rating"
          defaultSortDirection="desc"
          pageSize={10}
        />
      )}

      {/* Supplier Detail Drawer / Modal */}
      {selectedSupplier && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-stone-300 shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-stone-900 font-serif">
                    {selectedSupplier.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                    {selectedSupplier.status || 'Active'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  {selectedSupplier.id} • {selectedSupplier.category} • Established {selectedSupplier.establishedYear || 2012}
                </p>
              </div>

              <button
                onClick={() => setSelectedSupplier(null)}
                className="p-1 rounded-md hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Performance KPI Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-center">
                <div className="text-[10px] uppercase font-semibold text-stone-400">Quality Rating</div>
                <div className="text-lg font-bold text-amber-600 flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{selectedSupplier.rating} / 5.0</span>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-center">
                <div className="text-[10px] uppercase font-semibold text-stone-400">On-Time Delivery</div>
                <div className="text-lg font-bold text-emerald-600 mt-0.5">
                  {selectedSupplier.onTimeRate}%
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 text-center">
                <div className="text-[10px] uppercase font-semibold text-stone-400">Total Spend (YTD)</div>
                <div className="text-base font-bold text-stone-900 mt-0.5">
                  {formatINR(selectedSupplier.totalSpend)}
                </div>
              </div>
            </div>

            {/* Contact & Facility Info */}
            <div className="space-y-2 text-xs bg-stone-50/70 p-4 rounded-lg border border-stone-200">
              <h4 className="font-bold text-stone-900 uppercase text-[11px] tracking-wider mb-2">
                Contact & Logistics Details
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-700">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Contact: <strong>{selectedSupplier.contactPerson || 'Dispatch Manager'}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Phone: {selectedSupplier.phone || '+91 98000 00000'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Email: {selectedSupplier.email || 'dispatch@supplier.in'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>Address: {selectedSupplier.address || selectedSupplier.location}</span>
                </div>
              </div>
            </div>

            {/* Active Orders with this Supplier */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-700">
                Active Purchase Orders ({supplierPOs.length})
              </h4>
              {supplierPOs.length > 0 ? (
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-md overflow-hidden text-xs">
                  {supplierPOs.map((po) => (
                    <div
                      key={po.id}
                      onClick={() => {
                        setSelectedSupplier(null);
                        navigate(`/erp/purchase-orders/${po.id}`);
                      }}
                      className="p-2.5 flex items-center justify-between hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      <div>
                        <span className="font-bold text-stone-900">{po.poNumber}</span>
                        <span className="text-stone-400 mx-1.5">•</span>
                        <span className="text-stone-600">{po.product}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-stone-900">{formatINR(po.value)}</span>
                        <StatusBadge status={po.status} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500 italic p-3 bg-stone-50 rounded border border-stone-200">
                  No open purchase orders currently pending for this supplier.
                </p>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <button
                onClick={() => handleAskAISupplier(selectedSupplier)}
                className="px-3.5 py-2 rounded-md bg-[#141412] hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Performance Audit</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSupplier(null)}
                  className="px-3.5 py-2 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedSupplier(null);
                    navigate('/erp/rfqs');
                  }}
                  className="px-3.5 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Issue RFQ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
