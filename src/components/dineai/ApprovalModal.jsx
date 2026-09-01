import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Search, Sparkles, Building2, Calendar, DollarSign, Clock, AlertTriangle, FileText, ArrowRight } from 'lucide-react';

export const ApprovalModal = ({
  data = {},
  onApprove = () => {},
  onReject = () => {},
  onReview = () => {}
}) => {
  const [showFullReview, setShowFullReview] = useState(false);

  const {
    poId = 'PO-1045',
    supplier = 'ABC Components',
    item = 'Industrial Component A (500 units @ ₹1,200/unit)',
    currentStatus = 'OVERDUE (5 days)',
    previousDate = 'Sep 10, 2026',
    newDate = 'Sep 15, 2026',
    value = 600000,
    formattedValue = '₹6,00,000',
    threshold = 100000,
    reason = 'Production delay resolved — shipment ready tomorrow morning',
    confidence = 94,
    source = 'Automated Voice Call Transcript (00:42)'
  } = data;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-burnt-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl bg-burnt-900 border border-burnt-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header Alert Strip */}
        <div className="px-6 py-4 bg-amber-500/10 border-b border-amber-500/30 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                  Human-in-the-Loop Governance
                </span>
                <span className="text-xs text-burnt-300">Policy Limit: ₹1,00,000</span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                AI Recommendation: Update {poId} delivery date to {newDate}
              </h3>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm text-burnt-200">
          <p className="text-xs text-burnt-300">
            Autonomous expediting completed via Voice Agent. Because the purchase order value (<strong className="text-white">{formattedValue}</strong>) exceeds the autonomous threshold of <strong className="text-white">₹1,00,000</strong>, operator confirmation is required before committing to the enterprise ERP.
          </p>

          {/* Key Facts Card */}
          <div className="bg-burnt-950/70 border border-burnt-800 rounded-xl p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-burnt-400 flex items-center gap-1 text-[11px]">
                  <Building2 className="w-3.5 h-3.5 text-burnt-400" /> Supplier
                </span>
                <span className="font-semibold text-white text-sm">{supplier}</span>
              </div>
              <div>
                <span className="text-burnt-400 flex items-center gap-1 text-[11px]">
                  <DollarSign className="w-3.5 h-3.5 text-burnt-400" /> Order Value
                </span>
                <span className="font-semibold text-emerald-400 text-sm font-mono">{formattedValue}</span>
              </div>
            </div>

            <div className="border-t border-burnt-800/80 pt-3 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-burnt-400 flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-burnt-400" /> Previous Due Date
                </span>
                <span className="font-mono text-red-400 line-through">{previousDate}</span>
              </div>
              <div>
                <span className="text-burnt-400 flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" /> New Delivery Commitment
                </span>
                <span className="font-mono font-bold text-emerald-400">{newDate}</span>
              </div>
            </div>

            <div className="border-t border-burnt-800/80 pt-3 flex items-center justify-between text-xs">
              <div>
                <span className="text-burnt-400 block text-[11px]">Identified Reason</span>
                <span className="text-burnt-100 font-medium">{reason}</span>
              </div>
              <div className="text-right">
                <span className="text-burnt-400 block text-[11px]">AI Confidence</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs">
                  <Sparkles className="w-3 h-3 text-emerald-400" /> {confidence}%
                </span>
              </div>
            </div>
          </div>

          {/* Audit & Verification Trace */}
          <div className="p-3 bg-burnt-800/40 border border-burnt-700/50 rounded-xl text-xs space-y-1">
            <div className="text-burnt-400 text-[11px] uppercase tracking-wider font-semibold">Evidence Trace</div>
            <div className="text-burnt-200">
              • Voice Call recording verified with Rajesh Kumar (ABC Components Dispatch Desk).<br />
              • Confirmation receipt email staged to <code className="text-burnt-300">rajesh@abccomponents.in</code>.<br />
              • On approval: ERP record will update to <strong className="text-emerald-400">"Confirmed Sep 15"</strong> and append an immutable event to the Audit Log.
            </div>
          </div>

          {/* Expandable full review view if clicked */}
          {showFullReview && (
            <div className="p-4 bg-burnt-950 border border-burnt-800 rounded-xl text-xs space-y-2 animate-fade-in">
              <div className="font-bold text-white flex items-center justify-between">
                <span>Detailed Purchase Order Breakdown</span>
                <span className="text-burnt-400 font-mono">PO-1045</span>
              </div>
              <div className="text-burnt-300">
                <strong>Line Item:</strong> Industrial Component A (SKU: IND-CMP-A)<br />
                <strong>Quantity:</strong> 500 units @ ₹1,200.00 each<br />
                <strong>Current Stage:</strong> Production (Resolved) → Ready for Shipment Sep 14<br />
                <strong>Expected Arrival:</strong> Sep 15, 2026 (Warehouse Bay 4, Pune)
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-burnt-950 border-t border-burnt-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFullReview(!showFullReview)}
              className="px-3 py-2 bg-burnt-800 hover:bg-burnt-700 text-burnt-200 hover:text-white border border-burnt-700 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{showFullReview ? 'Hide Details' : 'Review Details'}</span>
            </button>
            <button
              onClick={() => onReject({ reason: 'User Rejected' })}
              className="px-3 py-2 bg-transparent hover:bg-red-500/10 text-red-400 hover:text-red-300 border border-transparent hover:border-red-500/30 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onApprove({ decision: 'APPROVE', newDate, reason })}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-emerald-900/40 flex items-center space-x-2 transition-all transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Update ERP</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
