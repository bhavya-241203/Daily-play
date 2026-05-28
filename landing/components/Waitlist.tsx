'use client'

import { useState, FormEvent } from 'react'

const cities = [
  'Bangalore',
  'Mumbai',
  'Pune',
  'Hyderabad',
  'Delhi NCR',
  'Chennai',
  'Kolkata',
]

const sportOptions = [
  { id: 'cricket', label: 'Cricket', emoji: '🏏' },
  { id: 'badminton', label: 'Badminton', emoji: '🏸' },
  { id: 'pickleball', label: 'Pickleball', emoji: '🥒' },
  { id: 'football', label: 'Football', emoji: '⚽' },
  { id: 'gym', label: 'Gym', emoji: '💪' },
  { id: 'ps5', label: 'PS5', emoji: '🎮' },
]

export default function Waitlist() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [sports, setSports] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const toggleSport = (id: string) => {
    setSports((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="waitlist" className="py-20 md:py-32">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Be First in <span className="text-gradient">Your City</span>
          </h2>
          <p className="text-[#64748b] text-lg">
            Join the waitlist. We&apos;ll reach out when Daily Play launches in your area.
          </p>
        </div>

        {/* Card */}
        <div className="card p-8 md:p-10 glow-indigo">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-[#f1f5f9] mb-2">You&apos;re on the list!</h3>
              <p className="text-[#64748b]">
                We&apos;ll reach out when we launch in{' '}
                <span className="text-[#6366f1] font-semibold">{city || 'your city'}</span>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#64748b] mb-1.5">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Sharma"
                  className="w-full bg-[#0a0e1a] border border-[#1e2540] focus:border-[#6366f1] rounded-xl px-4 py-3 text-[#f1f5f9] placeholder-[#64748b] outline-none transition-colors duration-200"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#64748b] mb-1.5">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@example.com"
                  className="w-full bg-[#0a0e1a] border border-[#1e2540] focus:border-[#6366f1] rounded-xl px-4 py-3 text-[#f1f5f9] placeholder-[#64748b] outline-none transition-colors duration-200"
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-[#64748b] mb-1.5">
                  Your City
                </label>
                <select
                  id="city"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#0a0e1a] border border-[#1e2540] focus:border-[#6366f1] rounded-xl px-4 py-3 text-[#f1f5f9] outline-none transition-colors duration-200 appearance-none cursor-pointer"
                >
                  <option value="" disabled className="text-[#64748b]">Select your city</option>
                  {cities.map((c) => (
                    <option key={c} value={c} className="bg-[#141828]">{c}</option>
                  ))}
                </select>
              </div>

              {/* Sports */}
              <div>
                <label className="block text-sm font-medium text-[#64748b] mb-2">
                  Sports you play
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {sportOptions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSport(s.id)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                        sports.includes(s.id)
                          ? 'border-[#6366f1] bg-[#6366f1]/15 text-[#f1f5f9]'
                          : 'border-[#1e2540] bg-[#0a0e1a] text-[#64748b] hover:border-[#6366f1]/50'
                      }`}
                    >
                      <span>{s.emoji}</span>
                      <span>{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#6366f1] hover:bg-[#4f52d9] text-white font-bold py-4 rounded-full text-lg transition-all duration-200 glow-indigo hover:scale-[1.02] mt-2"
              >
                Join the Waitlist →
              </button>
            </form>
          )}
        </div>

        {/* Social proof below */}
        {!submitted && (
          <div className="text-center mt-6">
            <p className="text-[#64748b] text-sm mb-3">
              Already <span className="text-[#f1f5f9] font-semibold">10,000+ players</span> waiting across India
            </p>
            <div className="flex justify-center gap-3 text-2xl">
              {sportOptions.map((s) => (
                <span key={s.id} title={s.label}>{s.emoji}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
