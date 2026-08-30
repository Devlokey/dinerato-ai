import React from 'react'
import { Database, Cable, RefreshCcw, Layers, Server, MessageSquare, Mail, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

export default function IntegrationSection() {
  const integrations = [
    { category: 'ERP & Accounting', list: ['SAP Business One', 'NetSuite', 'Microsoft Dynamics 365', 'QuickBooks Enterprise', 'Sage Intacct', 'Encompass'] },
    { category: 'EDI & Ordering Channels', list: ['EDI 850 / 810 / 855', 'Email PDF Parsing', 'WhatsApp Business API', 'SPS Commerce', 'TrueCommerce'] },
    { category: 'WMS & Logistics', list: ['Manhattan Associates', 'HighJump / Körber', 'Blue Yonder', 'Custom SQL / REST APIs'] }
  ]

  return (
    <section id="workflows" className="py-20 md:py-28 bg-[#FAF9F5] border-t border-[#E8E5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E8E5DC] text-[#383630] text-xs font-semibold uppercase tracking-wider mb-4">
            <Cable className="w-3.5 h-3.5" />
            <span>Plug & Play Infrastructure</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#141412] tracking-tight">
            Connects seamlessly with your existing stack
          </h2>
          <p className="text-base text-[#524F47] mt-3">
            No costly rip-and-replace. Dinerato sits on top of your current ERP, WMS, and communication tools via enterprise connectors and bi-directional webhooks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {integrations.map((group, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-[#E8E5DC] shadow-sm hover:shadow-md hover:border-[#D5D1C4] transition-all"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-[#757266] mb-4">
                {group.category}
              </div>

              <div className="space-y-3">
                {group.list.map((tool, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F5] hover:bg-[#F4F2EB] border border-[#E8E5DC]/60 transition-colors text-sm font-medium text-[#141412]"
                  >
                    <span>{tool}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security & Compliance Banner */}
        <div className="mt-12 p-6 rounded-3xl bg-[#F4F2EB] border border-[#E8E5DC] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-white text-[#141412] shadow-xs">
              <Shield className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#141412]">Enterprise Grade Security & Compliance</div>
              <div className="text-xs text-[#757266] mt-0.5">SOC2 Type II certified, end-to-end 256-bit encryption, dedicated VPC tenant isolation.</div>
            </div>
          </div>
          <div className="text-xs font-mono font-medium text-[#524F47] bg-white px-3 py-1.5 rounded-full border border-[#E8E5DC]">
            99.999% SLA Uptime
          </div>
        </div>

      </div>
    </section>
  )
}
