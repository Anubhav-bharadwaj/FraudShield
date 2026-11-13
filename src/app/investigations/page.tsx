'use client';

import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { useFraudShield } from '../../context/FraudShieldContext';
import {
  FileSearch,
  ShieldAlert,
  Clock,
  User,
  Plus,
  Send,
  CheckCircle2,
  AlertTriangle,
  Printer,
  ExternalLink,
  Layers,
  ArrowRight
} from 'lucide-react';
import { CaseStatus, CasePriority, InvestigationCase } from '../../types';
import { TransactionDetailModal } from '../../components/TransactionDetailModal';

export default function InvestigationsPage() {
  const { cases, addCaseNote, updateCaseStatus, transactions, setSelectedTransaction, selectedTransaction } = useFraudShield();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(cases[0]?.id || '');
  const [newNoteBody, setNewNoteBody] = useState('');
  const [analystName, setAnalystName] = useState('Senior AML Investigator');
  const [resolutionInput, setResolutionInput] = useState('');

  const activeCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteBody.trim() || !activeCase) return;
    addCaseNote(activeCase.id, newNoteBody.trim(), analystName);
    setNewNoteBody('');
  };

  const handleStatusChange = (newStatus: CaseStatus) => {
    if (!activeCase) return;
    if (newStatus === 'CLOSED' && !activeCase.resolutionNote) {
      const note = prompt('Please enter final case disposition / closure note:') || 'Case closed after analyst review.';
      updateCaseStatus(activeCase.id, newStatus, note);
    } else {
      updateCaseStatus(activeCase.id, newStatus);
    }
  };

  const printCaseSummary = () => {
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Investigation Case Management"
        subtitle="Formal analyst case dossiers, evidence compilation, chronological audit notes, and regulatory dispositions."
      />

      <div className="p-8 space-y-6 flex-1">
        {cases.length > 0 && activeCase ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Queue: Case Dossiers (4 cols) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#AAA395] px-1">
                <span>CASE DOSSIERS ({cases.length})</span>
                <span>STATUS / PRIORITY</span>
              </div>

              <div className="space-y-2.5 max-h-[75vh] overflow-y-auto pr-1">
                {cases.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCaseId(c.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      c.id === activeCase.id
                        ? 'bg-[#2B2822] border-[#D8C5A3] shadow-md'
                        : 'bg-[#211F1B] border-[#403B32] hover:border-[#D8C5A3]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#D8C5A3]">{c.id}</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                            c.priority === 'CRITICAL'
                              ? 'bg-[#D46D68]/20 text-[#D46D68]'
                              : c.priority === 'HIGH'
                              ? 'bg-[#D98558]/20 text-[#D98558]'
                              : 'bg-[#D2A45F]/20 text-[#D2A45F]'
                          }`}
                        >
                          {c.priority}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-semibold uppercase ${
                            c.status === 'CLOSED'
                              ? 'bg-[#78A88A]/20 text-[#78A88A]'
                              : 'bg-[#171715] text-[#AAA395]'
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-xs font-semibold text-[#F1EBDD] mt-2 line-clamp-2 leading-snug">
                      {c.title}
                    </h4>

                    <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#AAA395]">
                      <span>{c.transactionIds.length} txs linked</span>
                      <span>Score: <strong className="text-[#F1EBDD]">{c.riskScore}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Workspace: Selected Case Dossier (8 cols) */}
            <div className="lg:col-span-8 p-6 rounded-xl bg-[#211F1B] border border-[#403B32] shadow-sm space-y-6">
              {/* Case Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#403B32]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#D8C5A3] px-2 py-0.5 rounded bg-[#171715] border border-[#403B32]">
                      {activeCase.id}
                    </span>
                    <span className="text-xs text-[#AAA395] font-mono">
                      Opened {new Date(activeCase.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#F1EBDD] mt-1.5">{activeCase.title}</h3>
                </div>

                {/* Status Switcher & Print */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <label htmlFor="case-state-select" className="text-xs font-mono text-[#AAA395]">STATE:</label>
                    <select
                      id="case-state-select"
                      aria-label="Update case status"
                      value={activeCase.status}
                      onChange={e => handleStatusChange(e.target.value as CaseStatus)}
                      className="bg-[#171715] border border-[#403B32] rounded-lg px-3 py-1.5 text-xs text-[#F1EBDD] font-mono font-semibold focus:outline-none focus:border-[#D8C5A3]"
                    >
                      <option value="OPEN">OPEN</option>
                      <option value="INVESTIGATING">INVESTIGATING</option>
                      <option value="ESCALATED">ESCALATED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                  </div>

                  <button
                    onClick={printCaseSummary}
                    className="p-1.5 rounded-lg bg-[#171715] border border-[#403B32] text-[#AAA395] hover:text-[#F1EBDD]"
                    title="Print Case Summary"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Summary & Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-[#2B2822] border border-[#403B32]">
                  <span className="text-[10px] font-mono uppercase text-[#AAA395]">Priority Level</span>
                  <div className="text-sm font-bold font-mono text-[#D46D68] mt-0.5">
                    {activeCase.priority} PRIORITY
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#2B2822] border border-[#403B32]">
                  <span className="text-[10px] font-mono uppercase text-[#AAA395]">Aggregate Threat Score</span>
                  <div className="text-sm font-bold font-mono text-[#D8C5A3] mt-0.5">
                    {activeCase.riskScore} / 100
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-[#2B2822] border border-[#403B32]">
                  <span className="text-[10px] font-mono uppercase text-[#AAA395]">Status Disposition</span>
                  <div className="text-sm font-bold font-mono text-[#78A88A] mt-0.5 uppercase">
                    {activeCase.status}
                  </div>
                </div>
              </div>

              {/* Case Summary narrative */}
              <div className="p-4 rounded-lg bg-[#171715] border border-[#403B32] text-xs space-y-1.5">
                <span className="font-mono text-[11px] text-[#D8C5A3] uppercase tracking-wider">
                  Investigative Summary & Hypothesis
                </span>
                <p className="text-[#F1EBDD] leading-relaxed">{activeCase.summary}</p>
                {activeCase.resolutionNote && (
                  <div className="mt-2 pt-2 border-t border-[#403B32] text-[#78A88A] font-mono text-[11px]">
                    Final Disposition Note: {activeCase.resolutionNote}
                  </div>
                )}
              </div>

              {/* Attached Evidence Pills */}
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#AAA395]">
                  Linked Transaction & Counterparty Evidence
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeCase.accountIds.map(accId => (
                    <span key={accId} className="px-2.5 py-1 rounded-md bg-[#2B2822] border border-[#403B32] text-xs font-mono text-[#D8C5A3]">
                      Account: {accId}
                    </span>
                  ))}
                  {activeCase.transactionIds.map(txId => {
                    const tx = transactions.find(t => t.id === txId);
                    return (
                      <button
                        key={txId}
                        onClick={() => tx && setSelectedTransaction(tx)}
                        className="px-2.5 py-1 rounded-md bg-[#2B2822] border border-[#403B32] hover:border-[#D8C5A3] text-xs font-mono text-[#F1EBDD] flex items-center gap-1.5 transition-colors"
                      >
                        <span>Tx: {txId}</span>
                        <ExternalLink className="w-3 h-3 text-[#D8C5A3]" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chronological Notes Feed */}
              <div className="space-y-3 pt-4 border-t border-[#403B32]">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#AAA395]">
                  Analyst Chronological Notes & Audit Log ({activeCase.notes.length})
                </h4>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {activeCase.notes.map(note => (
                    <div key={note.id} className="p-3 rounded-lg bg-[#171715] border border-[#403B32] space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#AAA395]">
                        <span className="text-[#D8C5A3] font-semibold flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {note.author}
                        </span>
                        <span>{new Date(note.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-[#F1EBDD] leading-relaxed">{note.body}</p>
                    </div>
                  ))}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="space-y-2 pt-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      aria-label="Add case note"
                      value={newNoteBody}
                      onChange={e => setNewNoteBody(e.target.value)}
                      placeholder="Add investigation annotation, external callback finding, or SAR filing notes..."
                      className="flex-1 bg-[#171715] border border-[#403B32] rounded-lg px-3 py-2 text-xs text-[#F1EBDD] placeholder-[#AAA395]/60 focus:outline-none focus:border-[#D8C5A3]"
                    />
                    <button
                      type="submit"
                      disabled={!newNoteBody.trim()}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold bg-[#D8C5A3] text-[#171715] hover:bg-[#E9DDC7] disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Post</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-12 text-center text-[#AAA395] bg-[#211F1B] border border-[#403B32] rounded-xl text-sm">
            No active investigation cases. Open a case from any Alert or AML pattern to begin dossier tracking.
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
      />
    </div>
  );
}

