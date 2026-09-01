import React, { useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useERP } from '../context/ERPContext';
import { useAgent } from '../context/AgentContext';
import StatusBadge from '../components/shared/StatusBadge';
import { formatINR, formatNumber, formatDate } from '../utils/formatters';
import {
  ArrowLeft,
  PhoneCall,
  Mail,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  Building2,
  User,
  MapPin,
  Calendar,
  FileText,
  ShieldAlert,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

export default function PODetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { pos, suppliers, getPOById, getSupplierById, setActiveContext } = useERP();
  const { setIsPanelOpen, addMessage, setActiveWorkflow } = useAgent();

  // Find PO by ID, fallback to PO-1045 if not found
  const po = useMemo(() => {
    const found = getPOById(id);
    if (found) return found;
    return getPOById('PO-1045') || pos[0];
  }, [id, pos, getPOById]);

  // Find supplier info
  const supplierInfo = useMemo(() => {
    if (!po) return null;
    return getSupplierById(po.supplier) || getSupplierById(po.supplierId) || suppliers[0];
  }, [po, suppliers, getSupplierById]);

  // Sync active Copilot context on PO view
  useEffect(() => {
    if (po) {
      setActiveContext({
        pageType: 'PO Detail',
        pageData: {
          poNumber: po.poNumber,
          supplier: po.supplier,
          product: po.product,
          value: po.value,
          status: po.status,
          overdueDays: po.overdueDays,
          promisedDelivery: po.promisedDelivery,
          notes: po.notes
        }
      });
    }
  }, [po, setActiveContext]);

  if (!po) {
    return (
      <div className="p-8 text-center bg-white rounded-lg border border-stone-200">
        <h2 className="text-lg font-bold text-stone-900">Purchase Order Not Found</h2>
        <p className="text-xs text-stone-500 mt-1">The requested PO could not be retrieved from the ERP registry.</p>
        <Link to="/erp/purchase-orders" className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Purchase Orders</span>
        </Link>
      </div>
    );
  }

  const handleChaseSupplier = () => {
    setIsPanelOpen(true);
    setActiveWorkflow('CHASE_OVERDUE');
    addMessage({
      sender: 'user',
      text: `Expedite ${po.poNumber} with ${po.supplier}. Check delivery timeline and place automated phone call.`
    });
  };

  const handleAskDineAI = (promptText) => {
    setIsPanelOpen(true);
    addMessage({
      sender: 'user',
      text: promptText || `Why is ${po.poNumber} delayed and what are our alternative options?`
    });
  };

  // 5-Stage Interactive Timeline
  const stages = po.stages || [
    { name: 'Order Created', status: 'completed', date: formatDate(po.orderDate) },
    { name: 'Supplier Confirmed', status: 'completed', date: 'Sep 2, 2026' },
    { name: 'Production', status: po.status === 'OVERDUE' ? 'delayed' : 'completed', date: po.status === 'OVERDUE' ? 'Sep 8 (Delayed: Bottleneck)' : 'Completed' },
    { name: 'Shipment', status: po.status === 'DELIVERED' ? 'completed' : 'pending', date: po.status === 'DELIVERED' ? 'Completed' : 'Est. Sep 14, 2026' },
    { name: 'Delivery', status: po.status === 'DELIVERED' ? 'completed' : 'pending', date: po.promisedDelivery || po.dueDate }
  ];

  const lineItems = po.lineItems || [
    {
      itemNumber: 1,
      sku: po.sku || 'IND-CMP-001',
      description: `${po.product} - High Precision Component Specifications`,
      quantity: po.quantity || 500,
      unit: 'PCS',
      unitPrice: po.unitPrice || 1200,
      total: po.value || 600000,
      taxRate: '18% GST',
      taxAmount: Math.round((po.value || 600000) * 0.18)
    }
  ];

  const subtotal = lineItems.reduce((acc, item) => acc + item.total, 0);
  const gstTotal = lineItems.reduce((acc, item) => acc + item.taxAmount, 0);
  const grandTotal = subtotal + gstTotal;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <button
              onClick={() => navigate('/erp/purchase-orders')}
              className="hover:text-stone-900 flex items-center gap-1 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Purchase Orders</span>
            </button>
            <span>/</span>
            <span className="font-bold text-stone-900">{po.poNumber}</span>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight font-serif">
              {po.poNumber}
            </h1>
            <StatusBadge status={po.status} size="lg" />
            {po.riskLevel === 'HIGH' && (
              <span className="px-2 py-0.5 rounded-full bg-red-100 border border-red-300 text-red-700 text-xs font-bold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                HIGH RISK
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleAskDineAI(`Show full risk analysis and alternative suppliers for ${po.poNumber}`)}
            className="px-3.5 py-2 rounded-xl bg-[#0F1622] hover:bg-[#151F2E] text-stone-200 hover:text-white text-xs font-semibold flex items-center gap-2 transition-all border border-[#1E293B] shadow-xs"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 text-amber-400"
              fill="currentColor"
            >
              <path d="M12 1.5 C12 7.3 7.3 12 1.5 12 C7.3 12 12 16.7 12 22.5 C12 16.7 16.7 12 22.5 12 C16.7 12 12 7.3 12 1.5 Z" />
            </svg>
            <span>Ask DINE AI</span>
          </button>

          {po.status === 'OVERDUE' && (
            <button
              onClick={handleChaseSupplier}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-950/30 flex items-center gap-2 transition-all active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Chase Supplier with DINE AI</span>
            </button>
          )}
        </div>
      </div>

      {/* Overdue Alert Banner (If Overdue) */}
      {po.status === 'OVERDUE' && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-red-100 text-red-700 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-red-900">
                Delivery Overdue by {po.overdueDays || 5} Days (Reference Date: Sep 13, 2026)
              </div>
              <div className="text-xs text-red-700 mt-0.5">
                Promised Delivery was <strong>{formatDate(po.promisedDelivery || po.dueDate)}</strong>. {po.notes || 'Vendor production delay reported.'}
              </div>
            </div>
          </div>

          <button
            onClick={handleChaseSupplier}
            className="px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold whitespace-nowrap self-start sm:self-auto"
          >
            Launch Voice Call
          </button>
        </div>
      )}

      {/* 5-Stage Interactive Delivery Timeline */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Truck className="w-4 h-4 text-stone-600" />
            <span>Fulfillment & Delivery Timeline</span>
          </h2>
          <span className="text-xs text-stone-500 font-mono">Reference Date: Sep 13, 2026</span>
        </div>

        {/* Timeline visualization track */}
        <div className="relative pt-2 pb-4">
          <div className="grid grid-cols-5 gap-2 relative">
            {/* Connecting bar */}
            <div className="absolute top-4 left-[10%] right-[10%] h-1 bg-stone-200 -z-0" />

            {stages.map((stage, idx) => {
              const isCompleted = stage.status === 'completed';
              const isDelayed = stage.status === 'delayed';
              const isPending = stage.status === 'pending';

              return (
                <div key={stage.name} className="flex flex-col items-center text-center relative z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs'
                        : isDelayed
                        ? 'bg-red-500 border-red-600 text-white ring-4 ring-red-100 animate-pulse'
                        : 'bg-white border-stone-300 text-stone-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : isDelayed ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-bold">{idx + 1}</span>
                    )}
                  </div>

                  <div className="mt-2 text-xs font-bold text-stone-900">
                    {stage.name}
                  </div>

                  <div className={`text-[11px] mt-0.5 ${
                    isDelayed ? 'text-red-600 font-semibold' : 'text-stone-500'
                  }`}>
                    {stage.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Details Grid: Left PO Specs & Line Items, Right Supplier Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Order Details & Line Items Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary Cards */}
          <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <FileText className="w-4 h-4 text-stone-600" />
              <span>Purchase Order Specifications</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1 border-t border-stone-100">
              <div>
                <span className="text-[11px] font-semibold uppercase text-stone-400">Order Date</span>
                <p className="text-xs font-bold text-stone-800 mt-0.5">{formatDate(po.orderDate)}</p>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase text-stone-400">Promised Delivery</span>
                <p className="text-xs font-bold text-stone-800 mt-0.5">{formatDate(po.promisedDelivery || po.dueDate)}</p>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase text-stone-400">Category</span>
                <p className="text-xs font-bold text-stone-800 mt-0.5">{po.category || 'Industrial'}</p>
              </div>

              <div>
                <span className="text-[11px] font-semibold uppercase text-stone-400">Destination Hub</span>
                <p className="text-xs font-bold text-stone-800 mt-0.5">{po.destinationWarehouse || 'Pune Central Hub'}</p>
              </div>
            </div>

            <div className="bg-stone-50 p-3 rounded-md border border-stone-200 text-xs text-stone-700">
              <span className="font-bold text-stone-900">Procurement Notes: </span>
              {po.notes || 'Standard purchase requisition contract with quality inspection telemetry.'}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Line Items Breakdown (1 Item)
              </h3>
              <span className="text-xs font-semibold text-stone-500">Currency: INR (₹)</span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                <tr>
                  <th className="px-4 py-2.5">#</th>
                  <th className="px-4 py-2.5">SKU / Description</th>
                  <th className="px-4 py-2.5 text-right">Quantity</th>
                  <th className="px-4 py-2.5 text-right">Unit Price</th>
                  <th className="px-4 py-2.5 text-right">Tax (GST)</th>
                  <th className="px-4 py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {lineItems.map((item, idx) => (
                  <tr key={item.sku || idx} className="hover:bg-stone-50/60">
                    <td className="px-4 py-3 font-semibold text-stone-500">{item.itemNumber || idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-stone-900">{item.description}</div>
                      <div className="text-[11px] text-stone-400 font-mono mt-0.5">{item.sku}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-stone-800">
                      {formatNumber(item.quantity)} {item.unit || 'PCS'}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-stone-900">
                      {formatINR(item.unitPrice)}
                    </td>
                    <td className="px-4 py-3 text-right text-stone-600">
                      <div>{formatINR(item.taxAmount)}</div>
                      <div className="text-[10px] text-stone-400">{item.taxRate}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-stone-900">
                      {formatINR(item.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Financial Totals Calculation Box */}
            <div className="p-4 bg-stone-50/70 border-t border-stone-200 flex justify-end">
              <div className="w-full sm:w-64 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-stone-900">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>GST (18%):</span>
                  <span className="font-semibold text-stone-900">{formatINR(gstTotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Grand Total:</span>
                  <span className="text-blue-600">{formatINR(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Supplier Card & DINE AI Action Center */}
        <div className="space-y-6">
          {/* Supplier Card */}
          <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Supplier Profile
              </h3>
              <button
                onClick={() => navigate('/erp/suppliers')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <span>Directory</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div>
              <h4 className="text-base font-bold text-stone-900 font-serif">
                {supplierInfo?.name || po.supplier}
              </h4>
              <p className="text-xs text-stone-500 mt-0.5">
                {supplierInfo?.category || 'Industrial Components'}
              </p>
            </div>

            <div className="space-y-2 text-xs border-t border-stone-100 pt-3">
              <div className="flex items-center gap-2 text-stone-700">
                <User className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>Contact: <strong>{supplierInfo?.contactPerson || 'Rajesh Kumar (Dispatch Head)'}</strong></span>
              </div>

              <div className="flex items-center gap-2 text-stone-700">
                <PhoneCall className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{supplierInfo?.phone || '+91 98230 45112'}</span>
              </div>

              <div className="flex items-center gap-2 text-stone-700">
                <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate">{supplierInfo?.email || 'rajesh@abccomponents.in'}</span>
              </div>

              <div className="flex items-center gap-2 text-stone-700">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate">{supplierInfo?.address || 'Plot 42, Bhosari Industrial Area, Pune 411026'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-stone-100 text-center">
              <div className="p-2 bg-stone-50 rounded border border-stone-200">
                <div className="text-[10px] uppercase font-semibold text-stone-400">Rating</div>
                <div className="text-sm font-bold text-amber-600 mt-0.5">
                  ★ {supplierInfo?.rating || 4.8} / 5.0
                </div>
              </div>

              <div className="p-2 bg-stone-50 rounded border border-stone-200">
                <div className="text-[10px] uppercase font-semibold text-stone-400">On-Time Rate</div>
                <div className="text-sm font-bold text-emerald-600 mt-0.5">
                  {supplierInfo?.onTimeRate || 98}%
                </div>
              </div>
            </div>
          </div>

          {/* DINE AI Quick Context Action Card */}
          <div className="bg-[#141412] text-stone-100 p-5 rounded-lg shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white font-serif">
                DINE AI Assistant
              </h3>
            </div>

            <p className="text-xs text-stone-300">
              Autonomous agents can inspect telemetry, call vendor dispatch, or negotiate delivery extensions.
            </p>

            <div className="space-y-1.5 pt-1">
              <button
                onClick={() => handleAskDineAI(`Why is ${po.poNumber} delayed?`)}
                className="w-full text-left p-2 rounded bg-stone-900 hover:bg-stone-800 text-xs text-stone-200 border border-stone-800 transition-colors flex items-center justify-between"
              >
                <span>Why is this delayed?</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
              </button>

              <button
                onClick={() => handleChaseSupplier()}
                className="w-full text-left p-2 rounded bg-stone-900 hover:bg-stone-800 text-xs text-red-300 border border-stone-800 transition-colors flex items-center justify-between"
              >
                <span>Call supplier regarding delivery</span>
                <PhoneCall className="w-3.5 h-3.5 text-red-400" />
              </button>

              <button
                onClick={() => handleAskDineAI(`Find alternative suppliers who can deliver ${po.product} within 5 days.`)}
                className="w-full text-left p-2 rounded bg-stone-900 hover:bg-stone-800 text-xs text-stone-200 border border-stone-800 transition-colors flex items-center justify-between"
              >
                <span>Find alternative suppliers</span>
                <ChevronRight className="w-3.5 h-3.5 text-stone-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
