'use client';

import React from 'react';
import { Zap, Network, Download, ShieldCheck, Activity } from 'lucide-react';
import { useFraudShield } from '../context/FraudShieldContext';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onOpenAddModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onOpenAddModal }) => {
  const { simulateFraudAttack, runAMLAnalysis, exportTransactionsCSV, isSimulating, transactions, metrics } = useFraudShield();

  return (
    <header className="sticky top-0 z-30 bg-[#171715]/95 backdrop-blur-md border-b border-[#403B32] px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight text-[#F1EBDD]">{title}</h2>
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-[#211F1B] border border-[#403B32] text-[#AAA395]">
            <Activity className="w-3 h-3 text-[#78A88A] animate-pulse" />
            <span>LIVE MONITORING</span>
          </span>
        </div>
        {subtitle && <p className="text-xs text-[#AAA395] mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center flex-wrap gap-2.5">
        {/* Run AML scan button */}
        <button
          onClick={() => runAMLAnalysis()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#211F1B] border border-[#403B32] text-[#F1EBDD] hover:bg-[#2B2822] hover:border-[#D8C5A3]/50 transition-colors"
          title="Run heuristic AML pattern detectors over all transactions"
        >
          <Network className="w-3.5 h-3.5 text-[#D8C5A3]" />
          <span>Run AML Scan</span>
        </button>

        {/* Simulate Fraud Scenario */}
        <button
          onClick={simulateFraudAttack}
          disabled={isSimulating}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2B2822] border border-[#D2A45F]/50 text-[#D8C5A3] hover:bg-[#D2A45F]/20 active:scale-95 transition-all shadow-sm"
          title="Trigger a realistic 5-step synthetic fraud scenario"
        >
          <Zap className="w-3.5 h-3.5 text-[#D2A45F]" />
          <span>{isSimulating ? 'Injecting...' : 'Simulate Attack'}</span>
        </button>

        {/* Export CSV button */}
        <button
          onClick={() => exportTransactionsCSV()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#211F1B] border border-[#403B32] text-[#AAA395] hover:text-[#F1EBDD] hover:bg-[#2B2822] transition-colors"
          title="Export current transactions to CSV"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>

        {onOpenAddModal && (
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#D8C5A3] text-[#171715] hover:bg-[#E9DDC7] active:scale-95 transition-all shadow-sm"
          >
            <span>+ Add Synthetic Tx</span>
          </button>
        )}
      </div>
    </header>
  );
};

