'use client';

import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { useFraudShield } from '../../context/FraudShieldContext';
import {
  BellRing,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FilePlus,
  ArrowRight,
  Filter,
  Check,
  Zap,
  Info,
  Clock,
  ExternalLink
} from 'lucide-react';
import { AlertStatus, RiskLevel } from '../../types';

export default function AlertsPage() {
  const {
    alerts,
    acknowledgeAlert,
    escalateAlert,
    resolveAlert,
    createCaseFromAlert,
    setSelectedTransaction,
    transactions
  } = useFraudShield();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [resolvingAlertId, setResolvingAlertId] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const filteredAlerts = alerts.filter(a => {
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (severityFilter !== 'ALL' && a.severity !== severityFilter) return false;
    return true;
  });

  const handleResolveSubmit = (alertId: string) => {
    resolveAlert(alertId, resolutionNote || 'Verified as resolved by fraud investigator.');
    setResolvingAlertId(null);
    setResolutionNote('');
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Alert Management Queue"
        subtitle="Operational triage queue for automated risk triggers, AML alerts, and attack simulations."
      />

      <div className="p-8 space-y-6 flex-1">
        {/* Filters and Summary Bar */}
        <div className="p-4 rounded-xl bg-[#211F1B] border border-[#403B32] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#AAA395]">ACTIVE QUEUE:</span>
            <span className="text-sm font-bold font-mono text-[#F1EBDD]">{filteredAlerts.length} Alerts</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="filter-alert-status" className="text-[#AAA395] font-mono text-[11px]">STATUS:</label>
              <select
                id="filter-alert-status"
                aria-label="Filter alerts by status"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-[#171715] border border-[#403B32] rounded px-2.5 py-1 text-xs text-[#F1EBDD] focus:outline-none focus:border-[#D8C5A3]"
              >
                <option value="ALL">All Statuses</option>
                <option value="NEW">New (Unreviewed)</option>
                <option value="ACKNOWLEDGED">Acknowledged</option>
                <option value="INVESTIGATING">Investigating</option>
                <option value="ESCALATED">Escalated</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="filter-alert-severity" className="text-[#AAA395] font-mono text-[11px]">SEVERITY:</label>
              <select
                id="filter-alert-severity"
                aria-label="Filter alerts by severity"
                value={severityFilter}
                onChange={e => setSeverityFilter(e.target.value)}
                className="bg-[#171715] border border-[#403B32] rounded px-2.5 py-1 text-xs text-[#F1EBDD] focus:outline-none focus:border-[#D8C5A3]"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => (
              <div
                key={alert.id}
                className={`p-5 rounded-xl border transition-all ${
                  alert.status === 'RESOLVED'
                    ? 'bg-[#1b1a18] border-[#403B32]/40 opacity-70'
                    : 'bg-[#211F1B] border-[#403B32] shadow-sm'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-[#403B32]/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        alert.severity === 'CRITICAL'
                          ? 'bg-[#D46D68]/20 text-[#D46D68] border border-[#D46D68]/40'
                          : alert.severity === 'HIGH'
                          ? 'bg-[#D98558]/20 text-[#D98558] border border-[#D98558]/40'
                          : 'bg-[#D2A45F]/20 text-[#D2A45F] border border-[#D2A45F]/40'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#F1EBDD]">{alert.id}</span>
                    <span className="text-[11px] font-mono text-[#AAA395] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#AAA395]">
                      Risk Score: <strong className="text-[#D8C5A3]">{alert.riskScore}/100</strong>
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        alert.status === 'NEW'
                          ? 'bg-[#D46D68]/20 text-[#D46D68] border border-[#D46D68]/40 animate-pulse'
                          : alert.status === 'INVESTIGATING'
                          ? 'bg-[#D2A45F]/20 text-[#D2A45F] border border-[#D2A45F]/40'
                          : alert.status === 'RESOLVED'
                          ? 'bg-[#78A88A]/20 text-[#78A88A] border border-[#78A88A]/40'
                          : 'bg-[#2B2822] text-[#AAA395] border border-[#403B32]'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="py-3 space-y-1.5">
                  <h4 className="text-sm font-bold text-[#F1EBDD]">{alert.title}</h4>
                  <p className="text-xs text-[#AAA395] leading-relaxed">{alert.explanation}</p>

                  {/* Linked accounts and transactions */}
                  <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="text-[10px] text-[#AAA395]">LINKED ENTITIES:</span>
                    {alert.accountIds.map(accId => (
                      <span key={accId} className="px-2 py-0.5 rounded bg-[#171715] text-[#D8C5A3] border border-[#403B32] text-[11px]">
                        {accId}
                      </span>
                    ))}
                    {alert.transactionIds.map(txId => {
                      const tx = transactions.find(t => t.id === txId);
                      return (
                        <button
                          key={txId}
                          onClick={() => tx && setSelectedTransaction(tx)}
                          className="px-2 py-0.5 rounded bg-[#2B2822] text-[#F1EBDD] border border-[#403B32] text-[11px] hover:border-[#D8C5A3] flex items-center gap-1"
                          title="Click to inspect transaction"
                        >
                          <span>{txId}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-[#D8C5A3]" />
                        </button>
                      );
                    })}
                  </div>

                  {alert.resolutionNote && (
                    <div className="mt-2 p-2 rounded bg-[#78A88A]/10 border border-[#78A88A]/30 text-xs text-[#78A88A]">
                      Resolution: {alert.resolutionNote}
                    </div>
                  )}
                </div>

                {/* Inline Resolve Note Box */}
                {resolvingAlertId === alert.id && (
                  <div className="my-2 p-3 rounded-lg bg-[#171715] border border-[#403B32] space-y-2">
                    <label htmlFor="resolution-note-input" className="block text-xs font-mono text-[#AAA395]">Add Resolution Finding / Disposition:</label>
                    <input
                      id="resolution-note-input"
                      type="text"
                      value={resolutionNote}
                      onChange={e => setResolutionNote(e.target.value)}
                      placeholder="e.g. Account owner verified legitimacy via callback; false positive on travel."
                      className="w-full bg-[#211F1B] border border-[#403B32] rounded px-3 py-1.5 text-xs text-[#F1EBDD] focus:outline-none focus:border-[#D8C5A3]"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setResolvingAlertId(null)}
                        className="px-2.5 py-1 text-xs text-[#AAA395] hover:text-[#F1EBDD]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleResolveSubmit(alert.id)}
                        className="px-3 py-1 text-xs font-semibold rounded bg-[#78A88A] text-[#171715] hover:bg-[#8cc4a1]"
                      >
                        Confirm Resolution
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#403B32]/40">
                  <div className="text-[11px] font-mono text-[#AAA395]">
                    {alert.caseId ? (
                      <span className="text-[#D8C5A3]">Linked Case: {alert.caseId}</span>
                    ) : (
                      <span>No active investigation case</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {alert.status === 'NEW' && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-2.5 py-1 rounded text-xs font-medium bg-[#2B2822] border border-[#403B32] text-[#AAA395] hover:text-[#F1EBDD] transition-colors"
                      >
                        Acknowledge
                      </button>
                    )}

                    {alert.status !== 'RESOLVED' && (
                      <>
                        <button
                          onClick={() => escalateAlert(alert.id)}
                          className="px-2.5 py-1 rounded text-xs font-medium bg-[#2B2822] border border-[#D98558]/40 text-[#D98558] hover:bg-[#D98558]/10 transition-colors"
                        >
                          Escalate
                        </button>

                        <button
                          onClick={() => {
                            createCaseFromAlert(alert.id);
                            if (typeof window !== 'undefined') {
                              window.alert(`Investigation Case created for Alert ${alert.id}!`);
                            }
                          }}
                          className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold bg-[#2B2822] border border-[#D8C5A3]/50 text-[#D8C5A3] hover:bg-[#D8C5A3]/10 transition-colors"
                        >
                          <FilePlus className="w-3.5 h-3.5" />
                          <span>Open Case</span>
                        </button>

                        <button
                          onClick={() => setResolvingAlertId(alert.id)}
                          className="px-2.5 py-1 rounded text-xs font-medium bg-[#78A88A]/15 border border-[#78A88A]/40 text-[#78A88A] hover:bg-[#78A88A]/25 transition-colors"
                        >
                          Resolve
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-[#AAA395] bg-[#211F1B] border border-[#403B32] rounded-xl text-sm">
              No alerts match the current filter selection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
