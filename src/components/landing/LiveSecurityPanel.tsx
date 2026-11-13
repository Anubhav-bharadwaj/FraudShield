'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShieldAlert,
  ShieldCheck,
  Activity,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Clock,
  CheckCircle,
  ExternalLink,
  Sliders,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface SimulatedFeedItem {
  id: string;
  sender: string;
  receiver: string;
  amount: string;
  rail: string;
  score: number;
  status: 'SAFE' | 'SUSPICIOUS' | 'CRITICAL';
  signal: string;
  timeAgo: string;
}

export const LiveSecurityPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'SUSPICIOUS' | 'CRITICAL'>('ALL');

  // Simulated live feed records
  const sampleFeed: SimulatedFeedItem[] = [
    {
      id: 'TXN-SIM-901',
      sender: 'Aarav Patel (ACC-1001)',
      receiver: 'Shadow Mule ACC-999',
      amount: '₹4,85,000',
      rail: 'IMPS',
      score: 88,
      status: 'CRITICAL',
      signal: '138x baseline outlier + unseen counterparty',
      timeAgo: 'Just now',
    },
    {
      id: 'TXN-SIM-902',
      sender: 'Rajesh Verma (ACC-1004)',
      receiver: 'CryptoBridge Escrow',
      amount: '₹49,200',
      rail: 'UPI',
      score: 78,
      status: 'CRITICAL',
      signal: 'Smurfing burst below ₹50,000 threshold',
      timeAgo: '2m ago',
    },
    {
      id: 'TXN-SIM-903',
      sender: 'Priya Sharma (ACC-1002)',
      receiver: 'QuickPay Logistics',
      amount: '₹1,250',
      rail: 'UPI',
      score: 8,
      status: 'SAFE',
      signal: 'Conforms to historical merchant baseline',
      timeAgo: '4m ago',
    },
    {
      id: 'TXN-SIM-904',
      sender: 'Sneha Rao (ACC-1005)',
      receiver: 'Karan Singhania (Layering Node)',
      amount: '₹19,800',
      rail: 'UPI',
      score: 64,
      status: 'SUSPICIOUS',
      signal: 'Rapid 5-transfer velocity burst in 8 mins',
      timeAgo: '7m ago',
    },
    {
      id: 'TXN-SIM-905',
      sender: 'Karan Singhania (ACC-1008)',
      receiver: 'Deepak Joshi (ACC-1009)',
      amount: '₹2,75,000',
      rail: 'NEFT',
      score: 92,
      status: 'CRITICAL',
      signal: 'Circular flow cycle participant (A → B → C → A)',
      timeAgo: '11m ago',
    },
    {
      id: 'TXN-SIM-906',
      sender: 'Vikram Malhotra (ACC-1003)',
      receiver: 'Zenith Global Traders',
      amount: '₹1,25,000',
      rail: 'NEFT',
      score: 14,
      status: 'SAFE',
      signal: 'Regular B2B vendor settlement pattern',
      timeAgo: '15m ago',
    },
  ];

  const filteredFeed = sampleFeed.filter((item) => {
    if (activeTab === 'ALL') return true;
    return item.status === activeTab;
  });

  return (
    <section id="live-security" className="py-24 bg-[#080D18] relative overflow-hidden border-t border-[#1E293B]/60">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101827] border border-[#3B82F6]/30 text-xs font-mono text-[#3B82F6]">
            <Cpu className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Telemetry Simulation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Real-Time Threat Visualization
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Experience how FraudShield evaluates live transaction rails, isolates behavioural anomalies, and computes deterministic threat scores in milliseconds.
          </p>
        </div>

        {/* Security Panel Container */}
        <div className="relative rounded-2xl bg-[#0E1726] border border-[#1E293B] shadow-2xl shadow-[#3B82F6]/5 overflow-hidden">
          {/* Laser Scanning Beam (CSS Animation) */}
          <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent animate-scan z-20 pointer-events-none opacity-80" />

          {/* Panel Top Bar */}
          <div className="px-6 py-4 bg-[#0A101D] border-b border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
              </div>
              <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                SECURITY TELEMETRY ENGINE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1E293B]/80 text-[#22D3EE] border border-[#3B82F6]/30">
                LATENCY: 12ms
              </span>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeTab === 'ALL'
                    ? 'bg-[#2563EB] text-white font-bold'
                    : 'bg-[#101827] text-[#94A3B8] hover:text-white'
                }`}
              >
                All (6)
              </button>
              <button
                onClick={() => setActiveTab('SUSPICIOUS')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeTab === 'SUSPICIOUS'
                    ? 'bg-[#F59E0B]/20 border border-[#F59E0B]/50 text-[#F59E0B] font-bold'
                    : 'bg-[#101827] text-[#94A3B8] hover:text-white'
                }`}
              >
                Suspicious
              </button>
              <button
                onClick={() => setActiveTab('CRITICAL')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeTab === 'CRITICAL'
                    ? 'bg-[#EF4444]/20 border border-[#EF4444]/50 text-[#EF4444] font-bold'
                    : 'bg-[#101827] text-[#94A3B8] hover:text-white'
                }`}
              >
                Critical (3)
              </button>
            </div>
          </div>

          {/* Panel Main Grid: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#1E293B]">
            {/* Left Column: Live Monitored Activity Feed (7 cols) */}
            <div className="lg:col-span-7 p-6 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8] px-1">
                <span>SIMULATED RAIL TRAFFIC FEED</span>
                <span>STATUS / SCORE</span>
              </div>

              <div className="space-y-2.5">
                {filteredFeed.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#0A101D] border border-[#1E293B] hover:border-[#3B82F6]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">{item.id}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#101827] text-[#22D3EE] border border-[#1E293B]">
                          {item.rail}
                        </span>
                        <span className="text-[11px] text-[#94A3B8] font-mono">{item.timeAgo}</span>
                      </div>
                      <div className="text-xs text-[#94A3B8] truncate max-w-xs">
                        <span className="text-white font-medium">{item.sender.split('(')[0]}</span> →{' '}
                        <span>{item.receiver.split('(')[0]}</span>
                      </div>
                      <div className="text-[11px] text-[#94A3B8] font-mono line-clamp-1">
                        Signal: {item.signal}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-[#1E293B]">
                      <span className="font-mono text-sm font-bold text-white tabular-nums">
                        {item.amount}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          item.status === 'CRITICAL'
                            ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40'
                            : item.status === 'SUSPICIOUS'
                            ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                            : 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                        }`}
                      >
                        {item.status} ({item.score})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Active Threat Deep Dive Card (5 cols) */}
            <div className="lg:col-span-5 p-6 bg-[#0B1322] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-[#EF4444]" />
                    <span className="text-xs font-mono font-bold text-white uppercase">
                      THREAT RADAR INSPECTOR
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 font-bold animate-pulse">
                    ACTIVE THREAT
                  </span>
                </div>

                {/* Score Gauge Card */}
                <div className="p-4 rounded-xl bg-[#080D18] border border-[#1E293B] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#94A3B8]">AGGREGATE THREAT SCORE</span>
                    <span className="text-xs font-mono font-bold text-[#EF4444]">CRITICAL RISK</span>
                  </div>
                  <div className="text-4xl font-extrabold font-mono text-[#EF4444] tabular-nums">
                    88 <span className="text-lg font-normal text-[#94A3B8]">/ 100</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#101827] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#F59E0B] to-[#EF4444] w-[88%] rounded-full" />
                  </div>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Transaction value ₹4,85,000 represents 138x baseline average (₹3,500) routed to newly created shell beneficiary.
                  </p>
                </div>

                {/* Evidence Checklist */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-[#94A3B8] uppercase">
                    EVIDENCE SIGNALS TRIGGERED
                  </span>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#0E1726] border border-[#1E293B]">
                      <span className="text-white">Amount Baseline Deviation</span>
                      <span className="text-[#EF4444] font-bold">+25 pts</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#0E1726] border border-[#1E293B]">
                      <span className="text-white">First-Time Unseen Beneficiary</span>
                      <span className="text-[#F59E0B] font-bold">+15 pts</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#0E1726] border border-[#1E293B]">
                      <span className="text-white">High-Speed Outflow Transit</span>
                      <span className="text-[#EF4444] font-bold">+25 pts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="w-full py-3 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] border border-[#3B82F6]/50 shadow-lg shadow-[#2563EB]/25 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <span>Launch Live Decision Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Panel Footer Disclaimer */}
          <div className="px-6 py-2.5 bg-[#080D18] border-t border-[#1E293B] text-[11px] font-mono text-[#94A3B8] flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[#22D3EE]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]" />
              SIMULATED TELEMETRY & THREAT DETECTION DEMONSTRATION
            </span>
            <span className="hidden sm:inline text-[#94A3B8]/60">
              Deterministic rule scoring • No external banking integration
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

