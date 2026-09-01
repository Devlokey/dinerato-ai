import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import {
  Flame,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building2,
  ArrowRight,
  PhoneCall,
  X,
  Undo2
} from 'lucide-react';
import { INITIAL_SWIPEMAIL_ITEMS } from '../../data/swipeMailData';
import { useERP } from '../../context/ERPContext';
import { useAgent } from '../../context/AgentContext';
import { runChaseOverdueFlow } from '../../agents/orchestrator';

export default function DineAISwipeMailDeck({ onSwitchToChat = () => {} }) {
  const { updatePOStatus, addAuditLog } = useERP();
  const agentContext = useAgent();
  const erpContext = useERP();

  const [deck, setDeck] = useState(INITIAL_SWIPEMAIL_ITEMS);
  const [history, setHistory] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const [activeReply, setActiveReply] = useState('');
  const [syncWithERP, setSyncWithERP] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [notification, setNotification] = useState(null);

  const currentCard = deck.length > 0 ? deck[0] : null;

  // Framer motion drag hooks for top card
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);

  // Visual drag stamps
  const replyStampOpacity = useTransform(x, [30, 100], [0, 1]);
  const archiveStampOpacity = useTransform(x, [-30, -100], [0, 1]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSwipe = (direction, mail) => {
    const item = mail || currentCard;
    if (!item) return;

    setHistory(prev => [{ mail: item, direction }, ...prev]);
    setDeck(prev => prev.slice(1));
    x.set(0);

    if (direction === 'right') {
      openReplyComposer(item);
    } else {
      showToast(`Archived email from ${item.from.name}`);
      addAuditLog({
        agent: 'Supplier Communication Agent',
        action: `Archived supplier email: ${item.subject}`,
        object: item.poNumber || 'INBOX',
        method: 'SwipeMail Triage',
        status: 'SUCCESS'
      });
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastAction = history[0];
    setDeck(prev => [lastAction.mail, ...prev]);
    setHistory(prev => prev.slice(1));
    showToast(`Restored email from ${lastAction.mail.from.name}`);
  };

  const openReplyComposer = (mail) => {
    setSelectedMail(mail);
    const defaultReply = mail.suggestedReplies?.[0]?.text || '';
    setActiveReply(defaultReply);
  };

  const handleSendReply = () => {
    if (!selectedMail) return;
    setIsSending(true);

    setTimeout(() => {
      if (syncWithERP && selectedMail.poNumber && selectedMail.bento?.revisedDate) {
        updatePOStatus(selectedMail.poNumber, 'UPDATED', {
          promisedDelivery: selectedMail.bento.revisedDate,
          notes: `Updated via DINE AI SwipeMail AI Reply: ${selectedMail.bento.rootCause}`
        });

        addAuditLog({
          agent: 'PO Expediting Agent',
          action: `Committed revised delivery ${selectedMail.bento.revisedDate} for ${selectedMail.poNumber}`,
          object: selectedMail.poNumber,
          method: 'SwipeMail Auto-Commit',
          status: 'SUCCESS'
        });
      }

      showToast(`✓ AI Reply dispatched to ${selectedMail.from.name}`);
      setIsSending(false);
      setSelectedMail(null);
    }, 600);
  };

  const handleTriggerVoiceAgent = async (mail) => {
    showToast(`Launching Voice Agent re: ${mail.poNumber}...`);
    onSwitchToChat();
    await runChaseOverdueFlow({
      agentContext,
      erpContext,
      userMessage: `Expedite ${mail.poNumber} with ABC Components`
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#090D16]">

      {/* Header telemetry counter */}
      <div className="px-5 py-3 bg-[#111827] border-b border-slate-700 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>
          <span className="text-xs font-bold text-white tracking-wide">
            {deck.length} Pending Supplier {deck.length === 1 ? 'Email' : 'Emails'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="px-2.5 py-1 rounded-lg border border-slate-600 bg-slate-800 text-slate-200 hover:text-white disabled:opacity-30 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Undo last swipe"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
          <button
            onClick={() => setDeck(INITIAL_SWIPEMAIL_ITEMS)}
            className="p-1.5 rounded-lg border border-slate-600 bg-slate-800 text-slate-200 hover:text-white transition-colors"
            title="Reset email deck"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-14 left-4 right-4 z-40 bg-emerald-700 text-white border-2 border-emerald-400 px-4 py-3 rounded-2xl text-xs flex items-center gap-2.5 shadow-2xl backdrop-blur-md font-bold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
            <span className="truncate">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card Deck Area */}
      <div className="flex-1 p-4 flex flex-col items-center justify-center relative overflow-hidden">
        {deck.length === 0 ? (
          /* Inbox Zero State */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-4 p-6 rounded-3xl bg-slate-900 border-2 border-slate-700 max-w-xs shadow-2xl"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto text-emerald-300 shadow-lg">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Inbox Zero Achieved</h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed font-medium">
                All supplier communications have been triaged and synchronized with the ERP.
              </p>
            </div>
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => setDeck(INITIAL_SWIPEMAIL_ITEMS)}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload Demo Emails</span>
              </button>
              <button
                onClick={onSwitchToChat}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors border border-slate-600"
              >
                Back to Copilot Chat
              </button>
            </div>
          </motion.div>
        ) : (
          /* Active Card Deck Stack */
          <div className="relative w-full h-full max-h-[540px] flex items-center justify-center">
            {/* Background stack card preview */}
            {deck.slice(1, 3).reverse().map((mail, i) => {
              const depth = deck.slice(1, 3).length - i;
              return (
                <div
                  key={mail.id}
                  style={{
                    transform: `scale(${1 - depth * 0.04}) translateY(${depth * 12}px)`,
                    zIndex: 5 - depth
                  }}
                  className="absolute inset-0 bg-slate-900 rounded-3xl border-2 border-slate-700 shadow-xl pointer-events-none opacity-40"
                />
              );
            })}

            {/* Top Interactive Card - HIGH-CONTRAST SLATE 800 (Z-INDEX: 20) */}
            <motion.div
              style={{ x, rotate, zIndex: 20 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={(e, info) => {
                if (info.offset.x > 90) {
                  handleSwipe('right', currentCard);
                } else if (info.offset.x < -90) {
                  handleSwipe('left', currentCard);
                }
              }}
              className="absolute inset-0 z-20 bg-[#1E293B] rounded-3xl border-2 border-slate-500 shadow-2xl p-4.5 flex flex-col justify-between cursor-grab active:cursor-grabbing select-none overflow-hidden"
            >
              {/* Overlay Stamp: Quick Reply */}
              <motion.div
                style={{ opacity: replyStampOpacity }}
                className="absolute top-4 right-4 z-30 px-4 py-2 rounded-2xl border-2 border-emerald-400 bg-emerald-600 text-white font-black text-xs tracking-wider uppercase rotate-6 shadow-2xl"
              >
                AI Quick Reply ✉️
              </motion.div>

              {/* Overlay Stamp: Archive */}
              <motion.div
                style={{ opacity: archiveStampOpacity }}
                className="absolute top-4 left-4 z-30 px-4 py-2 rounded-2xl border-2 border-rose-400 bg-rose-600 text-white font-black text-xs tracking-wider uppercase -rotate-6 shadow-2xl"
              >
                Archive 🗑️
              </motion.div>

              {/* Card Header */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow-md">
                      {currentCard.from.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white leading-tight tracking-wide">
                        {currentCard.from.name}
                      </h4>
                      <p className="text-xs text-slate-300 font-semibold mt-0.5">
                        {currentCard.from.company} · {currentCard.from.role}
                      </p>
                    </div>
                  </div>

                  <span className={`px-3 py-1 rounded-full text-xs font-black shadow-md ${
                    currentCard.priorityTier === 'Critical'
                      ? 'bg-rose-500 text-white'
                      : 'bg-amber-400 text-slate-950'
                  }`}>
                    {currentCard.priorityScore} · {currentCard.priorityTier}
                  </span>
                </div>

                {/* PO & Subject Line Banner */}
                <div className="bg-[#0F172A] p-3 rounded-2xl border border-slate-700 space-y-1.5 shadow-inner">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-950 font-black bg-amber-400 px-2 py-0.5 rounded-md text-xs shadow-sm">
                      {currentCard.poNumber}
                    </span>
                    <span className="text-emerald-400 font-extrabold text-sm">{currentCard.orderValue}</span>
                  </div>
                  <p className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {currentCard.subject}
                  </p>
                </div>

                {/* DINE AI Bento Extraction Grid - HIGH CONTRAST */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-[#0F172A] border border-slate-700 space-y-1 shadow-sm">
                    <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Revised Date
                    </span>
                    <p className="font-black text-amber-300 text-xs">
                      {currentCard.bento?.revisedDate} <span className="text-rose-400 font-black">({currentCard.bento?.delayDays})</span>
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#0F172A] border border-slate-700 space-y-1 shadow-sm">
                    <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                      Root Cause
                    </span>
                    <p className="font-bold text-white truncate text-xs">
                      {currentCard.bento?.rootCause}
                    </p>
                  </div>
                </div>

                {/* AI Recommendation Banner */}
                <div className="p-3 rounded-2xl bg-purple-950 border border-purple-400/60 text-xs text-purple-100 flex items-start gap-2 shadow-md">
                  <Sparkles className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-semibold">{currentCard.bento?.aiVerdict}</span>
                </div>
              </div>

              {/* Email Excerpt */}
              <div className="my-2 p-3 rounded-2xl bg-[#0F172A] border border-slate-700 text-xs text-slate-200 leading-relaxed line-clamp-3 italic font-medium">
                "{currentCard.body.split('\n')[2] || currentCard.body.slice(0, 120)}..."
              </div>

              {/* Bottom Quick Action Controls */}
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between gap-2.5">
                <button
                  onClick={() => handleSwipe('left', currentCard)}
                  className="flex-1 py-3 px-3 rounded-2xl bg-[#0F172A] hover:bg-rose-900 border-2 border-slate-600 hover:border-rose-400 text-white text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-md"
                >
                  <X className="w-4 h-4 text-rose-400" />
                  <span>Archive</span>
                </button>

                {currentCard.poNumber === 'PO-1045' && (
                  <button
                    onClick={() => handleTriggerVoiceAgent(currentCard)}
                    className="p-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white transition-all active:scale-95 shadow-lg shadow-sky-600/30"
                    title="Launch Autonomous Voice Call"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handleSwipe('right', currentCard)}
                  className="flex-1 py-3 px-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all active:scale-95 flex items-center justify-center gap-1.5 shadow-xl shadow-amber-400/25"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Reply</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Slide-Up AI Response Composer Modal */}
      <AnimatePresence>
        {selectedMail && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-x-0 bottom-0 z-50 bg-slate-900 border-t-2 border-slate-600 p-4.5 rounded-t-3xl shadow-2xl space-y-3.5"
          >
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-extrabold text-white">
                  DINE AI Reply Composer · {selectedMail.poNumber}
                </h4>
              </div>
              <button
                onClick={() => setSelectedMail(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Smart Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-300 uppercase font-black tracking-wider">Select Tone Preset:</span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {selectedMail.suggestedReplies?.map((preset, pi) => (
                  <button
                    key={pi}
                    onClick={() => setActiveReply(preset.text)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors shrink-0 ${
                      activeReply === preset.text
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md'
                        : 'bg-slate-800 text-slate-200 border-slate-600 hover:border-slate-400'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Editable Draft Body */}
            <textarea
              value={activeReply}
              onChange={(e) => setActiveReply(e.target.value)}
              rows={3}
              className="w-full bg-slate-950 border-2 border-slate-700 rounded-2xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-medium leading-relaxed"
            />

            {/* ERP Sync Checkbox */}
            <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer select-none font-bold">
              <input
                type="checkbox"
                checked={syncWithERP}
                onChange={(e) => setSyncWithERP(e.target.checked)}
                className="rounded bg-slate-800 border-slate-500 text-amber-400 focus:ring-0 w-4 h-4"
              />
              <span>Commit revised date (<strong>{selectedMail.bento?.revisedDate}</strong>) directly to ERP</span>
            </label>

            {/* Submit Dispatches */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setSelectedMail(null)}
                className="px-4 py-3 rounded-2xl bg-slate-800 border border-slate-600 text-slate-200 hover:bg-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={isSending || !activeReply.trim()}
                className="flex-1 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-40 shadow-xl shadow-amber-400/25"
              >
                {isSending ? (
                  <span>Dispatching & Committing...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Reply & Commit</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
