'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Activity,
  Lock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Radio
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-[#080D18]">
      {/* Background Ambient Glowing Gradient Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#3B82F6]/15 to-[#22D3EE]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-[#1D4ED8]/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Subtle Grid Pattern Overlay */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#1E293B0F_1px,transparent_1px),linear-gradient(to_bottom,#1E293B0F_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Copy, CTAs (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#101827] border border-[#3B82F6]/30 text-xs font-mono text-[#22D3EE] shadow-sm shadow-[#3B82F6]/10">
              <span className="w-2 h-2 rounded-full bg-[#22D3EE] animate-pulse" />
              <span>Next-Gen Financial Crime Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Detect Fraud <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#22D3EE]">
                Before It Strikes.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#94A3B8] max-w-xl leading-relaxed">
              Stay one step ahead of digital threats with intelligent fraud detection, real-time risk analysis, and actionable security insights.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/dashboard"
                className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] border border-[#3B82F6]/50 shadow-xl shadow-[#2563EB]/25 active:scale-98 transition-all"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-medium text-[#F8FAFC] bg-[#101827] hover:bg-[#1E293B] border border-[#1E293B] hover:border-[#3B82F6]/40 transition-colors"
              >
                <span>Explore Features</span>
              </a>
            </div>

            {/* Security Guarantee Signals */}
            <div className="pt-6 border-t border-[#1E293B]/60 grid grid-cols-3 gap-4 text-xs font-mono text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>Zero Black-Box Math</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#3B82F6] shrink-0" />
                <span>Sub-15ms Scoring</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#22D3EE] shrink-0" />
                <span>Synthetic Sandbox</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Animated Cyber Shield & Radar Telemetry (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Outer Circular Boundary with Radar Sweep */}
            <div className="relative w-[340px] sm:w-[400px] h-[340px] sm:h-[400px] rounded-full border border-[#1E293B] flex items-center justify-center shadow-2xl shadow-[#3B82F6]/10 overflow-hidden bg-[#0A101D]/80 backdrop-blur-sm">
              {/* Concentric Radar Rings */}
              <div className="absolute inset-8 rounded-full border border-[#1E293B]/70" />
              <div className="absolute inset-20 rounded-full border border-[#3B82F6]/20 animate-pulse-ring" />
              <div className="absolute inset-32 rounded-full border border-[#22D3EE]/20" />

              {/* Crosshair Grids */}
              <div className="absolute w-full h-[1px] bg-[#1E293B]/60" />
              <div className="absolute h-full w-[1px] bg-[#1E293B]/60" />

              {/* Radar Rotating Sweep Beam */}
              <div
                className="absolute inset-0 rounded-full animate-radar pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(34, 211, 238, 0.08) 320deg, rgba(59, 130, 246, 0.35) 360deg)',
                }}
              />

              {/* Central Glowing Shield Hologram */}
              <div className="relative z-10 w-28 h-28 rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0A101D] border-2 border-[#3B82F6] flex flex-col items-center justify-center shadow-2xl shadow-[#3B82F6]/40 animate-float">
                <Shield className="w-12 h-12 text-[#22D3EE] drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
                <span className="text-[9px] font-mono font-bold tracking-widest text-[#3B82F6] mt-1 uppercase">
                  ARMED
                </span>
              </div>
            </div>

            {/* Floating Live Telemetry Cards */}
            {/* Pill 1: Top Right */}
            <div className="absolute -top-3 -right-2 sm:right-2 p-3 rounded-xl bg-[#0E1726]/95 border border-[#3B82F6]/40 shadow-xl backdrop-blur-md animate-float flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#3B82F6]/15 flex items-center justify-center text-[#3B82F6]">
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
              <div className="text-left font-mono">
                <div className="text-[10px] text-[#94A3B8]">VELOCITY SPIKE DETECTED</div>
                <div className="text-xs font-bold text-white">5 txs / 8m • Blocked</div>
              </div>
            </div>

            {/* Pill 2: Bottom Left */}
            <div className="absolute -bottom-4 -left-4 sm:left-2 p-3 rounded-xl bg-[#0E1726]/95 border border-[#EF4444]/40 shadow-xl backdrop-blur-md animate-float-delayed flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#EF4444]/15 flex items-center justify-center text-[#EF4444]">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-left font-mono">
                <div className="text-[10px] text-[#EF4444]">TOR EXIT PROXY MITIGATED</div>
                <div className="text-xs font-bold text-white">Threat Score: 92 (Critical)</div>
              </div>
            </div>

            {/* Pill 3: Bottom Right */}
            <div className="absolute bottom-16 -right-6 hidden sm:flex p-2.5 rounded-lg bg-[#0E1726]/90 border border-[#10B981]/40 shadow-lg backdrop-blur-md font-mono text-[11px] items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              <span className="text-[#10B981] font-semibold">Verified Safe Routing</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

