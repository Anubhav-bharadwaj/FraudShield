'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  LayoutDashboard,
  ArrowLeftRight,
  Network,
  BellRing,
  FileSearch,
  BarChart3,
  Sliders,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useFraudShield } from '../context/FraudShieldContext';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { simulateFraudAttack, resetDemo, isSimulating, alerts } = useFraudShield();

  const activeAlertsCount = alerts.filter(a => a.status === 'NEW' || a.status === 'INVESTIGATING').length;

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
    { name: 'Fraud Detection', href: '/fraud', icon: ShieldAlert },
    { name: 'AML Intelligence', href: '/aml', icon: Network },
    { name: 'Alerts', href: '/alerts', icon: BellRing, badge: activeAlertsCount > 0 ? activeAlertsCount : undefined },
    { name: 'Investigations', href: '/investigations', icon: FileSearch },
    { name: 'Analytics & Reports', href: '/analytics', icon: BarChart3 },
    { name: 'Demo Controls', href: '/settings', icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-[#1b1916] border-r border-[#403B32] flex flex-col h-screen fixed left-0 top-0 z-40 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#403B32] bg-[#171715]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#2B2822] border border-[#D8C5A3]/40 flex items-center justify-center text-[#D8C5A3] shadow-inner">
            <ShieldAlert className="w-5 h-5 text-[#D8C5A3]" />
          </div>
          <div>
            <h1 className="font-semibold text-base tracking-wide text-[#F1EBDD]">
              FraudShield
            </h1>
            <p className="text-[11px] text-[#AAA395] tracking-tight">Stay Ahead of Every Threat.</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-[10px] uppercase font-mono px-2 py-1 rounded bg-[#211F1B] border border-[#403B32] text-[#D8C5A3]">
          <span className="w-2 h-2 rounded-full bg-[#78A88A] animate-pulse" />
          <span>Decision Support Platform</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#2B2822] text-[#D8C5A3] border border-[#403B32]'
                  : 'text-[#AAA395] hover:text-[#F1EBDD] hover:bg-[#211F1B]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D8C5A3]' : 'text-[#AAA395]'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded-full bg-[#D46D68]/20 border border-[#D46D68]/40 text-[#D46D68]">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Quick Demo Controls Panel */}
      <div className="p-3 border-t border-[#403B32] bg-[#171715] space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#AAA395] px-1">
          <span>DEMO CONTROLS</span>
          <span className="text-[#78A88A] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#78A88A]" /> READY
          </span>
        </div>

        <button
          onClick={simulateFraudAttack}
          disabled={isSimulating}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-[#D2A45F]/15 border border-[#D2A45F]/40 text-[#D8C5A3] hover:bg-[#D2A45F]/25 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          <Zap className="w-3.5 h-3.5 text-[#D2A45F]" />
          <span>{isSimulating ? 'Simulating Attack...' : 'Simulate Fraud Attack'}</span>
        </button>

        <button
          onClick={resetDemo}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#211F1B] border border-[#403B32] text-[#AAA395] hover:text-[#F1EBDD] hover:bg-[#2B2822] active:scale-[0.98] transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>

        <div className="pt-2 flex items-center justify-between text-[10px] text-[#AAA395]/80 font-mono px-1">
          <span>Synthetic Data | INR Rails</span>
          <Link href="/" className="text-[#D8C5A3] hover:underline flex items-center gap-0.5">
            <span>Landing ↗</span>
          </Link>
        </div>
      </div>
    </aside>
  );
};

