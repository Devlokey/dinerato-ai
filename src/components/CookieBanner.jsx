import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, X, Check } from 'lucide-react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false
  })

  useEffect(() => {
    const consent = localStorage.getItem('dinerato_cookie_consent')
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAcceptAll = () => {
    localStorage.setItem('dinerato_cookie_consent', JSON.stringify({ necessary: true, analytics: true, marketing: true }))
    setVisible(false)
    setShowPreferences(false)
  }

  const handleDeny = () => {
    localStorage.setItem('dinerato_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false }))
    setVisible(false)
    setShowPreferences(false)
  }

  const handleSavePreferences = () => {
    localStorage.setItem('dinerato_cookie_consent', JSON.stringify(preferences))
    setVisible(false)
    setShowPreferences(false)
  }

  if (!visible) return null

  return (
    <>
      {/* Cookie Banner (Bottom Right Floating as in Screenshot 3) */}
      <AnimatePresence>
        {visible && !showPreferences && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 max-w-sm sm:max-w-md bg-[#181816] text-white p-5 rounded-2xl shadow-2xl border border-white/10 glass-dark-panel"
          >
            <p className="text-xs text-white/80 leading-relaxed">
              By clicking <span className="font-semibold text-white">"Accept"</span>, you agree to the storing of cookies on your device to analyze site usage and assist in our marketing efforts. View our <a href="#privacy" className="underline hover:text-white transition-colors">Privacy Policy</a> for more information.
            </p>

            <div className="mt-4 flex items-center justify-end space-x-2 text-xs">
              <button
                onClick={() => setShowPreferences(true)}
                className="px-3 py-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors font-medium"
              >
                Preferences
              </button>

              <button
                onClick={handleDeny}
                className="px-3 py-1.5 rounded-lg text-white/90 bg-white/10 hover:bg-white/20 transition-colors font-medium"
              >
                Deny
              </button>

              <button
                onClick={handleAcceptAll}
                className="px-4 py-1.5 rounded-lg bg-white text-[#141412] hover:bg-[#FAF9F5] font-semibold transition-colors shadow-xs"
              >
                Accept
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preferences Modal */}
      <AnimatePresence>
        {showPreferences && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setShowPreferences(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#181816] text-white rounded-3xl p-6 border border-white/15 shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-base font-semibold text-white">Cookie Preferences</h4>
                </div>
                <button 
                  onClick={() => setShowPreferences(false)}
                  className="p-1 rounded-full text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 my-6 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <div className="font-semibold text-white">Strictly Necessary</div>
                    <div className="text-white/60 text-[11px] mt-0.5">Required for core website security & routing.</div>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">Always Active</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <div className="font-semibold text-white">Performance & Analytics</div>
                    <div className="text-white/60 text-[11px] mt-0.5">Helps us measure workflow loading latency.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="w-4 h-4 rounded-sm accent-white cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div>
                    <div className="font-semibold text-white">Personalization & Marketing</div>
                    <div className="text-white/60 text-[11px] mt-0.5">Tailors case study examples to your industry.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="w-4 h-4 rounded-sm accent-white cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10 text-xs">
                <button
                  onClick={handleDeny}
                  className="px-4 py-2 rounded-xl text-white/80 hover:text-white bg-white/10 font-medium"
                >
                  Reject All
                </button>
                <button
                  onClick={handleSavePreferences}
                  className="px-5 py-2 rounded-xl bg-white text-[#141412] font-semibold hover:bg-white/90"
                >
                  Save Preferences
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
