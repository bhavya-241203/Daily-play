const cities = [
  {
    name: 'Bangalore',
    flag: '🟢',
    status: 'LIVE',
    statusColor: 'text-[#22c55e]',
    bg: 'bg-[#22c55e]/10',
    border: 'border-[#22c55e]/30',
  },
  {
    name: 'Mumbai',
    flag: '🟡',
    status: 'Coming Soon',
    statusColor: 'text-[#eab308]',
    bg: 'bg-[#eab308]/10',
    border: 'border-[#eab308]/30',
  },
  {
    name: 'Pune',
    flag: '🟡',
    status: 'Coming Soon',
    statusColor: 'text-[#eab308]',
    bg: 'bg-[#eab308]/10',
    border: 'border-[#eab308]/30',
  },
  {
    name: 'Hyderabad',
    flag: '🟡',
    status: 'Coming Soon',
    statusColor: 'text-[#eab308]',
    bg: 'bg-[#eab308]/10',
    border: 'border-[#eab308]/30',
  },
  {
    name: 'Delhi NCR',
    flag: '⚪',
    status: 'Planned',
    statusColor: 'text-[#64748b]',
    bg: 'bg-[#1e2540]/50',
    border: 'border-[#1e2540]',
  },
  {
    name: 'Chennai',
    flag: '⚪',
    status: 'Planned',
    statusColor: 'text-[#64748b]',
    bg: 'bg-[#1e2540]/50',
    border: 'border-[#1e2540]',
  },
  {
    name: 'Kolkata',
    flag: '⚪',
    status: 'Planned',
    statusColor: 'text-[#64748b]',
    bg: 'bg-[#1e2540]/50',
    border: 'border-[#1e2540]',
  },
]

export default function Cities() {
  return (
    <section id="cities" className="py-20 md:py-32 bg-[#141828]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Coming to <span className="text-gradient">Your City</span>
          </h2>
          <p className="text-[#64748b] text-lg max-w-xl mx-auto">
            Daily Play is expanding across India. Join the waitlist for your city.
          </p>
        </div>

        {/* City pills */}
        <div className="flex flex-wrap justify-center gap-4">
          {cities.map((city) => (
            <div
              key={city.name}
              className={`flex items-center gap-2.5 ${city.bg} border ${city.border} rounded-full px-5 py-3 transition-all duration-200 hover:scale-105`}
            >
              <span className="text-lg">{city.flag}</span>
              <div>
                <div className="text-[#f1f5f9] font-semibold text-sm leading-none mb-0.5">{city.name}</div>
                <div className={`text-xs font-medium ${city.statusColor}`}>{city.status}</div>
              </div>
            </div>
          ))}
        </div>

        {/* India map note */}
        <p className="text-center text-[#64748b] text-sm mt-10">
          🇮🇳 Planning to cover all major metros by end of 2026
        </p>
      </div>
    </section>
  )
}
