import React from 'react';
import { isGeminiConfigured } from '../../services/geminiService';
import { isVapiConfigured } from '../../services/vapiService';

export const SystemStatusFooter = () => {
  const geminiOnline = isGeminiConfigured();
  const vapiOnline = isVapiConfigured();

  return (
    <div className="px-4 py-2.5 bg-[#100F0E] border-t border-stone-800 text-[10px] font-mono text-stone-400 select-none">
      <div className="flex flex-wrap items-center justify-between gap-y-1.5 gap-x-3">
        {/* ERP Status */}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-stone-300">ERP</span>
          <span className="text-stone-500">● Demo</span>
        </div>

        {/* Voice Agent */}
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${vapiOnline ? 'bg-purple-400' : 'bg-emerald-400'}`} />
          <span className="text-stone-300">Voice</span>
          <span className={vapiOnline ? 'text-purple-400' : 'text-stone-500'}>
            {vapiOnline ? '● Vapi Live' : '● Demo Mode'}
          </span>
        </div>


        {/* Email */}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-stone-300">Email</span>
          <span className="text-stone-500">● Demo</span>
        </div>

        {/* Agents */}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span className="text-stone-300">Agents</span>
          <span className="text-stone-500">● 7 Active</span>
        </div>

        {/* AI Intelligence Engine */}
        <div className="flex items-center gap-1.5 w-full pt-1 border-t border-stone-900 justify-between text-[9px]">
          <span className="text-stone-500">AI Intelligence Engine:</span>
          <span className={geminiOnline ? 'text-emerald-400' : 'text-amber-400'}>
            {geminiOnline ? '● Neural Engine (Online)' : '● Heuristic Engine (Local)'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemStatusFooter;
