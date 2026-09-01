import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../context/ERPContext';
import { useAgent } from '../context/AgentContext';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import { formatINR, formatNumber } from '../utils/formatters';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Package,
  TrendingDown,
  Warehouse,
  Plus,
  Send,
  ExternalLink
} from 'lucide-react';

export default function Inventory() {
  const navigate = useNavigate();
  const { inventory, setActiveContext } = useERP();
  const { setIsPanelOpen, addMessage, setActiveWorkflow } = useAgent();

  const [activeFilter, setActiveFilter] = useState('ALL');

  // Sync Copilot Context
  useEffect(() => {
    setActiveContext({
      pageType: 'Inventory',
      pageData: {
        title: 'Warehouse Stock & SKU Inventory',
        totalSKUs: inventory.length,
        reorderCount: inventory.filter(i => i.status === 'Reorder Required').length,
        lowStockCount: inventory.filter(i => i.status === 'Low Stock').length
      }
    });
  }, [inventory, setActiveContext]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: inventory.length,
      inStock: inventory.filter(i => i.status === 'In Stock').length,
      lowStock: inventory.filter(i => i.status === 'Low Stock').length,
      reorderRequired: inventory.filter(i => i.status === 'Reorder Required').length
    };
  }, [inventory]);

  const totalInventoryValuation = useMemo(() => {
    return inventory.reduce((acc, item) => acc + (item.inStock * (item.unitCost || 0)), 0);
  }, [inventory]);

  const filters = [
    { id: 'ALL', label: 'All SKUs', count: counts.all },
    { id: 'In Stock', label: 'In Stock', count: counts.inStock },
    { id: 'Low Stock', label: 'Low Stock', count: counts.lowStock },
    { id: 'Reorder Required', label: 'Reorder Required', count: counts.reorderRequired }
  ];

  // Filtered inventory
  const displayedInventory = useMemo(() => {
    if (activeFilter === 'ALL') return inventory;
    return inventory.filter(i => i.status === activeFilter);
  }, [inventory, activeFilter]);

  const handleReorderItem = (item) => {
    setIsPanelOpen(true);
    setActiveWorkflow('SOURCE_RFQ');
    addMessage({
      sender: 'user',
      text: `Draft RFQ to replenish ${item.name} (${item.sku}). Current stock: ${item.inStock} units, Reorder target: ${item.reorderPoint * 2} units.`
    });
  };

  const columns = [
    {
      key: 'sku',
      label: 'SKU Code',
      width: '130px',
      render: (val) => (
        <span className="font-mono font-bold text-stone-900">{val}</span>
      )
    },
    {
      key: 'name',
      label: 'Item Name & Category',
      width: '240px',
      render: (val, row) => (
        <div>
          <div className="font-bold text-stone-900 truncate">{val}</div>
          <div className="text-[11px] text-stone-500">{row.category}</div>
        </div>
      )
    },
    {
      key: 'location',
      label: 'Warehouse Bay',
      width: '130px',
      render: (val) => (
        <div className="flex items-center gap-1 font-medium text-stone-700">
          <Warehouse className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          <span>{val}</span>
        </div>
      )
    },
    {
      key: 'inStock',
      label: 'Current Stock',
      width: '120px',
      align: 'right',
      render: (val, row) => (
        <div className="text-right">
          <span className={`font-bold ${
            row.status === 'Reorder Required' ? 'text-red-700' :
            row.status === 'Low Stock' ? 'text-amber-700' : 'text-stone-900'
          }`}>
            {formatNumber(val)} PCS
          </span>
        </div>
      )
    },
    {
      key: 'reorderPoint',
      label: 'Reorder Point',
      width: '120px',
      align: 'right',
      render: (val) => (
        <span className="text-stone-600 font-medium">{formatNumber(val)} PCS</span>
      )
    },
    {
      key: 'unitCost',
      label: 'Unit Cost',
      width: '110px',
      align: 'right',
      render: (val) => (
        <span className="font-semibold text-stone-900">{formatINR(val)}</span>
      )
    },
    {
      key: 'status',
      label: 'Stock Health',
      width: '150px',
      render: (val) => <StatusBadge status={val} size="sm" />
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      sortable: false,
      align: 'center',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1">
          {row.status !== 'In Stock' ? (
            <button
              onClick={() => handleReorderItem(row)}
              className="px-2.5 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[11px] font-bold flex items-center gap-1 shadow-xs"
            >
              <Sparkles className="w-3 h-3 text-red-600" />
              <span>Reorder</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsPanelOpen(true);
                addMessage({
                  sender: 'user',
                  text: `Show usage velocity and reorder forecast for ${row.name} (${row.sku}).`
                });
              }}
              className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-medium"
            >
              Analytics
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight font-serif">
            Warehouse Inventory & Stock
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            SKU catalog across 20 critical industrial categories with autonomous reorder triggers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsPanelOpen(true);
              setActiveWorkflow('SOURCE_RFQ');
              addMessage({
                sender: 'user',
                text: 'Trigger automatic replenishment RFQs for all 3 items flagged as Reorder Required.'
              });
            }}
            className="px-3.5 py-1.5 rounded-md bg-[#141412] hover:bg-stone-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Auto-Replenish</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-stone-500 uppercase">Stock Valuation</div>
            <div className="text-base font-bold text-stone-900">{formatINR(totalInventoryValuation)}</div>
          </div>
          <div className="p-2 rounded bg-stone-100 text-stone-700">
            <Package className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-red-200 bg-red-50/30 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-red-600 uppercase">Reorder Required</div>
            <div className="text-base font-bold text-red-700">{counts.reorderRequired} SKUs</div>
          </div>
          <div className="p-2 rounded bg-red-100 text-red-700">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-amber-200 bg-amber-50/30 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-amber-600 uppercase">Low Stock Alerts</div>
            <div className="text-base font-bold text-amber-700">{counts.lowStock} SKUs</div>
          </div>
          <div className="p-2 rounded bg-amber-100 text-amber-700">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/30 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-emerald-600 uppercase">Healthy Stock</div>
            <div className="text-base font-bold text-emerald-700">{counts.inStock} SKUs</div>
          </div>
          <div className="p-2 rounded bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Inventory Data Table */}
      <DataTable
        columns={columns}
        data={displayedInventory}
        keyField="sku"
        searchable={true}
        searchPlaceholder="Search by SKU, name, category, bay location..."
        searchKeys={['sku', 'name', 'category', 'location']}
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        defaultSortKey="status"
        defaultSortDirection="asc"
        pageSize={10}
        emptyMessage="No inventory items match the selected stock status."
      />
    </div>
  );
}
