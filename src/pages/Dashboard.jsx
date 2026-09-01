import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useERP } from '../context/ERPContext';
import { useAgent } from '../context/AgentContext';
import MetricCard from '../components/shared/MetricCard';
import StatusBadge from '../components/shared/StatusBadge';
import { formatINR, formatNumber } from '../utils/formatters';
import {
  ShoppingCart,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Bot,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  FileSpreadsheet,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  Flame
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const MONTHLY_TREND_DATA = [
  { month: 'Apr 2026', totalPOs: 88, onTime: 82, delayed: 6, spendLakhs: 42.5 },
  { month: 'May 2026', totalPOs: 104, onTime: 96, delayed: 8, spendLakhs: 51.2 },
  { month: 'Jun 2026', totalPOs: 112, onTime: 105, delayed: 7, spendLakhs: 58.0 },
  { month: 'Jul 2026', totalPOs: 119, onTime: 110, delayed: 9, spendLakhs: 64.8 },
  { month: 'Aug 2026', totalPOs: 125, onTime: 118, delayed: 7, spendLakhs: 71.3 },
  { month: 'Sep 2026 (MTD)', totalPOs: 128, onTime: 117, delayed: 11, spendLakhs: 78.4 }
];

const CATEGORY_SPEND_DATA = [
  { name: 'Precision Engineering', value: 8900000, color: '#2563EB' },
  { name: 'Heavy Machinery & Parts', value: 7200000, color: '#3B82F6' },
  { name: 'Industrial Components', value: 4850000, color: '#C25E00' },
  { name: 'Raw Metals & Alloys', value: 3400000, color: '#F59E0B' },
  { name: 'Electrical & Plastics', value: 2100000, color: '#10B981' },
  { name: 'Fasteners & Hardware', value: 1950000, color: '#6366F1' },
  { name: 'Other Categories', value: 5700000, color: '#94A3B8' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { pos, rfqs, suppliers, kpis, setActiveContext } = useERP();
  const { setIsPanelOpen, addMessage, setActiveWorkflow } = useAgent();

  // Set Copilot active context on page mount
  useEffect(() => {
    setActiveContext({
      pageType: 'Dashboard',
      pageData: {
        title: 'Executive Procurement Overview',
        openPOs: kpis.openPOs || 128,
        overduePOs: pos.filter(p => p.status === 'OVERDUE').length,
        atRiskPOs: kpis.atRiskPOs || 7,
        pendingRFQs: kpis.pendingRFQs || 24,
        hoursSaved: kpis.estimatedHoursSaved || 126
      }
    });
  }, [setActiveContext, kpis, pos]);

  const overduePOs = pos.filter(p => p.status === 'OVERDUE');
  const atRiskPOs = pos.filter(p => p.status === 'AT RISK' || p.riskLevel === 'MEDIUM');

  const handleQuickAction = (actionType) => {
    setIsPanelOpen(true);
    if (actionType === 'CHASE_OVERDUE') {
      addMessage({
        sender: 'user',
        text: 'Chase overdue purchase orders and resolve shipment delays.'
      });
      setActiveWorkflow('CHASE_OVERDUE');
    } else if (actionType === 'SOURCE_RFQ') {
      addMessage({
        sender: 'user',
        text: 'Find suppliers for 500 units of Industrial Component A and issue RFQ.'
      });
      setActiveWorkflow('SOURCE_RFQ');
    } else if (actionType === 'ANOMALY_SCAN') {
      addMessage({
        sender: 'user',
        text: 'Scan the ERP database for supplier delivery risk anomalies.'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Executive Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 tracking-tight font-serif">
              Procurement Operations Dashboard
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
              ● All Systems Operational
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real-time telemetry across 128 Open Purchase Orders, 25 Suppliers, and 7 Autonomous AI Agents.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsPanelOpen(true);
              addMessage({
                sender: 'user',
                text: 'Triage pending supplier emails with SwipeMail.'
              });
            }}
            className="px-3 py-1.5 rounded-md bg-[#0A0E17] hover:bg-[#151F2E] text-stone-200 border border-[#1E293B] text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            title="Open DINE AI Supplier Email Triage"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Inbox (5)</span>
          </button>

          <button
            onClick={() => handleQuickAction('CHASE_OVERDUE')}
            className="px-3 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Chase Overdue POs ({overduePOs.length})</span>
          </button>

          <button
            onClick={() => {
              setIsPanelOpen(true);
              addMessage({
                sender: 'user',
                text: 'What needs my attention in procurement today?'
              });
            }}
            className="px-3 py-1.5 rounded-md bg-[#141412] hover:bg-stone-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Ask DINE AI</span>
          </button>
        </div>
      </div>

      {/* 7 Key Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <MetricCard
          title="Open POs"
          value={kpis.openPOs || 128}
          subtext="₹3.42 Cr active commitments"
          icon={ShoppingCart}
          trend="+12%"
          trendDirection="success"
          onClick={() => navigate('/erp/purchase-orders')}
        />
        <MetricCard
          title="Pending RFQs"
          value={kpis.pendingRFQs || 24}
          subtext="6 closing this week"
          icon={Send}
          trend="24 Active"
          trendDirection="info"
          onClick={() => navigate('/erp/rfqs')}
        />
        <MetricCard
          title="Supplier Bids"
          value={kpis.supplierResponses || 17}
          subtext="71% response rate"
          icon={CheckCircle2}
          trend="+3 New"
          trendDirection="success"
          onClick={() => navigate('/erp/quotations')}
        />
        <MetricCard
          title="At-Risk POs"
          value={kpis.atRiskPOs || 7}
          subtext="Early bottleneck warnings"
          icon={AlertTriangle}
          trend="7 Flagged"
          trendDirection="warning"
          variant="warning"
          onClick={() => navigate('/erp/purchase-orders')}
        />
        <MetricCard
          title="Overdue POs"
          value={overduePOs.length || 4}
          subtext="PO-1045 (5d delay)"
          icon={Clock}
          trend="4 High Risk"
          trendDirection="alert"
          variant="danger"
          onClick={() => navigate('/erp/purchase-orders/PO-1045')}
        />
        <MetricCard
          title="AI Tasks"
          value={kpis.activeAITasks || 13}
          subtext="7 autonomous agents"
          icon={Bot}
          trend="4 Running"
          trendDirection="info"
          variant="info"
          onClick={() => setIsPanelOpen(true)}
        />
        <MetricCard
          title="Hours Saved"
          value={`${kpis.estimatedHoursSaved || 126}h`}
          subtext="₹3.8L cost avoided"
          icon={Sparkles}
          trend="+18h this wk"
          trendDirection="success"
          variant="success"
          onClick={() => navigate('/erp/reports')}
        />
      </div>

      {/* Recharts Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PO Volume & Spend Activity Trend (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-stone-900 tracking-tight">
                PO Volume & Delivery Trend
              </h2>
              <p className="text-xs text-stone-500">
                Monthly commitment volume vs on-time delivery performance (Last 6 Months)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <TrendingUp className="w-3 h-3" />
                91.4% Avg On-Time
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip
                  formatter={(val, name) => [
                    name === 'spendLakhs' ? `₹${val} Lakhs` : `${val} POs`,
                    name === 'onTime' ? 'On-Time Deliveries' : name === 'delayed' ? 'Delayed POs' : 'Total Orders'
                  ]}
                  contentStyle={{ backgroundColor: '#141412', color: '#FFF', borderRadius: '6px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="onTime" name="On-Time Orders" fill="#10B981" radius={[4, 4, 0, 0]} barSize={18} />
                <Bar dataKey="delayed" name="Delayed / At Risk" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Spend Breakdown (1 col) */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-stone-900 tracking-tight">
                Spend by Category
              </h2>
              <span className="text-xs font-semibold text-stone-500">₹3.42 Cr Total</span>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Distribution across active industrial procurement segments
            </p>

            <div className="h-[180px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_SPEND_DATA}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {CATEGORY_SPEND_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => [formatINR(val), 'Total Spend']}
                    contentStyle={{ backgroundColor: '#141412', color: '#FFF', borderRadius: '6px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] uppercase font-semibold text-stone-400">Total Spend</span>
                <span className="text-sm font-bold text-stone-900">₹3.42 Cr</span>
              </div>
            </div>
          </div>

          <div className="mt-3 space-y-1.5">
            {CATEGORY_SPEND_DATA.slice(0, 4).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-stone-700 truncate max-w-[140px]">{cat.name}</span>
                </div>
                <span className="font-semibold text-stone-900">{formatINR(cat.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Overdue Attention Banner & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Overdue Anomaly Callout (PO-1045 Focus) */}
        <div className="bg-red-50/60 border border-red-200 rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-red-100 text-red-700">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-red-900">
                  High-Priority Delay Flagged
                </h3>
              </div>
              <StatusBadge status="OVERDUE (5 days)" size="sm" />
            </div>

            <div className="bg-white p-3.5 rounded-md border border-red-200/80 mb-3 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs font-bold text-stone-900">PO-1045 — ABC Components</div>
                  <div className="text-[11px] text-stone-500">Industrial Component A (500 PCS)</div>
                </div>
                <div className="text-xs font-bold text-red-700">₹6,00,000</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-stone-100 text-stone-600">
                <div>Due Date: <span className="font-semibold text-red-600">Sep 10, 2026</span></div>
                <div>Promised: <span className="font-semibold">Sep 10, 2026</span></div>
              </div>

              <p className="text-[11px] text-stone-600 italic bg-stone-50 p-2 rounded border border-stone-200">
                "Critical assembly part for Line 4. Vendor production bottleneck resolved, pending automated phone dispatch."
              </p>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                navigate('/erp/purchase-orders/PO-1045');
              }}
              className="w-full py-2 px-3 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>View Full PO-1045 Detail</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleQuickAction('CHASE_OVERDUE')}
              className="w-full py-2 px-3 rounded-md bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Launch AI Voice Expedite</span>
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Recent Procurement Activity Feed */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-stone-900 tracking-tight">
                Recent Procurement & AI Activity
              </h2>
              <p className="text-xs text-stone-500">
                Live stream of order dispatches, supplier responses, and autonomous agent tasks
              </p>
            </div>
            <button
              onClick={() => navigate('/erp/purchase-orders')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              <span>View All POs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {pos.slice(0, 6).map((po) => (
              <div
                key={po.id}
                onClick={() => navigate(`/erp/purchase-orders/${po.id}`)}
                className="py-2.5 flex items-center justify-between gap-3 hover:bg-stone-50/80 px-2 rounded cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-1.5 rounded shrink-0 ${
                    po.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                    po.status === 'AT RISK' ? 'bg-amber-100 text-amber-700' :
                    po.status === 'DELIVERED' ? 'bg-stone-100 text-stone-600' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-stone-900">{po.poNumber}</span>
                      <span className="text-stone-400 text-xs">•</span>
                      <span className="text-xs text-stone-700 font-medium truncate">{po.supplier}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 truncate">
                      {po.product} ({formatNumber(po.quantity)} units)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-bold text-stone-900">{formatINR(po.value)}</div>
                    <div className="text-[10px] text-stone-400">Due {po.dueDate}</div>
                  </div>
                  <StatusBadge status={po.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
