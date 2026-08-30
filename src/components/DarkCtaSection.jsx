import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'
import DineratoLogo from './DineratoLogo'

export default function DarkCtaSection({ onOpenDemo }) {
  return (
    <section className="bg-[#141412] text-white pt-24 pb-20 md:pt-32 md:pb-28 relative overflow-hidden bg-dark-noise">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-gradient-to-b from-white/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Header */}
        <div className="mb-16 md:mb-20">
          <DineratoLogo color="white" className="h-9 md:h-11" />
        </div>

        {/* Main CTA Hero Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end justify-between pb-20 border-b border-white/10">
          
          {/* Left Large Headline */}
          <div className="lg:col-span-7">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal leading-[1.08] tracking-tight text-white"
            >
              Transform your operations with Dinerato
            </motion.h2>
          </div>

          {/* Right Text & CTA */}
          <div className="lg:col-span-5 flex flex-col items-start lg:items-start lg:pl-12">
            <p className="text-base sm:text-lg text-white/70 font-normal leading-relaxed mb-8 max-w-md">
              See how distributors are automating operations and scaling without adding headcount.
            </p>

            <button
              onClick={onOpenDemo}
              className="group inline-flex items-center space-x-3 px-8 py-4 rounded-full text-base font-semibold text-[#141412] bg-white hover:bg-[#FAF9F5] active:scale-[0.98] transition-all shadow-xl hover:shadow-2xl cursor-pointer"
            >
              <span>Get a demo</span>
              <div className="w-6 h-6 rounded-full bg-[#141412]/10 flex items-center justify-center group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#141412]" />
              </div>
            </button>
          </div>

        </div>

      </div>
    </section>
  )
}
