'use client';

import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { useFraudShield } from '../../context/FraudShieldContext';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Users,
  CreditCard,
  ArrowUpRight,
  ArrowRight,
  Filter,
  Eye,
  RefreshCw,
  Clock
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { TransactionDetailModal } from '../../components/TransactionDetailModal';
import { AddTransactionModal } from '../../components/AddTransactionModal';
import { Transaction } from '../../types';

export default function DashboardPage() {
  const { metrics, transactions, alerts, setSelectedTransaction, selectedTransaction } = useFraudShield();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Chart 1: Volume over time bucketed
  const volumeChartData = React.useMemo(() => {
    const buckets: { [key: string]: { time: string; total: number; flagged: number } } = {};
    const sorted = [...transactions].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    sorted.forEach(t => {
      const d = new Date(t.timestamp);
      const hourStr = `${d.getHours().toString().padStart(2, '0')}:00`;
      if (!buckets[hourStr]) {
        buckets[hourStr] = { time: hourStr, total: 0, flagged: 0 };
      }
      buckets[hourStr].total += 1;
      if ((t.riskScore ?? 0) >= 40) {
        buckets[hourStr].flagged += 1;
      }
    });

    return Object.values(buckets);
  }, [transactions]);

  // Chart 2: Risk distribution
  const riskPieData = React.useMemo(() => {
    let low = 0, medium = 0, high = 0, critical = 0;
    transactions.forEach(t => {
      const s = t.riskScore ?? 0;
      if (s >= 75) critical++;
      else if (s >= 50) high++;
      else if (s >= 30) medium++;
      else low++;
    });

    return [
      { name: 'Low Risk', value: low, color: '#78A88A' },
      { name: 'Medium Risk', value: medium, color: '#D2A45F' },
      { name: 'High Risk', value: high, color: '#D98558' },
      { name: 'Critical Risk', value: critical, color: '#D46D68' },
    ];
  }, [transactions]);

  // Recent transactions (last 6)
  const recentTransactions = React.useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 6);
  }, [transactions]);

  // Recent alerts (last 4)
  const recentAlerts = React.useMemo(() => {
    return [...alerts].slice(0, 4);
  }, [alerts]);

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Executive Overview"
        subtitle="Real-time transaction behavioural monitoring & anti-money laundering telemetry."
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <div className="p-8 space-y-8 flex-1">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Total Transacted */}
          <div className="p-4 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-[#AAA395]">
              <span>MONITORED TRANSACTIONS</span>
              <CreditCard className="w-4 h-4 text-[#D8C5A3]" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-[#F1EBDD] tabular-nums">
              {metrics.totalTransactions}
            </div>
            <div className="mt-1 text-[11px] text-[#AAA395]">
              Volume: ₹{(metrics.totalVolumeValue / 100000).toFixed(1)} Lakhs
            </div>
          </div>

          {/* Card 2: Flagged Transactions */}
          <div className="p-4 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-[#AAA395]">
              <span>FLAGGED ANOMALIES</span>
              <TrendingUp className="w-4 h-4 text-[#D2A45F]" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-[#D2A45F] tabular-nums">
              {metrics.flaggedTransactions}
            </div>
            <div className="mt-1 text-[11px] text-[#AAA395]">
              {metrics.totalTransactions > 0
                ? `${((metrics.flaggedTransactions / metrics.totalTransactions) * 100).toFixed(1)}% of total traffic`
                : '0%'}
            </div>
          </div>

          {/* Card 3: Critical Alerts */}
          <div className="p-4 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-[#AAA395]">
              <span>CRITICAL ALERTS</span>
              <ShieldAlert className="w-4 h-4 text-[#D46D68]" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-[#D46D68] tabular-nums">
              {metrics.criticalAlerts}
            </div>
            <div className="mt-1 text-[11px] text-[#AAA395]">
              + {metrics.highAlerts} high priority alerts
            </div>
          </div>

          {/* Card 4: Accounts Under Review */}
          <div className="p-4 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-[#AAA395]">
              <span>ACCOUNTS IN SCOPE</span>
              <Users className="w-4 h-4 text-[#D8C5A3]" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-[#F1EBDD] tabular-nums">
              {metrics.accountsUnderReview}
            </div>
            <div className="mt-1 text-[11px] text-[#AAA395]">
              Active investigation entities
            </div>
          </div>

          {/* Card 5: Flagged Value at Risk */}
          <div className="p-4 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm">
            <div className="flex items-center justify-between text-xs font-mono text-[#AAA395]">
              <span>FLAGGED EXPOSURE</span>
              <AlertTriangle className="w-4 h-4 text-[#D98558]" />
            </div>
            <div className="mt-2 text-2xl font-bold font-mono text-[#D98558] tabular-nums">
              ₹{(metrics.flaggedValue / 100000).toFixed(2)}L
            </div>
            <div className="mt-1 text-[11px] text-[#AAA395]">
              Flagged value (not confirmed loss)
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Activity & Flagged Trend (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#F1EBDD]">Transaction Activity & Flagged Volume</h3>
                <p className="text-xs text-[#AAA395]">Hourly timeline of all processed transactions vs. flagged anomalies</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-[#AAA395]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#D8C5A3]" /> Total Traffic
                </span>
                <span className="flex items-center gap-1.5 text-[#D46D68]">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#D46D68]" /> Suspicious Flags
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={volumeChartData}>
                  <defs>
                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D8C5A3" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D8C5A3" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="flagGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D46D68" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#D46D68" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#AAA395" fontSize={11} tickLine={false} />
                  <YAxis stroke="#AAA395" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#211F1B', borderColor: '#403B32', borderRadius: '8px', color: '#F1EBDD', fontSize: '12px' }}
                    itemStyle={{ color: '#F1EBDD' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#D8C5A3" strokeWidth={2} fillOpacity={1} fill="url(#totalGrad)" name="Total Transactions" />
                  <Area type="monotone" dataKey="flagged" stroke="#D46D68" strokeWidth={2} fillOpacity={1} fill="url(#flagGrad)" name="Flagged Anomalies" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Risk Level Distribution (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#F1EBDD]">Risk Severity Distribution</h3>
              <p className="text-xs text-[#AAA395]">Scored risk breakdown across dataset</p>
            </div>

            <div className="h-52 w-full my-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#171715" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#211F1B', borderColor: '#403B32', borderRadius: '8px', color: '#F1EBDD', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-3 border-t border-[#403B32]">
              {riskPieData.map(item => (
                <div key={item.name} className="flex items-center justify-between p-1.5 rounded bg-[#171715]">
                  <span className="flex items-center gap-1.5 text-[#AAA395]">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name.replace(' Risk', '')}
                  </span>
                  <span className="font-bold text-[#F1EBDD]">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lower Row: Recent Alerts & Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Alerts (6 cols) */}
          <div className="lg:col-span-6 p-6 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#F1EBDD] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-[#D8C5A3]" />
                  <span>Recent Security & AML Alerts</span>
                </h3>
                <p className="text-xs text-[#AAA395]">Automated threat indicators requiring analyst decision</p>
              </div>
              <a href="/alerts" className="text-xs font-mono text-[#D8C5A3] hover:underline flex items-center gap-1">
                <span>View All ({alerts.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-2.5">
              {recentAlerts.map(alert => (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-lg bg-[#2B2822] border border-[#403B32] hover:border-[#D8C5A3]/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          alert.severity === 'CRITICAL'
                            ? 'bg-[#D46D68]/20 text-[#D46D68] border border-[#D46D68]/40'
                            : alert.severity === 'HIGH'
                            ? 'bg-[#D98558]/20 text-[#D98558] border border-[#D98558]/40'
                            : 'bg-[#D2A45F]/20 text-[#D2A45F] border border-[#D2A45F]/40'
                        }`}
                      >
                        {alert.severity}
                      </span>
                      <span className="text-xs font-mono text-[#AAA395]">{alert.id}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#D8C5A3]">
                      Score: {alert.riskScore}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-[#F1EBDD] mt-1.5">{alert.title}</h4>
                  <p className="text-[11px] text-[#AAA395] line-clamp-1 mt-0.5">{alert.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions Table (6 cols) */}
          <div className="lg:col-span-6 p-6 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-[#F1EBDD] flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#D8C5A3]" />
                  <span>Real-Time Ingestion Feed</span>
                </h3>
                <p className="text-xs text-[#AAA395]">Latest synthetic payments processed</p>
              </div>
              <a href="/transactions" className="text-xs font-mono text-[#D8C5A3] hover:underline flex items-center gap-1">
                <span>All Transactions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-2">
              {recentTransactions.map(tx => (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTransaction(tx)}
                  className="p-3 rounded-lg bg-[#2B2822] border border-[#403B32] hover:border-[#D8C5A3]/50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#171715] border border-[#403B32] flex items-center justify-center text-xs font-mono font-bold text-[#D8C5A3]">
                      {tx.paymentMethod.slice(0, 3)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#F1EBDD] flex items-center gap-2">
                        <span>{tx.senderName}</span>
                        <ArrowRight className="w-3 h-3 text-[#AAA395]" />
                        <span>{tx.receiverName}</span>
                      </div>
                      <div className="text-[10px] font-mono text-[#AAA395] mt-0.5">
                        {tx.id} • {new Date(tx.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-[#F1EBDD]">
                      ₹{tx.amount.toLocaleString('en-IN')}
                    </div>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                        (tx.riskScore ?? 0) >= 50
                          ? 'text-[#D46D68]'
                          : (tx.riskScore ?? 0) >= 30
                          ? 'text-[#D2A45F]'
                          : 'text-[#78A88A]'
                      }`}
                    >
                      {tx.riskScore !== undefined ? `Risk: ${tx.riskScore}` : 'Unscored'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details Drawer/Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />

      {/* Add Synthetic Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}

