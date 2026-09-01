import React from 'react';
import { useAgent } from '../../context/AgentContext';

function SparkleStar({ className = "w-4 h-4 text-amber-400" }) {
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

export default function DineAIButton({ onClick }) {
  const { isPanelOpen, isRunning } = useAgent();

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={onClick}
        className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#0A0E17] text-white border border-[#1E293B] shadow-2xl hover:border-amber-400/80 hover:shadow-amber-500/10 hover:bg-[#111724] transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer ${
          isPanelOpen ? 'ring-2 ring-amber-400/60' : ''
        }`}
        title="Ask Dine AI"
      >
        {/* Glow halo */}
        <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-sm pointer-events-none group-hover:bg-amber-500/20 transition-all" />

        {/* 4-Point Concave Sparkle Star */}
        <div className="relative">
          <SparkleStar className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
          {isRunning && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          )}
        </div>

        {/* Brand Label */}
        <span className="font-bold text-xs tracking-wider uppercase text-white group-hover:text-amber-300 transition-colors">
          DINE AI
        </span>

        {/* Status indicator badge */}
        <div className="flex items-center gap-1.5 pl-1.5 border-l border-[#1E293B] text-[11px] text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Online</span>
        </div>
      </button>
    </div>
  );
}
