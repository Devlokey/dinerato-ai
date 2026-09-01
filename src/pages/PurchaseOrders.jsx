import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../context/ERPContext';
import { useAgent } from '../context/AgentContext';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import { formatINR, formatNumber, formatDate } from '../utils/formatters';
import {
  ShoppingCart,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Filter,
  Download,
  Plus
} from 'lucide-react';

export default function PurchaseOrders() {
  const navigate = useNavigate();
  const { pos, setActiveContext } = useERP();
  const { setIsPanelOpen, addMessage, setActiveWorkflow } = useAgent();
  const [activeFilter, setActiveFilter] = useState('ALL');

  // Set active context on mount
  useEffect(() => {
    setActiveContext({
      pageType: 'Purchase Orders',
      pageData: {
        title: 'Purchase Orders Directory',
        totalPOs: pos.length,
        overdueCount: pos.filter(p => p.status === 'OVERDUE').length,
        atRiskCount: pos.filter(p => p.status === 'AT RISK').length
      }
    });
  }, [setActiveContext, pos]);

  // Counts for filter tabs
  const counts = useMemo(() => {
    return {
      all: pos.length,
      overdue: pos.filter(p => p.status === 'OVERDUE').length,
      atRisk: pos.filter(p => p.status === 'AT RISK').length,
      onTrack: pos.filter(p => p.status === 'ON TRACK' || p.status === 'UPDATED' || p.status === 'CONFIRMED SEP 15').length,
      delivered: pos.filter(p => p.status === 'DELIVERED').length
    };
  }, [pos]);

  const filters = [
    { id: 'ALL', label: 'All Orders', count: counts.all },
    { id: 'OVERDUE', label: 'Overdue', count: counts.overdue },
    { id: 'AT RISK', label: 'At Risk', count: counts.atRisk },
    { id: 'ON TRACK', label: 'On Track', count: counts.onTrack },
    { id: 'DELIVERED', label: 'Delivered', count: counts.delivered }
  ];

  // Filter data based on active tab
  const displayedPOs = useMemo(() => {
    if (activeFilter === 'ALL') return pos;
    if (activeFilter === 'OVERDUE') return pos.filter(p => p.status === 'OVERDUE');
    if (activeFilter === 'AT RISK') return pos.filter(p => p.status === 'AT RISK');
    if (activeFilter === 'ON TRACK') {
      return pos.filter(p => p.status === 'ON TRACK' || p.status === 'UPDATED' || p.status === 'CONFIRMED SEP 15');
    }
    if (activeFilter === 'DELIVERED') return pos.filter(p => p.status === 'DELIVERED');
    return pos;
  }, [pos, activeFilter]);

  const handleAskAI = (e, po) => {
    e.stopPropagation();
    setIsPanelOpen(true);
    addMessage({
      sender: 'user',
      text: `What is the status and delivery outlook for purchase order ${po.poNumber} with ${po.supplier}?`
    });
  };

  const columns = [
    {
      key: 'poNumber',
      label: 'PO Number',
      width: '120px',
      render: (val, row) => (
        <div className="flex items-center gap-1.5 font-bold text-stone-900 group-hover:text-blue-600">
          <span>{val}</span>
          {row.riskLevel === 'HIGH' && (
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" title="High Risk Anomaly" />
          )}
        </div>
      )
    },
    {
      key: 'supplier',
      label: 'Supplier',
      width: '200px',
      render: (val, row) => (
        <div>
          <div className="font-semibold text-stone-900 truncate">{val}</div>
          <div className="text-[11px] text-stone-500">{row.category || 'Industrial'}</div>
        </div>
      )
    },
    {
      key: 'product',
      label: 'Product / Line Item',
      width: '220px',
      render: (val, row) => (
        <div>
          <div className="font-medium text-stone-800 truncate">{val}</div>
          <div className="text-[11px] text-stone-400 font-mono">{row.sku}</div>
        </div>
      )
    },
    {
      key: 'quantity',
      label: 'Quantity',
      width: '100px',
      align: 'right',
      render: (val) => (
        <span className="font-medium text-stone-700">{formatNumber(val)} PCS</span>
      )
    },
    {
      key: 'value',
      label: 'Value (INR)',
      width: '130px',
      align: 'right',
      render: (val) => (
        <span className="font-bold text-stone-900">{formatINR(val)}</span>
      )
    },
    {
      key: 'orderDate',
      label: 'Order Date',
      width: '110px',
      render: (val) => formatDate(val)
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      width: '130px',
      render: (val, row) => (
        <div>
          <div className={`font-semibold ${row.status === 'OVERDUE' ? 'text-red-700' : 'text-stone-800'}`}>
            {formatDate(val)}
          </div>
          {row.overdueDays > 0 && (
            <div className="text-[10px] text-red-600 font-bold">
              +{row.overdueDays} days late
            </div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '140px',
      render: (val) => <StatusBadge status={val} size="sm" />
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '110px',
      sortable: false,
      align: 'center',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={(e) => handleAskAI(e, row)}
            className="p-1.5 rounded-md hover:bg-stone-100 text-stone-600 hover:text-[#141412] transition-colors"
            title="Ask DINE AI about this PO"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/erp/purchase-orders/${row.id}`);
            }}
            className="p-1.5 rounded-md hover:bg-blue-50 text-stone-500 hover:text-blue-600 transition-colors"
            title="Open Detail View"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight font-serif">
            Purchase Orders
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Enterprise procurement registry across 40 orders with live tracking and delay risk scoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsPanelOpen(true);
              setActiveWorkflow('CHASE_OVERDUE');
              addMessage({
                sender: 'user',
                text: 'Chase overdue POs and expedite delivery for high-risk items.'
              });
            }}
            className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Chase Overdue ({counts.overdue})</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-stone-500 uppercase">Total Value</div>
            <div className="text-base font-bold text-stone-900">₹3.42 Cr</div>
          </div>
          <div className="p-2 rounded bg-stone-100 text-stone-700">
            <ShoppingCart className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-red-200 bg-red-50/30 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-red-600 uppercase">Overdue Amount</div>
            <div className="text-base font-bold text-red-700">₹13.70 Lakhs</div>
          </div>
          <div className="p-2 rounded bg-red-100 text-red-700">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-amber-200 bg-amber-50/30 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-amber-600 uppercase">At-Risk Orders</div>
            <div className="text-base font-bold text-amber-700">7 Orders</div>
          </div>
          <div className="p-2 rounded bg-amber-100 text-amber-700">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/30 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-emerald-600 uppercase">On-Time Fulfillment</div>
            <div className="text-base font-bold text-emerald-700">91.4%</div>
          </div>
          <div className="p-2 rounded bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 40-Record Data Table with Tabs, Search, and Row Navigation */}
      <DataTable
        columns={columns}
        data={displayedPOs}
        keyField="id"
        onRowClick={(row) => navigate(`/erp/purchase-orders/${row.id}`)}
        searchable={true}
        searchPlaceholder="Search by PO#, supplier, product, SKU..."
        searchKeys={['poNumber', 'supplier', 'product', 'sku', 'category']}
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        defaultSortKey="poNumber"
        defaultSortDirection="asc"
        pageSize={10}
        emptyMessage="No purchase orders match your filter criteria."
      />
    </div>
  );
}
