'use client';

import React from 'react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  User,
  CreditCard,
  MapPin,
  ExternalLink,
  FilePlus,
  RefreshCw,
  Info
} from 'lucide-react';
import { Transaction } from '../types';
import { useFraudShield } from '../context/FraudShieldContext';

interface TransactionDetailModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onOpenCaseForm?: (alertId: string) => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  onClose,
}) => {
  const { analyseTx, createCaseFromAlert, alerts } = useFraudShield();

  if (!transaction) return null;

  const analysis = transaction.analysisResult;
  const score = transaction.riskScore ?? (analysis ? analysis.riskScore : null);
  const level = transaction.riskLevel || (score !== null ? (score >= 75 ? 'CRITICAL' : score >= 50 ? 'HIGH' : score >= 30 ? 'MEDIUM' : 'LOW') : 'UNASSESSED');

  const relatedAlert = alerts.find(a => a.transactionIds.includes(transaction.id));

  const getScoreColor = () => {
    if (score === null) return 'text-[#AAA395] border-[#403B32] bg-[#211F1B]';
    if (score >= 75) return 'text-[#D46D68] border-[#D46D68]/40 bg-[#D46D68]/10';
    if (score >= 50) return 'text-[#D98558] border-[#D98558]/40 bg-[#D98558]/10';
    if (score >= 30) return 'text-[#D2A45F] border-[#D2A45F]/40 bg-[#D2A45F]/10';
    return 'text-[#78A88A] border-[#78A88A]/40 bg-[#78A88A]/10';
  };

  const handleCreateCase = () => {
    if (relatedAlert) {
      createCaseFromAlert(relatedAlert.id);
      alert(`Investigation Case created from Alert ${relatedAlert.id}! Visit the Investigations tab to review.`);
    } else {
      // Create ad-hoc case
      alert(`Transaction ${transaction.id} flagged for review. A case can be opened once an alert is active.`);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-detail-id"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-[#211F1B] border border-[#403B32] rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#403B32] flex items-center justify-between bg-[#171715]">
          <div className="flex items-center gap-3">
            <span id="modal-detail-id" className="font-mono text-sm font-semibold text-[#D8C5A3] px-2 py-0.5 rounded bg-[#2B2822] border border-[#403B32]">
              {transaction.id}
            </span>
            <span className="text-xs text-[#AAA395] flex items-center gap-1.5 font-mono">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {new Date(transaction.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close transaction details modal"
            className="p-1 rounded-lg text-[#AAA395] hover:text-[#F1EBDD] hover:bg-[#2B2822] transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Top Overview Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Amount Box */}
            <div className="p-4 rounded-lg bg-[#2B2822] border border-[#403B32]">
              <span className="text-[11px] font-mono uppercase text-[#AAA395]">Transaction Amount</span>
              <div className="text-2xl font-bold font-mono text-[#F1EBDD] mt-1">
                ₹{transaction.amount.toLocaleString('en-IN')}
                <span className="text-xs text-[#AAA395] font-normal ml-1.5">{transaction.currency}</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-[#AAA395]">
                <CreditCard className="w-3.5 h-3.5 text-[#D8C5A3]" />
                <span>{transaction.paymentMethod}</span>
                <span>•</span>
                <span className="uppercase">{transaction.channel}</span>
              </div>
            </div>

            {/* Risk Gauge Box */}
            <div className={`p-4 rounded-lg border flex flex-col justify-between ${getScoreColor()}`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-semibold">Risk Engine Score</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded border border-current">
                  {level}
                </span>
              </div>
              <div className="text-3xl font-extrabold font-mono mt-1">
                {score !== null ? `${score} / 100` : 'Not Analysed'}
              </div>
              <span className="text-[11px] opacity-80 mt-1">
                {analysis?.recommendedAction ? `Recommended: ${analysis.recommendedAction}` : 'Click Analyse to score'}
              </span>
            </div>

            {/* Status & Scenario */}
            <div className="p-4 rounded-lg bg-[#2B2822] border border-[#403B32]">
              <span className="text-[11px] font-mono uppercase text-[#AAA395]">Execution Status</span>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-mono font-semibold uppercase ${
                    transaction.status === 'completed'
                      ? 'bg-[#78A88A]/20 text-[#78A88A] border border-[#78A88A]/40'
                      : 'bg-[#D46D68]/20 text-[#D46D68] border border-[#D46D68]/40'
                  }`}
                >
                  {transaction.status}
                </span>
              </div>
              {transaction.scenarioTag && (
                <div className="mt-2 text-[11px] font-mono text-[#D8C5A3] truncate">
                  Tag: {transaction.scenarioTag}
                </div>
              )}
            </div>
          </div>

          {/* Counterparties Flow */}
          <div className="p-4 rounded-lg bg-[#171715] border border-[#403B32]">
            <h4 className="text-xs font-mono uppercase tracking-wider text-[#AAA395] mb-3">Counterparty Routing</h4>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Sender */}
              <div className="flex-1 w-full p-3 rounded-lg bg-[#211F1B] border border-[#403B32]">
                <div className="text-[10px] font-mono text-[#AAA395]">ORIGIN (SENDER)</div>
                <div className="font-semibold text-sm text-[#F1EBDD] mt-0.5">{transaction.senderName}</div>
                <div className="text-xs font-mono text-[#D8C5A3] mt-0.5">{transaction.senderAccountId}</div>
                {transaction.senderLocation && (
                  <div className="flex items-center gap-1 text-[11px] text-[#AAA395] mt-1.5">
                    <MapPin className="w-3 h-3 text-[#D8C5A3]" />
                    <span>{transaction.senderLocation}</span>
                  </div>
                )}
              </div>

              <div className="text-[#D8C5A3] p-2 rounded-full bg-[#2B2822] border border-[#403B32]">
                <ArrowRight className="w-4 h-4" />
              </div>

              {/* Receiver */}
              <div className="flex-1 w-full p-3 rounded-lg bg-[#211F1B] border border-[#403B32]">
                <div className="text-[10px] font-mono text-[#AAA395]">BENEFICIARY (RECEIVER)</div>
                <div className="font-semibold text-sm text-[#F1EBDD] mt-0.5">{transaction.receiverName}</div>
                <div className="text-xs font-mono text-[#D8C5A3] mt-0.5">{transaction.receiverAccountId}</div>
                {transaction.receiverLocation && (
                  <div className="flex items-center gap-1 text-[11px] text-[#AAA395] mt-1.5">
                    <MapPin className="w-3 h-3 text-[#D8C5A3]" />
                    <span>{transaction.receiverLocation}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Explainability & Triggered Signals */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#AAA395] flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#D8C5A3]" />
                <span>Explainable Detection Signals ({analysis?.triggeredSignals?.length || 0})</span>
              </h4>
              <button
                onClick={() => analyseTx(transaction.id)}
                className="flex items-center gap-1 text-xs font-mono text-[#D8C5A3] hover:underline"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Re-score Engine</span>
              </button>
            </div>

            {analysis && analysis.triggeredSignals.length > 0 ? (
              <div className="space-y-2">
                {analysis.triggeredSignals.map((sig, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#2B2822] border border-[#403B32] space-y-1"
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
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#211F1B] text-[#AAA395] border border-[#403B32]">
                          {sig.category}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#D8C5A3]">
                        +{sig.points} pts
                      </span>
                    </div>
                    <p className="text-xs text-[#AAA395] pl-4">{sig.explanation}</p>
                    <div className="text-[11px] font-mono text-[#D8C5A3]/80 pl-4 bg-[#211F1B] p-1.5 rounded border border-[#403B32]/60 mt-1">
                      Evidence: {sig.evidence}
                    </div>
                  </div>
                ))}

                <div className="p-3 rounded-lg bg-[#171715] border border-[#403B32] text-xs text-[#AAA395] space-y-1">
                  <div className="font-semibold text-[#F1EBDD] flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-[#D8C5A3]" />
                    <span>Investigative Summary:</span>
                  </div>
                  <p>{analysis.explanation}</p>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-lg bg-[#2B2822]/60 border border-[#403B32] text-center text-xs text-[#AAA395]">
                {score !== null
                  ? 'No suspicious anomaly signals triggered. Normal transaction baseline.'
                  : 'Transaction has not yet been passed through the risk engine. Click "Analyse Transaction" below.'}
              </div>
            )}
          </div>

          {/* Disclaimer Pill */}
          <div className="p-2.5 rounded bg-[#171715] border border-[#403B32] text-[11px] text-[#AAA395] flex items-center gap-2">
            <Info className="w-4 h-4 text-[#D8C5A3] shrink-0" />
            <span>
              Disclaimer: Rule-based anomaly indicator for human analyst review. Not proof of fraud or illegal financial activity.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#403B32] bg-[#171715] flex items-center justify-between">
          <button
            onClick={() => analyseTx(transaction.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#211F1B] border border-[#403B32] text-[#F1EBDD] hover:bg-[#2B2822] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#D8C5A3]" />
            <span>Analyse Transaction</span>
          </button>

          <div className="flex items-center gap-2">
            {relatedAlert && (
              <button
                onClick={handleCreateCase}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#2B2822] border border-[#D2A45F]/50 text-[#D8C5A3] hover:bg-[#D2A45F]/20 transition-all"
              >
                <FilePlus className="w-3.5 h-3.5" />
                <span>Create Case Dossier</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#D8C5A3] text-[#171715] hover:bg-[#E9DDC7] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

