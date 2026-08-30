import React from 'react'
import { Quote, Star } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Dinerato took our order intake errors from 4% down to zero within the first week. Our customer reps now spend their time building relationships rather than re-typing PDF orders.",
      author: "Marcus Vance",
      title: "VP of Operations, Premier Meat & Seafood Distributors",
      stat: "40+ hours saved weekly per branch"
    },
    {
      quote: "The Procurement agent accurately predicted our holiday seafood spikes 3 weeks earlier than our manual spreadsheets ever could. We avoided stockouts on our highest-margin SKUs.",
      author: "Elena Rostova",
      title: "Chief Supply Officer, Pacific Rim Foodservice",
      stat: "99.8% on-time fulfillment rate"
    },
    {
      quote: "Autonomous credit control was a game changer. Friendly, automated payment reminders dropped our DSO by 12 days without annoying a single chef or restaurant owner.",
      author: "David Chen",
      title: "CFO, Metro Wholesale Provisions",
      stat: "$1.4M accelerated working capital"
    }
  ]

  return (
    <section id="about" className="py-20 md:py-28 bg-[#FAF9F5] border-t border-[#E8E5DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-16">
          <div className="text-xs font-bold uppercase tracking-wider text-[#757266] mb-3">
            Customer Case Studies
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#141412] tracking-tight">
            Trusted by top regional & national food distributors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-3xl p-7 border border-[#E8E5DC] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-1 text-amber-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-[14.5px] text-[#383630] leading-relaxed font-normal italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-[#E8E5DC]">
                <div className="font-semibold text-sm text-[#141412]">{t.author}</div>
                <div className="text-xs text-[#757266] mt-0.5">{t.title}</div>
                <div className="mt-3 inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {t.stat}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
