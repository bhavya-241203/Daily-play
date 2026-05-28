import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import StatsBar from '@/components/StatsBar'
import HowItWorks from '@/components/HowItWorks'
import Sports from '@/components/Sports'
import AppScreens from '@/components/AppScreens'
import WhatsAppBot from '@/components/WhatsAppBot'
import TurfPartners from '@/components/TurfPartners'
import Cities from '@/components/Cities'
import Waitlist from '@/components/Waitlist'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <StatsBar />
      <HowItWorks />
      <Sports />
      <AppScreens />
      <WhatsAppBot />
      <TurfPartners />
      <Cities />
      <Waitlist />
      <Footer />
    </main>
  )
}
