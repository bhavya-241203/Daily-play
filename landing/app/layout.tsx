import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Daily Play — Find Your Game',
  description: "India's sports coordination app. Find open sessions, show up, earn XP, and build your sporting career.",
  keywords: ['cricket', 'badminton', 'sports', 'turf booking', 'India', 'pickleball', 'football', 'gym', 'PS5'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" style={{ backgroundColor: '#0a0e1a' }}>
      <body style={{ backgroundColor: '#0a0e1a', color: '#f1f5f9', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
