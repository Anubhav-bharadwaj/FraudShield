'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050810] border-t border-[#1E293B] text-xs font-mono text-[#94A3B8] py-14">
      <div className="max-w-7xl mx-auto px-6 md:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Description */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#1E293B] border border-[#3B82F6]/40 flex items-center justify-center text-[#3B82F6]">
                <Shield className="w-4 h-4 text-[#3B82F6]" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">FraudShield</span>
            </div>
            <p className="text-xs text-[#94A3B8] max-w-sm leading-relaxed">
              Intelligent financial fraud detection and AML network telemetry platform. Stay ahead of every threat with transparent, explainable decision support.
            </p>
            <div className="text-[11px] text-[#22D3EE]">
              Tagline: Stay Ahead of Every Threat.
            </div>
          </div>

          {/* Col 2: Platform Links */}
          <div className="space-y-2.5">
            <div className="text-white font-bold tracking-wider uppercase text-[11px]">
              Active Console
            </div>
            <ul className="space-y-1.5">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Executive Overview</span>
                  <ArrowUpRight className="w-3 h-3 text-[#3B82F6]" />
                </Link>
              </li>
              <li>
                <Link href="/transactions" className="hover:text-white transition-colors">
                  Transaction Monitor
                </Link>
              </li>
              <li>
                <Link href="/fraud" className="hover:text-white transition-colors">
                  Fraud Detection Engine
                </Link>
              </li>
              <li>
                <Link href="/aml" className="hover:text-white transition-colors">
                  AML Network Graph
                </Link>
              </li>
              <li>
                <Link href="/investigations" className="hover:text-white transition-colors">
                  Investigation Cases
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Landing Sections */}
          <div className="space-y-2.5">
            <div className="text-white font-bold tracking-wider uppercase text-[11px]">
              Architecture
            </div>
            <ul className="space-y-1.5">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Core Capabilities
                </a>
              </li>
              <li>
                <a href="#live-security" className="hover:text-white transition-colors">
                  Live Security Telemetry
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  Three-Step Protocol
                </a>
              </li>
              <li>
                <a href="#security-protocol" className="hover:text-white transition-colors">
                  Trust & Verification
                </a>
              </li>
              <li>
                <Link href="/settings" className="hover:text-white transition-colors">
                  Presentation Controls
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Synthetic Disclaimer */}
        <div className="pt-8 border-t border-[#1E293B]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#94A3B8]/80">
          <div>
            © {new Date().getFullYear()} FraudShield. All rights reserved. Decision Support Prototype.
          </div>
          <div className="text-center sm:text-right">
            Synthetic Evaluation Dataset • Simulated Demonstration Telemetry
          </div>
        </div>
      </div>
    </footer>
  );
};

