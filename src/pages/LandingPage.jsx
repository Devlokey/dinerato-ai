import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  PhoneCall,
  Bot,
  Zap,
  Sparkles,
  ShieldCheck,
  Building2,
  TrendingUp,
  Cpu,
  Layers,
  CheckCircle2,
  Lock,
  Workflow
} from 'lucide-react';
import DineratoLogo from '../components/shared/DineratoLogo';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLaunchPrimaryDemo = () => {
    // Navigate to PO-1045 with autoTrigger=chase
    navigate('/erp/purchase-orders/PO-1045?autoTrigger=chase');
  };

  const handleLaunchSourcingDemo = () => {
    // Navigate to RFQs with autoTrigger=source
    navigate('/erp/rfqs?autoTrigger=source');
  };

  const handleExploreFreely = () => {
    navigate('/erp/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#141412] text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden relative">
      {/* Background Subtle Gradient Mesh & Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-1/3 -left-32 w-72 h-72 bg-blue-600/10 blur-3xl rounded-full" />
        <div className="absolute top-2/3 -right-32 w-80 h-80 bg-amber-500/10 blur-3xl rounded-full" />
      </div>

      {/* Top Exhibition Navigation Bar */}
      <header className="relative z-10 w-full border-b border-stone-800/80 bg-[#141412]/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DineratoLogo className="h-7" color="white" />
            <div className="h-4 w-px bg-stone-700 mx-1 hidden sm:block" />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[11px] font-semibold text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Exhibition Interactive Prototype
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExploreFreely}
              className="px-3.5 py-1.5 text-xs font-medium text-stone-300 hover:text-white bg-stone-800/60 hover:bg-stone-800 border border-stone-700/60 rounded-lg transition-colors"
            >
              Enter Direct ERP
            </button>
            <button
              onClick={handleLaunchPrimaryDemo}
              className="px-3.5 py-1.5 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm shadow-amber-500/20 flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              <span>Live Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 lg:py-16 max-w-6xl mx-auto w-full text-center space-y-12">
        {/* Main Brand & Taglines */}
        <div className="space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800/90 border border-stone-700 text-amber-400 text-xs font-semibold tracking-wide shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Autonomous Procurement Operations Layer</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white font-serif leading-[1.1]">
            DINE <span className="text-amber-400 font-sans tracking-normal">AI</span>
          </h1>

          <p className="text-xl sm:text-2xl text-stone-200 font-medium font-serif italic max-w-2xl mx-auto">
            "Your ERP, with an AI agent built in."
          </p>

          <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-stone-400 font-bold">
            Ask. Instruct. Execute.
          </p>

          <p className="text-sm text-stone-400 max-w-xl mx-auto leading-relaxed pt-2">
            Experience next-generation procurement operations: 7 autonomous agents actively monitoring purchase orders, expediting vendors over real-time synthesized voice calls, and negotiating quotations with built-in human governance.
          </p>
        </div>

        {/* 3 Prominent Demo Launch Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 text-left pt-2">
          {/* Card 1: Primary Demo Flow */}
          <div
            onClick={handleLaunchPrimaryDemo}
            className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-b from-[#1c1b18] to-[#161513] border-2 border-red-500/40 hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-red-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-red-500/20 transition-all" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  PRIMARY DEMO
                </span>
                <span className="text-[10px] font-mono text-stone-500 uppercase">PO-1045 • ₹6,00,000</span>
              </div>

              <h2 className="text-lg font-bold text-white group-hover:text-red-300 transition-colors flex items-center gap-2">
                <span>Chase Overdue PO</span>
              </h2>

              <p className="text-xs text-stone-400 leading-relaxed">
                Autonomous voice call to vendor rep Rajesh Kumar (ABC Components), real-time dialogue transcription, delivery commitment extraction (Sep 15), and ₹1,00,000 threshold human approval gate.
              </p>

              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">Voice Synthesis</span>
                <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">HITL Gate</span>
                <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">Audit Log</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs font-semibold text-red-400 group-hover:text-red-300">
              <span>Launch Primary Flow</span>
              <div className="p-1.5 rounded-full bg-red-500/10 group-hover:bg-red-500 group-hover:text-white transition-all transform group-hover:translate-x-1">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: Sourcing & RFQ Demo Flow */}
          <div
            onClick={handleLaunchSourcingDemo}
            className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-b from-[#1c1b18] to-[#161513] border-2 border-blue-500/40 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  SOURCING DEMO
                </span>
                <span className="text-[10px] font-mono text-stone-500 uppercase">RFQ-104 • 500 units</span>
              </div>

              <h2 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors flex items-center gap-2">
                <span>Source & RFQ</span>
              </h2>

              <p className="text-xs text-stone-400 leading-relaxed">
                Evaluates 6 industrial suppliers, shortlists 4 candidates, generates RFQ-104, receives 3 competitive bids, and benchmarks price vs lead-time with AI scoring matrix.
              </p>

              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">Multi-Quote Matrix</span>
                <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">Scoring Engine</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
              <span>Launch Sourcing Flow</span>
              <div className="p-1.5 rounded-full bg-blue-500/10 group-hover:bg-blue-500 group-hover:text-white transition-all transform group-hover:translate-x-1">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 3: Free Interactive ERP Exploration */}
          <div
            onClick={handleExploreFreely}
            className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-b from-[#1c1b18] to-[#161513] border-2 border-stone-700/80 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-400/10 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 blur-2xl rounded-full pointer-events-none group-hover:bg-amber-500/20 transition-all" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  INTERACTIVE ERP
                </span>
                <span className="text-[10px] font-mono text-stone-500 uppercase">9 Modules + Governance</span>
              </div>

              <h2 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-2">
                <span>Explore Freely</span>
              </h2>

              <p className="text-xs text-stone-400 leading-relaxed">
                Full access to Executive Dashboard, 40 Purchase Orders, 25 Suppliers, Inventory, Delivery tracking, Agent Permissions matrix, Audit Log, and the floating DINE AI Copilot.
              </p>

              <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">Full Access</span>
                <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">Free Chat</span>
                <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">7 Agents</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-800/80 flex items-center justify-between text-xs font-semibold text-stone-300 group-hover:text-amber-300">
              <span>Enter Executive Dashboard</span>
              <div className="p-1.5 rounded-full bg-stone-800 group-hover:bg-amber-400 group-hover:text-stone-950 transition-all transform group-hover:translate-x-1">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Key Feature Preview Grid */}
        <div className="w-full pt-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">
              Key Capabilities Built Into The Operations Layer
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 flex items-start space-x-3.5">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-stone-100">Autonomous Voice Calling</h4>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Voice Agent conducts real conversational tele-calls with vendor dispatchers to verify delivery commitments with 94%+ NLP confidence.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 flex items-start space-x-3.5">
              <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-stone-100">Multi-Agent Intelligence</h4>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  7 specialized sub-agents coordinate synchronously across risk analysis, expediting, vendor messaging, RFQs, and quote scoring.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-900/60 border border-stone-800 flex items-start space-x-3.5">
              <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-stone-100">Real-time ERP Integration & HITL</h4>
                <p className="text-[11px] text-stone-400 leading-relaxed">
                  Bi-directional synchronization with mock ERP state, enforced ₹1,00,000 threshold human approval gates, and immutable audit logging.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Small Footnote */}
        <div className="pt-4 border-t border-stone-800/80 w-full flex flex-col sm:flex-row items-center justify-between text-stone-500 text-xs gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px]">DINE AI v2.4 Engine Active • 7 Agents Online</span>
          </div>
          <div className="text-[11px] font-mono text-stone-400">
            Interactive prototype — currently in development for DINE AI Exhibition.
          </div>
        </div>
      </main>
    </div>
  );
}
