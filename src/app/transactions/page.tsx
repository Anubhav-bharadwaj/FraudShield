'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '../../components/Header';
import { useFraudShield } from '../../context/FraudShieldContext';
import {
  Search,
  Filter,
  Download,
  Plus,
  RefreshCw,
  Eye,
  ShieldAlert,
  ArrowUpDown,
  CreditCard,
  MapPin,
  Clock
} from 'lucide-react';
import { TransactionDetailModal } from '../../components/TransactionDetailModal';
import { AddTransactionModal } from '../../components/AddTransactionModal';
import { Transaction, RiskLevel, PaymentMethod, TransactionStatus } from '../../types';

export default function TransactionsPage() {
  const {
    transactions,
    selectedTransaction,
    setSelectedTransaction,
    analyseTx,
    analyseAllTransactions,
    exportTransactionsCSV
  } = useFraudShield();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL');
  const [selectedMethod, setSelectedMethod] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'timestamp' | 'amount' | 'riskScore'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Search
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const matchesId = tx.id.toLowerCase().includes(query);
        const matchesSender = tx.senderName.toLowerCase().includes(query) || tx.senderAccountId.toLowerCase().includes(query);
        const matchesReceiver = tx.receiverName.toLowerCase().includes(query) || tx.receiverAccountId.toLowerCase().includes(query);
        const matchesTag = tx.scenarioTag?.toLowerCase().includes(query);
        if (!matchesId && !matchesSender && !matchesReceiver && !matchesTag) return false;
      }

      // Risk
      if (selectedRisk !== 'ALL') {
        const score = tx.riskScore ?? -1;
        if (selectedRisk === 'CRITICAL' && score < 75) return false;
        if (selectedRisk === 'HIGH' && (score < 50 || score >= 75)) return false;
        if (selectedRisk === 'MEDIUM' && (score < 30 || score >= 50)) return false;
        if (selectedRisk === 'LOW' && (score < 0 || score >= 30)) return false;
        if (selectedRisk === 'UNASSESSED' && tx.riskScore !== undefined) return false;
      }

      // Method
      if (selectedMethod !== 'ALL' && tx.paymentMethod !== selectedMethod) return false;

      // Status
      if (selectedStatus !== 'ALL' && tx.status !== selectedStatus) return false;

      return true;
    }).sort((a, b) => {
      let valA: any = a[sortBy] ?? 0;
      let valB: any = b[sortBy] ?? 0;

      if (sortBy === 'timestamp') {
        valA = new Date(a.timestamp).getTime();
        valB = new Date(b.timestamp).getTime();
      }

      if (sortOrder === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
  }, [transactions, searchQuery, selectedRisk, selectedMethod, selectedStatus, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getRiskBadge = (score?: number, level?: RiskLevel) => {
    if (score === undefined || level === undefined) {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2B2822] text-[#AAA395] border border-[#403B32]">
          UNASSESSED
        </span>
      );
    }
    if (score >= 75) {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D46D68]/20 text-[#D46D68] border border-[#D46D68]/40 font-bold">
          CRITICAL ({score})
        </span>
      );
    }
    if (score >= 50) {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D98558]/20 text-[#D98558] border border-[#D98558]/40 font-bold">
          HIGH ({score})
        </span>
      );
    }
    if (score >= 30) {
      return (
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#D2A45F]/20 text-[#D2A45F] border border-[#D2A45F]/40 font-bold">
          MEDIUM ({score})
        </span>
      );
    }
    return (
      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#78A88A]/20 text-[#78A88A] border border-[#78A88A]/40 font-semibold">
        LOW ({score})
      </span>
    );
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Transaction Monitoring"
        subtitle="Searchable real-time ledger with automated behavioural anomaly scoring."
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <div className="p-8 space-y-6 flex-1">
        {/* Filter & Search Bar */}
        <div className="p-4 rounded-xl bg-[#211F1B] border border-[#403B32] space-y-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#AAA395] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="search-transactions"
                type="text"
                aria-label="Search transactions by ID, sender, receiver, account number, or tag"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search by Transaction ID, sender, receiver, account number, or tag..."
                className="w-full bg-[#171715] border border-[#403B32] rounded-lg pl-9 pr-4 py-2 text-xs text-[#F1EBDD] placeholder-[#AAA395]/60 focus:outline-none focus:border-[#D8C5A3]"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={() => analyseAllTransactions()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-[#2B2822] border border-[#D8C5A3]/40 text-[#D8C5A3] hover:bg-[#D8C5A3]/10 transition-colors"
                title="Run risk engine on all transactions"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Batch Analyse All</span>
              </button>

              <button
                onClick={() => exportTransactionsCSV(filteredTransactions)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#171715] border border-[#403B32] text-[#AAA395] hover:text-[#F1EBDD] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export ({filteredTransactions.length})</span>
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#403B32]/60 text-xs">
            {/* Risk filter */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="filter-risk" className="text-[#AAA395] font-mono text-[11px]">RISK:</label>
              <select
                id="filter-risk"
                aria-label="Filter transactions by risk level"
                value={selectedRisk}
                onChange={e => { setSelectedRisk(e.target.value); setCurrentPage(1); }}
                className="bg-[#171715] border border-[#403B32] rounded px-2 py-1 text-xs text-[#F1EBDD] focus:outline-none focus:border-[#D8C5A3]"
              >
                <option value="ALL">All Risk Levels</option>
                <option value="CRITICAL">Critical (75-100)</option>
                <option value="HIGH">High (50-74)</option>
                <option value="MEDIUM">Medium (30-49)</option>
                <option value="LOW">Low (0-29)</option>
                <option value="UNASSESSED">Unassessed</option>
              </select>
            </div>

            {/* Method filter */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="filter-method" className="text-[#AAA395] font-mono text-[11px]">RAILS:</label>
              <select
                id="filter-method"
                aria-label="Filter transactions by payment method"
                value={selectedMethod}
                onChange={e => { setSelectedMethod(e.target.value); setCurrentPage(1); }}
                className="bg-[#171715] border border-[#403B32] rounded px-2 py-1 text-xs text-[#F1EBDD] focus:outline-none focus:border-[#D8C5A3]"
              >
                <option value="ALL">All Payment Methods</option>
                <option value="UPI">UPI</option>
                <option value="IMPS">IMPS</option>
                <option value="NEFT">NEFT</option>
                <option value="RTGS">RTGS</option>
                <option value="WALLET">Wallet</option>
              </select>
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="filter-status" className="text-[#AAA395] font-mono text-[11px]">STATUS:</label>
              <select
                id="filter-status"
                aria-label="Filter transactions by execution status"
                value={selectedStatus}
                onChange={e => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                className="bg-[#171715] border border-[#403B32] rounded px-2 py-1 text-xs text-[#F1EBDD] focus:outline-none focus:border-[#D8C5A3]"
              >
                <option value="ALL">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Sort selection */}
            <div className="flex items-center gap-1.5 ml-auto">
              <label htmlFor="sort-by" className="text-[#AAA395] font-mono text-[11px]">SORT BY:</label>
              <select
                id="sort-by"
                aria-label="Sort transactions by field"
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-[#171715] border border-[#403B32] rounded px-2 py-1 text-xs text-[#F1EBDD] focus:outline-none focus:border-[#D8C5A3]"
              >
                <option value="timestamp">Timestamp</option>
                <option value="amount">Amount</option>
                <option value="riskScore">Risk Score</option>
              </select>
              <button
                type="button"
                aria-label="Toggle sort direction"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-1 rounded bg-[#171715] border border-[#403B32] text-[#AAA395] hover:text-[#F1EBDD]"
              >
                <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-[#211F1B] border border-[#403B32] rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <caption className="sr-only">Monitored transactions ledger</caption>
              <thead>
                <tr className="bg-[#171715] border-b border-[#403B32] text-[#AAA395] font-mono uppercase text-[10px] tracking-wider">
                  <th scope="col" className="py-3 px-4">Tx ID & Timestamp</th>
                  <th scope="col" className="py-3 px-4">Origin / Sender</th>
                  <th scope="col" className="py-3 px-4">Beneficiary / Receiver</th>
                  <th scope="col" className="py-3 px-4 text-right">Amount (INR)</th>
                  <th scope="col" className="py-3 px-4">Method</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4">Risk Evaluation</th>
                  <th scope="col" className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#403B32]/60">
                {paginatedTransactions.length > 0 ? (
                  paginatedTransactions.map(tx => (
                    <tr
                      key={tx.id}
                      className="hover:bg-[#2B2822] transition-colors cursor-pointer"
                      onClick={() => setSelectedTransaction(tx)}
                    >
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-[#D8C5A3]">{tx.id}</div>
                        <div className="text-[10px] text-[#AAA395] mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(tx.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#F1EBDD]">{tx.senderName}</div>
                        <div className="text-[10px] font-mono text-[#AAA395]">{tx.senderAccountId}</div>
                        {tx.senderLocation && (
                          <div className="text-[10px] text-[#AAA395] flex items-center gap-0.5 mt-0.5">
                            <MapPin className="w-2.5 h-2.5 text-[#D8C5A3]" />
                            <span className="truncate max-w-[140px]">{tx.senderLocation}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#F1EBDD]">{tx.receiverName}</div>
                        <div className="text-[10px] font-mono text-[#AAA395]">{tx.receiverAccountId}</div>
                        {tx.receiverLocation && (
                          <div className="text-[10px] text-[#AAA395] flex items-center gap-0.5 mt-0.5">
                            <MapPin className="w-2.5 h-2.5 text-[#D8C5A3]" />
                            <span className="truncate max-w-[140px]">{tx.receiverLocation}</span>
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-[#F1EBDD] tabular-nums">
                        ₹{tx.amount.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#171715] border border-[#403B32] text-[#D8C5A3]">
                          {tx.paymentMethod}
                        </span>
                        <span className="block text-[10px] text-[#AAA395] mt-0.5 uppercase">
                          {tx.channel}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-semibold uppercase ${
                            tx.status === 'completed'
                              ? 'text-[#78A88A] bg-[#78A88A]/10 border border-[#78A88A]/30'
                              : 'text-[#D46D68] bg-[#D46D68]/10 border border-[#D46D68]/30'
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {getRiskBadge(tx.riskScore, tx.riskLevel)}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5" onClick={e => e.stopPropagation()}>
                          <button
                            type="button"
                            onClick={() => analyseTx(tx.id)}
                            aria-label={`Re-run risk engine on transaction ${tx.id}`}
                            className="p-1 rounded bg-[#171715] border border-[#403B32] text-[#D8C5A3] hover:bg-[#2B2822] hover:border-[#D8C5A3]"
                            title="Re-run Risk Engine"
                          >
                            <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedTransaction(tx)}
                            aria-label={`View full investigative details for transaction ${tx.id}`}
                            className="p-1 rounded bg-[#171715] border border-[#403B32] text-[#AAA395] hover:text-[#F1EBDD] hover:bg-[#2B2822]"
                            title="View Full Investigative Details"
                          >
                            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-[#AAA395]">
                      No transactions match current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-3 bg-[#171715] border-t border-[#403B32] flex items-center justify-between text-xs text-[#AAA395] font-mono">
            <div>
              Showing {Math.min(filteredTransactions.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredTransactions.length, currentPage * itemsPerPage)} of {filteredTransactions.length} transactions
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Go to previous page"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-2.5 py-1 rounded bg-[#211F1B] border border-[#403B32] disabled:opacity-40 hover:text-[#F1EBDD]"
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages || 1}</span>
              <button
                type="button"
                aria-label="Go to next page"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-2.5 py-1 rounded bg-[#211F1B] border border-[#403B32] disabled:opacity-40 hover:text-[#F1EBDD]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Details Drawer */}
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

