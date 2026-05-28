'use client'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 bg-[#0a0e1a]/80 backdrop-blur border-b border-[#1e2540]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl">🏆</span>
            <span className="text-xl font-bold">
              <span className="text-gradient">Daily</span>
              <span className="text-[#f1f5f9]"> Play</span>
            </span>
          </div>

          {/* CTA */}
          <a
            href="#waitlist"
            className="bg-[#6366f1] hover:bg-[#4f52d9] text-white font-semibold px-5 py-2 rounded-full transition-all duration-200 text-sm glow-indigo hover:scale-105"
          >
            Get Early Access
          </a>
        </div>
      </div>
    </nav>
  )
}
