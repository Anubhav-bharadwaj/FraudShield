'use client';

import React, { useMemo } from 'react';
import { Header } from '../../components/Header';
import { useFraudShield } from '../../context/FraudShieldContext';
import {
  BarChart3,
  TrendingUp,
  Download,
  Printer,
  ShieldAlert,
  Users,
  AlertTriangle,
  CreditCard,
  CheckCircle2,
  PieChart as PieIcon,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie
} from 'recharts';

export default function AnalyticsPage() {
  const { transactions, accounts, alerts, amlPatterns, metrics, exportTransactionsCSV } = useFraudShield();

  // 1. Top Risky Accounts Ranking
  const topRiskyAccounts = useMemo(() => {
    const accountStats: { [accId: string]: { id: string; name: string; type: string; totalFlagged: number; totalVolume: number; maxScore: number } } = {};

    accounts.forEach(a => {
      accountStats[a.id] = {
        id: a.id,
        name: a.displayName,
        type: a.accountType,
        totalFlagged: 0,
        totalVolume: 0,
        maxScore: 0
      };
    });

    transactions.forEach(tx => {
      const score = tx.riskScore ?? 0;
      if (accountStats[tx.senderAccountId]) {
        accountStats[tx.senderAccountId].totalVolume += tx.amount;
        if (score >= 50) {
          accountStats[tx.senderAccountId].totalFlagged += 1;
        }
        accountStats[tx.senderAccountId].maxScore = Math.max(accountStats[tx.senderAccountId].maxScore, score);
      }
      if (accountStats[tx.receiverAccountId]) {
        accountStats[tx.receiverAccountId].totalVolume += tx.amount;
        if (score >= 50) {
          accountStats[tx.receiverAccountId].totalFlagged += 1;
        }
        accountStats[tx.receiverAccountId].maxScore = Math.max(accountStats[tx.receiverAccountId].maxScore, score);
      }
    });

    return Object.values(accountStats)
      .sort((a, b) => b.maxScore - a.maxScore || b.totalFlagged - a.totalFlagged)
      .slice(0, 8);
  }, [accounts, transactions]);

  // 2. Payment Method Anomaly Rate
  const methodStats = useMemo(() => {
    const stats: { [key: string]: { method: string; count: number; flagged: number } } = {
      UPI: { method: 'UPI', count: 0, flagged: 0 },
      IMPS: { method: 'IMPS', count: 0, flagged: 0 },
      NEFT: { method: 'NEFT', count: 0, flagged: 0 },
      RTGS: { method: 'RTGS', count: 0, flagged: 0 },
      WALLET: { method: 'WALLET', count: 0, flagged: 0 },
    };

    transactions.forEach(t => {
      const m = t.paymentMethod;
      if (stats[m]) {
        stats[m].count += 1;
        if ((t.riskScore ?? 0) >= 40) stats[m].flagged += 1;
      }
    });

    return Object.values(stats).map(s => ({
      ...s,
      flagRate: s.count > 0 ? Math.round((s.flagged / s.count) * 100) : 0
    }));
  }, [transactions]);

  // 3. Signal Frequency
  const signalFrequency = useMemo(() => {
    const freqs: { [key: string]: number } = {
      'High Amount': 0,
      'Velocity Burst': 0,
      'New Beneficiary': 0,
      'Location Anomaly': 0,
      'Rapid Pass-Through': 0,
      'Structuring / Smurfing': 0,
      'Circular Cycle': 0,
    };

    transactions.forEach(t => {
      const signals = t.analysisResult?.triggeredSignals || [];
      signals.forEach(s => {
        if (s.name.includes('Amount')) freqs['High Amount']++;
        else if (s.name.includes('Velocity')) freqs['Velocity Burst']++;
        else if (s.name.includes('Beneficiary')) freqs['New Beneficiary']++;
        else if (s.name.includes('Location') || s.name.includes('Proxy')) freqs['Location Anomaly']++;
        else if (s.name.includes('Pass-Through') || s.name.includes('Layering')) freqs['Rapid Pass-Through']++;
        else if (s.name.includes('Structuring') || s.name.includes('Smurfing')) freqs['Structuring / Smurfing']++;
        else if (s.name.includes('Circular')) freqs['Circular Cycle']++;
      });
    });

    return Object.entries(freqs).map(([name, count]) => ({ name, count }));
  }, [transactions]);

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Analytics & Executive Intelligence"
        subtitle="Cross-account risk profiling, payment rail vulnerability benchmarks, and audit reporting."
      />

      <div className="p-8 space-y-8 flex-1">
        {/* Top Report Header Controls */}
        <div className="p-6 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#F1EBDD] flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#D8C5A3]" />
              <span>Executive Anti-Financial Crime (AFC) Synthesis Report</span>
            </h3>
            <p className="text-xs text-[#AAA395] mt-1">
              Generated for internal decision-support and supervisory risk assessment.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportTransactionsCSV()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#2B2822] border border-[#403B32] text-[#F1EBDD] hover:bg-[#D8C5A3]/10 hover:border-[#D8C5A3] transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#D8C5A3]" />
              <span>Export Full CSV Dataset</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#D8C5A3] text-[#171715] hover:bg-[#E9DDC7] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Signal Frequency Breakdown (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm flex flex-col">
            <h4 className="text-sm font-semibold text-[#F1EBDD] mb-1">Detection Signal Triggers by Heuristic</h4>
            <p className="text-xs text-[#AAA395] mb-4">Total incidence count of each behavioural rule across the dataset</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={signalFrequency} layout="vertical">
                  <XAxis type="number" stroke="#AAA395" fontSize={11} tickLine={false} />
                  <YAxis type="category" dataKey="name" stroke="#AAA395" fontSize={11} tickLine={false} width={140} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#211F1B', borderColor: '#403B32', borderRadius: '8px', color: '#F1EBDD', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#D8C5A3" radius={[0, 4, 4, 0]}>
                    {signalFrequency.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name.includes('Circular') || entry.name.includes('Structuring')
                            ? '#D46D68'
                            : entry.name.includes('Pass-Through') || entry.name.includes('High Amount')
                            ? '#D98558'
                            : '#D8C5A3'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Rail Vulnerability (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[#F1EBDD]">Payment Rail Anomaly Ratios</h4>
              <p className="text-xs text-[#AAA395]">Flagged transaction rate (%) by settlement protocol</p>
            </div>

            <div className="space-y-3 my-4">
              {methodStats.map(m => (
                <div key={m.method} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#F1EBDD] font-bold">{m.method}</span>
                    <span className="text-[#AAA395]">
                      {m.flagged} flagged / {m.count} txs ({m.flagRate}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#171715] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        m.flagRate > 30 ? 'bg-[#D46D68]' : m.flagRate > 15 ? 'bg-[#D2A45F]' : 'bg-[#78A88A]'
                      }`}
                      style={{ width: `${Math.max(5, m.flagRate)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[11px] font-mono text-[#AAA395] bg-[#171715] p-2.5 rounded border border-[#403B32]">
              Instant rails (UPI, IMPS) demonstrate highest velocity burst vectors in current monitoring window.
            </div>
          </div>
        </div>

        {/* Top Risky Accounts Leaderboard */}
        <div className="p-6 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-[#F1EBDD]">High-Risk Account Concentration</h4>
              <p className="text-xs text-[#AAA395]">Accounts exhibiting highest composite risk scores and anomalous cluster participation</p>
            </div>
            <span className="text-xs font-mono text-[#D8C5A3] px-2.5 py-1 rounded bg-[#171715] border border-[#403B32]">
              Top 8 Entities
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#171715] border-b border-[#403B32] text-[#AAA395] font-mono uppercase text-[10px]">
                  <th className="py-2.5 px-4">Account ID & Holder</th>
                  <th className="py-2.5 px-4">Entity Type</th>
                  <th className="py-2.5 px-4 text-right">Monitored Volume</th>
                  <th className="py-2.5 px-4 text-center">Flagged Events</th>
                  <th className="py-2.5 px-4 text-center">Peak Risk Score</th>
                  <th className="py-2.5 px-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#403B32]/60">
                {topRiskyAccounts.map(acc => (
                  <tr key={acc.id} className="hover:bg-[#2B2822] transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#F1EBDD]">{acc.name}</div>
                      <div className="text-[10px] font-mono text-[#AAA395]">{acc.id}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[#171715] border border-[#403B32] text-[#D8C5A3]">
                        {acc.type}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-bold text-[#F1EBDD]">
                      ₹{acc.totalVolume.toLocaleString('en-IN')}
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-bold text-[#D2A45F]">
                      {acc.totalFlagged}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          acc.maxScore >= 75
                            ? 'bg-[#D46D68]/20 text-[#D46D68] border border-[#D46D68]/40'
                            : acc.maxScore >= 50
                            ? 'bg-[#D98558]/20 text-[#D98558] border border-[#D98558]/40'
                            : 'bg-[#78A88A]/20 text-[#78A88A] border border-[#78A88A]/40'
                        }`}
                      >
                        {acc.maxScore} / 100
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[11px] font-mono text-[#AAA395]">
                        {acc.maxScore >= 75 ? 'Enhanced Due Diligence' : acc.maxScore >= 50 ? 'Active Monitoring' : 'Standard Baseline'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

