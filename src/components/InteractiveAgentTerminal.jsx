import React, { useState } from 'react'
import { Sparkles, Terminal, Send, CheckCircle2, RefreshCw, ArrowRight, CornerDownLeft, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function InteractiveAgentTerminal({ onOpenDemo }) {
  const [selectedPrompt, setSelectedPrompt] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [outputLogs, setOutputLogs] = useState([])
  const [customInput, setCustomInput] = useState('')

  const samplePrompts = [
    {
      label: "Parse & Ingest Order",
      query: "Customer sent WhatsApp image of handwritten order for Lily's Cafe (10 cases Roma Tomatoes, 5 prime rib eyes, slice 1-inch)",
      agent: "Sales & Operations Agent",
      action: "Parsing WhatsApp audio & visual image OCR...",
      results: [
        "Identified Customer: Lily's Cafe (Account #8849)",
        "Parsed Line Item 1: 10 Cases Roma Tomatoes (SKU #TM-200) -> Matched in Stock",
        "Parsed Line Item 2: 5 Prime Ribeye (SKU #RB-910) -> Custom Cut spec '1-inch' attached",
        "ERP Order created: #SO-9921 -> Sent to Picking Station with cut ticket"
      ]
    },
    {
      label: "Autonomous Reorder",
      query: "Check stock on Atlantic Salmon and trigger purchase orders for upcoming Friday surge",
      agent: "Procurement Agent",
      action: "Analyzing 12-week historical velocity & weather forecast...",
      results: [
        "Current On-Hand: 145 portions (Projected runout: Thursday 18:00)",
        "Optimal Order Quantity: +200 lbs from Norway Seafoods Direct",
        "Supplier Price: $11.20/lb (locked via contract #CN-42)",
        "Purchase Order #PO-4091 transmitted via EDI 850 automatically"
      ]
    },
    {
      label: "Smart Collections Call",
      query: "Follow up with Corner Bistro on overdue invoice #INV-2845 ($3,275.00)",
      agent: "Credit Control Agent",
      action: "Reviewing payment history and generating personalized follow-up...",
      results: [
        "Customer Risk Score: Low (98% on-time payment track record)",
        "Triggered polite conversational email + SMS payment link with 1-click Apple Pay",
        "Detected response: 'Chef was away, approving today'",
        "Payment promise logged -> Scheduled automated bank account match for tomorrow 09:00"
      ]
    }
  ]

  const runSimulation = (index) => {
    setSelectedPrompt(index)
    setIsProcessing(true)
    setOutputLogs([])

    const current = samplePrompts[index]
    let logIndex = 0

    const interval = setInterval(() => {
      if (logIndex < current.results.length) {
        setOutputLogs(prev => [...prev, current.results[logIndex]])
        logIndex++
      } else {
        clearInterval(interval)
        setIsProcessing(false)
      }
    }, 450)
  }

  // Run initial simulation on load
  React.useEffect(() => {
    runSimulation(0)
  }, [])

  return (
    <section id="terminal" className="py-20 md:py-28 bg-[#F4F2EB] border-t border-[#E8E5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E8E5DC] text-[#383630] text-xs font-semibold uppercase tracking-wider mb-4">
            <Terminal className="w-3.5 h-3.5" />
            <span>Interactive Sandbox</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#141412] tracking-tight">
            See the agents execute in real time
          </h2>
          <p className="text-base text-[#524F47] mt-3">
            Select a real-world distributor prompt below to see how Dinerato agents autonomously ingest, reason, and take action inside your ERP.
          </p>
        </div>

        {/* Terminal Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Prompts selection */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-[#757266] px-1">
              Select Scenario:
            </div>
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => runSimulation(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all text-sm ${
                  selectedPrompt === idx
                    ? 'bg-[#141412] text-white border-[#141412] shadow-lg'
                    : 'bg-white text-[#141412] border-[#E8E5DC] hover:border-[#D5D1C4] hover:bg-[#FAF9F5]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">{p.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    selectedPrompt === idx ? 'bg-white/20 text-white' : 'bg-[#FAF9F5] text-[#757266]'
                  }`}>
                    {p.agent.split(' ')[0]}
                  </span>
                </div>
                <p className={`text-xs line-clamp-2 ${selectedPrompt === idx ? 'text-white/70' : 'text-[#757266]'}`}>
                  {p.query}
                </p>
              </button>
            ))}

            <div className="p-4 rounded-2xl bg-white/70 border border-[#E8E5DC] mt-4 text-xs text-[#524F47]">
              <div className="font-semibold text-[#141412] mb-1">Want to test with your own ERP data?</div>
              <p>Join the waitlist to test Dinerato running against your actual historical catalogs and order emails.</p>
              <button 
                onClick={onOpenDemo}
                className="mt-3 text-xs font-semibold text-[#141412] hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>Join the waitlist</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Terminal Console View */}
          <div className="lg:col-span-8 bg-[#141412] rounded-3xl p-6 shadow-2xl border border-white/10 text-white min-h-[380px] flex flex-col justify-between">
            <div>
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs text-white/60">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-white/80">dinerato-agent-runtime — {samplePrompts[selectedPrompt].agent}</span>
                </div>
                <span className="font-mono text-emerald-400 text-[11px] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>ONLINE</span>
                </span>
              </div>

              {/* Input Query Bubble */}
              <div className="mt-4 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs sm:text-sm text-white/90">
                <div className="text-[11px] text-white/40 uppercase font-semibold mb-1">Incoming Trigger Event:</div>
                <div className="font-mono">{samplePrompts[selectedPrompt].query}</div>
              </div>

              {/* Real-time Agent Execution Log Output */}
              <div className="mt-5 space-y-2 font-mono text-xs sm:text-[13px]">
                <div className="text-white/50 flex items-center space-x-2">
                  <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin text-amber-400' : 'text-emerald-400'}`} />
                  <span>{samplePrompts[selectedPrompt].action}</span>
                </div>

                <div className="space-y-2 mt-3 pl-2 border-l-2 border-white/10">
                  {outputLogs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start space-x-2 text-emerald-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-white/90">{log}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Terminal status bar */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40">
              <span>Latency: 0.28s • Zero Human Intervention • Audit Log Generated</span>
              <span className="font-mono text-white/60">OK: 200 SUCCESS</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}
