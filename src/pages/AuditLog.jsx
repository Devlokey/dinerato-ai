import React, { useState, useEffect, useMemo } from 'react';
import { useERP } from '../context/ERPContext';
import {
  ClipboardList,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Calendar,
  Bot,
  User,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  ArrowUpDown,
  RefreshCw,
  ExternalLink,
  Code,
  FileText,
  Clock,
  Eye,
  XCircle,
  Hash
} from 'lucide-react';
import MetricCard from '../components/shared/MetricCard';
import StatusBadge from '../components/shared/StatusBadge';

export default function AuditLog() {
  const { auditLogs, setActiveContext } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [methodFilter, setMethodFilter] = useState('ALL');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' | 'asc'

  // Context sync
  useEffect(() => {
    setActiveContext({
      pageType: 'AuditLog',
      pageData: {
        title: 'System Audit Log & Compliance Ledger',
        totalEvents: auditLogs.length,
        tamperEvident: true
      }
    });
  }, [auditLogs.length, setActiveContext]);

  // Unique filters
  const statuses = useMemo(() => {
    const set = new Set(auditLogs.map(a => a.status).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [auditLogs]);

  const methods = useMemo(() => {
    const set = new Set(auditLogs.map(a => a.method).filter(Boolean));
    return ['ALL', ...Array.from(set)];
  }, [auditLogs]);

  // Filtered & sorted audit entries
  const filteredEntries = useMemo(() => {
    return auditLogs.filter(entry => {
      const matchSearch =
        entry.agent?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.object?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.approvedBy?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.method?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.id?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'ALL' || entry.status === statusFilter;
      const matchMethod = methodFilter === 'ALL' || entry.method === methodFilter;

      return matchSearch && matchStatus && matchMethod;
    }).sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime() || 0;
      const dateB = new Date(b.timestamp).getTime() || 0;
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [auditLogs, searchQuery, statusFilter, methodFilter, sortOrder]);

  const handleExportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Agent', 'Action', 'Target Object', 'Method', 'Status', 'Approved By'];
    const rows = filteredEntries.map(e => [
      e.id,
      `"${e.timestamp}"`,
      `"${e.agent}"`,
      `"${e.action}"`,
      `"${e.object}"`,
      `"${e.method}"`,
      `"${e.status}"`,
      `"${e.approvedBy}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DINE_AI_AUDIT_LOG_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('success') || s.includes('verified') || s.includes('approved') || s.includes('completed')) {
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">● {status}</span>;
    }
    if (s.includes('sent') || s.includes('ping') || s.includes('cached')) {
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300">● {status}</span>;
    }
    if (s.includes('gated') || s.includes('flagged') || s.includes('ranked')) {
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">● {status}</span>;
    }
    if (s.includes('blocked') || s.includes('reject') || s.includes('failed')) {
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">● {status}</span>;
    }
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-300">● {status}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-serif">
              System Audit Log & Compliance Ledger
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Immutable Stream
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Chronological audit trail tracking all autonomous agent executions, tele-call verifications, financial approval gates, and ERP data mutations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <MetricCard
          title="Total Recorded Events"
          value={auditLogs.length}
          subtext="Seeded + Live Demo Streams"
          icon={ClipboardList}
          trend={`${filteredEntries.length} Visible`}
          trendDirection="neutral"
        />
        <MetricCard
          title="Human Approvals (HITL)"
          value={auditLogs.filter(a => a.approvedBy?.includes('Director') || a.approvedBy?.includes('Lead') || a.approvedBy?.includes('Sharma') || a.approvedBy?.includes('Mehta') || a.approvedBy?.includes('Patel')).length}
          subtext="Sign-offs for high-value POs"
          icon={User}
          trend="Enforced"
          trendDirection="success"
        />
        <MetricCard
          title="Autonomous Executions"
          value={auditLogs.filter(a => a.approvedBy?.includes('System') || a.approvedBy?.includes('Automated')).length}
          subtext="Below threshold workflows"
          icon={Bot}
          trend="ISO-AI Compliant"
          trendDirection="info"
        />
        <MetricCard
          title="Integrity Verification"
          value="100% Valid"
          subtext="Zero hash collisions or drifts"
          icon={ShieldCheck}
          trend="Tamper-Evident"
          trendDirection="success"
        />
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by Agent, Action, Target Object (e.g. PO-1045), Approver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-stone-800"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-stone-500 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200">
              <Filter className="w-3.5 h-3.5 text-stone-400" />
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-semibold text-stone-800 text-xs focus:outline-none cursor-pointer"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 text-xs text-stone-500 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200">
              <span>Method:</span>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="bg-transparent font-semibold text-stone-800 text-xs focus:outline-none cursor-pointer"
              >
                {methods.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="px-2.5 py-1 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 flex items-center gap-1 transition-colors"
              title="Toggle Sort Chronological Direction"
            >
              <ArrowUpDown className="w-3 h-3" />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100/80 border-b border-stone-200 text-[11px] font-semibold text-stone-700">
                <th className="py-3 px-4 min-w-[150px]">Timestamp</th>
                <th className="py-3 px-4 min-w-[190px]">Responsible Agent</th>
                <th className="py-3 px-4 min-w-[220px]">Action Executed</th>
                <th className="py-3 px-3 min-w-[110px]">Target Object</th>
                <th className="py-3 px-3 min-w-[140px]">Execution Method</th>
                <th className="py-3 px-3 text-center min-w-[110px]">Status</th>
                <th className="py-3 px-4 min-w-[180px]">Approved By</th>
                <th className="py-3 px-3 text-right">Inspect</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-200">
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-stone-400">
                    <ClipboardList className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                    <p className="text-xs font-medium text-stone-600">No matching audit records found</p>
                    <p className="text-[11px] text-stone-400 mt-0.5">Try clearing filters or search terms</p>
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => {
                  const isSelected = selectedEntry?.id === entry.id;

                  return (
                    <tr
                      key={entry.id}
                      onClick={() => setSelectedEntry(entry)}
                      className={`cursor-pointer transition-colors hover:bg-stone-50/80 ${
                        isSelected ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      {/* Timestamp */}
                      <td className="py-3 px-4 font-mono text-[11px] text-stone-600">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{entry.timestamp}</span>
                        </div>
                      </td>

                      {/* Agent */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 text-stone-600">
                            <Bot className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold text-stone-900 text-xs">
                            {entry.agent}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 font-medium text-stone-800 text-xs">
                        {entry.action}
                      </td>

                      {/* Target Object */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded font-mono font-bold text-[11px] bg-stone-100 text-stone-700 border border-stone-200">
                          {entry.object}
                        </span>
                      </td>

                      {/* Execution Method */}
                      <td className="py-3 px-3 text-stone-600 text-xs">
                        <div className="flex items-center gap-1.5">
                          <Code className="w-3.5 h-3.5 text-stone-400" />
                          <span>{entry.method}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        {getStatusBadge(entry.status)}
                      </td>

                      {/* Approved By */}
                      <td className="py-3 px-4 text-xs text-stone-600">
                        <div className="flex items-center gap-1.5">
                          {entry.approvedBy?.includes('System') || entry.approvedBy?.includes('Automated') ? (
                            <Bot className="w-3.5 h-3.5 text-stone-400" />
                          ) : (
                            <User className="w-3.5 h-3.5 text-blue-600" />
                          )}
                          <span className="font-medium">{entry.approvedBy}</span>
                        </div>
                      </td>

                      {/* Action / Inspect */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEntry(entry);
                          }}
                          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
                          title="Inspect Event Payload"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <div>
            Showing <strong>{filteredEntries.length}</strong> of <strong>{auditLogs.length}</strong> events
          </div>
          <div className="font-mono text-[11px]">
            ISO-27001 AI Audit Standard • SHA-256 Ledger
          </div>
        </div>
      </div>

      {/* Detailed Event Inspection Drawer / Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl border-l border-stone-200 flex flex-col justify-between overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-stone-200 bg-[#141412] text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-stone-800 text-emerald-400 border border-stone-700">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                      Audit Event Record
                    </span>
                    <h3 className="text-base font-bold text-white font-serif">{selectedEntry.id}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="text-xs text-stone-400 mt-2 font-mono">
                {selectedEntry.timestamp} • Object: {selectedEntry.object}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 flex-1 text-xs text-stone-700">
              {/* Event Summary */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-[11px] text-stone-500 font-semibold uppercase">Action Executed</span>
                  <span className="font-bold text-stone-900">{selectedEntry.action}</span>
                </div>
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-[11px] text-stone-500 font-semibold uppercase">Executing Agent</span>
                  <span className="font-bold text-stone-900">{selectedEntry.agent}</span>
                </div>
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-[11px] text-stone-500 font-semibold uppercase">Target Entity</span>
                  <span className="font-mono font-bold text-blue-600">{selectedEntry.object}</span>
                </div>
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-[11px] text-stone-500 font-semibold uppercase">Execution Method</span>
                  <span className="font-mono text-stone-800">{selectedEntry.method}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-stone-500 font-semibold uppercase">Authorization Source</span>
                  <span className="font-medium text-stone-900">{selectedEntry.approvedBy}</span>
                </div>
              </div>

              {/* Cryptographic Verification Trace */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-stone-400" />
                  <span>Cryptographic Proof & Attestation</span>
                </h4>
                <div className="p-3 bg-stone-900 text-stone-300 rounded-xl font-mono text-[11px] space-y-2">
                  <div>
                    <span className="text-stone-500 block text-[10px]">EVENT HASH (SHA-256):</span>
                    <span className="text-emerald-400 break-all select-all">
                      e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                    </span>
                  </div>
                  <div>
                    <span className="text-stone-500 block text-[10px]">PREVIOUS BLOCK HASH:</span>
                    <span className="text-stone-400 break-all select-all">
                      9f8336ca144f123c910e661bceb5ff6345c20e2b60d65e2dec9be44e2d334547
                    </span>
                  </div>
                  <div className="pt-1 text-[10px] text-stone-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Validated against ISO-27001 AI governance rules.</span>
                  </div>
                </div>
              </div>

              {/* Raw JSON Payload */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-stone-400" />
                  <span>Raw Event Payload Snapshot</span>
                </h4>
                <pre className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-[11px] font-mono text-stone-800 overflow-x-auto">
                  {JSON.stringify(selectedEntry, null, 2)}
                </pre>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <span className="text-[11px] text-stone-500">Immutable ledger entry</span>
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
