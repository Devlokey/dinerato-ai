import React, { useState } from 'react';
import { CheckCircle2, Sparkles, Star, TrendingUp, Clock, DollarSign, ShieldCheck, ArrowRight, ExternalLink, RefreshCw } from 'lucide-react';

export const QuoteComparison = ({
  data = {},
  onApprove = () => {},
  onReviewAll = () => {},
  onRequestMore = () => {}
}) => {
  const [selectedSupplier, setSelectedSupplier] = useState('ABC Components');

  const quotes = data.quotes || [
    {
      supplier: 'ABC Components',
      unitPrice: 1200,
      totalValue: 600000,
      leadTime: '10 days',
      onTimeRate: 98,
      paymentTerms: 'Net 30',
      rating: 5,
      score: 96,
      tag: 'Recommended',
      isRecommended: true,
      notes: 'Optimal balance of cost, lead time, and reliability.'
    },
    {
      supplier: 'Global Industrial Supply',
      unitPrice: 1120,
      totalValue: 560000,
      leadTime: '18 days',
      onTimeRate: 91,
      paymentTerms: 'Net 45',
      rating: 4,
      score: 88,
      tag: 'Lowest Cost',
      isRecommended: false,
      notes: 'Cheapest option (-₹40k), but longer 18-day lead time risk.'
    },
    {
      supplier: 'Vertex Manufacturing',
      unitPrice: 1260,
      totalValue: 630000,
      leadTime: '8 days',
      onTimeRate: 99,
      paymentTerms: 'Net 30',
      rating: 5,
      score: 91,
      tag: 'Fastest Delivery',
      isRecommended: false,
      notes: 'Fastest delivery (8 days) with a 5% price premium.'
    }
  ];

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="w-full bg-burnt-900 border border-burnt-700/80 rounded-2xl shadow-xl overflow-hidden my-3">
      {/* Header */}
      <div className="px-5 py-3.5 bg-burnt-950 border-b border-burnt-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              RFQ-104 Quotation Intelligence Matrix
            </h4>
            <p className="text-[11px] text-burnt-300">
              500 units • Industrial Component A • 3 Quotes Analyzed
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-900/40 text-blue-300 border border-blue-700/40">
          Scored by AI
        </span>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-burnt-950/60 border-b border-burnt-800 text-[11px] font-semibold text-burnt-300">
              <th className="py-2.5 px-3">Supplier</th>
              <th className="py-2.5 px-3">Unit Price</th>
              <th className="py-2.5 px-3">Total (500u)</th>
              <th className="py-2.5 px-3">Lead Time</th>
              <th className="py-2.5 px-3">On-Time %</th>
              <th className="py-2.5 px-3">Terms</th>
              <th className="py-2.5 px-3">Rating</th>
              <th className="py-2.5 px-3 text-right">AI Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-burnt-800/60">
            {quotes.map((q, idx) => {
              const isSelected = selectedSupplier === q.supplier;
              return (
                <tr
                  key={idx}
                  onClick={() => setSelectedSupplier(q.supplier)}
                  className={`cursor-pointer transition-colors ${
                    q.isRecommended
                      ? 'bg-blue-950/20 hover:bg-blue-950/40'
                      : isSelected
                      ? 'bg-burnt-800/50 hover:bg-burnt-800/70'
                      : 'hover:bg-burnt-800/30'
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white flex items-center space-x-1.5">
                      <span>{q.supplier}</span>
                      {q.isRecommended && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          ★ Recommended
                        </span>
                      )}
                      {q.tag && !q.isRecommended && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-burnt-800 text-burnt-300 border border-burnt-700">
                          {q.tag}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono font-medium text-burnt-200">
                    {formatINR(q.unitPrice)}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-white">
                    {formatINR(q.totalValue)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 font-medium text-burnt-200">
                      <Clock className="w-3 h-3 text-burnt-400" />
                      {q.leadTime}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`font-semibold ${q.onTimeRate >= 95 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {q.onTimeRate}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-burnt-300 font-mono text-[11px]">
                    {q.paymentTerms}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: q.rating }).map((_, rIdx) => (
                        <Star key={rIdx} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold font-mono ${
                      q.isRecommended
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-burnt-800 text-burnt-200 border border-burnt-700'
                    }`}>
                      {q.score}/100
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* AI Recommendation Card */}
      <div className="p-4 bg-burnt-950/80 border-t border-burnt-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1 max-w-lg">
          <div className="flex items-center space-x-1.5 text-blue-400 font-bold text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Executive Recommendation</span>
          </div>
          <p className="text-burnt-200 leading-relaxed">
            <strong className="text-white">ABC Components</strong> recommended — best balance of cost (<strong className="text-emerald-400">₹1,200/unit</strong>), lead time (<strong className="text-white">10 days</strong>), and delivery reliability (<strong className="text-emerald-400">98%</strong>). Vertex is faster (8 days) but costs 5% more.
          </p>
        </div>

        {/* Quick Selection Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => onApprove({ supplier: 'ABC Components', quote: quotes[0] })}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-emerald-900/30 flex items-center space-x-1.5 transition-all transform active:scale-95"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve ABC Components</span>
          </button>
          <button
            onClick={onReviewAll}
            className="px-3 py-2 bg-burnt-800 hover:bg-burnt-700 text-burnt-200 hover:text-white border border-burnt-700 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <span>Review All</span>
          </button>
          <button
            onClick={onRequestMore}
            className="px-2.5 py-2 bg-burnt-800 hover:bg-burnt-700 text-burnt-300 hover:text-white border border-burnt-700 text-xs rounded-lg transition-colors"
            title="Request More Quotes from Shortlist"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteComparison;
