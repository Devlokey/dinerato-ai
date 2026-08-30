import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FaqSection({ onOpenDemo }) {
  const [openIndex, setOpenIndex] = useState(0)

  const faqs = [
    {
      q: "How does Dinerato connect with our existing ERP without breaking custom scripts?",
      a: "Dinerato connects non-invasively through standard REST/OData APIs, secure SQL endpoints, or native connectors (SAP B1, NetSuite, Dynamics). Our agents operate with granular read/write permissions, logging every audit event with 100% traceability."
    },
    {
      q: "Can the agents handle handwriting, unstructured emails, and voice memos from chefs?",
      a: "Yes. Our Sales & Operations agent is trained specifically on food and supply chain terminology, cut specifications, catch-weights, and regional slang. Whether an order comes via WhatsApp audio, messy PDF, or email thread, it is transcribed and matched with 99.99% SKU precision."
    },
    {
      q: "How fast can we go live with our first autonomous workflow?",
      a: "Most distributors launch their first agent (typically Order Ingestion or Inventory Monitoring) in under 10 business days. Our pre-built ERP connectors and historical dataset matching ensure rapid time-to-value."
    },
    {
      q: "What happens if an agent encounters an ambiguous SKU or unfamiliar customer note?",
      a: "Dinerato features an intelligent 'Human-in-the-Loop' routing system. If confidence is below 99.8%, the agent flags the line item with a 1-click resolution card for your rep, learning the correction permanently for all future orders."
    }
  ]

  return (
    <section id="faq" className="py-20 md:py-28 bg-[#FAF9F5] border-t border-[#E8E5DC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-14">
          <div className="text-xs font-bold uppercase tracking-wider text-[#757266] mb-2">
            Frequently Asked Questions
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#141412] tracking-tight">
            Everything you need to know about deploying Dinerato
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-[#E8E5DC] overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full p-6 text-left flex items-center justify-between space-x-4 focus:outline-hidden"
                >
                  <span className="text-base sm:text-lg font-medium text-[#141412] tracking-tight">
                    {faq.q}
                  </span>
                  <div className={`p-1.5 rounded-full bg-[#FAF9F5] text-[#141412] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 bg-[#141412] text-white' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="px-6 pb-6 text-sm text-[#524F47] leading-relaxed border-t border-[#E8E5DC]/50 pt-4"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-[#524F47]">
            Have a custom workflow question?{' '}
            <button 
              onClick={onOpenDemo}
              className="text-[#141412] font-semibold underline hover:opacity-80"
            >
              Talk to an AI engineer
            </button>
          </p>
        </div>

      </div>
    </section>
  )
}
