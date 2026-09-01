import React, { useState, useEffect } from 'react';
import { useERP } from '../context/ERPContext';
import {
  ShieldCheck,
  ShieldAlert,
  Bot,
  Check,
  X,
  Info,
  Sliders,
  Sparkles,
  Lock,
  Unlock,
  AlertTriangle,
  FileCode,
  Zap,
  Activity,
  Layers,
  PhoneCall,
  Mail,
  Scale,
  Send,
  Search,
  BarChart3,
  ChevronRight,
  XCircle,
  HelpCircle
} from 'lucide-react';
import StatusBadge from '../components/shared/StatusBadge';
import MetricCard from '../components/shared/MetricCard';

// Capability Metadata
const CAPABILITY_COLUMNS = [
  { key: 'readData', label: 'Read Data', description: 'Query ERP database, order records, and vendor catalogs' },
  { key: 'writeData', label: 'Write Data', description: 'Directly modify ERP tables, update delivery schedules and notes' },
  { key: 'sendEmails', label: 'Send Emails', description: 'Compose and dispatch formal RFC/RFQ/Confirmation emails to vendors' },
  { key: 'makeCalls', label: 'Make Calls', description: 'Synthesize voice telephone calls and converse via WebRTC SIP trunk' },
  { key: 'approvePurchases', label: 'Approve Purchases', description: 'Unconditionally approve financial expenditures (> ₹1,00,000 policy limit)' },
  { key: 'createPOs', label: 'Create POs', description: 'Generate binding Purchase Order documents in the ERP system' }
];

// Rich governance metadata per agent
const AGENT_GOVERNANCE_DETAILS = {
  'agent-1': {
    scope: 'Read-Only Analytical Intelligence',
    boundaryNote: 'Strictly sandboxed to read operations. Cannot mutate ERP records, send emails, or make telephone calls.',
    endpoints: ['/api/v2/pos/query', '/api/v2/suppliers/ratings', '/api/v2/analytics/risk-score'],
    maxFinancialThreshold: '₹0 (No Financial Authority)',
    auditClassification: 'Tamper-Evident Analytical Read'
  },
  'agent-2': {
    scope: 'Order Tracking & Delivery Status Updates',
    boundaryNote: 'Authorized to update delivery dates & tracking stages. Cannot approve purchases exceeding ₹1,00,000 without human sign-off.',
    endpoints: ['/api/v2/pos/update-status', '/api/v2/pos/timeline', '/api/v2/deliveries/sync'],
    maxFinancialThreshold: '₹1,00,000 (Hard Human Approval Gate for >= ₹1L)',
    auditClassification: 'ERP State Mutation'
  },
  'agent-3': {
    scope: 'Vendor Inquiries & Confirmation Broadcasts',
    boundaryNote: 'Authorized to dispatch automated follow-up & confirmation emails using approved corporate templates. Cannot initiate voice calls.',
    endpoints: ['/api/v2/mail/send-template', '/api/v2/mail/audit-log', '/api/v2/suppliers/contacts'],
    maxFinancialThreshold: 'N/A',
    auditClassification: 'Outbound Vendor Communication'
  },
  'agent-4': {
    scope: 'Autonomous Voice Calling & Transcript Extraction',
    boundaryNote: 'Authorized for telephone outreach to verify dispatch times. Strictly forbidden from committing ERP financial approvals or PO creation.',
    endpoints: ['/api/v2/voice/webrtc-call', '/api/v2/voice/whisper-stream', '/api/v2/voice/extract-entities'],
    maxFinancialThreshold: '₹0 (No Financial Authority)',
    auditClassification: 'Real-Time Voice Ingestion'
  },
  'agent-5': {
    scope: 'Supplier Sourcing & Capability Discovery',
    boundaryNote: 'Analyzes public market catalogs and historical ERP performance to construct shortlists. No direct PO generation.',
    endpoints: ['/api/v2/suppliers/search', '/api/v2/catalog/categories', '/api/v2/benchmarking/capacity'],
    maxFinancialThreshold: '₹0 (No Financial Authority)',
    auditClassification: 'Market Sourcing Query'
  },
  'agent-6': {
    scope: 'RFQ Document Generation & Distribution',
    boundaryNote: 'Can create draft RFQs and dispatch them to approved vendor lists. Can create draft PO headers pending approval.',
    endpoints: ['/api/v2/rfqs/create', '/api/v2/rfqs/broadcast', '/api/v2/pos/draft-header'],
    maxFinancialThreshold: '₹1,00,000 (Drafts only; requires Director sign-off for release)',
    auditClassification: 'Commercial RFQ Generation'
  },
  'agent-7': {
    scope: 'Multi-Criteria Quotation Scoring & Ranking',
    boundaryNote: 'Parses vendor bids and computes objective scores (0-100). Cannot accept quotes or commit corporate funds directly.',
    endpoints: ['/api/v2/quotes/parse', '/api/v2/quotes/score-matrix', '/api/v2/quotes/recommendation'],
    maxFinancialThreshold: '₹0 (Advisory Only)',
    auditClassification: 'Decision Intelligence Advisory'
  }
};

