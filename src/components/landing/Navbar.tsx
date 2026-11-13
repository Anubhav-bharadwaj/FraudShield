'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, Menu, X, ArrowRight, Activity, Lock } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Live Telemetry', href: '#live-security' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Security Protocol', href: '#security-protocol' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080D18]/90 backdrop-blur-md border-b border-[#1E293B]/80 shadow-2xl py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0E1726] border border-[#3B82F6]/40 flex items-center justify-center text-[#3B82F6] shadow-lg shadow-[#3B82F6]/10 group-hover:border-[#22D3EE]/70 group-hover:shadow-[#22D3EE]/20 transition-all">
            <Shield className="w-5 h-5 text-[#3B82F6] group-hover:text-[#22D3EE] transition-colors" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              FraudShield
            </span>
            <span className="text-[10px] font-mono tracking-wider text-[#94A3B8] uppercase">
              Stay Ahead of Every Threat
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-[#94A3B8] hover:text-white transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-3.5">
          <Link
            href="/dashboard"
            className="text-xs font-semibold px-4 py-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/50 border border-transparent hover:border-[#1E293B] transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/dashboard"
            className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] border border-[#3B82F6]/50 shadow-lg shadow-[#2563EB]/25 hover:shadow-[#3B82F6]/40 active:scale-95 transition-all overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Get Started
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/60 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A101D] border-b border-[#1E293B] px-6 py-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200 shadow-2xl">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#94A3B8] hover:text-white py-2 border-b border-[#1E293B]/40"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-2 flex flex-col gap-2.5">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-semibold rounded-lg text-[#94A3B8] bg-[#101827] border border-[#1E293B]"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-semibold rounded-lg text-white bg-[#2563EB] shadow-lg shadow-[#2563EB]/30"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

