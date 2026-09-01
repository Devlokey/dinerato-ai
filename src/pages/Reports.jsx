import React, { useState, useEffect } from 'react';
import { useERP } from '../context/ERPContext';
import { useAgent } from '../context/AgentContext';
import MetricCard from '../components/shared/MetricCard';
import { formatINR, formatNumber } from '../utils/formatters';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  DollarSign,
  Clock,
  CheckCircle2,
  Download,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck
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
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

const MONTHLY_SPEND_VS_BUDGET = [
  { month: 'Apr 2026', spend: 42.5, budget: 45.0, savings: 2.5 },
  { month: 'May 2026', spend: 51.2, budget: 55.0, savings: 3.8 },
  { month: 'Jun 2026', spend: 58.0, budget: 60.0, savings: 2.0 },
  { month: 'Jul 2026', spend: 64.8, budget: 70.0, savings: 5.2 },
  { month: 'Aug 2026', spend: 71.3, budget: 75.0, savings: 3.7 },
  { month: 'Sep 2026 (MTD)', spend: 78.4, budget: 85.0, savings: 6.6 }
];

const SUPPLIER_PERFORMANCE_METRICS = [
  { supplier: 'Vertex Mfg', onTime: 99, quality: 98, costIndex: 94 },
  { supplier: 'ABC Comp', onTime: 98, quality: 96, costIndex: 96 },
  { supplier: 'Vadodara Parts', onTime: 96, quality: 95, costIndex: 92 },
  { supplier: 'Prime Materials', onTime: 95, quality: 94, costIndex: 90 },
  { supplier: 'Global Ind', onTime: 91, quality: 90, costIndex: 98 },
  { supplier: 'Nova Comp', onTime: 89, quality: 88, costIndex: 86 }
];

const AI_SAVINGS_TIMELINE = [
  { month: 'Apr 2026', hoursSaved: 16, costAvoidance: 48000, expedites: 8 },
  { month: 'May 2026', hoursSaved: 22, costAvoidance: 66000, expedites: 12 },
  { month: 'Jun 2026', hoursSaved: 28, costAvoidance: 84000, expedites: 17 },
  { month: 'Jul 2026', hoursSaved: 34, costAvoidance: 102000, expedites: 21 },
  { month: 'Aug 2026', hoursSaved: 42, costAvoidance: 126000, expedites: 26 },
  { month: 'Sep 2026', hoursSaved: 54, costAvoidance: 162000, expedites: 32 }
];

const CATEGORY_DISTRIBUTION = [
  { name: 'Precision Engineering', spend: 8900000, percentage: '26%', color: '#2563EB' },
  { name: 'Heavy Machinery & Parts', spend: 7200000, percentage: '21%', color: '#3B82F6' },
  { name: 'Industrial Components', spend: 4850000, percentage: '14%', color: '#C25E00' },
  { name: 'Raw Metals & Alloys', spend: 3400000, percentage: '10%', color: '#F59E0B' },
  { name: 'Electrical & Plastics', spend: 2100000, percentage: '6%', color: '#10B981' },
  { name: 'Fasteners & Hardware', spend: 1950000, percentage: '6%', color: '#6366F1' },
  { name: 'Other Categories', spend: 5700000, percentage: '17%', color: '#94A3B8' }
];

