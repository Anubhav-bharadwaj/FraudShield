'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  Activity,
  Network,
  Cpu,
  FileSearch,
  Sliders,
  ArrowRight,
  TrendingUp,
  Lock,
  Layers
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Activity,
      title: 'Real-Time Transaction Monitoring',
      description: 'Continuous surveillance across Indian UPI, IMPS, NEFT, and wallet rails, evaluating velocity and counterparty relationships instantaneously.',
      badge: 'Live Rail Telemetry',
      accent: 'border-[#3B82F6]/40 text-[#3B82F6]',
    },
    {
      icon: Cpu,
      title: 'Deterministic Risk Scoring',
      description: 'Transparent 0–100 threat scoring calibrated with mathematical evidence. Every single score surfaces exactly which rules and points triggered it.',
      badge: 'Explainable Engine',
      accent: 'border-[#22D3EE]/40 text-[#22D3EE]',
    },
    {
      icon: ShieldAlert,
      title: 'Suspicious Activity Identification',
      description: 'Detects high-frequency velocity bursts, unprecedented transaction spikes, proxy/TOR geographic anomalies, and repeated failed authorisations.',
      badge: 'Multi-Vector Signals',
      accent: 'border-[#F59E0B]/40 text-[#F59E0B]',
    },
    {
      icon: Network,
      title: 'AML Network Topology Detection',
      description: 'Advanced graph algorithms that uncover sub-threshold smurfing clusters, rapid pass-through layering, and closed-loop circular fund routing.',
      badge: 'Graph Intelligence',
      accent: 'border-[#EF4444]/40 text-[#EF4444]',
    },
    {
      icon: Layers,
      title: 'Actionable Security Insights',
      description: 'Translates raw mathematical anomalies into plain-English investigative dossiers with concrete evidence summaries and next-step recommendations.',
      badge: 'Human-in-the-Loop',
      accent: 'border-[#10B981]/40 text-[#10B981]',
    },
    {
      icon: FileSearch,
      title: 'Investigation Case Management',
      description: 'Formal triage workflow from automated alert to investigation dossier with chronological analyst notes, audit trails, and printable case summaries.',
      badge: 'Dossier Workflow',
      accent: 'border-[#3B82F6]/40 text-[#3B82F6]',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="features" className="py-24 bg-[#080D18] relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#3B82F6]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101827] border border-[#3B82F6]/30 text-xs font-mono text-[#3B82F6]">
            <Lock className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Security Intelligence That Never Sleeps
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Engineered from first principles to empower fraud analysts and compliance teams with inspectable telemetry, graph topology, and rapid decision support.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group relative p-7 rounded-2xl bg-[#0E1726] border border-[#1E293B] hover:border-[#3B82F6]/50 shadow-lg hover:shadow-2xl hover:shadow-[#3B82F6]/10 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Top Row: Icon and Badge */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#101827] border border-[#1E293B] flex items-center justify-center text-white group-hover:scale-105 group-hover:border-[#3B82F6]/40 transition-all duration-300">
                      <Icon className="w-6 h-6 text-[#3B82F6] group-hover:text-[#22D3EE] transition-colors" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#101827] border border-[#1E293B] text-[#94A3B8] group-hover:text-white transition-colors">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-[#22D3EE] transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mt-2.5">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom Border Accent Glow */}
                <div className="mt-6 pt-4 border-t border-[#1E293B]/70 flex items-center justify-between text-xs font-mono text-[#94A3B8] group-hover:text-[#3B82F6] transition-colors">
                  <span>Engineered for Production</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

