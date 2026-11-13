'use client';

import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { HeroSection } from '../components/landing/HeroSection';
import { LiveSecurityPanel } from '../components/landing/LiveSecurityPanel';
import { FeaturesSection } from '../components/landing/FeaturesSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { TrustSection } from '../components/landing/TrustSection';
import { FinalCTASection } from '../components/landing/FinalCTASection';
import { Footer } from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080D18] text-[#F8FAFC] selection:bg-[#3B82F6]/30 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Hero Section with Animated Shield & Radar Illustration */}
      <HeroSection />

      {/* Live Security Monitoring Visual Panel */}
      <LiveSecurityPanel />

      {/* Features Showcase */}
      <FeaturesSection />

      {/* How It Works Workflow */}
      <HowItWorksSection />

      {/* Trust & Security Philosophy */}
      <TrustSection />

      {/* Final Call to Action */}
      <FinalCTASection />

      {/* Production Quality Footer */}
      <Footer />
    </div>
  );
}
