'use client'

import { useState, useEffect } from 'react'

export default function Hero() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModal(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-20 md:py-32">
      {/* Floating background emojis */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <span className="absolute top-[10%] left-[5%] text-7xl opacity-10 animate-float">🏏</span>
        <span className="absolute top-[20%] right-[8%] text-8xl opacity-10 animate-float-slow">🏸</span>
        <span className="absolute top-[60%] left-[3%] text-6xl opacity-10 animate-bounce" style={{ animationDuration: '3s' }}>⚽</span>
        <span className="absolute top-[70%] right-[5%] text-7xl opacity-15 animate-float">💪</span>
        <span className="absolute top-[40%] left-[45%] text-5xl opacity-10 animate-float-slow">🎮</span>
        <span className="absolute top-[85%] left-[20%] text-6xl opacity-10 animate-bounce" style={{ animationDuration: '4s' }}>🏆</span>
        <span className="absolute top-[15%] left-[30%] text-5xl opacity-10 animate-float">🥒</span>
      </div>

      {/* Background gradient blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6366f1] rounded-full opacity-5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#a855f7] rounded-full opacity-5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — Text */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#141828] border border-[#1e2540] rounded-full px-4 py-2 text-sm text-[#64748b] mb-8">
              <span className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse" />
              <span>🚀 Now live in Bangalore · Mumbai · Pune</span>
            </div>

            {/* H1 */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
              Your Sporting Life,{' '}
              <span className="text-gradient">Gamified</span>
            </h1>

            {/* Subtext */}
            <p className="text-lg md:text-xl text-[#64748b] leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
              Find open sessions near you. Show up. Earn XP. Build a career that tracks every game you play — Cricket, Badminton, Pickleball and more.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <a
                href="#waitlist"
                className="bg-[#6366f1] hover:bg-[#4f52d9] text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 glow-indigo hover:scale-105 text-center"
              >
                Get Early Access →
              </a>
              <button
                onClick={() => setShowModal(true)}
                className="border border-[#1e2540] hover:border-[#6366f1] text-[#f1f5f9] font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 hover:bg-[#141828] text-center"
              >
                Watch Demo ▶
              </button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {['bg-[#6366f1]', 'bg-[#22c55e]', 'bg-[#f59e0b]', 'bg-[#f97316]', 'bg-[#a855f7]'].map((bg, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${bg} border-2 border-[#0a0e1a] flex items-center justify-center text-xs font-bold text-white`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[#eab308] text-sm">★★★★★</div>
                <div className="text-[#64748b] text-xs">Trusted by 10,000+ players waiting</div>
              </div>
            </div>
          </div>

          {/* Right — Phone Mockup */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-[#6366f1] opacity-20 blur-3xl rounded-[3rem]" />

              {/* Phone frame */}
              <div className="relative rounded-[3rem] bg-[#141828] border-2 border-[#1e2540] shadow-2xl w-64 h-[520px] mx-auto overflow-hidden">
                {/* Notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[#0a0e1a] rounded-full z-10" />

                {/* Screen Content */}
                <div className="pt-12 px-3 pb-3 h-full flex flex-col gap-2 overflow-hidden">
                  {/* Status bar */}
                  <div className="flex justify-between items-center text-[9px] text-[#64748b] px-1">
                    <span>9:41</span>
                    <span>●●●</span>
                  </div>

                  {/* Player Card */}
                  <div className="bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-lg">🦁</div>
                      <div>
                        <div className="text-white font-bold text-sm">Bhavya</div>
                        <div className="text-white/70 text-[10px]">Lv.1 Rookie</div>
                      </div>
                      <div className="ml-auto text-right">
                        <div className="text-[#eab308] font-bold text-sm">0 XP</div>
                        <div className="text-white/70 text-[10px]">0 sessions</div>
                      </div>
                    </div>
                    {/* XP Bar */}
                    <div className="bg-white/20 rounded-full h-1.5">
                      <div className="bg-[#eab308] h-1.5 rounded-full w-[5%]" />
                    </div>
                    <div className="flex justify-between text-[9px] text-white/60 mt-1">
                      <span>0 XP</span>
                      <span>500 XP to Lv.2</span>
                    </div>
                  </div>

                  {/* Sessions near you */}
                  <div className="text-[11px] font-semibold text-[#64748b] px-1">Sessions near you</div>

                  {/* Session card 1 — Cricket */}
                  <div className="bg-[#0a0e1a] rounded-xl p-2.5 border-l-2 border-[#22c55e]">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🏏</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-[11px] font-semibold truncate">Sunday Cricket</div>
                        <div className="text-[#64748b] text-[9px]">7am · Koramangala · 4/8</div>
                      </div>
                      <div className="bg-[#22c55e] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">Join</div>
                    </div>
                  </div>

                  {/* Session card 2 — Badminton */}
                  <div className="bg-[#0a0e1a] rounded-xl p-2.5 border-l-2 border-[#f59e0b]">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🏸</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-[11px] font-semibold truncate">Office Badminton</div>
                        <div className="text-[#64748b] text-[9px]">6pm · Indiranagar · 3/4</div>
                      </div>
                      <div className="bg-[#f59e0b] text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">Join</div>
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Bottom Nav */}
                  <div className="bg-[#0a0e1a] rounded-2xl p-2 flex justify-around items-center">
                    {[
                      { icon: '🏠', label: 'Home' },
                      { icon: '🔍', label: 'Find' },
                      { icon: '➕', label: 'Create', active: false },
                      { icon: '👥', label: 'Community' },
                      { icon: '👤', label: 'Profile' },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col items-center gap-0.5">
                        <span className="text-sm">{item.icon}</span>
                        <span className="text-[7px] text-[#64748b]">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#141828] rounded-2xl overflow-hidden border border-[#1e2540]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 bg-[#0a0e1a] rounded-full flex items-center justify-center text-[#64748b] hover:text-white transition-colors"
            >
              ✕
            </button>
            <video
              src="/demo.mp4"
              controls
              autoPlay
              className="w-full aspect-video"
            />
          </div>
        </div>
      )}
    </section>
  )
}
