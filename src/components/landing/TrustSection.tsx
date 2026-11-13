'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Eye, CheckCircle2, UserCheck, Terminal } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const pillars = [
    {
      icon: Eye,
      title: 'Mathematical Explainability',
      description: 'Zero black-box obscurity. Every transaction flag reveals the exact points contributed, thresholds compared, and evidence gathered so compliance teams can defend decisions with certainty.',
    },
    {
      icon: UserCheck,
      title: 'Human-in-the-Loop Philosophy',
      description: 'FraudShield is built to augment investigator intelligence, not replace human judgment. Triage alerts, annotate dossiers with audit notes, and retain control over freeze authorizations.',
    },
    {
      icon: Terminal,
      title: 'Synthetic Verification Sandbox',
      description: 'Developed and evaluated against comprehensive synthetic UPI and banking datasets. Rigorously tested against simulated smurfing, circular round-trips, and credential drains without touching real customer credentials.',
    },
    {
      icon: Lock,
      title: 'Privacy & Credential Isolation',
      description: 'Zero storage or transmission of banking passwords, UPI PINs, OTPs, or customer credentials. Built strictly as an analytical telemetry and risk intelligence layer.',
    },
  ];

  return (
    <section id="security-protocol" className="py-24 bg-[#080D18] relative overflow-hidden border-t border-[#1E293B]/60">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101827] border border-[#3B82F6]/30 text-xs font-mono text-[#3B82F6]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Architecture & Trust</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Security That Works Behind Every Transaction.
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Built with uncompromising standards for precision, auditability, and responsible financial technology.
          </p>
        </div>

        {/* 2x2 Grid of Engineering Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-[#0E1726] border border-[#1E293B] hover:border-[#3B82F6]/40 transition-all space-y-4"
              >
                <div className="w-11 h-11 rounded-xl bg-[#101827] border border-[#1E293B] flex items-center justify-center text-[#3B82F6]">
                  <Icon className="w-5 h-5 text-[#22D3EE]" />
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