export default function Reports() {
  const { kpis, setActiveContext } = useERP();
  const { setIsPanelOpen, addMessage } = useAgent();
  const [timeRange, setTimeRange] = useState('Q3 2026');

  // Sync Copilot Context
  useEffect(() => {
    setActiveContext({
      pageType: 'Reports',
      pageData: {
        title: 'Executive Procurement Analytics & AI ROI',
        totalSpend: '₹3.42 Cr',
        realizedSavings: '₹28.40 Lakhs',
        hoursSaved: 126
      }
    });
  }, [setActiveContext]);

  const handleAskAIReport = () => {
    setIsPanelOpen(true);
    addMessage({
      sender: 'user',
      text: 'Generate a comprehensive quarterly procurement audit report highlighting spend variance and supplier risk trends.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-lg border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 tracking-tight font-serif">
              Procurement Analytics & ROI Reports
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              Live BI Stream
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Executive spend tracking, vendor quality benchmarks, and autonomous AI cost reduction analytics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-stone-50 border border-stone-300 rounded-md text-stone-800 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="Q3 2026">Q3 2026 (Jul - Sep)</option>
            <option value="YTD 2026">YTD 2026 (Jan - Sep)</option>
            <option value="Last 30 Days">Last 30 Days</option>
          </select>

          <button
            onClick={handleAskAIReport}
            className="px-3.5 py-1.5 rounded-md bg-[#141412] hover:bg-stone-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Executive Summary</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          title="Total Spend (YTD)"
          value="₹3.42 Cr"
          subtext="Within 94.2% of budget target"
          icon={DollarSign}
          trend="-5.8% under budget"
          trendDirection="success"
        />

        <MetricCard
          title="Realized Cost Savings"
          value="₹28.40 L"
          subtext="Through AI quote benchmarking"
          icon={TrendingUp}
          trend="+18.4% vs LY"
          trendDirection="success"
          variant="success"
        />

        <MetricCard
          title="Autonomous Expedites"
          value="84 Orders"
          subtext="Zero operator manual calls required"
          icon={Sparkles}
          trend="94% Success Rate"
          trendDirection="info"
          variant="info"
        />

        <MetricCard
          title="Cycle Time Reduction"
          value="3.2 Days"
          subtext="From RFQ issue to PO placement"
          icon={Clock}
          trend="42% Faster"
          trendDirection="success"
        />
      </div>

      {/* Chart Grid Row 1: Spend vs Budget & AI ROI Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spend vs Budget Trend Chart */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900 tracking-tight">
                Monthly Spend vs Planned Budget
              </h2>
              <p className="text-xs text-stone-500">Values in Lakhs (INR ₹)</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ₹23.8L Total Savings
            </span>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_SPEND_VS_BUDGET} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip
                  formatter={(val, name) => [`₹${val} Lakhs`, name === 'spend' ? 'Actual Spend' : 'Allocated Budget']}
                  contentStyle={{ backgroundColor: '#141412', color: '#FFF', borderRadius: '6px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="spend" name="Actual Spend" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="budget" name="Allocated Budget" fill="#CBD5E1" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Savings & Labor Hours Avoided */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900 tracking-tight">
                AI Labor Hours Saved & Cost Avoidance
              </h2>
              <p className="text-xs text-stone-500">Cumulative operator hours saved via multi-agent automation</p>
            </div>
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              126h YTD
            </span>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={AI_SAVINGS_TIMELINE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip
                  formatter={(val, name) => [
                    name === 'hoursSaved' ? `${val} Hours` : formatINR(val),
                    name === 'hoursSaved' ? 'Operator Hours Saved' : 'Direct Cost Avoidance'
                  ]}
                  contentStyle={{ backgroundColor: '#141412', color: '#FFF', borderRadius: '6px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Area type="monotone" dataKey="hoursSaved" name="Operator Hours Saved" stroke="#10B981" fill="#D1FAE5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart Grid Row 2: Supplier Scorecard & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supplier Scorecard (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-900 tracking-tight">
                Top Supplier Performance Benchmarks
              </h2>
              <p className="text-xs text-stone-500">
                Multi-criteria evaluation comparing On-Time Delivery % vs Quality Compliance Score
              </p>
            </div>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SUPPLIER_PERFORMANCE_METRICS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="supplier" tick={{ fontSize: 11, fill: '#6B7280' }} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#6B7280' }} />
                <Tooltip
                  formatter={(val) => [`${val}%`, 'Score']}
                  contentStyle={{ backgroundColor: '#141412', color: '#FFF', borderRadius: '6px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="onTime" name="On-Time Delivery %" fill="#10B981" radius={[4, 4, 0, 0]} barSize={16} />
                <Bar dataKey="quality" name="Quality Compliance %" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={16} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spend by Category Table (1 col) */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-3">
          <div>
            <h2 className="text-sm font-bold text-stone-900 tracking-tight">
              Spend Distribution Breakdown
            </h2>
            <p className="text-xs text-stone-500">Total Capital Allocation by Sector</p>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {CATEGORY_DISTRIBUTION.map((cat) => (
              <div key={cat.name} className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="font-medium text-stone-800 truncate max-w-[130px]">{cat.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-stone-900">{formatINR(cat.spend)}</div>
                  <div className="text-[10px] text-stone-400 font-semibold">{cat.percentage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
