import React, { useState } from 'react'
import { Check, Edit2, CheckCircle2, AlertCircle, Clock, ChevronRight, RefreshCw, Send, DollarSign, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AgentsShowcase({ onOpenDemo }) {
  // --- 1. Validate Order State ---
  const [orderItems, setOrderItems] = useState([
    { id: 1, name: 'Sirloin Steak', weight: '10oz', prep: 'Item prep: Vacuum pack in singles', checked: true },
    { id: 2, name: 'Beef Chuck Roll', weight: '', prep: 'Item prep: Diced', checked: true },
    { id: 3, name: 'Shin of Beef', weight: '', prep: 'Item prep: Less bone as possible', checked: true },
    { id: 4, name: 'Beef Braising Steak', weight: '', prep: 'Item prep: Pack separately', checked: false }
  ])

  const toggleOrderItem = (id) => {
    setOrderItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item))
  }

  // --- 2. Inventory State ---
  const [inventoryItems, setInventoryItems] = useState([
    { id: 1, name: 'Roma Tomatoes', status: 'Low', qty: '18 cases', count: 18, unit: 'cases', type: 'low' },
    { id: 2, name: 'Atlantic Salmon', status: 'Healthy', qty: '145 portions', count: 145, unit: 'portions', type: 'healthy' },
    { id: 3, name: 'Yukon Gold Potatoes', status: 'Critical', qty: '8 bags', count: 8, unit: 'bags', type: 'critical' },
    { id: 4, name: 'Fresh Mozzarella', status: 'Healthy', qty: '52 units', count: 52, unit: 'units', type: 'healthy' }
  ])

  const reorderItem = (id) => {
    setInventoryItems(prev => prev.map(item => {
      if (item.id === id) {
        const newCount = item.count + 50
        return {
          ...item,
          count: newCount,
          qty: `${newCount} ${item.unit}`,
          status: 'Healthy',
          type: 'healthy'
        }
      }
      return item
    }))
  }

  // --- 3. Invoices State ---
  const [invoices, setInvoices] = useState([
    { id: 1, customer: "Lily's Cafe", status: 'Paid', inv: 'INV-2847', amount: 2340, type: 'paid' },
    { id: 2, customer: 'Harvest Kitchen', status: 'Called', inv: 'INV-2846', amount: 1890, type: 'called' },
    { id: 3, customer: 'Corner Bistro', status: 'On hold', inv: 'INV-2845', amount: 3275, type: 'hold' },
    { id: 4, customer: "Mike's Pizzeria", status: 'Paid', inv: 'INV-2844', amount: 1218, type: 'paid' }
  ])

  const [paidTotal, setPaidTotal] = useState(24798.12)
  const [outstandingTotal, setOutstandingTotal] = useState(5821.74)

  const markInvoicePaid = (id) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === id && inv.status !== 'Paid') {
        setPaidTotal(p => p + inv.amount)
        setOutstandingTotal(o => Math.max(0, o - inv.amount))
        return { ...inv, status: 'Paid', type: 'paid' }
      }
      return inv
    }))
  }

  const allChecked = orderItems.every(i => i.checked)

  return (
    <section id="agents" className="py-24 md:py-32 bg-[#FAF9F5] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20">
          <div className="max-w-xl">
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.1] text-[#141412] tracking-tight">
              Agents for every critical workflow
            </h2>
          </div>
          <div className="mt-4 md:mt-0 max-w-md">
            <p className="text-base text-[#524F47] font-normal leading-relaxed">
              Each agent is purpose-built for a specific part of your operation. Start with one or deploy the full platform.
            </p>
          </div>
        </div>

        {/* 3 Mockup Cards Grid with Ambient Gradient Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          
          {/* Card 1: Validate Order */}
          <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#E2EBE8]/70 via-[#EAF0ED]/40 to-white/60 border border-[#D5DCD8] shadow-lg flex flex-col justify-between overflow-hidden group hover:border-[#B6C8C0] transition-all duration-300">
            {/* Ambient blur backdrop inside card */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-200/20 rounded-full blur-2xl pointer-events-none" />

            <div>
              {/* Card Title */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#141412] tracking-tight">
                  Validate order
                </h3>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-colors ${
                  allChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {orderItems.filter(i => i.checked).length}/{orderItems.length} Verified
                </span>
              </div>

              {/* Order Items List */}
              <div className="bg-white/95 rounded-2xl p-3.5 shadow-sm border border-[#E8E5DC] space-y-3">
                {orderItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-[#FAF9F5] transition-colors"
                  >
                    <div className="flex-1 pr-2">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm font-semibold text-[#141412]">{item.name}</span>
                        {item.weight && (
                          <span className="text-xs text-[#757266] font-normal">{item.weight}</span>
                        )}
                      </div>
                      <div className="text-[11.5px] text-[#757266] mt-0.5">{item.prep}</div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button 
                        className="p-1 text-[#A8A394] hover:text-[#141412] transition-colors"
                        title="Edit instructions"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => toggleOrderItem(item.id)}
                        className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                          item.checked 
                            ? 'bg-[#141412] text-white shadow-xs' 
                            : 'bg-[#E8E5DC] text-transparent hover:bg-[#D5D1C4]'
                        }`}
                        aria-label="Toggle validation"
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#D5DCD8]/60 flex items-center justify-between text-xs text-[#524F47]">
              <span>Click checkmarks to test live agent sync</span>
              <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Live AI Hook</span>
            </div>
          </div>

          {/* Card 2: Inventory */}
          <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#EAE6DF]/70 via-[#F0ECE6]/40 to-white/60 border border-[#DCD6CC] shadow-lg flex flex-col justify-between overflow-hidden group hover:border-[#C8BFB0] transition-all duration-300">
            <div className="absolute top-0 right-0 w-36 h-36 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />

            <div>
              {/* Card Title */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-[#141412] tracking-tight">
                  Inventory
                </h3>
                <span className="text-[11px] font-medium text-[#757266]">
                  Real-time stock monitor
                </span>
              </div>

              {/* Inventory Table */}
              <div className="bg-white/95 rounded-2xl p-3.5 shadow-sm border border-[#E8E5DC] space-y-2.5">
                {inventoryItems.map((item) => {
                  let badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  if (item.type === 'low') badgeClass = 'bg-amber-50 text-amber-700 border-amber-200'
                  if (item.type === 'critical') badgeClass = 'bg-rose-50 text-rose-700 border-rose-200'

                  return (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between py-2 px-2 rounded-xl hover:bg-[#FAF9F5] transition-colors"
                    >
                      <div className="text-sm font-semibold text-[#141412] flex-1">
                        {item.name}
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => reorderItem(item.id)}
                          className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${badgeClass} cursor-pointer hover:opacity-80 transition-opacity`}
                          title="Click to trigger auto-reorder"
                        >
                          • {item.status}
                        </button>
                        <span className="text-xs font-mono text-[#524F47] w-20 text-right">
                          {item.qty}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#DCD6CC]/60 flex items-center justify-between text-xs text-[#524F47]">
              <span>Tap status pills to simulate instant auto-replenish</span>
              <span className="font-mono text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">Auto-PO</span>
            </div>
          </div>

          {/* Card 3: Invoices */}
          <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#EBE2E4]/70 via-[#F3ECEE]/40 to-white/60 border border-[#DED4D7] shadow-lg flex flex-col justify-between overflow-hidden group hover:border-[#CBBEC2] transition-all duration-300">
            <div className="absolute top-0 right-0 w-36 h-36 bg-rose-200/20 rounded-full blur-2xl pointer-events-none" />

            <div>
              {/* Card Title */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#141412] tracking-tight">
                  Invoices
                </h3>
                <span className="text-[11px] font-medium text-[#757266]">
                  Autonomous Collections
                </span>
              </div>

              {/* Summary Tiles */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-white/90 p-2.5 rounded-xl border border-[#E8E5DC]">
                  <div className="flex items-center space-x-1 text-[11px] text-[#757266] font-medium">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Paid</span>
                  </div>
                  <div className="text-sm font-bold text-[#141412] mt-0.5">
                    ${paidTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="bg-white/90 p-2.5 rounded-xl border border-[#E8E5DC]">
                  <div className="flex items-center space-x-1 text-[11px] text-[#757266] font-medium">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>Outstanding</span>
                  </div>
                  <div className="text-sm font-bold text-[#141412] mt-0.5">
                    ${outstandingTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Invoice Ledger Table */}
              <div className="bg-white/95 rounded-2xl p-2.5 shadow-sm border border-[#E8E5DC] space-y-1.5">
                {invoices.map((inv) => {
                  let badge = 'bg-emerald-50 text-emerald-700'
                  if (inv.type === 'called') badge = 'bg-amber-50 text-amber-700'
                  if (inv.type === 'hold') badge = 'bg-orange-50 text-orange-700'

                  return (
                    <div 
                      key={inv.id}
                      onClick={() => markInvoicePaid(inv.id)}
                      className="flex items-center justify-between py-1.5 px-2 rounded-xl hover:bg-[#FAF9F5] transition-colors cursor-pointer"
                      title="Click to resolve and mark as Paid"
                    >
                      <span className="text-xs font-semibold text-[#141412] truncate max-w-[95px]">
                        {inv.customer}
                      </span>

                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${badge}`}>
                          • {inv.status}
                        </span>
                        <span className="text-[11px] font-mono text-[#757266]">
                          {inv.inv}
                        </span>
                        <span className="text-xs font-semibold text-[#141412] font-mono w-14 text-right">
                          ${inv.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#DED4D7]/60 flex items-center justify-between text-xs text-[#524F47]">
              <span>Click invoice to mark collected</span>
              <span className="font-mono text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">Smart Dunning</span>
            </div>
          </div>

        </div>

        {/* 3 Column Detailed Descriptions (Matching Reference Exactly) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 pt-4 border-t border-[#E8E5DC]">
          
          {/* Column 1: Sales + Operations */}
          <div className="space-y-2.5">
            <h4 className="font-serif text-2xl sm:text-3xl font-normal text-[#141412] tracking-tight">
              Sales + operations
            </h4>
            <div className="text-xs font-bold uppercase tracking-wider text-[#757266]">
              AUTOMATION THAT FUELS SALES
            </div>
            <p className="text-sm text-[#524F47] leading-relaxed">
              From flawless order processing to powerful sales insights, our agent runs the work so your team can run the business.
            </p>
          </div>

          {/* Column 2: Procurement */}
          <div className="space-y-2.5">
            <h4 className="font-serif text-2xl sm:text-3xl font-normal text-[#141412] tracking-tight">
              Procurement
            </h4>
            <div className="text-xs font-bold uppercase tracking-wider text-[#757266]">
              SMARTER BUYING, ZERO BOTTLENECKS
            </div>
            <p className="text-sm text-[#524F47] leading-relaxed">
              Automates purchasing decisions and supplier communications to keep inventory balanced.
            </p>
          </div>

          {/* Column 3: Credit Control */}
          <div className="space-y-2.5">
            <h4 className="font-serif text-2xl sm:text-3xl font-normal text-[#141412] tracking-tight">
              Credit control
            </h4>
            <div className="text-xs font-bold uppercase tracking-wider text-[#757266]">
              STOP CHASING PAYMENTS
            </div>
            <p className="text-sm text-[#524F47] leading-relaxed">
              Handles collections calls and payment negotiations to keep your cash flow healthy.
            </p>
          </div>

        </div>

      </div>
    </section>
  )
}
