const messages = [
  { from: 'bot', text: 'Welcome to Daily Play! 👋 What\'s your name?' },
  { from: 'user', text: 'Rahul' },
  { from: 'bot', text: 'Nice to meet you Rahul! 🎉 Which city are you in?' },
  { from: 'user', text: 'Bangalore' },
  { from: 'bot', text: '✅ Profile created! Level 1 · Rookie\nType *play* to find a game 🏏' },
  { from: 'user', text: 'play' },
  { from: 'bot', text: '📋 Open sessions in Bangalore:\n1. Sunday cricket — 7am Koramangala\n2. Office badminton — Sat 6pm\nType *join 1* to join!' },
  { from: 'user', text: 'join 1' },
  { from: 'bot', text: '🎉 You\'re in! See you Sunday at 7am\nType *checkin* when you arrive!' },
]

const features = [
  'Find open sessions near you',
  'Log your session in one message',
  'Check career stats anytime',
  'Daily challenges and leaderboard',
]

export default function WhatsAppBot() {
  return (
    <section id="whatsapp" className="py-20 md:py-32 bg-[#141828]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — text */}
          <div className="order-2 lg:order-1">
            {/* WA icon */}
            <div className="w-16 h-16 rounded-2xl bg-[#25d366]/20 border border-[#25d366]/30 flex items-center justify-center text-3xl mb-6">
              💬
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Also on <span style={{ color: '#25d366' }}>WhatsApp</span>
            </h2>
            <p className="text-[#64748b] text-lg leading-relaxed mb-8">
              No app install needed. Log sessions, check your stats, and find games — just by chatting.
            </p>

            {/* Feature list */}
            <ul className="space-y-3 mb-8">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-3">
                  <span className="text-[#25d366] text-lg flex-shrink-0">✅</span>
                  <span className="text-[#f1f5f9]">{f}</span>
                </li>
              ))}
            </ul>

            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 bg-[#25d366] hover:bg-[#1dbd58] text-white font-bold px-6 py-3 rounded-full transition-all duration-200 hover:scale-105"
              style={{ boxShadow: '0 0 20px rgba(37,211,102,0.25)' }}
            >
              Try the Bot →
            </a>
          </div>

          {/* Right — WhatsApp chat mockup */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-[#1e2540] shadow-2xl">
              {/* Header bar */}
              <div className="flex items-center gap-3 px-4 py-3" style={{ background: '#128c7e' }}>
                <div className="w-9 h-9 rounded-full bg-[#25d366] flex items-center justify-center text-xl">🤖</div>
                <div>
                  <div className="text-white font-semibold text-sm">Daily Play Bot</div>
                  <div className="text-white/70 text-xs">Online</div>
                </div>
              </div>

              {/* Chat area */}
              <div className="bg-[#0d1117] px-3 py-4 space-y-2 max-h-[380px] overflow-y-auto" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #1e2540 1px, transparent 0)', backgroundSize: '20px 20px' }}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-2xl px-3 py-2 text-xs leading-relaxed whitespace-pre-line ${
                        msg.from === 'bot'
                          ? 'rounded-tl-sm text-white'
                          : 'rounded-tr-sm text-white'
                      }`}
                      style={{
                        background: msg.from === 'bot' ? '#1f2c34' : '#005c4b',
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input bar */}
              <div className="flex items-center gap-2 px-3 py-2 bg-[#1f2c34] border-t border-[#1e2540]">
                <div className="flex-1 bg-[#2a3942] rounded-full px-3 py-1.5 text-[#64748b] text-xs">
                  Message...
                </div>
                <div className="w-8 h-8 rounded-full bg-[#25d366] flex items-center justify-center text-sm">
                  ↗
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
