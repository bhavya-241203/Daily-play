function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex-shrink-0">
      <div className="absolute inset-0 bg-[#6366f1] opacity-10 blur-2xl rounded-[2.5rem]" />
      <div className="relative rounded-[2.5rem] bg-[#141828] border-2 border-[#1e2540] shadow-2xl w-52 h-96 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-4 bg-[#0a0e1a] rounded-full z-10" />
        <div className="pt-10 px-2.5 pb-2.5 h-full flex flex-col">
          {children}
        </div>
      </div>
    </div>
  )
}

function FindAGame() {
  return (
    <PhoneFrame>
      {/* Header */}
      <div className="text-[#f1f5f9] font-bold text-sm mb-3">Find a Game</div>
      {/* Filter pills */}
      <div className="flex gap-1.5 mb-3 flex-wrap">
        {['All', 'Cricket', 'Badminton'].map((f, i) => (
          <span
            key={f}
            className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${
              i === 0
                ? 'bg-[#6366f1] text-white'
                : 'bg-[#0a0e1a] text-[#64748b] border border-[#1e2540]'
            }`}
          >
            {f}
          </span>
        ))}
      </div>
      {/* Session cards */}
      <div className="space-y-2 flex-1">
        <div className="bg-[#0a0e1a] rounded-xl p-2.5 border-l-2 border-[#22c55e]">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🏏</span>
            <div className="flex-1 min-w-0">
              <div className="text-white text-[10px] font-semibold truncate">Sunday Cricket</div>
              <div className="text-[#64748b] text-[8px]">7am · Koramangala · 4/8</div>
            </div>
            <div className="bg-[#22c55e] text-white text-[7px] px-1.5 py-0.5 rounded-full font-bold">Join</div>
          </div>
        </div>
        <div className="bg-[#0a0e1a] rounded-xl p-2.5 border-l-2 border-[#f59e0b]">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🏸</span>
            <div className="flex-1 min-w-0">
              <div className="text-white text-[10px] font-semibold truncate">Office Badminton</div>
              <div className="text-[#64748b] text-[8px]">6pm · Indiranagar · 3/4</div>
            </div>
            <div className="bg-[#f59e0b] text-white text-[7px] px-1.5 py-0.5 rounded-full font-bold">Join</div>
          </div>
        </div>
        <div className="bg-[#0a0e1a] rounded-xl p-2.5 border-l-2 border-[#06b6d4]">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🥒</span>
            <div className="flex-1 min-w-0">
              <div className="text-white text-[10px] font-semibold truncate">Pickleball Meetup</div>
              <div className="text-[#64748b] text-[8px]">Sat 5pm · HSR Layout · 2/6</div>
            </div>
            <div className="bg-[#06b6d4] text-white text-[7px] px-1.5 py-0.5 rounded-full font-bold">Join</div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

function CreateSession() {
  return (
    <PhoneFrame>
      <div className="text-[#f1f5f9] font-bold text-sm mb-3">Create Session</div>
      {/* Sport selector */}
      <div className="grid grid-cols-3 gap-1.5 mb-3">
        {[
          { e: '🏏', n: 'Cricket', c: '#22c55e', active: true },
          { e: '🏸', n: 'Badminton', c: '#f59e0b', active: false },
          { e: '🥒', n: 'Pickle', c: '#06b6d4', active: false },
          { e: '⚽', n: 'Football', c: '#f97316', active: false },
          { e: '💪', n: 'Gym', c: '#a855f7', active: false },
          { e: '🎮', n: 'PS5', c: '#3b82f6', active: false },
        ].map((s) => (
          <div
            key={s.n}
            className={`rounded-lg p-1.5 flex flex-col items-center gap-0.5 border ${
              s.active ? 'border-[#22c55e] bg-[#22c55e]/10' : 'border-[#1e2540] bg-[#0a0e1a]'
            }`}
          >
            <span className="text-sm">{s.e}</span>
            <span className="text-[7px] text-[#64748b]">{s.n}</span>
          </div>
        ))}
      </div>
      {/* Title input */}
      <div className="bg-[#0a0e1a] border border-[#1e2540] rounded-lg px-2 py-1.5 mb-3">
        <div className="text-[8px] text-[#64748b] mb-0.5">Session title</div>
        <div className="text-[10px] text-[#f1f5f9]">Sunday Morning Cricket...</div>
      </div>
      {/* Date strip */}
      <div className="flex gap-1">
        {['Today', 'Tomorrow', 'Sat', 'Sun'].map((d, i) => (
          <div
            key={d}
            className={`flex-1 text-center py-1 rounded-lg text-[8px] font-semibold ${
              i === 0
                ? 'bg-[#6366f1] text-white'
                : 'bg-[#0a0e1a] text-[#64748b] border border-[#1e2540]'
            }`}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="mt-auto pt-2">
        <div className="bg-[#6366f1] text-white text-[10px] font-bold py-2 rounded-xl text-center">
          Create Session →
        </div>
      </div>
    </PhoneFrame>
  )
}

function Venues() {
  return (
    <PhoneFrame>
      <div className="text-[#f1f5f9] font-bold text-sm mb-3">Venues</div>
      {/* City filter */}
      <div className="flex gap-1.5 mb-3">
        {['Bangalore', 'Mumbai', 'Pune'].map((c, i) => (
          <span
            key={c}
            className={`text-[8px] px-2 py-0.5 rounded-full font-semibold ${
              i === 0
                ? 'bg-[#6366f1] text-white'
                : 'bg-[#0a0e1a] text-[#64748b] border border-[#1e2540]'
            }`}
          >
            {c}
          </span>
        ))}
      </div>
      {/* Venue cards */}
      <div className="space-y-2 flex-1">
        {[
          { name: 'Koramangala Sports Hub', sports: '🏏 🏸 ⚽', sessions: '12 sessions/wk' },
          { name: 'HSR Turf Arena', sports: '⚽ 🏸 🥒', sessions: '8 sessions/wk' },
        ].map((v) => (
          <div key={v.name} className="bg-[#0a0e1a] rounded-xl p-2.5 border border-[#1e2540]">
            <div className="flex items-start justify-between gap-1 mb-1.5">
              <div className="text-white text-[10px] font-semibold leading-tight">{v.name}</div>
              <span className="bg-[#22c55e]/20 text-[#22c55e] text-[7px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
                Partner
              </span>
            </div>
            <div className="text-[8px] mb-1">{v.sports}</div>
            <div className="text-[#64748b] text-[8px]">{v.sessions}</div>
          </div>
        ))}
      </div>
    </PhoneFrame>
  )
}

function Community() {
  return (
    <PhoneFrame>
      <div className="text-[#f1f5f9] font-bold text-sm mb-2">Community</div>
      {/* Active pill */}
      <div className="bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-lg px-2 py-1.5 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse flex-shrink-0" />
        <span className="text-[#22c55e] text-[9px] font-semibold">62 Active · 8 Sessions today</span>
      </div>
      {/* Leaderboard */}
      <div className="text-[9px] text-[#64748b] font-semibold mb-2 uppercase tracking-wide">Leaderboard</div>
      <div className="space-y-1.5 flex-1">
        {[
          { rank: '🥇', name: 'Rahul K.', xp: '2,840 XP', level: 'Lv.18' },
          { rank: '🥈', name: 'Priya S.', xp: '2,610 XP', level: 'Lv.16' },
          { rank: '🥉', name: 'Vikram N.', xp: '2,290 XP', level: 'Lv.15' },
          { rank: '4', name: 'Ananya M.', xp: '1,950 XP', level: 'Lv.13' },
        ].map((p) => (
          <div
            key={p.name}
            className="bg-[#0a0e1a] rounded-xl p-2 flex items-center gap-2"
          >
            <span className="text-sm w-5 text-center">{p.rank}</span>
            <div className="flex-1 min-w-0">
              <div className="text-white text-[10px] font-semibold">{p.name}</div>
              <div className="text-[#64748b] text-[8px]">{p.level}</div>
            </div>
            <div className="text-[#eab308] text-[9px] font-bold">{p.xp}</div>
          </div>
        ))}
      </div>
    </PhoneFrame>
  )
}

export default function AppScreens() {
  return (
    <section id="app-screens" className="py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Every screen built{' '}
            <span className="text-gradient">for players</span>
          </h2>
          <p className="text-[#64748b] text-lg max-w-xl mx-auto">
            Clean, fast, and intuitive — from finding a game to checking the leaderboard.
          </p>
        </div>

        {/* Phones */}
        <div className="flex gap-6 overflow-x-auto pb-4 md:justify-center snap-x snap-mandatory scrollbar-hide">
          <div className="snap-center">
            <div className="text-center mb-3 text-[#64748b] text-sm font-medium">Find a Game</div>
            <FindAGame />
          </div>
          <div className="snap-center">
            <div className="text-center mb-3 text-[#64748b] text-sm font-medium">Create Session</div>
            <CreateSession />
          </div>
          <div className="snap-center">
            <div className="text-center mb-3 text-[#64748b] text-sm font-medium">Venues</div>
            <Venues />
          </div>
          <div className="snap-center">
            <div className="text-center mb-3 text-[#64748b] text-sm font-medium">Community</div>
            <Community />
          </div>
        </div>

        {/* Scroll hint on mobile */}
        <p className="text-center text-[#64748b] text-xs mt-4 md:hidden">← Scroll to see more screens →</p>
      </div>
    </section>
  )
}
