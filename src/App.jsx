import React, { useState } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import MetricsBar from './components/MetricsBar'
import AgentsShowcase from './components/AgentsShowcase'
import InteractiveAgentTerminal from './components/InteractiveAgentTerminal'
import IntegrationSection from './components/IntegrationSection'
import TestimonialsSection from './components/TestimonialsSection'
import FaqSection from './components/FaqSection'
import DarkCtaSection from './components/DarkCtaSection'
import Footer from './components/Footer'
import DemoModal from './components/DemoModal'
import CookieBanner from './components/CookieBanner'

export default function App() {
  const [demoModalOpen, setDemoModalOpen] = useState(false)

  const handleOpenDemo = () => {
    setDemoModalOpen(true)
  }

  const handleCloseDemo = () => {
    setDemoModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141412] font-sans antialiased selection:bg-[#141412] selection:text-white flex flex-col">
      {/* Fixed Sticky Header */}
      <Navbar onOpenDemo={handleOpenDemo} />

      {/* Main Content Sections */}
      <main className="flex-grow">
        {/* 1. Hero Section with Interactive Selector & Visual Showcase */}
        <HeroSection onOpenDemo={handleOpenDemo} />

        {/* 2. Key Metrics Bar */}
        <MetricsBar />

        {/* 3. "Agents for every critical workflow" Grid with 3 Mockup Cards */}
        <AgentsShowcase onOpenDemo={handleOpenDemo} />

        {/* 4. Live Interactive Agent Terminal Sandbox */}
        <InteractiveAgentTerminal onOpenDemo={handleOpenDemo} />

        {/* 5. Enterprise Integrations & Connectors */}
        <IntegrationSection />

        {/* 6. Customer Testimonials & Case Studies */}
        <TestimonialsSection />

        {/* 7. FAQs */}
        <FaqSection onOpenDemo={handleOpenDemo} />

        {/* 8. Dark Hero CTA Section (Matching Image 1) */}
        <DarkCtaSection onOpenDemo={handleOpenDemo} />
      </main>

      {/* 9. Comprehensive Dark Footer (Matching Image 1) */}
      <Footer onOpenDemo={handleOpenDemo} />

      {/* 10. Interactive Demo Booking Modal */}
      <DemoModal isOpen={demoModalOpen} onClose={handleCloseDemo} />

      {/* 11. Cookie Consent Banner (Matching Image 3) */}
      <CookieBanner />
    </div>
  )
}
