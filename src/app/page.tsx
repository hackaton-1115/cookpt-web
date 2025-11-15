'use client'

import { CallToAction } from '@/components/landing/CallToAction'
import { Features } from '@/components/landing/Features'
import { Footer } from '@/components/landing/Footer'
import { Hero } from '@/components/landing/Hero'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Navigation } from '@/components/landing/Navigation'

export default function LandingPage() {
  return (
    <div className="bg-background min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
