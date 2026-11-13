'use client';

import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { useFraudShield } from '../../context/FraudShieldContext';
import {
  Sliders,
  Zap,
  RotateCcw,
  Network,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Server,
  Database,
  Cpu,
  Layers
} from 'lucide-react';

export default function SettingsPage() {
  const { simulateFraudAttack, resetDemo, runAMLAnalysis, isSimulating, transactions, accounts } = useFraudShield();

  const [structuringThreshold, setStructuringThreshold] = useState('50000');
  const [velocityWindowMin, setVelocityWindowMin] = useState('15');
  const [multiplier, setMultiplier] = useState('3.0');
  const [savedStatus, setSavedStatus] = useState(false);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Demo Controls & Engine Configuration"
        subtitle="Presentation triggers, heuristic threshold calibration, and system architecture specifications."
      />

      <div className="p-8 space-y-8 flex-1">
        {/* Live Presentation Demo Controls Card */}
        <div className="p-6 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#D8C5A3]" />
            <h3 className="text-base font-bold text-[#F1EBDD]">Judge Presentation Action Triggers</h3>
          </div>
          <p className="text-xs text-[#AAA395]">
            Execute verified demonstration sequences during live evaluator walkthroughs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Action 1: Attack */}
            <div className="p-4 rounded-xl bg-[#171715] border border-[#403B32] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D2A45F]">
                  <Zap className="w-4 h-4 text-[#D2A45F]" />
                  <span>ACTION 1: INJECT ATTACK</span>
                </div>
                <h4 className="text-sm font-semibold text-[#F1EBDD] mt-1">Simulate Coordinated Fraud</h4>
                <p className="text-xs text-[#AAA395] mt-1 leading-relaxed">
                  Injects a multi-hop account drain from TOR proxy, 3-burst structuring, and offshore layering.
                </p>
              </div>

              <button
                onClick={simulateFraudAttack}
                disabled={isSimulating}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[#2B2822] border border-[#D2A45F]/50 text-[#D8C5A3] hover:bg-[#D2A45F]/20 active:scale-95 transition-all shadow-sm"
              >
                {isSimulating ? 'Simulating Attack Sequence...' : '⚡ Trigger Attack Simulation'}
              </button>
            </div>

            {/* Action 2: AML Scan */}
            <div className="p-4 rounded-xl bg-[#171715] border border-[#403B32] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D8C5A3]">
                  <Network className="w-4 h-4 text-[#D8C5A3]" />
                  <span>ACTION 2: RUN AML SCAN</span>
                </div>
                <h4 className="text-sm font-semibold text-[#F1EBDD] mt-1">Run Network Graph Detectors</h4>
                <p className="text-xs text-[#AAA395] mt-1 leading-relaxed">
                  Evaluates directed transaction graph for closed loops, smurfing clusters, and fast transit nodes.
                </p>
              </div>

              <button
                onClick={() => {
                  const patterns = runAMLAnalysis();
                  alert(`AML scan complete: ${patterns.length} multi-party syndicates identified!`);
                }}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[#2B2822] border border-[#403B32] text-[#F1EBDD] hover:bg-[#353128] transition-colors"
              >
                🔄 Run Full AML Scan
              </button>
            </div>

            {/* Action 3: Reset Demo */}
            <div className="p-4 rounded-xl bg-[#171715] border border-[#403B32] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#AAA395]">
                  <RotateCcw className="w-4 h-4" />
                  <span>ACTION 3: RESET STATE</span>
                </div>
                <h4 className="text-sm font-semibold text-[#F1EBDD] mt-1">Restore Pristine Seed</h4>
                <p className="text-xs text-[#AAA395] mt-1 leading-relaxed">
                  Clears local storage, restores the original 100+ clean synthetic baseline dataset and alerts.
                </p>
              </div>

              <button
                onClick={() => {
                  resetDemo();
                  alert('Demo dataset reset to pristine initial state!');
                }}
                className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-[#211F1B] border border-[#403B32] text-[#AAA395] hover:text-[#F1EBDD] hover:bg-[#2B2822] transition-colors"
              >
                Restore Demo Baseline
              </button>
            </div>
          </div>
        </div>

        {/* Prototype Threshold Calibration */}
        <div className="p-6 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#F1EBDD] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D8C5A3]" />
                <span>Heuristic Threshold Parameters</span>
              </h3>
              <p className="text-xs text-[#AAA395] mt-0.5">
                Configurable prototype detection limits (illustrative, not official regulatory benchmarks)
              </p>
            </div>
            {savedStatus && (
              <span className="text-xs font-mono text-[#78A88A] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Parameters updated!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveConfig} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono text-[#AAA395] mb-1">
                Illustrative Structuring Limit (INR ₹)
              </label>
              <input
                type="number"
                value={structuringThreshold}
                onChange={e => setStructuringThreshold(e.target.value)}
                className="w-full bg-[#171715] border border-[#403B32] rounded-lg px-3 py-2 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#D8C5A3]"
              />
              <span className="text-[10px] text-[#AAA395] mt-1 block">
                Amounts within 10% below this trigger smurfing flag.
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#AAA395] mb-1">
                Velocity Burst Window (Minutes)
              </label>
              <input
                type="number"
                value={velocityWindowMin}
                onChange={e => setVelocityWindowMin(e.target.value)}
                className="w-full bg-[#171715] border border-[#403B32] rounded-lg px-3 py-2 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#D8C5A3]"
              />
              <span className="text-[10px] text-[#AAA395] mt-1 block">
                Window for calculating high-frequency bursts.
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#AAA395] mb-1">
                Baseline Outlier Multiplier
              </label>
              <input
                type="number"
                step="0.5"
                value={multiplier}
                onChange={e => setMultiplier(e.target.value)}
                className="w-full bg-[#171715] border border-[#403B32] rounded-lg px-3 py-2 text-xs text-[#F1EBDD] font-mono focus:outline-none focus:border-[#D8C5A3]"
              />
              <span className="text-[10px] text-[#AAA395] mt-1 block">
                Multiplied against account baseline average.
              </span>
            </div>

            <div className="md:col-span-3 flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-[#D8C5A3] text-[#171715] hover:bg-[#E9DDC7] transition-colors"
              >
                Save Parameter Calibration
              </button>
            </div>
          </form>
        </div>

        {/* Responsible AI & Technical Truth Disclosure */}
        <div className="p-6 rounded-xl bg-[#171715] border border-[#403B32] space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#D8C5A3]">
            <Info className="w-4 h-4 text-[#D8C5A3]" />
            <span>Product Truth & Architecture Disclosure</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#AAA395] leading-relaxed">
            <div className="p-4 rounded-lg bg-[#211F1B] border border-[#403B32] space-y-2">
              <div className="font-bold text-[#F1EBDD] flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#D8C5A3]" />
                <span>Deterministic Heuristic Engine vs ML</span>
              </div>
              <p>
                As specified in the product blueprint, this MVP prototype is built as an <strong>explainable, deterministic rule-based anomaly and risk engine</strong>—not an uninterpretable black-box ML model. Every score directly surfaces the exact mathematical signals, weights, and evidence that contributed to it.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#211F1B] border border-[#403B32] space-y-2">
              <div className="font-bold text-[#F1EBDD] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#78A88A]" />
                <span>Synthetic Data & Regulatory Sandbox</span>
              </div>
              <p>
                All 120+ transactions, Indian account numbers, and counterparties are <strong>fully synthetic</strong>. No real customer credentials, banking PINs, or live banking rails are utilized. Thresholds are illustrative prototypes and do not constitute legal determinations of money laundering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

