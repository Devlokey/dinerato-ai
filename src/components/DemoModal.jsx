import React, { useState } from 'react'
import { X, ArrowRight, CheckCircle2, Building, Mail, User, Phone, Sparkles, Database } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import DineratoLogo from './DineratoLogo'

export default function DemoModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    erp: 'SAP Business One',
    volume: '$10M - $50M'
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setSubmitted(false)
    }, 300)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-[#FAF9F5] rounded-3xl shadow-2xl border border-[#E8E5DC] overflow-hidden z-10 my-8"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-full text-[#757266] hover:text-[#141412] hover:bg-[#E8E5DC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-7 sm:p-9">
            {!submitted ? (
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <DineratoLogo color="black" className="h-6" />
                  <span className="text-[11px] text-[#757266] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#E8E5DC]/60">• Early Access</span>
                </div>

                <h3 className="font-serif text-3xl font-normal text-[#141412] tracking-tight">
                  Join the waitlist for Dinerato AI
                </h3>

                <p className="text-sm text-[#524F47] mt-2 mb-6">
                  Get priority onboarding and early access to autonomous distribution agents for your supply chain operations.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#757266] mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#A8A394] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Marcus Vance"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E8E5DC] focus:border-[#141412] focus:ring-1 focus:ring-[#141412] text-sm text-[#141412] outline-hidden transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#757266] mb-1.5">
                        Work Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#A8A394] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="marcus@premiermeats.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E8E5DC] focus:border-[#141412] focus:ring-1 focus:ring-[#141412] text-sm text-[#141412] outline-hidden transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#757266] mb-1.5">
                        Company Name
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-[#A8A394] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Premier Meat Distribution"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E8E5DC] focus:border-[#141412] focus:ring-1 focus:ring-[#141412] text-sm text-[#141412] outline-hidden transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#757266] mb-1.5">
                        Primary ERP / System
                      </label>
                      <div className="relative">
                        <Database className="w-4 h-4 text-[#A8A394] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <select
                          value={formData.erp}
                          onChange={(e) => setFormData({ ...formData, erp: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E8E5DC] focus:border-[#141412] focus:ring-1 focus:ring-[#141412] text-sm text-[#141412] outline-hidden transition-colors appearance-none cursor-pointer"
                        >
                          <option value="SAP Business One">SAP Business One</option>
                          <option value="NetSuite">Oracle NetSuite</option>
                          <option value="Microsoft Dynamics">Microsoft Dynamics 365</option>
                          <option value="QuickBooks Enterprise">QuickBooks Enterprise</option>
                          <option value="Encompass">Encompass Technologies</option>
                          <option value="Other / Custom">Other / Custom</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center space-x-2 py-3.5 rounded-full text-base font-semibold text-white bg-[#141412] hover:bg-[#22211E] active:scale-[0.98] transition-all shadow-md cursor-pointer"
                    >
                      <span>Join the Waitlist</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-center text-[11px] text-[#757266]">
                    Instant confirmation • Priority onboarding batch • SOC2 Type II Certified
                  </p>
                </form>
              </div>
            ) : (
              <div className="text-center py-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4"
                >
                  <CheckCircle2 className="w-8 h-8" />
                </motion.div>

                <h3 className="font-serif text-3xl font-normal text-[#141412]">
                  You're on the Waitlist!
                </h3>
                <p className="text-sm text-[#524F47] mt-2 mb-6 max-w-sm mx-auto">
                  Thank you, <span className="font-semibold text-[#141412]">{formData.name}</span>. We've reserved your priority spot and will notify you at <span className="font-semibold text-[#141412]">{formData.email}</span> as soon as your batch is unlocked.
                </p>

                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 rounded-full bg-[#141412] text-white text-sm font-semibold hover:bg-[#22211E] transition-colors cursor-pointer"
                >
                  Return to Website
                </button>
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </AnimatePresence>
  )
}
