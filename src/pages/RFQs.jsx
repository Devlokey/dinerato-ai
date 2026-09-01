import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../context/ERPContext';
import { useAgent } from '../context/AgentContext';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import { formatINR, formatNumber, formatDate } from '../utils/formatters';
import {
  Send,
  Plus,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
  Building2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function RFQs() {
  const navigate = useNavigate();
  const { rfqs, addRFQ, suppliers, setActiveContext } = useERP();
  const { setIsPanelOpen, addMessage, setActiveWorkflow } = useAgent();

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New RFQ form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Industrial Components',
    requestedQuantity: '',
    unit: 'PCS',
    targetDate: '2026-10-15',
    estimatedBudget: '',
    shortlistedSuppliers: ['ABC Components', 'Vertex Manufacturing']
  });

  // Sync Copilot Context
  useEffect(() => {
    setActiveContext({
      pageType: 'RFQs',
      pageData: {
        title: 'Request for Quotations Registry',
        totalRFQs: rfqs.length,
        respondedCount: rfqs.filter(r => r.status === 'Responded').length,
        activeRFQ: 'RFQ-104'
      }
    });
  }, [rfqs, setActiveContext]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: rfqs.length,
      responded: rfqs.filter(r => r.status === 'Responded').length,
      sent: rfqs.filter(r => r.status === 'Sent').length,
      pending: rfqs.filter(r => r.status === 'Pending').length,
      expired: rfqs.filter(r => r.status === 'Expired').length
    };
  }, [rfqs]);

  const filters = [
    { id: 'ALL', label: 'All RFQs', count: counts.all },
    { id: 'Responded', label: 'Responded', count: counts.responded },
    { id: 'Sent', label: 'Sent', count: counts.sent },
    { id: 'Pending', label: 'Pending', count: counts.pending },
    { id: 'Expired', label: 'Expired', count: counts.expired }
  ];

  // Filtered RFQs
  const displayedRFQs = useMemo(() => {
    if (activeFilter === 'ALL') return rfqs;
    return rfqs.filter(r => r.status === activeFilter);
  }, [rfqs, activeFilter]);

  const handleCreateRFQ = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newId = `RFQ-${100 + rfqs.length + 1}`;
    const newRFQ = {
      id: newId,
      rfqNumber: newId,
      title: formData.title,
      category: formData.category,
      requestedQuantity: Number(formData.requestedQuantity) || 500,
      unit: formData.unit || 'PCS',
      targetDate: formData.targetDate || '2026-10-15',
      createdDate: '2026-09-13',
      status: 'Sent',
      quotesReceived: 0,
      shortlistedSuppliers: formData.shortlistedSuppliers,
      estimatedBudget: Number(formData.estimatedBudget) || 500000
    };

    addRFQ(newRFQ);
    setIsCreateModalOpen(false);
    setFormData({
      title: '',
      category: 'Industrial Components',
      requestedQuantity: '',
      unit: 'PCS',
      targetDate: '2026-10-15',
      estimatedBudget: '',
      shortlistedSuppliers: ['ABC Components', 'Vertex Manufacturing']
    });
  };

  const columns = [
    {
      key: 'rfqNumber',
      label: 'RFQ ID',
      width: '110px',
      render: (val) => (
        <span className="font-bold text-stone-900">{val}</span>
      )
    },
    {
      key: 'title',
      label: 'Requirement / Item Description',
      width: '260px',
      render: (val, row) => (
        <div>
          <div className="font-semibold text-stone-900 group-hover:text-blue-600 truncate">{val}</div>
          <div className="text-[11px] text-stone-500 font-medium">{row.category}</div>
        </div>
      )
    },
    {
      key: 'requestedQuantity',
      label: 'Quantity',
      width: '110px',
      align: 'right',
      render: (val, row) => (
        <span className="font-medium text-stone-800">{formatNumber(val)} {row.unit || 'PCS'}</span>
      )
    },
    {
      key: 'estimatedBudget',
      label: 'Est. Budget',
      width: '130px',
      align: 'right',
      render: (val) => (
        <span className="font-bold text-stone-900">{val ? formatINR(val) : '—'}</span>
      )
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      width: '110px',
      render: (val) => formatDate(val)
    },
    {
      key: 'targetDate',
      label: 'Target Delivery',
      width: '120px',
      render: (val) => formatDate(val)
    },
    {
      key: 'quotesReceived',
      label: 'Quotes',
      width: '110px',
      align: 'center',
      render: (val, row) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
          val > 0 ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : 'bg-stone-100 text-stone-500'
        }`}>
          {val} Received
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (val) => <StatusBadge status={val} size="sm" />
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '130px',
      sortable: false,
      align: 'center',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1.5">
          {row.quotesReceived > 0 ? (
            <button
              onClick={() => navigate('/erp/quotations')}
              className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold flex items-center gap-1"
            >
              <span>Compare</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          ) : (
            <button
              onClick={() => {
                setIsPanelOpen(true);
                addMessage({
                  sender: 'user',
                  text: `Check vendor status and remind suppliers for ${row.rfqNumber}: ${row.title}`
                });
              }}
              className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium"
            >
              Follow-up
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight font-serif">
            Request for Quotations (RFQs)
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage 30 procurement requirements, track vendor responses, and benchmark quote intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsPanelOpen(true);
              setActiveWorkflow('SOURCE_RFQ');
              addMessage({
                sender: 'user',
                text: 'Create a new RFQ for 500 units of Industrial Component A and distribute to 4 shortlisted suppliers.'
              });
            }}
            className="px-3 py-1.5 rounded-md bg-[#141412] hover:bg-stone-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Sourcing & RFQ</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create RFQ</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-stone-500 uppercase">Total RFQs</div>
            <div className="text-base font-bold text-stone-900">{rfqs.length} Requirements</div>
          </div>
          <div className="p-2 rounded bg-stone-100 text-stone-700">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-indigo-200 bg-indigo-50/30 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-indigo-600 uppercase">Responded & Ready</div>
            <div className="text-base font-bold text-indigo-700">{counts.responded} RFQs</div>
          </div>
          <div className="p-2 rounded bg-indigo-100 text-indigo-700">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-blue-200 bg-blue-50/30 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-blue-600 uppercase">Sent to Vendors</div>
            <div className="text-base font-bold text-blue-700">{counts.sent} In Flight</div>
          </div>
          <div className="p-2 rounded bg-blue-100 text-blue-700">
            <Send className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-amber-200 bg-amber-50/30 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-amber-600 uppercase">Pending Review</div>
            <div className="text-base font-bold text-amber-700">{counts.pending} RFQs</div>
          </div>
          <div className="p-2 rounded bg-amber-100 text-amber-700">
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* RFQ Data Table with Filter Tabs */}
      <DataTable
        columns={columns}
        data={displayedRFQs}
        keyField="id"
        searchable={true}
        searchPlaceholder="Search by RFQ ID, item name, category..."
        searchKeys={['rfqNumber', 'title', 'category']}
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        defaultSortKey="rfqNumber"
        defaultSortDirection="asc"
        pageSize={10}
        emptyMessage="No RFQs match the selected filter."
      />

      {/* Create RFQ Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-stone-300 shadow-xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 font-serif">
                  Create New RFQ
                </h3>
                <p className="text-xs text-stone-500">
                  Broadcast procurement requirements to vetted industrial suppliers.
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRFQ} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Requirement Title / Item Name</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Industrial Component A (500 units)"
                  className="w-full px-3 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-stone-900 bg-white"
                  >
                    <option value="Industrial Components">Industrial Components</option>
                    <option value="Precision Engineering">Precision Engineering</option>
                    <option value="Heavy Machinery & Parts">Heavy Machinery & Parts</option>
                    <option value="Structural Steel">Structural Steel</option>
                    <option value="Raw Metals & Alloys">Raw Metals & Alloys</option>
                    <option value="Circuit Boards & Electronics">Circuit Boards & Electronics</option>
                    <option value="Fasteners & Hardware">Fasteners & Hardware</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Quantity & Unit</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      value={formData.requestedQuantity}
                      onChange={(e) => setFormData({ ...formData, requestedQuantity: e.target.value })}
                      placeholder="500"
                      className="w-2/3 px-3 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-stone-900"
                    />
                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      className="w-1/3 px-2 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-stone-900 bg-white"
                    >
                      <option value="PCS">PCS</option>
                      <option value="UNITS">UNITS</option>
                      <option value="KG">KG</option>
                      <option value="METERS">METERS</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Target Delivery Date</label>
                  <input
                    type="date"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Estimated Budget (INR ₹)</label>
                  <input
                    type="number"
                    value={formData.estimatedBudget}
                    onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                    placeholder="650000"
                    className="w-full px-3 py-1.5 border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-stone-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish & Distribute RFQ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
