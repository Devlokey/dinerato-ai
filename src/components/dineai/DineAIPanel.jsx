import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Send,
  RotateCcw,
  LayoutGrid,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Flame,
  Mail,
  Mic,
  MicOff,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  PhoneCall
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAgent } from '../../context/AgentContext';
import AgentTimeline from './AgentTimeline';
import QuoteComparison from './QuoteComparison';
import DineAISwipeMailDeck from './DineAISwipeMailDeck';
import { dispatchAgentAction, runChaseOverdueFlow, runSourceAndRFQFlow } from '../../agents/orchestrator';
import { streamChatWithContext, isGeminiConfigured } from '../../services/geminiService';

// Custom 4-Point Concave Sparkle Star SVG
function SparkleStar({ className = "w-5 h-5 text-amber-400" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path d="M12 1.5 C12 7.3 7.3 12 1.5 12 C7.3 12 12 16.7 12 22.5 C12 16.7 16.7 12 22.5 12 C16.7 12 12 7.3 12 1.5 Z" />
    </svg>
  );
}

// Rich Interactive Markdown Renderer
function RichMarkdown({ text = '', onActionClick = () => {}, onEntityClick = () => {} }) {
  if (!text) return null;

  // Split lines
  const lines = text.split('\n');
  const elements = [];
  let tableRows = [];
  let inTable = false;

  const renderInline = (str) => {
    if (!str) return null;
    const tokens = str.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\])/g);

    return tokens.map((token, i) => {
      if (!token) return null;

      // Bold text
      if (token.startsWith('**') && token.endsWith('**')) {
        const content = token.slice(2, -2);
        const isGolden = /PO-\d+|₹|overdue|critical|urgent|chase|source|rfq/i.test(content);
        return (
          <strong
            key={i}
            className={`font-semibold ${isGolden ? 'text-amber-300' : 'text-white'}`}
          >
            {content}
          </strong>
        );
      }

      // Code tag
      if (token.startsWith('`') && token.endsWith('`')) {
        const code = token.slice(1, -1);
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-stone-800 text-amber-300 font-mono text-[10px]">
            {code}
          </code>
        );
      }

      // Actionable Button [Action Name]
      if (token.startsWith('[') && token.endsWith(']')) {
        const actionLabel = token.slice(1, -1);
        return (
          <button
            key={i}
            onClick={() => onActionClick(actionLabel)}
            className="inline-flex items-center gap-1 mx-1 px-2 py-0.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-semibold transition-all hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xs"
          >
            <span>{actionLabel}</span>
            <ChevronRight className="w-3 h-3 text-amber-400" />
          </button>
        );
      }

      // Check for clickable entity mentions (PO-1045, SwipeMail, RFQ-104)
      const words = token.split(/(\bPO-\d+\b|\bRFQ-\d+\b|\bSwipeMail\b)/g);
      return (
        <span key={i}>
          {words.map((w, wi) => {
            if (/^PO-\d+$/.test(w)) {
              return (
                <button
                  key={wi}
                  onClick={() => onEntityClick('PO', w)}
                  className="font-mono text-amber-300 font-bold hover:underline bg-amber-950/40 px-1 rounded border border-amber-800/40 mx-0.5"
                  title={`View ${w} Details`}
                >
                  {w}
                </button>
              );
            }
            if (/^RFQ-\d+$/.test(w)) {
              return (
                <button
                  key={wi}
                  onClick={() => onEntityClick('RFQ', w)}
                  className="font-mono text-sky-300 font-bold hover:underline bg-sky-950/40 px-1 rounded border border-sky-800/40 mx-0.5"
                  title={`View ${w}`}
                >
                  {w}
                </button>
              );
            }
            if (w === 'SwipeMail') {
              return (
                <button
                  key={wi}
                  onClick={() => onEntityClick('TAB', 'swipemail')}
                  className="text-amber-400 font-bold hover:underline mx-0.5"
                  title="Open SwipeMail inside DINE AI"
                >
                  SwipeMail ✉️
                </button>
              );
            }
            return w;
          })}
        </span>
      );
    });
  };

  const flushTable = (key) => {
    if (tableRows.length === 0) return null;
    const isHeaderRow = tableRows[0];
    const bodyRows = tableRows.slice(2);

    const rendered = (
      <div key={`table-${key}`} className="my-2.5 overflow-x-auto rounded-xl border border-[#1E293B] bg-[#0A0E17]">
        <table className="w-full text-[11px] text-left">
          <thead className="bg-[#111724] border-b border-[#1E293B] text-stone-300 font-bold">
            <tr>
              {isHeaderRow.map((cell, ci) => (
                <th key={ci} className="px-2.5 py-1.5 font-semibold">
                  {renderInline(cell.trim())}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E293B]/60">
            {bodyRows.map((row, ri) => (
              <tr key={ri} className="hover:bg-[#131B2A]/50 transition-colors">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-2.5 py-1.5 text-stone-200">
                    {renderInline(cell.trim())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
    inTable = false;
    return rendered;
  };

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];

    // Markdown Table Line
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      inTable = true;
      const cols = line.split('|').slice(1, -1);
      tableRows.push(cols);
      continue;
    } else if (inTable) {
      elements.push(flushTable(idx));
    }

    // Markdown Header (### Header)
    if (line.startsWith('### ')) {
      elements.push(
        <h4 key={idx} className="text-xs font-bold text-amber-300 tracking-wide uppercase mt-2 mb-1 flex items-center gap-1.5">
          <SparkleStar className="w-3.5 h-3.5 text-amber-400" />
          <span>{line.replace('### ', '')}</span>
        </h4>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={idx} className="text-sm font-bold text-white mt-2 mb-1">
          {line.replace('## ', '')}
        </h3>
      );
      continue;
    }

    // Bullet / List items
    if (/^[•\-\*]\s/.test(line.trim())) {
      elements.push(
        <div key={idx} className="flex items-start gap-2 text-stone-300 text-xs leading-relaxed my-0.5">
          <span className="text-amber-400 font-bold mt-0.5">•</span>
          <span className="flex-1">{renderInline(line.replace(/^[•\-\*]\s*/, ''))}</span>
        </div>
      );
      continue;
    }

    // Numbered lists (1. Item)
    if (/^\d+\.\s/.test(line.trim())) {
      const numMatch = line.trim().match(/^(\d+)\.\s*(.*)$/);
      if (numMatch) {
        elements.push(
          <div key={idx} className="flex items-start gap-2 text-stone-300 text-xs leading-relaxed my-0.5">
            <span className="font-mono text-amber-400 font-bold text-[11px] mt-0.5">{numMatch[1]}.</span>
            <span className="flex-1">{renderInline(numMatch[2])}</span>
          </div>
        );
        continue;
      }
    }

    // Regular line / Paragraph
    if (line.trim()) {
      elements.push(
        <p key={idx} className="text-xs text-stone-200 leading-relaxed my-1">
          {renderInline(line)}
        </p>
      );
    }
  }

  if (inTable) {
    elements.push(flushTable('end'));
  }

  return <div className="space-y-1">{elements}</div>;
}

// Workflow Complete Card
function WorkflowCompleteCard({ text, data = {} }) {
  const lines = text
    .replace(/^✓\s*\*\*WORKFLOW COMPLETE\*\*\n*/, '')
    .trim()
    .split('\n')
    .filter(Boolean);

  const analysis = data?.analysis;

  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-[#0A131A] p-4 space-y-3 shadow-lg shadow-emerald-950/20 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Workflow Complete</span>
        </div>
        {data?.confidence && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-mono">
            {data.confidence}% Confidence
          </span>
        )}
      </div>

      <div className="space-y-2 pt-0.5">
        {lines.map((line, i) => {
          const clean = line.replace(/^[•\-✓]\s*/, '').replace(/\*\*/g, '');
          const isWarning = line.includes('⚠') || line.includes('Human review required') || line.includes('review required');

          if (isWarning) {
            return (
              <div key={i} className="flex items-start gap-2 text-amber-300/95 leading-relaxed text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{clean.replace(/^⚠\s*/, '')}</span>
              </div>
            );
          }

          return (
            <div key={i} className="flex items-start gap-2 text-stone-200 leading-relaxed text-xs">
              <span className="text-emerald-400 shrink-0 mt-0.5 text-xs">✓</span>
              <span>{clean}</span>
            </div>
          );
        })}
      </div>

      {(data?.delayReason || analysis?.summary) && (
        <div className="mt-2 pt-2.5 border-t border-stone-800/80 space-y-1.5 bg-black/20 p-2.5 rounded-xl">
          <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1 text-purple-300 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Conversation Analysis
            </span>
            <span className="text-[9px] text-stone-400">
              {analysis?.analyzedVia ? (analysis.analyzedVia.includes('Gemini') ? 'AI Intelligence' : analysis.analyzedVia) : 'AI Intelligence'}
            </span>
          </div>

          <div className="text-[11px] text-stone-300 space-y-1">
            {data?.delayReason && (
              <div className="flex items-start gap-1.5">
                <span className="text-stone-400 shrink-0">Root Cause:</span>
                <span className="text-stone-200">{data.delayReason}</span>
              </div>
            )}
            {analysis?.dispatchStatus && (
              <div className="flex items-start gap-1.5">
                <span className="text-stone-400 shrink-0">Dispatch:</span>
                <span className="text-stone-200">{analysis.dispatchStatus}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function DineAIPanel({ isOpen, onClose }) {
  const navigate = useNavigate();
  const erpContext = useERP();
  const agentContext = useAgent();

  const { activeContext } = erpContext;
  const {
    messages,
    addMessage,
    updateMessage,
    clearMessages,
    isRunning,
    timelineSteps
  } = agentContext;

  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'swipemail'
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen && activeTab === 'chat' && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, timelineSteps, isRunning, isOpen, isStreaming, activeTab]);

  // Web Speech API Voice Recognition Initialization
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputVal(transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Voice dictation is supported in modern browsers like Chrome/Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Recognition start error:', err);
      }
    }
  };

  const copyToClipboard = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  // Context name
  const getContextLabel = () => {
    const page = activeContext?.pageType || 'Dashboard';
    const d = activeContext?.pageData || {};
    if (page === 'PODetail') return `${d.poNumber || 'PO-1045'} · ${d.supplier || 'ABC Components'}`;
    if (page === 'PurchaseOrders') return 'Purchase Orders';
    if (page === 'Suppliers') return 'Suppliers';
    if (page === 'RFQs') return 'RFQs';
    if (page === 'Quotations') return 'Quotations';
    if (page === 'Deliveries') return 'Deliveries';
    if (page === 'Inventory') return 'Inventory';
    if (page === 'Reports') return 'Reports';
    if (page === 'AgentPermissions') return 'Agent Permissions';
    if (page === 'AuditLog') return 'Audit Log';
    return 'Dashboard';
  };

  // Structured Chips
  const getChips = () => {
    const page = activeContext?.pageType || 'Dashboard';
    if (page === 'PODetail') {
      return [
        { label: 'Why is this delayed?', icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> },
        { label: 'Call supplier re: PO-1045', icon: <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> },
        { label: 'Chase overdue POs', icon: <Clock className="w-3.5 h-3.5 text-amber-400" /> },
        { label: 'Find alternative suppliers', icon: <Users className="w-3.5 h-3.5 text-amber-400" /> }
      ];
    }
    return [
      { label: 'Triage supplier emails', icon: <Flame className="w-3.5 h-3.5 text-amber-400" />, actionType: 'TAB_SWIPEMAIL' },
      { label: 'Chase overdue POs', icon: <Clock className="w-3.5 h-3.5 text-amber-400" /> },
      { label: 'What needs my attention?', icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" /> },
      { label: 'Find suppliers for 500 units', icon: <Users className="w-3.5 h-3.5 text-amber-400" /> },
      { label: 'Summarize risks', icon: <FileText className="w-3.5 h-3.5 text-amber-400" /> }
    ];
  };

  const handleEntityClick = (type, value) => {
    if (type === 'PO') {
      navigate(`/erp/purchase-orders/${value}`);
    } else if (type === 'RFQ') {
      navigate('/erp/rfqs');
    } else if (type === 'TAB') {
      setActiveTab(value);
    }
  };

  const handleSendMessage = async (textToSend, actionType) => {
    const query = (textToSend || inputVal).trim();
    if (!query) return;

    if (actionType === 'TAB_SWIPEMAIL' || query.toLowerCase().includes('triage supplier emails') || query.toLowerCase() === 'swipemail') {
      setActiveTab('swipemail');
      return;
    }

    if (isRunning || isStreaming) return;
    setInputVal('');

    // Check if query matches multi-agent execution workflows
    const result = await dispatchAgentAction(query, { agentContext, erpContext });

    if (result && result.isStandardQuery) {
      // If user asks about inbox / emails, offer quick switch to SwipeMail
      if (query.toLowerCase().includes('email') || query.toLowerCase().includes('inbox') || query.toLowerCase().includes('swipemail')) {
        addMessage({ sender: 'user', text: query, type: 'text' });
        agentContext.setIsRunning(true);
        setIsStreaming(true);

        const botMsgId = `bot-${Date.now()}`;
        addMessage({
          id: botMsgId,
          sender: 'assistant',
          text: '',
          type: 'text'
        });

        try {
          await streamChatWithContext(
            query,
            {
              activeContext: erpContext.activeContext,
              pos: erpContext.pos,
              suppliers: erpContext.suppliers,
              rfqs: erpContext.rfqs,
              kpis: erpContext.kpis
            },
            (chunk, accumulatedText) => {
              updateMessage(botMsgId, { text: accumulatedText });
            }
          );
        } finally {
          agentContext.setIsRunning(false);
          setIsStreaming(false);
        }
        return;
      }

      // 1. Add user message
      addMessage({ sender: 'user', text: query, type: 'text' });
      agentContext.setIsRunning(true);
      setIsStreaming(true);

      // 2. Prepare streaming assistant message placeholder
      const botMsgId = `bot-${Date.now()}`;
      addMessage({
        id: botMsgId,
        sender: 'assistant',
        text: '',
        type: 'text'
      });

      // 3. Stream from Gemini 2.0 Flash or local heuristic engine
      try {
        await streamChatWithContext(
          query,
          {
            activeContext: erpContext.activeContext,
            pos: erpContext.pos,
            suppliers: erpContext.suppliers,
            rfqs: erpContext.rfqs,
            kpis: erpContext.kpis
          },
          (chunk, accumulatedText) => {
            updateMessage(botMsgId, { text: accumulatedText });
          }
        );
      } catch (err) {
        console.error('Chat stream error:', err);
        updateMessage(botMsgId, {
          text: 'I encountered a communication error. All 7 procurement agents remain online.'
        });
      } finally {
        agentContext.setIsRunning(false);
        setIsStreaming(false);
      }
    }
  };

  if (!isOpen) return null;

  const chips = getChips();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-950/40 pointer-events-auto transition-opacity duration-300 lg:hidden"
      />

      {/* Slide-in Panel Container */}
      <div className="absolute top-0 right-0 h-full w-full max-w-[450px] sm:w-[450px] bg-[#0A0E17] text-stone-100 shadow-2xl border-l border-[#1E2638]/70 flex flex-col pointer-events-auto font-sans">

        {/* ── 1. Top Header ── */}
        <div className="px-5 py-3.5 flex items-center justify-between shrink-0 border-b border-[#1E293B]/40">
          <div className="flex items-center gap-2.5">
            <SparkleStar className="w-5 h-5 text-amber-400" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-wide">DINE AI</span>
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {activeTab === 'chat' && (
              <button
                onClick={clearMessages}
                className="w-8 h-8 rounded-full border border-[#1E293B] hover:bg-[#151F2E] text-stone-400 hover:text-white flex items-center justify-center transition-colors"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-[#1E293B] hover:bg-[#151F2E] text-stone-400 hover:text-white flex items-center justify-center transition-colors"
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── 2. Top View Tabs: Copilot Chat vs SwipeMail Inbox ── */}
        <div className="px-5 pt-2 flex items-center gap-5 shrink-0 border-b border-[#1E293B]/40 bg-[#0A0E17]">
          <button
            onClick={() => setActiveTab('chat')}
            className={`pb-2.5 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'text-amber-400'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Copilot Chat</span>
            {activeTab === 'chat' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400 rounded-full"
              />
            )}
          </button>

          <button
            onClick={() => setActiveTab('swipemail')}
            className={`pb-2.5 text-xs font-bold transition-all relative flex items-center gap-1.5 ${
              activeTab === 'swipemail'
                ? 'text-amber-400'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>SwipeMail</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono">
              5
            </span>
            {activeTab === 'swipemail' && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-400 rounded-full"
              />
            )}
          </button>
        </div>

        {/* ── 3. Content Area based on Active Tab ── */}
        {activeTab === 'swipemail' ? (
          /* ── Embedded SwipeMail Deck ── */
          <DineAISwipeMailDeck onSwitchToChat={() => setActiveTab('chat')} />
        ) : (
          /* ── Copilot Chat View ── */
          <>
            {/* Context Tab Strip */}
            <div className="px-5 pt-2 pb-2 flex items-center justify-between shrink-0 border-b border-[#1E293B]/30">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-200">
                <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
                <span>Context: {getContextLabel()}</span>
              </div>
              <span className="text-[10px] font-mono text-stone-400">
                Sep 13, 2026 · INR (₹)
              </span>
            </div>

            {/* Suggestion Prompt Chips */}
            {!isRunning && !isStreaming && (
              <div className="px-5 py-2.5 overflow-x-auto flex items-center gap-2 shrink-0 border-b border-[#1E293B]/30 no-scrollbar">
                {chips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip.label, chip.actionType)}
                    disabled={isRunning || isStreaming}
                    className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-[#0F1622] hover:bg-[#151F2E] border border-[#1E293B] hover:border-amber-400/40 text-stone-200 hover:text-white transition-all shrink-0 whitespace-nowrap active:scale-95 flex items-center gap-1.5 shadow-sm"
                  >
                    {chip.icon}
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Main Chat Stream */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs font-sans">
              {/* Initial Welcome Greeting Card */}
              <div className="rounded-2xl bg-[#0F1622]/90 border border-[#1E293B] p-4 flex items-start gap-3.5 shadow-sm">
                <SparkleStar className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs leading-relaxed text-stone-200">
                  <p>I'm monitoring all 40 POs, 25 suppliers, and pending supplier communications.</p>
                  <p className="text-stone-400 text-[11px]">
                    Try <span className="text-amber-300 font-semibold cursor-pointer hover:underline" onClick={() => setActiveTab('swipemail')}>SwipeMail Triage</span> (5 items), <span className="text-amber-300 font-semibold cursor-pointer hover:underline" onClick={() => handleSendMessage('Chase overdue POs')}>Chase overdue POs</span> (Voice Call), or <span className="text-amber-300 font-semibold cursor-pointer hover:underline" onClick={() => handleSendMessage('Find suppliers for 500 units of Product X')}>Find suppliers</span> (RFQ-104).
                  </p>
                </div>
              </div>

              {/* Dynamic Messages */}
              {messages.map((msg, index) => {
                if (index === 0 && msg.id === 'welcome-msg') return null;

                const isUser = msg.sender === 'user';
                const isBotStreaming = isStreaming && index === messages.length - 1 && !isUser;

                // Quote comparison result card
                if (msg.type === 'quote_comparison' && msg.data?.quotes) {
                  return (
                    <div key={msg.id || index} className="space-y-1.5 animate-fade-in">
                      <div className="text-[11px] text-stone-400 font-sans">
                        DINE AI • {msg.timestamp || 'Just now'}
                      </div>
                      <div className="rounded-2xl border border-[#1E293B] bg-[#0F1622] p-4 space-y-3">
                        <RichMarkdown text={msg.text} onActionClick={handleSendMessage} onEntityClick={handleEntityClick} />
                        <QuoteComparison data={{ quotes: msg.data.quotes, rfqId: msg.data.rfqId }} />
                      </div>
                    </div>
                  );
                }

                // Workflow Completion summary card
                if (msg.type === 'completion_summary' || (msg.text && msg.text.includes('WORKFLOW COMPLETE'))) {
                  return (
                    <div key={msg.id || index} className="space-y-1.5 animate-fade-in">
                      <div className="text-[11px] text-stone-400 font-sans">
                        DINE AI • {msg.timestamp || 'Just now'}
                      </div>
                      <WorkflowCompleteCard text={msg.text} data={msg.data} />
                    </div>
                  );
                }

                // Standard User / Bot bubble
                return (
                  <div
                    key={msg.id || index}
                    className={`group flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1 animate-fade-in`}
                  >
                    <div className="flex items-center gap-2 text-[11px] text-stone-400 font-sans px-1">
                      <span>{isUser ? 'You' : 'DINE AI'} • {msg.timestamp || 'Just now'}</span>
                      {!isUser && msg.text && (
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id || index)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 text-stone-500 hover:text-stone-300"
                          title="Copy response"
                        >
                          {copiedMsgId === (msg.id || index) ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>

                    <div
                      className={`px-4 py-3 rounded-2xl text-xs leading-relaxed max-w-[90%] ${
                        isUser
                          ? 'bg-[#242F42] text-stone-100 rounded-tr-md shadow-sm font-medium'
                          : 'bg-[#0F1622] border border-[#1E293B] text-stone-200 rounded-tl-md shadow-sm'
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      ) : (
                        <>
                          <RichMarkdown
                            text={msg.text || (isBotStreaming ? 'Analyzing procurement database...' : '')}
                            onActionClick={handleSendMessage}
                            onEntityClick={handleEntityClick}
                          />
                          {isBotStreaming && (
                            <span className="inline-block w-1.5 h-3 ml-1 bg-amber-400 animate-pulse" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Real-time Agent Activity Timeline */}
              {timelineSteps.length > 0 && (
                <AgentTimeline steps={timelineSteps} />
              )}

              {/* Running / Executing indicator */}
              {isRunning && !isStreaming && (
                <div className="flex items-center gap-2 text-xs text-stone-400 py-1 pl-1 animate-fade-in">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-[11px] text-stone-400 font-sans">
                    Agents executing autonomous workflow...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Voice Recording Status Bar */}
            {isListening && (
              <div className="px-5 py-2 bg-red-950/40 border-t border-red-900/50 flex items-center justify-between text-xs text-red-300 animate-pulse shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span className="font-semibold">🎙️ Listening... speak your procurement command</span>
                </div>
                <button
                  onClick={toggleVoiceInput}
                  className="text-[10px] uppercase font-bold text-red-400 hover:text-white px-2 py-0.5 rounded bg-red-900/60"
                >
                  Stop
                </button>
              </div>
            )}

            {/* Input Area & Footer */}
            <div className="px-5 pb-3.5 pt-2 shrink-0 border-t border-[#1E293B]/40 bg-[#0A0E17]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center justify-between bg-[#0F1622] border border-[#1E293B] rounded-2xl px-3.5 py-2 focus-within:border-amber-400/60 transition-colors shadow-inner gap-2"
              >
                <input
                  type="text"
                  placeholder={isListening ? "Listening to your voice..." : "Ask or instruct Dine AI (e.g. why is PO-1045 delayed?)..."}
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  disabled={isRunning || isStreaming}
                  className="flex-1 bg-transparent text-xs text-stone-200 placeholder-stone-400 focus:outline-none disabled:opacity-40"
                />

                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className={`p-1.5 rounded-xl transition-all ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'text-stone-400 hover:text-amber-400 hover:bg-[#151F2E]'
                  }`}
                  title={isListening ? 'Stop voice listening' : 'Start voice dictation'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="submit"
                  disabled={!inputVal.trim() || isRunning || isStreaming}
                  className="w-8 h-8 rounded-xl bg-[#E5A93C] hover:bg-[#F59E0B] text-stone-950 flex items-center justify-center transition-all shrink-0 active:scale-95 disabled:opacity-30 disabled:hover:bg-[#E5A93C]"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="text-center text-[10px] text-stone-500 font-sans mt-2 select-none">
                ERP · Demo &nbsp;•&nbsp; Voice · Demo &nbsp;•&nbsp; 7 Agents Active
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
