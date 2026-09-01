import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../context/ERPContext';
import { useAgent } from '../context/AgentContext';
import StatusBadge from '../components/shared/StatusBadge';
import { formatINR, formatNumber } from '../utils/formatters';
import {
  Scale,
  Sparkles,
  Star,
  CheckCircle2,
  Clock,
  TrendingDown,
  Zap,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileCheck,
  ChevronDown
} from 'lucide-react';

const RFQ_OPTIONS = [
  { id: 'RFQ-104', label: 'RFQ-104: Industrial Component A (500 units)', count: 3 },
  { id: 'RFQ-101', label: 'RFQ-101: High Precision CNC Shafts 25mm (800 units)', count: 4 },
  { id: 'RFQ-102', label: 'RFQ-102: Stainless Steel Flanges ANSI 150 (300 units)', count: 3 },
  { id: 'RFQ-106', label: 'RFQ-106: High Tensile M16 Fasteners (12,000 units)', count: 3 }
];

export default function Quotations() {
  const navigate = useNavigate();
  const { quotes, rfqs, setActiveContext, updatePOStatus } = useERP();
  const { setIsPanelOpen, addMessage, setActiveWorkflow } = useAgent();

  const [selectedRFQ, setSelectedRFQ] = useState('RFQ-104');
  const [approvedSupplier, setApprovedSupplier] = useState(null);

  // Sync Copilot context
  useEffect(() => {
    setActiveContext({
      pageType: 'Quotations',
      pageData: {
        title: 'Quotation Intelligence & Comparison',
        activeRFQ: selectedRFQ,
        recommendedSupplier: 'ABC Components (Score: 96/100)'
      }
    });
  }, [selectedRFQ, setActiveContext]);

  // Quotation list for active RFQ
  const activeQuotes = useMemo(() => {
    if (quotes[selectedRFQ]) return quotes[selectedRFQ];
    return quotes['RFQ-104'] || [];
  }, [quotes, selectedRFQ]);

  const handleApproveQuote = (quote) => {
    setApprovedSupplier(quote.supplier);
    setIsPanelOpen(true);
    addMessage({
      sender: 'user',
      text: `Approved quote from ${quote.supplier} for ${selectedRFQ}. Unit Price: ${formatINR(quote.unitPrice)}, Total: ${formatINR(quote.total)}. Draft PO created.`
    });
  };

  const handleAskAIQuoteComparison = () => {
    setIsPanelOpen(true);
    addMessage({
      sender: 'user',
      text: `Analyze all received bids for ${selectedRFQ} and explain why ABC Components has the highest reliability index.`
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 tracking-tight font-serif">
              Quotation Intelligence & Comparison
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
              AI Multi-Criteria Scoring Active
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Automated normalization of pricing, lead time variance, freight assumptions, and vendor reliability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* RFQ Selector */}
          <div className="relative">
            <select
              value={selectedRFQ}
              onChange={(e) => setSelectedRFQ(e.target.value)}
              className="px-3 py-1.5 pr-8 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-md text-stone-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              {RFQ_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAskAIQuoteComparison}
            className="px-3.5 py-1.5 rounded-md bg-[#141412] hover:bg-stone-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Bid Analysis</span>
          </button>
        </div>
      </div>

      {/* AI Recommendation Highlight Card */}
      <div className="bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white p-5 rounded-lg border border-blue-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>DINE AI Decision Intelligence</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold">
            Confidence: 96%
          </span>
        </div>

        <p className="text-xs text-stone-700 leading-relaxed font-medium">
          <strong>ABC Components</strong> is recommended for award — offering the optimal balance of total landed cost (<span className="font-bold text-stone-900">₹6,00,000</span>), predictable lead time (<span className="font-bold text-stone-900">10 days</span>), and historic delivery reliability (<span className="font-bold text-emerald-700">98% on-time</span>). Vertex Manufacturing is 2 days faster but costs 5% more (+₹30,000).
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => handleApproveQuote(activeQuotes[0])}
            className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve Recommended (ABC Components)</span>
          </button>

          <button
            onClick={() => {
              setIsPanelOpen(true);
              addMessage({
                sender: 'user',
                text: `Negotiate with Global Industrial Supply to match ABC Components lead time of 10 days at ₹1,120/unit.`
              });
            }}
            className="px-3 py-1.5 rounded-md bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold transition-colors"
          >
            <span>Negotiate Counter-Offer</span>
          </button>
        </div>
      </div>

      {/* Side-by-Side Quotation Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {activeQuotes.map((quote) => {
          const isRecommended = quote.recommended;
          const isApproved = approvedSupplier === quote.supplier;

          return (
            <div
              key={quote.id}
              className={`bg-white rounded-lg border transition-all duration-150 p-5 flex flex-col justify-between space-y-4 shadow-xs ${
                isRecommended
                  ? 'border-blue-500 ring-2 ring-blue-100/80'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-3">
                  {isRecommended ? (
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 border border-blue-300 text-blue-700 text-[11px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-600" />
                      AI RECOMMENDED
                    </span>
                  ) : quote.unitPrice <= 1120 ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[11px] font-bold flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" />
                      LOWEST COST
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      FASTEST TURNAROUND
                    </span>
                  )}

                  <div className="text-xs font-bold text-stone-700">
                    Score: <span className="text-blue-600">{quote.score}/100</span>
                  </div>
                </div>

                {/* Supplier Name & Rating */}
                <div>
                  <h3 className="font-bold text-base text-stone-900 font-serif">
                    {quote.supplier}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-0.5">
                    <div className="flex">
                      {[...Array(quote.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-stone-500 font-normal">({quote.rating}.0 / 5.0)</span>
                  </div>
                </div>

                {/* Pricing & Commercial Terms */}
                <div className="mt-4 pt-3 border-t border-stone-100 space-y-2.5 text-xs">
                  <div className="flex items-baseline justify-between">
                    <span className="text-stone-500">Unit Price:</span>
                    <span className="text-sm font-bold text-stone-900">{formatINR(quote.unitPrice)} / unit</span>
                  </div>

                  <div className="flex items-baseline justify-between">
                    <span className="text-stone-500">Total Landed Value:</span>
                    <span className="text-base font-bold text-blue-600">{formatINR(quote.total)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Lead Time:</span>
                    <span className="font-semibold text-stone-900">{quote.leadTime}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">On-Time Reliability:</span>
                    <span className="font-semibold text-emerald-600">{quote.onTimeRate}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Payment Terms:</span>
                    <span className="font-semibold text-stone-700">{quote.paymentTerms}</span>
                  </div>
                </div>

                {/* Quote Highlights */}
                <div className="mt-4 p-2.5 bg-stone-50 rounded border border-stone-200 text-[11px] text-stone-600 italic">
                  "{quote.highlight}"
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-stone-100">
                {isApproved ? (
                  <div className="w-full py-2 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-md text-xs font-bold text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Quote Approved & PO Created</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApproveQuote(quote)}
                    className={`w-full py-2 rounded-md text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                      isRecommended
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                        : 'bg-stone-900 hover:bg-stone-800 text-white'
                    }`}
                  >
                    <span>Award Quote & Issue PO</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Commercial Comparison Matrix Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Multi-Vendor Commercial Matrix ({selectedRFQ})
          </h3>
          <span className="text-xs text-stone-500">Standardized 500 PCS Comparison</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase font-semibold text-[11px]">
              <tr>
                <th className="px-4 py-2.5">Evaluation Parameter</th>
                {activeQuotes.map(q => (
                  <th key={q.id} className="px-4 py-2.5 font-bold text-stone-900">
                    {q.supplier} {q.recommended && '(AI Pick)'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              <tr>
                <td className="px-4 py-3 font-semibold text-stone-600">Unit Price</td>
                {activeQuotes.map(q => (
                  <td key={q.id} className="px-4 py-3 font-bold text-stone-900">{formatINR(q.unitPrice)}</td>
                ))}
              </tr>
              <tr className="bg-stone-50/50">
                <td className="px-4 py-3 font-semibold text-stone-600">Total Purchase Value</td>
                {activeQuotes.map(q => (
                  <td key={q.id} className="px-4 py-3 font-bold text-blue-600">{formatINR(q.total)}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-stone-600">Production Lead Time</td>
                {activeQuotes.map(q => (
                  <td key={q.id} className="px-4 py-3 font-semibold text-stone-800">{q.leadTime}</td>
                ))}
              </tr>
              <tr className="bg-stone-50/50">
                <td className="px-4 py-3 font-semibold text-stone-600">Historical On-Time Rate</td>
                {activeQuotes.map(q => (
                  <td key={q.id} className="px-4 py-3 font-bold text-emerald-600">{q.onTimeRate}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-stone-600">Commercial Payment Terms</td>
                {activeQuotes.map(q => (
                  <td key={q.id} className="px-4 py-3 font-medium text-stone-700">{q.paymentTerms}</td>
                ))}
              </tr>
              <tr className="bg-stone-50/50">
                <td className="px-4 py-3 font-semibold text-stone-600">Overall AI Composite Score</td>
                {activeQuotes.map(q => (
                  <td key={q.id} className="px-4 py-3 font-bold text-stone-900">
                    <span className={`px-2 py-0.5 rounded-full ${q.recommended ? 'bg-blue-100 text-blue-800 font-bold' : 'bg-stone-100 text-stone-700'}`}>
                      {q.score} / 100
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
