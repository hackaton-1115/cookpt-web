'use client';

import { Benefits } from '@/components/landing/Benefits';
import { CallToAction } from '@/components/landing/CallToAction';
import { Features } from '@/components/landing/Features';
import { Footer } from '@/components/landing/Footer';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Navigation } from '@/components/landing/Navigation';

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-[#fafafa]'>
      <Navigation />
      <main className='pt-16'>
        <Hero />
        <Features />
        <HowItWorks />
        <Benefits />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
