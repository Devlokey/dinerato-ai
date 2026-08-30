import React from 'react'
import { Target, Clock, Zap, UserCheck, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function MetricsBar() {
  const metrics = [
    {
      icon: Target,
      value: '99.99%',
      label: 'Order Intake Accuracy',
      sub: 'Zero manual transcription errors',
    },
    {
      icon: Clock,
      value: '80%',
      label: 'Less Admin Time',
      sub: 'Automating rep repetitive tasks',
    },
    {
      icon: Zap,
      value: '4.2x',
      label: 'Faster Fulfillment',
      sub: 'Same-hour PO processing',
    },
    {
      icon: UserCheck,
      value: '0',
      label: 'Headcount Required to Scale',
      sub: 'Scale 3x order volume effortlessly',
    }
  ]

  return (
    <section className="border-y border-[#E8E5DC] bg-[#FAF9F5] py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E5DC]">
          {metrics.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`flex flex-col items-start ${idx > 0 ? 'pt-4 sm:pt-0 sm:pl-8' : ''}`}
              >
                <div className="flex items-center space-x-2 text-[#757266] mb-2">
                  <Icon className="w-4 h-4 text-[#141412]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#757266]">{item.label}</span>
                </div>
                <div className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#141412] tracking-tight">
                  {item.value}
                </div>
                <p className="text-xs text-[#524F47] mt-1 font-medium">
                  {item.sub}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
