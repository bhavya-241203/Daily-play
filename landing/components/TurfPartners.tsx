const benefits = [
  {
    icon: '📋',
    iconBg: 'bg-[#6366f1]/20',
    iconBorder: 'border-[#6366f1]/30',
    title: 'Free Listing',
    description: 'Get discovered by thousands of active players in your city — completely free to list.',
  },
  {
    icon: '💰',
    iconBg: 'bg-[#22c55e]/20',
    iconBorder: 'border-[#22c55e]/30',
    title: 'Booking Revenue',
    description: 'Players book through Daily Play. You get paid, we take a small commission.',
  },
  {
    icon: '📊',
    iconBg: 'bg-[#eab308]/20',
    iconBorder: 'border-[#eab308]/30',
    title: 'Analytics Dashboard',
    description: 'See sessions per day, peak hours, sport breakdown, and active player counts.',
  },
]

export default function TurfPartners() {
  return (
    <section id="turf-partners" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Wrapper card */}
        <div className="card p-10 md:p-16 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#6366f1] opacity-5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#22c55e] opacity-5 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#6366f1]/10 border border-[#6366f1]/20 rounded-full px-4 py-1.5 text-[#6366f1] text-sm font-semibold mb-5">
              🏟️ For Venue Owners
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              Own a Turf or <span className="text-gradient">Ground?</span>
            </h2>
            <p className="text-[#64748b] text-lg max-w-xl mx-auto">
              Partner with Daily Play and turn your venue into a community hub for India&apos;s urban athletes.
            </p>
          </div>

          {/* Benefit cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="bg-[#0a0e1a] border border-[#1e2540] rounded-2xl p-6 hover:border-[#6366f1]/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${b.iconBg} border ${b.iconBorder} flex items-center justify-center text-2xl mb-5`}>
                  {b.icon}
                </div>
                <h3 className="text-lg font-bold text-[#f1f5f9] mb-2">{b.title}</h3>
                <p className="text-[#64748b] text-sm leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="#waitlist"
              className="inline-flex items-center gap-2 bg-[#6366f1] hover:bg-[#4f52d9] text-white font-bold px-8 py-4 rounded-full text-lg transition-all duration-200 glow-indigo hover:scale-105"
            >
              Partner With Us →
            </a>
            <p className="text-[#64748b] text-sm mt-4">
              Currently onboarding Bangalore. Mumbai and Pune opening soon.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
