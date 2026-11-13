'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Database, Cpu, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Submit & Ingest',
      description: 'Stream transaction payloads, UPI handles, device familiarity signals, and geographic locations into FraudShield ingestion endpoints.',
      icon: Database,
      highlight: 'Sub-15ms Ingestion',
    },
    {
      step: '02',
      title: 'Analyze & Correlate',
      description: 'The deterministic engine matches baseline deviations, calculates short-window velocity spikes, and traces multi-party directed graph topologies.',
      icon: Cpu,
      highlight: '6 Deterministic Heuristics',
    },
    {
      step: '03',
      title: 'Protect & Decide',
      description: 'Instantaneous risk score (0–100) delivered alongside full mathematical explainability, plain-English evidence, and triage recommendations.',
      icon: ShieldCheck,
      highlight: 'Actionable Intelligence',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#0A101D] relative overflow-hidden border-t border-[#1E293B]/60">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101827] border border-[#3B82F6]/30 text-xs font-mono text-[#3B82F6]">
            <span>System Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How FraudShield Protects Your Rails
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            A seamless three-stage security protocol transforming raw transaction telemetry into decisive financial crime prevention.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Desktop Connecting Line behind cards */}
          <div className="hidden md:block absolute top-1/2 left-16 right-16 h-[2px] bg-gradient-to-r from-[#3B82F6]/20 via-[#22D3EE]/40 to-[#10B981]/20 -translate-y-12 -z-0" />

          {steps.map((item, idx) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="relative z-10 p-8 rounded-2xl bg-[#0E1726] border border-[#1E293B] shadow-xl hover:border-[#3B82F6]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-br from-[#3B82F6] to-[#22D3EE]">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-[#101827] border border-[#1E293B] flex items-center justify-center text-[#22D3EE] shadow-inner">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Highlight Pill */}
                <div className="mt-6 pt-4 border-t border-[#1E293B]/70 flex items-center gap-2 text-xs font-mono text-[#22D3EE]">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span>{item.highlight}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

