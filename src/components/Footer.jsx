import React from 'react'
import { Award, ShieldCheck } from 'lucide-react'

export default function Footer({ onOpenDemo }) {
  return (
    <footer className="bg-[#141412] text-white pt-12 pb-16 border-t border-white/5 bg-dark-noise">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16 pb-16">
          
          {/* Column 1: Product */}
          <div>
            <h5 className="text-sm font-semibold text-white tracking-tight mb-5">
              Product
            </h5>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <a href="#workflows" className="hover:text-white transition-colors">Platform overview</a>
              </li>
              <li>
                <a href="#custom" className="hover:text-white transition-colors">Custom solutions</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              </li>
              <li>
                <button onClick={onOpenDemo} className="hover:text-white transition-colors text-left">
                  Get a demo
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Agents */}
          <div>
            <h5 className="text-sm font-semibold text-white tracking-tight mb-5">
              Agents
            </h5>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <a href="#agents" className="hover:text-white transition-colors">Sales & operations</a>
              </li>
              <li>
                <a href="#agents" className="hover:text-white transition-colors">Procurement</a>
              </li>
              <li>
                <a href="#agents" className="hover:text-white transition-colors">Credit control</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h5 className="text-sm font-semibold text-white tracking-tight mb-5">
              Company
            </h5>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <a href="#about" className="hover:text-white transition-colors">Our story</a>
              </li>
              <li>
                <a href="#careers" className="hover:text-white transition-colors flex items-center space-x-2">
                  <span>Careers</span>
                  <span className="text-[10px] bg-white/15 text-white/90 px-1.5 py-0.5 rounded-sm">We're hiring</span>
                </a>
              </li>
              <li>
                <button onClick={onOpenDemo} className="hover:text-white transition-colors text-left">
                  Contact
                </button>
              </li>
              <li>
                <a href="#blogs" className="hover:text-white transition-colors">Blogs</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h5 className="text-sm font-semibold text-white tracking-tight mb-5">
              Legal
            </h5>
            <ul className="space-y-3 text-sm text-white/60">
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">Privacy policy</a>
              </li>
              <li>
                <a href="#dpa" className="hover:text-white transition-colors">Data processing agreement</a>
              </li>
              <li>
                <a href="#cookies" className="hover:text-white transition-colors">Cookie policy</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & IFDA Select Member Badge */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <div>
            © 2026 Dinerato. All rights reserved.
          </div>

          {/* IFDA Badge (Matching Screenshot) */}
          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-lg">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 font-bold" />
              <span className="font-extrabold tracking-wider text-white text-xs">IFDA</span>
            </div>
            <span className="text-white/40">|</span>
            <span className="text-white/80 font-medium">Select Member</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
