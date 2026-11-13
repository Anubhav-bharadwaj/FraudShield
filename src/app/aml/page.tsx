'use client';

import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { useFraudShield } from '../../context/FraudShieldContext';
import {
  Network,
  RotateCcw,
  Zap,
  ArrowRight,
  ShieldAlert,
  AlertTriangle,
  FilePlus,
  Info,
  CheckCircle2,
  Clock,
  Layers,
  Search
} from 'lucide-react';
import { AMLNetworkGraph } from '../../components/AMLNetworkGraph';
import { TransactionDetailModal } from '../../components/TransactionDetailModal';
import { AMLPattern, Transaction } from '../../types';

export default function AMLPage() {
  const {
    amlPatterns,
    transactions,
    accounts,
    runAMLAnalysis,
    createCaseFromAlert,
    alerts,
    selectedTransaction,
    setSelectedTransaction
  } = useFraudShield();

  const [activeTab, setActiveTab] = useState<'ALL' | 'CIRCULAR_FLOW' | 'STRUCTURING' | 'RAPID_PASS_THROUGH'>('ALL');

  const filteredPatterns = React.useMemo(() => {
    if (activeTab === 'ALL') return amlPatterns;
    return amlPatterns.filter(p => p.type === activeTab);
  }, [amlPatterns, activeTab]);

  const handleCreateCaseFromPattern = (pattern: AMLPattern) => {
    // Find related alert or create
    const relatedAlert = alerts.find(a => pattern.involvedTransactions.some(t => a.transactionIds.includes(t)));
    if (relatedAlert) {
      createCaseFromAlert(relatedAlert.id, `Syndicate: ${pattern.title}`);
      alert(`Investigation Case created for ${pattern.title}! Open the Investigations tab to review.`);
    } else {
      alert(`Pattern logged in AML ledger. Evidence compiled across ${pattern.involvedAccounts.length} accounts.`);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="AML Intelligence & Network Topology"
        subtitle="Graph analysis detecting multi-hop layering, circular money routing, and sub-threshold structuring."
      />

      <div className="p-8 space-y-8 flex-1">
        {/* Top Controls Strip */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#211F1B] border border-[#403B32]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2B2822] border border-[#D8C5A3]/40 flex items-center justify-center text-[#D8C5A3]">
              <Network className="w-5 h-5 text-[#D8C5A3]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F1EBDD]">Multi-Party Syndicate Detection</h3>
              <p className="text-xs text-[#AAA395]">
                {amlPatterns.length} suspicious pattern clusters identified across {accounts.length} synthetic accounts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => runAMLAnalysis()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#2B2822] border border-[#D8C5A3]/50 text-[#D8C5A3] hover:bg-[#D8C5A3]/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-run Graph Analysis</span>
            </button>
          </div>
        </div>

        {/* Visual Graph Section */}
        <AMLNetworkGraph
          patterns={amlPatterns}
          transactions={transactions}
          accounts={accounts}
          onSelectTransaction={tx => setSelectedTransaction(tx)}
        />

        {/* Patterns Breakdown Table Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-[#F1EBDD]">Detected AML Pattern Dossiers</h3>
              <p className="text-xs text-[#AAA395]">
                Comprehensive breakdown of structuring, circular routing, and layering chains
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-lg bg-[#211F1B] border border-[#403B32] text-xs font-mono">
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'ALL' ? 'bg-[#2B2822] text-[#D8C5A3] font-bold' : 'text-[#AAA395] hover:text-[#F1EBDD]'
                }`}
              >
                ALL ({amlPatterns.length})
              </button>
              <button
                onClick={() => setActiveTab('CIRCULAR_FLOW')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'CIRCULAR_FLOW' ? 'bg-[#2B2822] text-[#D8C5A3] font-bold' : 'text-[#AAA395] hover:text-[#F1EBDD]'
                }`}
              >
                CIRCULAR
              </button>
              <button
                onClick={() => setActiveTab('STRUCTURING')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'STRUCTURING' ? 'bg-[#2B2822] text-[#D8C5A3] font-bold' : 'text-[#AAA395] hover:text-[#F1EBDD]'
                }`}
              >
                STRUCTURING
              </button>
              <button
                onClick={() => setActiveTab('RAPID_PASS_THROUGH')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  activeTab === 'RAPID_PASS_THROUGH' ? 'bg-[#2B2822] text-[#D8C5A3] font-bold' : 'text-[#AAA395] hover:text-[#F1EBDD]'
                }`}
              >
                LAYERING
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredPatterns.map(pattern => (
              <div
                key={pattern.id}
                className="p-5 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm space-y-3 hover:border-[#D8C5A3]/40 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        pattern.severity === 'CRITICAL'
                          ? 'bg-[#D46D68]/20 text-[#D46D68] border border-[#D46D68]/40'
                          : 'bg-[#D98558]/20 text-[#D98558] border border-[#D98558]/40'
                      }`}
                    >
                      {pattern.severity}
                    </span>
                    <span className="text-xs font-mono text-[#AAA395]">{pattern.id}</span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#171715] text-[#D8C5A3] border border-[#403B32]">
                      {pattern.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono text-[#AAA395]">
                    <span>Total Flow: <strong className="text-[#F1EBDD]">₹{pattern.totalAmount.toLocaleString('en-IN')}</strong></span>
                    <span>•</span>
                    <span>Elapsed: <strong className="text-[#D8C5A3]">{pattern.timeSpanMinutes}m</strong></span>
                    <span>•</span>
                    <span>Confidence: <strong className="text-[#78A88A]">{pattern.confidenceScore}%</strong></span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#F1EBDD]">{pattern.title}</h4>
                  <p className="text-xs text-[#AAA395] mt-1 leading-relaxed">{pattern.description}</p>
                </div>

                {/* Evidence & Flow Routing */}
                <div className="p-3 rounded-lg bg-[#171715] border border-[#403B32] space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-[#D8C5A3]">
                    <span>ROUTING TOPOLOGY:</span>
                    <span className="text-[#F1EBDD]">{pattern.flowPath?.join(' → ') || pattern.involvedAccounts.join(' ↔ ')}</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#AAA395]">
                    Evidence: {pattern.evidence}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-xs text-[#AAA395] font-mono">
                    <span>{pattern.involvedAccounts.length} Accounts in scope</span>
                    <span>•</span>
                    <span>{pattern.involvedTransactions.length} Transactions linked</span>
                  </div>

                  <button
                    onClick={() => handleCreateCaseFromPattern(pattern)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2B2822] border border-[#D8C5A3]/40 text-[#D8C5A3] hover:bg-[#D8C5A3]/10 transition-colors"
                  >
                    <FilePlus className="w-3.5 h-3.5" />
                    <span>Open Case Dossier</span>
                  </button>
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

