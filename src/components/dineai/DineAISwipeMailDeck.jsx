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
  Undo2,
  MessageSquare
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
  const rotate = useTransform(x, [-200, 200], [-10, 10]);

  // Visual drag stamps
  const replyStampOpacity = useTransform(x, [30, 90], [0, 1]);
  const archiveStampOpacity = useTransform(x, [-30, -90], [0, 1]);

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
    <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#080C14]">

      {/* Top Header Controls */}
      <div className="px-5 py-2.5 bg-[#0D1322] border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
          </span>
          <span className="text-xs font-semibold text-slate-200">
            {deck.length} {deck.length === 1 ? 'email' : 'emails'} in queue
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="px-2.5 py-1 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white disabled:opacity-30 transition-colors flex items-center gap-1 text-[11px] font-medium"
            title="Undo last swipe"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
          <button
            onClick={() => setDeck(INITIAL_SWIPEMAIL_ITEMS)}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white transition-colors"
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
            className="absolute top-12 left-4 right-4 z-40 bg-emerald-800/95 text-white border border-emerald-400/60 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 shadow-2xl backdrop-blur-md font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span className="truncate">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Deck Viewport */}
      <div className="flex-1 p-3.5 flex flex-col justify-between relative overflow-hidden">
        {deck.length === 0 ? (
          /* Inbox Zero State */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="my-auto text-center space-y-3 p-6 rounded-3xl bg-[#0F172A] border border-slate-700 shadow-2xl max-w-xs mx-auto"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">All Caught Up!</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                All supplier messages triaged and synchronized with ERP commitments.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => setDeck(INITIAL_SWIPEMAIL_ITEMS)}
                className="w-full py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Demo Queue</span>
              </button>
              <button
                onClick={onSwitchToChat}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              >
                Back to Chat
              </button>
            </div>
          </motion.div>
        ) : (
          /* Active Swipeable Card Deck */
          <div className="relative w-full flex-1 flex flex-col items-center justify-center">

            {/* Background preview stack cards */}
            {deck.slice(1, 3).reverse().map((mail, i) => {
              const depth = deck.slice(1, 3).length - i;
              return (
                <div
                  key={mail.id}
                  style={{
                    transform: `scale(${1 - depth * 0.04}) translateY(${depth * 8}px)`,
                    zIndex: 5 - depth
                  }}
                  className="absolute inset-0 bg-[#0F172A] rounded-2xl border border-slate-800 shadow-lg pointer-events-none opacity-40"
                />
              );
            })}

            {/* Top Interactive Card */}
            <motion.div
              style={{ x, rotate, zIndex: 20 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={(e, info) => {
                if (info.offset.x > 80) {
                  handleSwipe('right', currentCard);
                } else if (info.offset.x < -80) {
                  handleSwipe('left', currentCard);
                }
              }}
              className="absolute inset-0 z-20 bg-[#131E30] rounded-2xl border border-slate-700 shadow-2xl p-4 flex flex-col justify-between cursor-grab active:cursor-grabbing select-none overflow-hidden"
            >
              {/* Overlay Stamp: Quick Reply */}
              <motion.div
                style={{ opacity: replyStampOpacity }}
                className="absolute top-4 right-4 z-30 px-3 py-1.5 rounded-xl border-2 border-emerald-400 bg-emerald-800/90 text-white font-extrabold text-xs tracking-wider uppercase rotate-6 shadow-xl backdrop-blur-sm"
              >
                AI Reply ✉️
              </motion.div>

              {/* Overlay Stamp: Archive */}
              <motion.div
                style={{ opacity: archiveStampOpacity }}
                className="absolute top-4 left-4 z-30 px-3 py-1.5 rounded-xl border-2 border-rose-400 bg-rose-800/90 text-white font-extrabold text-xs tracking-wider uppercase -rotate-6 shadow-xl backdrop-blur-sm"
              >
                Archive 🗑️
              </motion.div>

              {/* ── 1. Clean Header (Sender + Priority) ── */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center shrink-0">
                      {currentCard.from.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white leading-tight">
                        {currentCard.from.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {currentCard.from.company}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    currentCard.priorityTier === 'Critical'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}>
                    ● {currentCard.priorityTier}
                  </span>
                </div>

                {/* ── 2. PO & Subject Summary ── */}
                <div className="bg-[#0A101C] p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-amber-400 font-bold">
                      {currentCard.poNumber}
                    </span>
                    <span className="text-emerald-400 font-semibold">{currentCard.orderValue}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-100 line-clamp-1">
                    {currentCard.subject}
                  </p>
                </div>

                {/* ── 3. Clean Bento Tag Row (Compact, No Box Clutter) ── */}
                <div className="flex items-center gap-1.5 text-[10px]">
                  <div className="flex-1 px-2 py-1 rounded-lg bg-[#0A101C] border border-slate-800 text-slate-300 flex items-center gap-1 truncate">
                    <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                    <span className="truncate">{currentCard.bento?.revisedDate}</span>
                  </div>
                  <div className="flex-1 px-2 py-1 rounded-lg bg-[#0A101C] border border-slate-800 text-slate-300 flex items-center gap-1 truncate">
                    <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                    <span className="truncate">{currentCard.bento?.rootCause}</span>
                  </div>
                </div>

                {/* ── 4. AI Recommendation Pill ── */}
                <div className="px-2.5 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/40 text-[11px] text-purple-200 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                  <span className="truncate font-medium">{currentCard.bento?.aiVerdict}</span>
                </div>
              </div>

              {/* ── 5. Email Excerpt ── */}
              <div className="my-1.5 p-2 rounded-xl bg-[#0A101C]/60 text-[11px] text-slate-300/90 leading-relaxed line-clamp-3 italic">
                "{currentCard.body.split('\n')[2] || currentCard.body.slice(0, 110)}..."
              </div>

              {/* ── 6. Bottom Floating Action Buttons ── */}
              <div className="pt-2 flex items-center justify-center gap-5">
                <button
                  onClick={() => handleSwipe('left', currentCard)}
                  className="w-11 h-11 rounded-full bg-[#0A101C] hover:bg-rose-950/60 border border-slate-700 hover:border-rose-500 text-slate-400 hover:text-rose-300 flex items-center justify-center shadow-lg transition-all active:scale-90"
                  title="Swipe Left to Archive"
                >
                  <X className="w-5 h-5" />
                </button>

                {currentCard.poNumber === 'PO-1045' && (
                  <button
                    onClick={() => handleTriggerVoiceAgent(currentCard)}
                    className="w-10 h-10 rounded-full bg-sky-950/80 hover:bg-sky-900 border border-sky-600/60 text-sky-300 flex items-center justify-center shadow-lg transition-all active:scale-90"
                    title="Launch Voice Call re: PO-1045"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handleSwipe('right', currentCard)}
                  className="w-11 h-11 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/20 transition-all active:scale-90"
                  title="Swipe Right for AI Reply"
                >
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Slide-In Full Cover Reply Composer */}
      <AnimatePresence>
        {selectedMail && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 240 }}
            className="absolute inset-0 z-50 bg-[#0A101C] p-4 flex flex-col justify-between shadow-2xl"
          >
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white leading-none">
                      Draft AI Reply · {selectedMail.poNumber}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      To: {selectedMail.from.name} ({selectedMail.from.company})
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedMail(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tone Presets */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Suggested Presets:</span>
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {selectedMail.suggestedReplies?.map((preset, pi) => (
                    <button
                      key={pi}
                      onClick={() => setActiveReply(preset.text)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors shrink-0 ${
                        activeReply === preset.text
                          ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold'
                          : 'bg-[#131E30] text-slate-300 border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable Draft Textarea */}
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Message Content:</span>
                <textarea
                  value={activeReply}
                  onChange={(e) => setActiveReply(e.target.value)}
                  rows={4}
                  className="w-full bg-[#131E30] border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
                />
              </div>

              {/* ERP Commit Toggle */}
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none bg-[#131E30] p-2.5 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={syncWithERP}
                  onChange={(e) => setSyncWithERP(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-600 text-amber-400 focus:ring-0 w-3.5 h-3.5"
                />
                <span className="text-[11px]">
                  Commit revised date (<strong>{selectedMail.bento?.revisedDate}</strong>) to ERP database
                </span>
              </label>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedMail(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSendReply}
                disabled={isSending || !activeReply.trim()}
                className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 shadow-lg shadow-amber-400/20"
              >
                {isSending ? (
                  <span>Dispatching...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send & Commit</span>
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
