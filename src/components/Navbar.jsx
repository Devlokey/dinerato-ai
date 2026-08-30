import React, { useState, useEffect } from 'react'
import { ChevronDown, ArrowUpRight, Menu, X, BarChart3, Package, Wallet, Wrench, Compass, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import DineratoLogo from './DineratoLogo'

export default function Navbar({ onOpenDemo }) {
  const [scrolled, setScrolled] = useState(false)
  const [productOpen, setProductOpen] = useState(false)
  const [companyOpen, setCompanyOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[#E8E5DC]/80 shadow-xs' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Main Nav */}
          <div className="flex items-center space-x-12">
            <a href="#" className="flex items-center space-x-2 group focus:outline-hidden">
              <DineratoLogo color="black" className="h-7 sm:h-8" />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8 text-[15px] font-normal text-[#141412]">
              
              {/* Product Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setProductOpen(true)}
                onMouseLeave={() => setProductOpen(false)}
              >
                <button 
                  className="flex items-center space-x-1.5 py-2 hover:opacity-75 transition-opacity focus:outline-hidden cursor-pointer"
                  onClick={() => setProductOpen(!productOpen)}
                >
                  <span>Product</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${productOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {productOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full -left-4 w-[380px] p-4 bg-[#383836] rounded-[22px] shadow-2xl border border-white/10 text-white z-50 mt-1"
                    >
                      <div className="space-y-4">
                        
                        {/* 1. Sales & operations */}
                        <a 
                          href="#agents" 
                          onClick={() => setProductOpen(false)}
                          className="flex items-start space-x-3.5 p-2 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-white/90">
                            <BarChart3 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-serif text-[21px] font-normal text-white leading-tight group-hover:text-white">
                              Sales & operations
                            </div>
                            <div className="text-[12.5px] text-white/70 font-sans mt-1 leading-snug">
                              Automate order intake and sales workflows across every channel with AI precision.
                            </div>
                          </div>
                        </a>

                        {/* 2. Procurement */}
                        <a 
                          href="#agents" 
                          onClick={() => setProductOpen(false)}
                          className="flex items-start space-x-3.5 p-2 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-white/90">
                            <Package className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-serif text-[21px] font-normal text-white leading-tight group-hover:text-white">
                              Procurement
                            </div>
                            <div className="text-[12.5px] text-white/70 font-sans mt-1 leading-snug">
                              Smart procurement that keeps inventory stocked while optimizing costs and supplier relationships.
                            </div>
                          </div>
                        </a>

                        {/* 3. Credit control */}
                        <a 
                          href="#agents" 
                          onClick={() => setProductOpen(false)}
                          className="flex items-start space-x-3.5 p-2 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-white/90">
                            <Wallet className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-serif text-[21px] font-normal text-white leading-tight group-hover:text-white">
                              Credit control
                            </div>
                            <div className="text-[12.5px] text-white/70 font-sans mt-1 leading-snug">
                              Automate collections and follow-ups while protecting customer relationships.
                            </div>
                          </div>
                        </a>

                        {/* 4. Custom solutions */}
                        <a 
                          href="#custom" 
                          onClick={() => setProductOpen(false)}
                          className="flex items-start space-x-3.5 p-2 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-white/90">
                            <Wrench className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-serif text-[21px] font-normal text-white leading-tight group-hover:text-white">
                              Custom solutions
                            </div>
                            <div className="text-[12.5px] text-white/70 font-sans mt-1 leading-snug">
                              Build specialized agents for your unique supply chain challenges and processes.
                            </div>
                          </div>
                        </a>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Company Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setCompanyOpen(true)}
                onMouseLeave={() => setCompanyOpen(false)}
              >
                <button 
                  className="flex items-center space-x-1.5 py-2 hover:opacity-75 transition-opacity focus:outline-hidden cursor-pointer"
                  onClick={() => setCompanyOpen(!companyOpen)}
                >
                  <span>Company</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${companyOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {companyOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full -left-4 w-[380px] p-4 bg-[#383836] rounded-[22px] shadow-2xl border border-white/10 text-white z-50 mt-1"
                    >
                      <div className="space-y-4">
                        
                        {/* 1. Our story */}
                        <a 
                          href="#about" 
                          onClick={() => setCompanyOpen(false)}
                          className="flex items-start space-x-3.5 p-2 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-white/90">
                            <Compass className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-serif text-[21px] font-normal text-white leading-tight group-hover:text-white">
                              Our story
                            </div>
                            <div className="text-[12.5px] text-white/70 font-sans mt-1 leading-snug">
                              Built by fourth-generation food operators who understand the industry's challenges inside out.
                            </div>
                          </div>
                        </a>

                        {/* 2. Careers */}
                        <a 
                          href="#careers" 
                          onClick={() => setCompanyOpen(false)}
                          className="flex items-start space-x-3.5 p-2 rounded-xl hover:bg-white/5 transition-colors group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0 mt-0.5 text-white/90">
                            <Zap className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-serif text-[21px] font-normal text-white leading-tight group-hover:text-white">
                              Careers
                            </div>
                            <div className="text-[12.5px] text-white/70 font-sans mt-1 leading-snug">
                              Join us in building the AI watchtower for food distributors around the world.
                            </div>
                          </div>
                        </a>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Blogs Link */}
              <a href="#blogs" className="hover:opacity-75 transition-opacity">
                Blogs
              </a>
            </nav>
          </div>

          {/* Right Action CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={onOpenDemo}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium text-white bg-[#141412] hover:bg-[#22211E] active:scale-[0.98] transition-all shadow-xs hover:shadow-md cursor-pointer"
            >
              <span>Get a demo</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#141412] hover:bg-[#E8E5DC]/60 transition-colors focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FAF9F5] border-b border-[#E8E5DC] px-6 py-6 space-y-4"
          >
            <div className="space-y-2">
              <a 
                href="#agents" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-[#141412] border-b border-[#E8E5DC]/50"
              >
                Product & Agents
              </a>
              <a 
                href="#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-[#141412] border-b border-[#E8E5DC]/50"
              >
                Company Story
              </a>
              <a 
                href="#blogs" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-[#141412] border-b border-[#E8E5DC]/50"
              >
                Blogs & Insights
              </a>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenDemo()
              }}
              className="w-full flex items-center justify-center space-x-2 px-5 py-3 rounded-full text-sm font-medium text-white bg-[#141412] hover:bg-[#22211E] transition-colors"
            >
              <span>Get a demo</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
