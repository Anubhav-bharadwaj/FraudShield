'use client';

import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { useFraudShield } from '../../context/FraudShieldContext';
import {
  ShieldAlert,
  Zap,
  Activity,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { TransactionDetailModal } from '../../components/TransactionDetailModal';
import { analyseTransaction } from '../../engine/riskEngine';

export default function FraudEnginePage() {
  const { transactions, accounts, selectedTransaction, setSelectedTransaction } = useFraudShield();

  // Interactive Sandbox state
  const [selectedTxId, setSelectedTxId] = useState<string>(transactions[10]?.id || transactions[0]?.id || '');
  const targetTx = transactions.find(t => t.id === selectedTxId) || transactions[0];

  const analysis = React.useMemo(() => {
    if (!targetTx) return null;
    return analyseTransaction(targetTx, transactions, accounts);
  }, [targetTx, transactions, accounts]);

  const activeSignals = analysis?.triggeredSignals || [];
  const score = analysis?.riskScore || 0;
  const level = analysis?.riskLevel || 'LOW';

  const signalsInventory = [
    {
      id: 'SIG-HIGH-AMOUNT',
      name: 'Unusually High Amount vs Baseline',
      category: 'AMOUNT',
      maxPoints: 25,
      description: 'Triggered when a transaction exceeds 2x to 5x the account historical average or typical maximum limit.',
      evidenceExample: 'Amount represents 138x baseline average (₹3,500) and exceeds normal limit (₹45,000).'
    },
    {
      id: 'SIG-VELOCITY-BURST',
      name: 'Transaction Velocity Burst',
      category: 'VELOCITY',
      maxPoints: 25,
      description: 'Triggered when >= 3 outbound transactions occur from the same account within a 15-minute rolling window.',
      evidenceExample: 'Observed 5 concurrent transfers totaling ₹93,500 within 8 minutes.'
    },
    {
      id: 'SIG-NEW-BENEFICIARY',
      name: 'New / Low-History Beneficiary',
      category: 'BENEFICIARY',
      maxPoints: 15,
      description: 'Triggered when large capital is routed to a counterparty never previously seen in sender history.',
      evidenceExample: 'Target account ACC-IN-1015 is a newly linked beneficiary for ₹4,85,000 transfer.'
    },
    {
      id: 'SIG-LOCATION-ANOMALY',
      name: 'Geographic / IP Proxy Anomaly',
      category: 'LOCATION',
      maxPoints: 22,
      description: 'Triggered when transaction origin deviates across international borders or uses known anonymizing proxies.',
      evidenceExample: 'Sender home: Bengaluru, KA. Originating point: Kyiv, Ukraine (TOR Exit Node).'
    },
    {
      id: 'SIG-RAPID-PASS-THROUGH',
      name: 'Rapid Onward Transfer / Layering',
      category: 'FLOW',
      maxPoints: 25,
      description: 'Triggered when incoming funds are disbursed onward within 30 minutes with retention rate < 15%.',
      evidenceExample: 'Inflow of ₹3,80,000 followed by outflow of ₹3,75,000 in 6 minutes.'
    },
    {
      id: 'SIG-REPEATED-FAILURES',
      name: 'Multiple Prior Failed Authorisations',
      category: 'REPEATED_FAILURES',
      maxPoints: 18,
      description: 'Triggered when 2 or more failed transactions or PIN probes precede a completed high-value transaction.',
      evidenceExample: '3 failed transaction attempts logged for this sender account within 10 minutes.'
    }
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Fraud Detection Engine"
        subtitle="Explainable rule-based scoring engine with deterministic weights & transparent evidence."
      />

      <div className="p-8 space-y-8 flex-1">
        {/* Interactive Sandbox Card */}
        <div className="p-6 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#D8C5A3]" />
                <h3 className="text-base font-semibold text-[#F1EBDD]">Real-Time Signal Evaluation Sandbox</h3>
              </div>
              <p className="text-xs text-[#AAA395] mt-0.5">
                Select any transaction from the dataset to inspect exact signal trigger conditions and points breakdown.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-[#AAA395]">SELECT TX:</label>
              <select
                value={selectedTxId}
                onChange={e => setSelectedTxId(e.target.value)}
                className="bg-[#171715] border border-[#403B32] rounded-lg px-3 py-1.5 text-xs text-[#D8C5A3] font-mono focus:outline-none focus:border-[#D8C5A3]"
              >
                {transactions.slice(0, 35).map(t => (
                  <option key={t.id} value={t.id}>
                    {t.id} — ₹{t.amount.toLocaleString('en-IN')} ({t.senderName.slice(0, 15)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {targetTx && analysis && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2 border-t border-[#403B32]/60">
              {/* Score Display (4 cols) */}
              <div className="lg:col-span-4 p-5 rounded-xl bg-[#171715] border border-[#403B32] flex flex-col items-center justify-center text-center space-y-3">
                <span className="text-[11px] font-mono uppercase text-[#AAA395]">
                  Calculated Risk Score
                </span>
                <div
                  className={`text-5xl font-black font-mono tabular-nums ${
                    score >= 75
                      ? 'text-[#D46D68]'
                      : score >= 50
                      ? 'text-[#D98558]'
                      : score >= 30
                      ? 'text-[#D2A45F]'
                      : 'text-[#78A88A]'
                  }`}
                >
                  {score}
                  <span className="text-xl text-[#AAA395] font-normal">/100</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                      level === 'CRITICAL'
                        ? 'bg-[#D46D68]/20 text-[#D46D68] border border-[#D46D68]/40'
                        : level === 'HIGH'
                        ? 'bg-[#D98558]/20 text-[#D98558] border border-[#D98558]/40'
                        : level === 'MEDIUM'
                        ? 'bg-[#D2A45F]/20 text-[#D2A45F] border border-[#D2A45F]/40'
                        : 'bg-[#78A88A]/20 text-[#78A88A] border border-[#78A88A]/40'
                    }`}
                  >
                    {level} RISK
                  </span>
                  <span className="text-xs font-mono text-[#AAA395] px-2 py-1 rounded bg-[#211F1B] border border-[#403B32]">
                    ACTION: {analysis.recommendedAction}
                  </span>
                </div>

                <p className="text-xs text-[#AAA395] px-4 leading-relaxed">
                  {analysis.explanation}
                </p>

                <button
                  onClick={() => setSelectedTransaction(targetTx)}
                  className="w-full mt-2 py-1.5 px-3 rounded-lg text-xs font-medium bg-[#2B2822] border border-[#403B32] text-[#D8C5A3] hover:bg-[#D8C5A3]/10"
                >
                  Open Full Transaction Inspector
                </button>
              </div>

              {/* Triggered Signals Breakdown (8 cols) */}
              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#AAA395]">
                  <span>TRIGGERED EVIDENCE SIGNALS ({activeSignals.length})</span>
                  <span>POINTS ALLOCATION</span>
                </div>

                {activeSignals.length > 0 ? (
                  <div className="space-y-2">
                    {activeSignals.map(sig => (
                      <div
                        key={sig.id}
                        className="p-3.5 rounded-lg bg-[#2B2822] border border-[#403B32] space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                sig.severity === 'CRITICAL'
                                  ? 'bg-[#D46D68]'
                                  : sig.severity === 'HIGH'
                                  ? 'bg-[#D98558]'
                                  : 'bg-[#D2A45F]'
                              }`}
                            />
                            <span className="text-sm font-semibold text-[#F1EBDD]">{sig.name}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171715] text-[#D8C5A3] border border-[#403B32]">
                              {sig.category}
                            </span>
                          </div>
                          <span className="text-sm font-mono font-bold text-[#D8C5A3]">
                            +{sig.points} pts
                          </span>
                        </div>
                        <p className="text-xs text-[#AAA395] pl-4">{sig.explanation}</p>
                        <div className="text-[11px] font-mono text-[#F1EBDD] pl-4 bg-[#171715] p-2 rounded border border-[#403B32]/70">
                          Evidence: {sig.evidence}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 rounded-lg bg-[#171715] border border-[#403B32] text-center text-xs text-[#AAA395]">
                    No anomalous signals triggered for this transaction. Transaction passes all 6 risk checks.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Signals Reference Catalog */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#F1EBDD]">Active Detection Heuristics Catalog</h3>
              <p className="text-xs text-[#AAA395]">
                Calibrated deterministic signals evaluated by the decision support engine on every transaction
              </p>
            </div>
            <span className="text-xs font-mono text-[#D8C5A3] px-2.5 py-1 rounded bg-[#211F1B] border border-[#403B32]">
              6 Rules Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {signalsInventory.map(rule => (
              <div
                key={rule.id}
                className="p-5 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171715] text-[#D8C5A3] border border-[#403B32]">
                      {rule.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#D8C5A3]">
                      Up to +{rule.maxPoints} pts
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#F1EBDD] mt-2">{rule.name}</h4>
                  <p className="text-xs text-[#AAA395] mt-1.5 leading-relaxed">{rule.description}</p>
                </div>

                <div className="pt-2 border-t border-[#403B32] text-[11px] font-mono text-[#D8C5A3]/90 bg-[#171715] p-2 rounded">
                  Test sample: {rule.evidenceExample}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Details Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}