export default function AgentPermissions() {
  const { agents, updateAgentPermission, setActiveContext } = useERP();
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [notification, setNotification] = useState(null);

  // Sync context with Copilot
  useEffect(() => {
    setActiveContext({
      pageType: 'AgentPermissions',
      pageData: {
        title: 'Agent Governance & Security Permissions',
        totalAgents: agents.length,
        governanceStandard: 'ISO-27001 AI Operations / HITL Enforcement'
      }
    });
  }, [agents.length, setActiveContext]);

  // Handle permission toggle with feedback
  const handleTogglePermission = (agentId, permKey, currentValue) => {
    // Some critical boundaries are strictly locked by system policy
    if (agentId === 'agent-4' && permKey === 'approvePurchases') {
      showNotice('Security Violation: Voice Agent cannot be granted Approve Purchases per ISO-AI Policy #402.', 'error');
      return;
    }

    const newValue = !currentValue;
    updateAgentPermission(agentId, permKey, newValue);
    showNotice(`Updated ${permKey} for ${agents.find(a => a.id === agentId)?.name} to ${newValue ? 'ENABLED' : 'DISABLED'}.`, 'success');
  };

  const showNotice = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredAgents = agents.filter(ag => 
    ag.name.toLowerCase().includes(filterText.toLowerCase()) ||
    ag.role.toLowerCase().includes(filterText.toLowerCase()) ||
    ag.description.toLowerCase().includes(filterText.toLowerCase())
  );

  const getAgentIcon = (id) => {
    switch (id) {
      case 'agent-1': return <BarChart3 className="w-4 h-4 text-blue-600" />;
      case 'agent-2': return <Zap className="w-4 h-4 text-amber-600" />;
      case 'agent-3': return <Mail className="w-4 h-4 text-purple-600" />;
      case 'agent-4': return <PhoneCall className="w-4 h-4 text-emerald-600" />;
      case 'agent-5': return <Search className="w-4 h-4 text-cyan-600" />;
      case 'agent-6': return <Send className="w-4 h-4 text-indigo-600" />;
      case 'agent-7': return <Scale className="w-4 h-4 text-rose-600" />;
      default: return <Bot className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Notification Toast */}
      {notification && (
        <div className={`p-3 rounded-lg border text-xs font-medium flex items-center justify-between transition-all ${
          notification.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex items-center gap-2">
            {notification.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            ) : (
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span>{notification.msg}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-stone-400 hover:text-stone-700">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight font-serif">
              Agent Governance & Access Matrix
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-semibold">
              7 Active Policies
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Enterprise boundary enforcement matrix for autonomous procurement agents. Read, write, email, telephone synthesis, and financial approval gates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200 flex items-center gap-2 text-xs font-medium text-stone-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>HITL Threshold: <strong>₹1,00,000</strong></span>
          </div>
        </div>
      </div>

      {/* Top Governance KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <MetricCard
          title="Active Autonomous Agents"
          value={agents.length}
          subtext="100% Policy Compliant"
          icon={Bot}
          trend="7 Agents"
          trendDirection="success"
        />
        <MetricCard
          title="Voice Synthesis Scope"
          value="1 Agent"
          subtext="Voice Agent (Sandboxed)"
          icon={PhoneCall}
          trend="WebRTC Verified"
          trendDirection="info"
        />
        <MetricCard
          title="Financial Approval Gates"
          value="Strict Policy"
          subtext="> ₹1,00,000 requires HITL"
          icon={Lock}
          trend="Enforced"
          trendDirection="neutral"
        />
        <MetricCard
          title="Audit Ledger Sync"
          value="Real-Time"
          subtext="Immutable Event Stream"
          icon={Activity}
          trend="100% Logged"
          trendDirection="success"
        />
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-stone-200 flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search agents by name, role, or scope..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-stone-800"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Permitted (✓)</span>
          </span>
          <span className="mx-1">•</span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-300 inline-block" />
            <span>Prohibited (✕)</span>
          </span>
        </div>
      </div>

      {/* Main Governance Matrix Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100/80 border-b border-stone-200 text-[11px] font-semibold text-stone-700">
                <th className="py-3 px-4 min-w-[220px]">Agent Identity & Role</th>
                {CAPABILITY_COLUMNS.map(col => (
                  <th key={col.key} className="py-3 px-3 text-center min-w-[105px]">
                    <div className="flex flex-col items-center">
                      <span>{col.label}</span>
                    </div>
                  </th>
                ))}
                <th className="py-3 px-4 min-w-[200px]">Enforced Boundary / Policy Notes</th>
                <th className="py-3 px-3 text-right">Inspector</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-200">
              {filteredAgents.map(ag => {
                const details = AGENT_GOVERNANCE_DETAILS[ag.id] || {};
                const isSelected = selectedAgent?.id === ag.id;

                return (
                  <tr
                    key={ag.id}
                    className={`transition-colors hover:bg-stone-50/80 ${
                      isSelected ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    {/* Agent Name & Role */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="p-2 rounded-lg bg-stone-100 border border-stone-200 shrink-0 mt-0.5">
                          {getAgentIcon(ag.id)}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                            <span>{ag.name}</span>
                            <span className="text-[10px] font-mono text-stone-400">({ag.id})</span>
                          </div>
                          <div className="text-[11px] text-stone-500 font-medium">{ag.role}</div>
                          <div className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">
                            {ag.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Capability Matrix Columns */}
                    {CAPABILITY_COLUMNS.map(col => {
                      const isPermitted = !!ag.permissions?.[col.key];

                      return (
                        <td key={col.key} className="py-3.5 px-3 text-center">
                          <button
                            onClick={() => handleTogglePermission(ag.id, col.key, isPermitted)}
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border transition-all transform active:scale-95 ${
                              isPermitted
                                ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs hover:bg-emerald-600'
                                : 'bg-stone-100 text-stone-400 border-stone-200 hover:bg-stone-200 hover:text-stone-600'
                            }`}
                            title={`Click to toggle ${col.label} for ${ag.name}`}
                          >
                            {isPermitted ? (
                              <Check className="w-4 h-4 stroke-[3]" />
                            ) : (
                              <X className="w-3.5 h-3.5 stroke-[2.5]" />
                            )}
                          </button>
                        </td>
                      );
                    })}

                    {/* Operational Boundary Note */}
                    <td className="py-3.5 px-4">
                      <div className="text-[11px] text-stone-600 leading-relaxed bg-stone-50 p-2 rounded border border-stone-200">
                        {details.boundaryNote || 'Standard autonomous procurement permissions applied.'}
                      </div>
                    </td>

                    {/* Inspector Action Button */}
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedAgent(ag)}
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 rounded-md text-xs font-medium inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Capability Inspector Slide-over Drawer / Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/40 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl border-l border-stone-200 flex flex-col justify-between overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-6 border-b border-stone-200 bg-[#141412] text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-stone-800 text-amber-400 border border-stone-700">
                    {getAgentIcon(selectedAgent.id)}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                      Governance Inspector
                    </span>
                    <h3 className="text-lg font-bold text-white font-serif">{selectedAgent.name}</h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="text-xs text-stone-400 mt-2 font-medium">
                {selectedAgent.role} • ID: <code className="text-stone-300 font-mono">{selectedAgent.id}</code>
              </div>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1 text-xs text-stone-700">
              {/* Overview */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Agent Mission</h4>
                <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-200">
                  {selectedAgent.description}
                </p>
              </div>

              {/* Security Scope & Constraints */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Security & Financial Scope</h4>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Financial Limit</span>
                    <span className="font-bold text-stone-900 text-xs">
                      {AGENT_GOVERNANCE_DETAILS[selectedAgent.id]?.maxFinancialThreshold || '₹0 (No Financial Authority)'}
                    </span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <span className="text-[10px] text-stone-500 block">Audit Classification</span>
                    <span className="font-bold text-stone-900 text-xs">
                      {AGENT_GOVERNANCE_DETAILS[selectedAgent.id]?.auditClassification || 'General ERP Action'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Capability Matrix Status */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Configured Capabilities</h4>
                <div className="space-y-2">
                  {CAPABILITY_COLUMNS.map(col => {
                    const isPermitted = !!selectedAgent.permissions?.[col.key];

                    return (
                      <div
                        key={col.key}
                        className="p-3 rounded-lg border border-stone-200 flex items-center justify-between bg-white"
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-stone-900 text-xs">{col.label}</div>
                          <div className="text-[10px] text-stone-500">{col.description}</div>
                        </div>

                        <button
                          onClick={() => handleTogglePermission(selectedAgent.id, col.key, isPermitted)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                            isPermitted
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-stone-100 text-stone-500 border-stone-300'
                          }`}
                        >
                          {isPermitted ? 'Permitted ✓' : 'Prohibited ✕'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Allowed Endpoints */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Authorized API Endpoints</h4>
                <div className="bg-stone-900 text-stone-200 p-3 rounded-lg font-mono text-[11px] space-y-1">
                  {(AGENT_GOVERNANCE_DETAILS[selectedAgent.id]?.endpoints || ['/api/v2/erp/standard']).map((ep, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-emerald-400">GET/POST</span>
                      <span>{ep}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <div className="text-[11px] text-stone-500">
                Changes persist to runtime state.
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
