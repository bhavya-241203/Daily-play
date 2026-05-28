import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
