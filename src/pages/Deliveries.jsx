import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../context/ERPContext';
import { useAgent } from '../context/AgentContext';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import { formatDate } from '../utils/formatters';
import {
  Truck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Sparkles,
  MapPin,
  ExternalLink,
  PhoneCall,
  Search,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function Deliveries() {
  const navigate = useNavigate();
  const { deliveries, setActiveContext } = useERP();
  const { setIsPanelOpen, addMessage, setActiveWorkflow } = useAgent();

  const [activeFilter, setActiveFilter] = useState('ALL');

  // Sync Copilot Context
  useEffect(() => {
    setActiveContext({
      pageType: 'Deliveries',
      pageData: {
        title: 'Inbound Logistics & Shipment Telemetry',
        totalDeliveries: deliveries.length,
        delayedCount: deliveries.filter(d => d.status === 'Delayed').length,
        inTransitCount: deliveries.filter(d => d.status === 'In Transit').length
      }
    });
  }, [deliveries, setActiveContext]);

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: deliveries.length,
      delayed: deliveries.filter(d => d.status === 'Delayed').length,
      inTransit: deliveries.filter(d => d.status === 'In Transit').length,
      delivered: deliveries.filter(d => d.status === 'Delivered').length
    };
  }, [deliveries]);

  const filters = [
    { id: 'ALL', label: 'All Inbound Shipments', count: counts.all },
    { id: 'Delayed', label: 'Delayed / Flagged', count: counts.delayed },
    { id: 'In Transit', label: 'In Transit', count: counts.inTransit },
    { id: 'Delivered', label: 'Delivered', count: counts.delivered }
  ];

  // Filtered deliveries
  const displayedDeliveries = useMemo(() => {
    if (activeFilter === 'ALL') return deliveries;
    return deliveries.filter(d => d.status === activeFilter);
  }, [deliveries, activeFilter]);

  const handleExpediteShipment = (del) => {
    setIsPanelOpen(true);
    if (del.poNumber === 'PO-1045') {
      setActiveWorkflow('CHASE_OVERDUE');
      addMessage({
        sender: 'user',
        text: `Expedite delivery ${del.id} for ${del.poNumber} (${del.supplier}) with carrier ${del.carrier}.`
      });
    } else {
      addMessage({
        sender: 'user',
        text: `Check live tracking for ${del.carrier} tracking #${del.trackingNumber} for ${del.poNumber}.`
      });
    }
  };

  const columns = [
    {
      key: 'id',
      label: 'Delivery ID',
      width: '110px',
      render: (val, row) => (
        <div>
          <span className="font-bold text-stone-900">{val}</span>
          <div className="text-[11px] text-blue-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate(`/erp/purchase-orders/${row.poNumber}`)}>
            {row.poNumber}
          </div>
        </div>
      )
    },
    {
      key: 'supplier',
      label: 'Supplier & Origin',
      width: '180px',
      render: (val, row) => (
        <div>
          <div className="font-bold text-stone-900 truncate">{val}</div>
          <div className="text-[11px] text-stone-500 truncate">{row.items}</div>
        </div>
      )
    },
    {
      key: 'carrier',
      label: 'Carrier & Tracking',
      width: '190px',
      render: (val, row) => (
        <div>
          <div className="font-semibold text-stone-800 flex items-center gap-1">
            <Truck className="w-3 h-3 text-stone-400" />
            <span>{val}</span>
          </div>
          <div className="text-[11px] text-stone-500 font-mono mt-0.5">{row.trackingNumber}</div>
        </div>
      )
    },
    {
      key: 'destinationWarehouse',
      label: 'Destination Hub',
      width: '160px',
      render: (val) => (
        <div className="flex items-center gap-1 text-stone-700">
          <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
          <span className="truncate">{val}</span>
        </div>
      )
    },
    {
      key: 'eta',
      label: 'ETA',
      width: '120px',
      render: (val, row) => (
        <div>
          <div className={`font-semibold ${row.status === 'Delayed' ? 'text-red-700 font-bold' : 'text-stone-900'}`}>
            {formatDate(val)}
          </div>
          {row.status === 'Delayed' && (
            <span className="text-[10px] text-red-600 font-bold">Delay Flagged</span>
          )}
        </div>
      )
    },
    {
      key: 'progress',
      label: 'Fulfillment Transit Progress',
      width: '180px',
      render: (val, row) => (
        <div className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="font-semibold text-stone-700">{val}%</span>
            <span className="text-stone-400">{row.status}</span>
          </div>
          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                row.status === 'Delayed' ? 'bg-red-500' : 'bg-blue-600'
              }`}
              style={{ width: `${val}%` }}
            />
          </div>
          {row.delayReason && (
            <div className="text-[10px] text-red-600 italic truncate max-w-[170px]" title={row.delayReason}>
              {row.delayReason}
            </div>
          )}
        </div>
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
      width: '110px',
      sortable: false,
      align: 'center',
      render: (_, row) => (
        <button
          onClick={() => handleExpediteShipment(row)}
          className="px-2.5 py-1 rounded bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Expedite</span>
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight font-serif">
            Inbound Logistics & Deliveries
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time multi-carrier shipment telemetry across Blue Dart, VRL Logistics, DTDC, and Safechem Freight.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsPanelOpen(true);
              setActiveWorkflow('CHASE_OVERDUE');
              addMessage({
                sender: 'user',
                text: 'Expedite all delayed inbound carrier shipments.'
              });
            }}
            className="px-3.5 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Expedite Delayed ({counts.delayed})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-stone-500 uppercase">Active In Transit</div>
            <div className="text-base font-bold text-stone-900">{counts.inTransit} Shipments</div>
          </div>
          <div className="p-2 rounded bg-blue-100 text-blue-700">
            <Truck className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-red-200 bg-red-50/30 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-red-600 uppercase">Flagged Bottlenecks</div>
            <div className="text-base font-bold text-red-700">{counts.delayed} Delayed</div>
          </div>
          <div className="p-2 rounded bg-red-100 text-red-700">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-emerald-200 bg-emerald-50/30 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-emerald-600 uppercase">On-Time Transit Rate</div>
            <div className="text-base font-bold text-emerald-700">88.5%</div>
          </div>
          <div className="p-2 rounded bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-stone-500 uppercase">Avg Transit Duration</div>
            <div className="text-base font-bold text-stone-900">4.2 Days</div>
          </div>
          <div className="p-2 rounded bg-stone-100 text-stone-700">
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Deliveries Data Table */}
      <DataTable
        columns={columns}
        data={displayedDeliveries}
        keyField="id"
        searchable={true}
        searchPlaceholder="Search by delivery ID, carrier, tracking number, supplier..."
        searchKeys={['id', 'poNumber', 'supplier', 'carrier', 'trackingNumber', 'destinationWarehouse']}
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        defaultSortKey="id"
        defaultSortDirection="asc"
        pageSize={10}
        emptyMessage="No shipments match the selected status."
      />
    </div>
  );
}
