import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useSearchParams, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAgent } from '../../context/AgentContext';
import { useERP } from '../../context/ERPContext';
import {
  DineAIButton,
  DineAIPanel,
  VoiceCallUI,
  ApprovalModal,
  QuoteComparison
} from '../dineai';
import { runChaseOverdueFlow, runSourceAndRFQFlow } from '../../agents/orchestrator';

export default function ERPLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const agentContext = useAgent();
  const erpContext = useERP();

  const {
    isPanelOpen,
    setIsPanelOpen,
    voiceCallActive,
    voiceCallData,
    closeVoiceCall,
    approvalModalData,
    resolveApproval,
    quoteComparisonData,
    setQuoteComparisonData
  } = agentContext;

  const triggeredRef = useRef(false);

  // Detect and auto-trigger demo flows on launch from LandingPage
  useEffect(() => {
    const autoTrigger = searchParams.get('autoTrigger');
    if (autoTrigger && !triggeredRef.current) {
      triggeredRef.current = true;

      // Clear the query parameter cleanly from browser URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);

      // Trigger respective demo flow after small UI mounting delay
      const timer = setTimeout(() => {
        if (autoTrigger === 'chase') {
          runChaseOverdueFlow({
            agentContext,
            erpContext,
            userMessage: 'Chase overdue POs'
          });
        } else if (autoTrigger === 'source') {
          runSourceAndRFQFlow({
            agentContext,
            erpContext,
            userMessage: 'Find suppliers for 500 units of Product X'
          });
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [searchParams, agentContext, erpContext]);

  return (
    <div className="min-h-screen bg-[#FAF9F5] flex flex-col font-sans text-stone-900 overflow-x-hidden antialiased selection:bg-[#141412] selection:text-[#FAF9F5]">
      {/* Main ERP Layout Frame */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggleCollapse={() => setSidebarCollapsed(prev => !prev)} 
        />

        {/* Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FAF9F5] overflow-hidden">
          {/* Header Bar */}
          <Header />

          {/* Router Outlet for ERP Pages */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#FAF9F5]">
            <div className="max-w-7xl mx-auto space-y-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Persistent Floating DINE AI Button */}
      <DineAIButton onClick={() => setIsPanelOpen(prev => !prev)} />

      {/* Slide-in DINE AI Copilot Panel */}
      <DineAIPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
      />

      {/* Voice Call UI Modal Overlay */}
      {voiceCallActive && (
        <VoiceCallUI
          callData={voiceCallData}
          onComplete={(res) => {
            if (voiceCallData?.onCallFinished) {
              voiceCallData.onCallFinished(res);
            } else {
              closeVoiceCall();
            }
          }}
          onClose={() => closeVoiceCall()}
        />
      )}

      {/* Human-in-the-Loop Approval Modal */}
      {approvalModalData && (
        <ApprovalModal
          data={approvalModalData}
          onApprove={(res) => resolveApproval({ decision: 'APPROVE', ...res })}
          onReject={(res) => resolveApproval({ decision: 'REJECT', ...res })}
          onReview={(res) => resolveApproval({ decision: 'REVIEW', ...res })}
        />
      )}

      {/* Quote Comparison Full-screen Modal (Source & RFQ Flow) */}
      {quoteComparisonData && !isPanelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm">
          <div className="w-full max-w-4xl bg-[#141412] border border-stone-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 bg-[#0E0E0C] border-b border-stone-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">RFQ-104 — Quote Intelligence Analysis</h3>
              <button
                onClick={() => setQuoteComparisonData(null)}
                className="p-1.5 rounded-md text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >✕</button>
            </div>
            <div className="p-6">
              <QuoteComparison data={quoteComparisonData} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
