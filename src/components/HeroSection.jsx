import React, { useState } from 'react'
import { ArrowUpRight, BarChart3, Package, Wallet, Wrench, CheckCircle2, TrendingUp, Sparkles, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HeroSection({ onOpenDemo }) {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    {
      id: 'sales',
      title: 'Sales & operations',
      desc: 'Automate order intake and sales workflows across every channel with AI precision.',
      icon: BarChart3,
      imageBg: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80', // Food market & produce
      stats: [
        { label: 'EDI / Email Parse Rate', val: '99.98%' },
        { label: 'Auto-Matched SKUs', val: '1,420 items' },
        { label: 'Avg Ingestion Time', val: '1.2 sec' }
      ],
      // Contextual Visual Content for Sales
      type: 'sales',
    },
    {
      id: 'procurement',
      title: 'Procurement',
      desc: 'Smart procurement that keeps inventory stocked while optimizing costs and supplier relationships.',
      icon: Package,
      imageBg: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80', // Strawberry & produce crates
      stats: [
        { label: 'Stockout Reduction', val: '94.2%' },
        { label: 'Dynamic Lead Time', val: 'Adaptive' },
        { label: 'Purchase Orders Saved', val: '18 hrs/wk' }
      ],
      // Contextual Visual Content: The iconic Forecast Graph & Annotation
      type: 'procurement',
    },
    {
      id: 'credit',
      title: 'Credit control',
      desc: 'Automate collections and follow-ups while protecting customer relationships.',
      icon: Wallet,
      imageBg: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80', // Accounting & invoices ledger
      stats: [
        { label: 'Collections Cleared', val: '$320,400' },
        { label: 'Dispute Resolution', val: '< 4 hours' },
        { label: 'Customer Retention', val: '99.4%' }
      ],
      // Contextual Visual Content for Credit Control
      type: 'credit',
    },
    {
      id: 'custom',
      title: 'Custom solutions',
      desc: 'Build specialized agents for your unique supply chain challenges and processes.',
      icon: Wrench,
      imageBg: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80', // Warehouse & logistics hub
      stats: [
        { label: 'Proprietary Integrations', val: 'Any ERP/WMS' },
        { label: 'Custom Rule Engine', val: 'Real-time' },
        { label: 'Audit Trail', val: 'SOC2 Type II' }
      ],
      // Contextual Visual Content for Custom Solutions
      type: 'custom',
    }
  ]

  const current = tabs[activeTab]

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-noise">
      {/* Ambient background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-[#E8E5DC]/40 via-[#FAF9F5] to-[#FAF9F5] rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header & Intro text */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal leading-[1.06] tracking-tight text-[#141412]">
              Automate distribution with AI agents
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-[#524F47] font-normal leading-relaxed max-w-2xl">
              Deploy AI agents across teams to eliminate manual work and scale without adding headcount.
            </p>

            {/* CTA Button Group */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenDemo}
                className="group inline-flex items-center space-x-3 px-7 py-3.5 rounded-full text-base font-medium text-white bg-[#141412] hover:bg-[#22211E] active:scale-[0.98] transition-all shadow-md hover:shadow-xl cursor-pointer"
              >
                <span>Join the waitlist</span>
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                  <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                </div>
              </button>
            </div>
          </motion.div>
        </div>

        {/* Hero Interactive Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Interactive Dark Tab Selector Card */}
          <div className="lg:col-span-5 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#383836] rounded-[24px] p-4 sm:p-5 shadow-2xl border border-white/10 flex flex-col justify-between h-full text-white"
            >
              <div className="space-y-2">
                {tabs.map((tab, idx) => {
                  const Icon = tab.icon
                  const isSelected = activeTab === idx

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(idx)}
                      className={`w-full text-left p-3.5 rounded-2xl transition-all duration-200 relative group cursor-pointer ${
                        isSelected 
                          ? 'bg-white/10 shadow-inner' 
                          : 'hover:bg-white/5 opacity-75 hover:opacity-100'
                      }`}
                    >
                      {/* Active Indicator Bar */}
                      {isSelected && (
                        <motion.div
                          layoutId="heroTabIndicator"
                          className="absolute left-0 top-3 bottom-3 w-1 bg-white rounded-r-full"
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}

                      <div className="flex items-start space-x-3.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isSelected ? 'bg-white text-black' : 'bg-white/10 text-white/90 group-hover:bg-white/15'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-[21px] font-normal text-white leading-tight">
                              {tab.title}
                            </span>
                          </div>
                          <p className="text-[12.5px] text-white/70 font-sans mt-1 leading-snug">
                            {tab.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Bottom Card Summary info */}
              <div className="mt-4 pt-4 border-t border-white/10 px-2 flex items-center justify-between text-xs text-white/60">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Autonomous multi-agent orchestration</span>
                </span>
                <span className="font-mono text-white/40">v2.4.0</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Context-Aware Visual Stage */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full min-h-[480px] rounded-[24px] overflow-hidden shadow-2xl border border-[#D5D1C4] group bg-[#141412]"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  {/* Background Photography for each specific tab */}
                  <img
                    src={current.imageBg}
                    alt={current.title}
                    className="w-full h-full object-cover object-center filter brightness-[0.78] contrast-[1.08]"
                  />

                  {/* Gradient vignettes */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

                  {/* ========================================================================= */}
                  {/* ONLY FOR PROCUREMENT: Show the White Chalk Curve & STOCKED + FORECAST ADJUSTED */}
                  {/* ========================================================================= */}
                  {current.type === 'procurement' && (
                    <>
                      {/* Stylized White Chalk-style Forecast Graph Overlay */}
                      <div className="absolute inset-x-8 top-12 bottom-24 pointer-events-none flex items-center justify-center">
                        <svg viewBox="0 0 480 180" className="w-full h-full opacity-90 drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)]">
                          <line x1="10" y1="150" x2="470" y2="150" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                          <line x1="10" y1="20" x2="10" y2="150" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                          
                          <motion.path
                            d="M 15 135 Q 90 20, 160 95 T 310 40 T 465 110"
                            fill="none"
                            stroke="#FFFFFF"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1.2, ease: "easeInOut" }}
                          />
                        </svg>
                      </div>

                      {/* Handwritten Annotation Overlay (Only for Procurement) */}
                      <div className="absolute top-1/2 left-8 -translate-y-1/2 pointer-events-none">
                        <div className="font-serif italic text-white text-2xl sm:text-3xl font-normal tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
                          STOCKED + FORECAST
                          <div className="text-xl sm:text-2xl text-white/90">ADJUSTED</div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ========================================================================= */}
                  {/* FOR SALES & OPERATIONS: Show Order Intake & OCR Verification Card */}
                  {/* ========================================================================= */}
                  {current.type === 'sales' && (
                    <div className="absolute inset-x-8 top-10 bottom-28 flex flex-col justify-center items-start">
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-5 max-w-md w-full shadow-2xl"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="font-serif text-lg text-white">Live Multi-Channel Intake</span>
                          </div>
                          <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                            Auto-Parsed
                          </span>
                        </div>

                        <div className="mt-3 space-y-2 text-xs">
                          <div className="flex items-center justify-between p-2 rounded-xl bg-white/10 text-white/90">
                            <div className="flex items-center space-x-2 truncate">
                              <span className="text-white/50">WhatsApp:</span>
                              <span className="font-medium">10 Cases Roma Tomatoes</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-mono">Matched (100%)</span>
                          </div>

                          <div className="flex items-center justify-between p-2 rounded-xl bg-white/10 text-white/90">
                            <div className="flex items-center space-x-2 truncate">
                              <span className="text-white/50">Email PDF:</span>
                              <span className="font-medium">5 Prime Ribeye (1-inch cut)</span>
                            </div>
                            <span className="text-[10px] text-emerald-400 font-mono">Cut Attached</span>
                          </div>

                          <div className="pt-2 text-[11px] text-white/60 flex items-center justify-between">
                            <span>Synced to ERP Order #SO-9921</span>
                            <span className="text-white/80 font-medium">Ready for Picking</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* FOR CREDIT CONTROL: Show Autonomous Collections & DSO Card */}
                  {/* ========================================================================= */}
                  {current.type === 'credit' && (
                    <div className="absolute inset-x-8 top-10 bottom-28 flex flex-col justify-center items-start">
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-5 max-w-md w-full shadow-2xl"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <div className="flex items-center space-x-2">
                            <span className="w-2 h-2 rounded-full bg-blue-400" />
                            <span className="font-serif text-lg text-white">Autonomous Receivables</span>
                          </div>
                          <span className="text-[11px] font-mono text-blue-300 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-500/30">
                            DSO -14 Days
                          </span>
                        </div>

                        <div className="mt-3 space-y-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-white/10 text-white/90 flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-white">Corner Bistro — $3,275.00</div>
                              <div className="text-[11px] text-white/60 mt-0.5">Polite conversational follow-up sent</div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-medium">
                              Paid Today
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white/10 text-white/90 flex items-center justify-between">
                            <div>
                              <div className="font-semibold text-white">Lily's Cafe — $2,340.00</div>
                              <div className="text-[11px] text-white/60 mt-0.5">Auto-reconciled with bank deposit</div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-medium">
                              Cleared
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* FOR CUSTOM SOLUTIONS: Show ERP & Workflow Mesh Node */}
                  {/* ========================================================================= */}
                  {current.type === 'custom' && (
                    <div className="absolute inset-x-8 top-10 bottom-28 flex flex-col justify-center items-start">
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-black/60 backdrop-blur-xl border border-white/20 rounded-2xl p-5 max-w-md w-full shadow-2xl"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-purple-400" />
                            <span className="font-serif text-lg text-white">Custom Neural Routing</span>
                          </div>
                          <span className="text-[11px] font-mono text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                            Active Flow
                          </span>
                        </div>

                        <div className="mt-3 space-y-2 text-xs font-mono">
                          <div className="p-2 rounded-xl bg-white/10 text-white/90 flex items-center justify-between">
                            <span>[Inbound Hook] EDI 850 Order</span>
                            <span className="text-emerald-400">&rarr; Connected</span>
                          </div>
                          <div className="p-2 rounded-xl bg-white/10 text-white/90 flex items-center justify-between">
                            <span>[Logic] Cold-Chain Cross Dock</span>
                            <span className="text-purple-300">&rarr; Auto-Routed</span>
                          </div>
                          <div className="p-2 rounded-xl bg-white/10 text-white/90 flex items-center justify-between">
                            <span>[ERP Sync] SAP B1 / NetSuite</span>
                            <span className="text-emerald-400">&rarr; Verified</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Bottom Stats Overlay Bar (Appropriate for each tab) */}
                  <div className="absolute bottom-6 inset-x-6">
                    <div className="bg-black/75 backdrop-blur-xl border border-white/15 rounded-2xl p-4 grid grid-cols-3 gap-3">
                      {current.stats.map((st, i) => (
                        <div key={i} className="text-left">
                          <div className="text-[11px] sm:text-xs text-white/60 font-medium truncate">{st.label}</div>
                          <div className="text-sm sm:text-base font-semibold text-white mt-0.5 tracking-tight">{st.val}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

        </div>

      </div>
    </section>
  )
}
