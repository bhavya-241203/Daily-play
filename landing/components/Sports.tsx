const sports = [
  {
    emoji: '🏏',
    name: 'Cricket',
    tagline: 'Colony matches, office leagues',
    color: '#22c55e',
    border: 'border-[#22c55e]',
    glow: 'hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]',
    bg: 'bg-[#22c55e]/10',
  },
  {
    emoji: '🏸',
    name: 'Badminton',
    tagline: 'Singles, doubles, weekend games',
    color: '#f59e0b',
    border: 'border-[#f59e0b]',
    glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
    bg: 'bg-[#f59e0b]/10',
  },
  {
    emoji: '🥒',
    name: 'Pickleball',
    tagline: 'The fastest growing sport in India',
    color: '#06b6d4',
    border: 'border-[#06b6d4]',
    glow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    bg: 'bg-[#06b6d4]/10',
  },
  {
    emoji: '⚽',
    name: 'Football',
    tagline: '5-a-side, 7-a-side, keep your streak',
    color: '#f97316',
    border: 'border-[#f97316]',
    glow: 'hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]',
    bg: 'bg-[#f97316]/10',
  },
  {
    emoji: '💪',
    name: 'Gym',
    tagline: 'Track sessions, accountability streaks',
    color: '#a855f7',
    border: 'border-[#a855f7]',
    glow: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]',
    bg: 'bg-[#a855f7]/10',
  },
  {
    emoji: '🎮',
    name: 'PS5',
    tagline: 'Tournaments with your crew',
    color: '#3b82f6',
    border: 'border-[#3b82f6]',
    glow: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]',
    bg: 'bg-[#3b82f6]/10',
  },
]

export default function Sports() {
  return (
    <section id="sports" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            6 Sports, <span className="text-gradient">One App</span>
          </h2>
          <p className="text-[#64748b] text-lg max-w-xl mx-auto">
            Track every game you play — from colony cricket to office PS5 tournaments.
          </p>
        </div>

        {/* Sport cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sports.map((sport) => (
            <div
              key={sport.name}
              className={`card border-t-2 ${sport.border} p-6 group hover:scale-[1.03] transition-all duration-300 ${sport.glow} cursor-default`}
            >
              <div className="flex items-start gap-4">
                {/* Emoji circle */}
                <div className={`w-14 h-14 rounded-2xl ${sport.bg} flex items-center justify-center text-3xl flex-shrink-0`}>
                  {sport.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-[#f1f5f9] mb-1">{sport.name}</h3>
                  <p className="text-[#64748b] text-sm leading-relaxed">{sport.tagline}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
