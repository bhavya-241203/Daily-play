export default function HowItWorks() {
  const steps = [
    {
      icon: '🔍',
      iconBg: 'bg-[#6366f1]/20',
      iconBorder: 'border-[#6366f1]/30',
      number: '01',
      title: 'Find a Game',
      description: 'Browse open sessions in your city — filter by sport, date, and skill level.',
    },
    {
      icon: '📍',
      iconBg: 'bg-[#22c55e]/20',
      iconBorder: 'border-[#22c55e]/30',
      number: '02',
      title: 'Show Up',
      description: 'Get to the turf, scan the QR to check in. No scores needed. Just play.',
    },
    {
      icon: '⚡',
      iconBg: 'bg-[#eab308]/20',
      iconBorder: 'border-[#eab308]/30',
      number: '03',
      title: 'Earn & Level Up',
      description: 'Every session earns XP. Build your career from Rookie to Legend across 50 levels.',
    },
  ]

  return (
    <section id="how-it-works" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-[#64748b] text-lg max-w-xl mx-auto">
            Three simple steps to start your sporting journey.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center md:items-start">
              {/* Arrow connector (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[calc(100%-16px)] w-8 text-2xl text-[#1e2540] z-10">
                  →
                </div>
              )}

              {/* Card */}
              <div className="card p-8 w-full group hover:border-[#6366f1]/40 transition-all duration-300 hover:-translate-y-1">
                {/* Step number */}
                <div className="text-[#1e2540] font-black text-5xl absolute top-4 right-6 select-none">
                  {step.number}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${step.iconBg} border ${step.iconBorder} flex items-center justify-center text-3xl mb-6`}>
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-[#f1f5f9] mb-3">{step.title}</h3>
                <p className="text-[#64748b] leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
