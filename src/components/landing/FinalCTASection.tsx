'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const FinalCTASection: React.FC = () => {
  return (
    <section className="py-24 bg-[#080D18] relative overflow-hidden border-t border-[#1E293B]/60">
      {/* Radiant Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-[#2563EB]/25 to-[#22D3EE]/20 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-6 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="p-12 sm:p-16 rounded-3xl bg-gradient-to-b from-[#0E1726] to-[#0A101D] border border-[#3B82F6]/30 shadow-2xl shadow-[#3B82F6]/10 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101827] border border-[#3B82F6]/30 text-xs font-mono text-[#22D3EE]">
            <Zap className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Operational Decision Support</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto leading-tight">
            Don't Let Fraud Catch You Off Guard.
          </h2>

          <p className="text-base sm:text-lg text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
            Take control of your security with FraudShield. Real-time transaction risk scoring, explainable anomaly detection, and rapid AML intelligence.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] border border-[#3B82F6]/50 shadow-xl shadow-[#2563EB]/30 active:scale-98 transition-all"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/fraud"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-medium text-[#F8FAFC] bg-[#101827] hover:bg-[#1E293B] border border-[#1E293B] transition-colors"
            >
              <span>Inspect Risk Engine</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

