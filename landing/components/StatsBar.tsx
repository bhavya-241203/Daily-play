export default function StatsBar() {
  const stats = [
    { number: '500+', label: 'Partner Turfs' },
    { number: '7', label: 'Metro Cities' },
    { number: '6', label: 'Sports' },
    { number: '10,000+', label: 'Players Waiting' },
  ]

  return (
    <div className="bg-[#141828] border-y border-[#1e2540]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-gradient mb-1">
                {stat.number}
              </div>
              <div className="text-[#64748b] text-sm font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
