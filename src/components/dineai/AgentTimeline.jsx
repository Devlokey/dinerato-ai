import React, { useState } from 'react';
import { CheckCircle2, Loader2, ChevronDown, ChevronUp, AlertCircle, Clock, RotateCw } from 'lucide-react';

const AGENT_COLORS = {
  analyst:       'text-sky-400',
  expediting:    'text-amber-400',
  communication: 'text-purple-400',
  supplier:      'text-purple-400',
  voice:         'text-emerald-400',
  sourcing:      'text-cyan-400',
  rfq:           'text-indigo-400',
  quote:         'text-rose-400',
};

function agentColor(name = '') {
  const n = name.toLowerCase();
  for (const [key, cls] of Object.entries(AGENT_COLORS)) {
    if (n.includes(key)) return cls;
  }
  return 'text-amber-400';
}

function formatTimestamp(ts) {
  if (!ts) return '43:00';
  // If timestamp like "10:43:04" or "43:04", trim to mm:ss
  const parts = ts.split(':');
  if (parts.length === 3) return `${parts[1]}:${parts[2]}`;
  return ts;
}

export default function AgentTimeline({ steps = [] }) {
  const [collapsed, setCollapsed] = useState(false);
  if (!steps || steps.length === 0) return null;

  const done = steps.filter(s => s.status === 'completed' || s.isCompleted).length;

  return (
    <div className="rounded-2xl bg-[#0F1622] border border-[#1E293B] overflow-hidden shadow-md my-2">
      {/* Header */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full px-4 py-3 flex items-center justify-between text-xs transition-colors select-none"
      >
        <div className="flex items-center gap-2">
          {/* Audio waveform glyph */}
          <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M4 10v4" />
            <path d="M8 6v12" />
            <path d="M12 3v18" />
            <path d="M16 8v8" />
            <path d="M20 11v2" />
          </svg>
          <span className="font-semibold text-white text-xs">Agent Activity</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-stone-400 text-[11px] font-sans">
            {done} / {steps.length} complete
          </span>
          {collapsed
            ? <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            : <ChevronUp className="w-3.5 h-3.5 text-stone-400" />}
        </div>
      </button>

      {/* Steps list */}
      {!collapsed && (
        <div className="px-4 pb-4 pt-1 max-h-72 overflow-y-auto">
          <div className="relative pl-6 space-y-4">
            {/* Continuous vertical guide line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-stone-700/50" />

            {steps.map((step, idx) => {
              const isCompleted = step.status === 'completed' || step.isCompleted;
              const isError = step.status === 'error';
              const isActive = !isCompleted && !isError && idx === steps.length - 1;

              const agentName = step.agent || 'DINE AI Agent';
              const isPurple = agentName.toLowerCase().includes('communication') || agentName.toLowerCase().includes('supplier');
              const isAmber = agentName.toLowerCase().includes('expediting');

              return (
                <div key={step.id || idx} className="relative flex items-start gap-3 text-xs animate-fade-in">
                  {/* Step Icon placed exactly over the vertical line */}
                  <div className="absolute -left-6 top-0.5 flex items-center justify-center w-4 h-4 bg-[#0F1622] z-10">
                    {isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isError ? (
                      <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                    ) : isActive ? (
                      isAmber ? (
                        <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      ) : isPurple ? (
                        <RotateCw className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                      ) : (
                        <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                      )
                    ) : (
                      <div className="w-2.5 h-2.5 rounded-full border border-stone-600 bg-stone-800" />
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="font-mono text-[11px] text-stone-400 shrink-0 w-11 select-none pt-0.5">
                    {formatTimestamp(step.timestamp)}
                  </span>

                  {/* Agent content */}
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className={`font-medium text-xs leading-tight ${agentColor(agentName)}`}>
                      {agentName}
                    </span>
                    <span className="text-stone-300 text-[11px] leading-relaxed break-words">
                      {step.text || step.action || step.message}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
