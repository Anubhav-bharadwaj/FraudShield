'use client';

import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle } from 'lucide-react';
import { useFraudShield } from '../context/FraudShieldContext';
import { PaymentMethod, Channel } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose }) => {
  const { accounts, addTransaction, setSelectedTransaction } = useFraudShield();

  const [senderId, setSenderId] = useState(accounts[0]?.id || 'ACC-IN-1001');
  const [receiverId, setReceiverId] = useState(accounts[1]?.id || 'ACC-IN-1002');
  const [amount, setAmount] = useState('25000');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [channel, setChannel] = useState<Channel>('mobile');
  const [senderLocation, setSenderLocation] = useState('Mumbai, MH');
  const [receiverLocation, setReceiverLocation] = useState('Bengaluru, KA');
  const [scenarioTag, setScenarioTag] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    if (senderId === receiverId) {
      setError('Sender and receiver accounts cannot be the same entity.');
      return;
    }

    const sender = accounts.find(a => a.id === senderId);
    const receiver = accounts.find(a => a.id === receiverId);

    const created = addTransaction({
      senderAccountId: senderId,
      senderName: sender?.displayName || 'Custom Sender',
      receiverAccountId: receiverId,
      receiverName: receiver?.displayName || 'Custom Receiver',
      amount: numAmount,
      paymentMethod,
      channel,
      senderLocation,
      receiverLocation,
      scenarioTag: scenarioTag.trim() || 'manual_injection'
    });

    setSelectedTransaction(created);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-add-title"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div className="bg-[#211F1B] border border-[#403B32] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#403B32] flex items-center justify-between bg-[#171715]">
          <h3 id="modal-add-title" className="font-semibold text-base text-[#F1EBDD] flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-[#D8C5A3]" aria-hidden="true" />
            <span>Add Synthetic Transaction</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close add transaction modal"
            className="p-1 rounded-lg text-[#AAA395] hover:text-[#F1EBDD] hover:bg-[#2B2822] transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div role="alert" className="p-3 rounded bg-[#D46D68]/15 border border-[#D46D68]/40 text-[#D46D68] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          {/* Accounts selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="modal-sender-account" className="block text-xs font-mono text-[#AAA395] mb-1">
                Sender Account
              </label>
              <select
                id="modal-sender-account"
                value={senderId}
                onChange={e => setSenderId(e.target.value)}
                className="w-full bg-[#2B2822] border border-[#403B32] rounded-lg px-3 py-2 text-xs text-[#F1EBDD] focus:outline-none focus:border-[#D8C5A3]"
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.displayName} ({a.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="modal-receiver-account" className="block text-xs font-mono text-[#AAA395] mb-1">
                Receiver Account
              </label>
              <select
                id="modal-receiver-account"
                value={receiverId}
                onChange={e => setReceiverId(e.target.value)}
                className="w-full bg-[#2B2822] border border-[#403B32] rounded-lg px-3 py-2 text-xs text-[#F1EBDD] focus:outline-none focus:border-[#D8C5A3]"
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.displayName} ({a.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount and Method */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="modal-tx-amount" className="block text-xs font-mono text-[#AAA395] mb-1">
                Amount (INR ₹)
              </label>
              <input
                id="modal-tx-amount"
                type="number"
                step="any"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-[#2B2822] border border-[#403B32] rounded-lg px-3 py-2 text-xs text-[#F1EBDD] focus:outline-none focus:border-[#D8C5A3]"
                placeholder="e.g. 48500"
                required
              />
            </div>

            <div>
              <label htmlFor="modal-payment-method" className="block text-xs font-mono text-[#AAA395] mb-1">
                Payment Method
              </label>
              <select
                id="modal-payment-method"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full bg-[#2B2822] border border-[#403B32] rounded-lg px-3 py-2 text-xs text-[#F1EBDD] focus:outline-none focus:border-[#D8C5A3]"
              >
                <option value="UPI">UPI (Instant)</option>
                <option value="IMPS">IMPS</option>
                <option value="NEFT">NEFT</option>
                <option value="RTGS">RTGS</option>
                <option value="WALLET">Wallet</option>
              </select>
            </div>
          </div>

          {/* Locations */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="modal-sender-location" className="block text-xs font-mono text-[#AAA395] mb-1">
                Sender Location
              </label>
              <input
                id="modal-sender-location"
                type="text"
                value={senderLocation}
                onChange={e => setSenderLocation(e.target.value)}
                className="w-full bg-[#2B2822] border border-[#403B32] rounded-lg px-3 py-2 text-xs text-[#F1EBDD] focus:outline-none focus:border-[#D8C5A3]"
                placeholder="e.g. Mumbai, MH"
              />
            </div>

            <div>
              <label htmlFor="modal-receiver-location" className="block text-xs font-mono text-[#AAA395] mb-1">
                Receiver Location
              </label>
              <input
                id="modal-receiver-location"
                type="text"
                value={receiverLocation}
                onChange={e => setReceiverLocation(e.target.value)}
                className="w-full bg-[#2B2822] border border-[#403B32] rounded-lg px-3 py-2 text-xs text-[#F1EBDD] focus:outline-none focus:border-[#D8C5A3]"
                placeholder="e.g. Bengaluru, KA"
              />
            </div>
          </div>

          {/* Scenario Tag */}
          <div>
            <label htmlFor="modal-scenario-tag" className="block text-xs font-mono text-[#AAA395] mb-1">
              Scenario / Test Tag (Optional)
            </label>
            <input
              id="modal-scenario-tag"
              type="text"
              value={scenarioTag}
              onChange={e => setScenarioTag(e.target.value)}
              className="w-full bg-[#2B2822] border border-[#403B32] rounded-lg px-3 py-2 text-xs text-[#F1EBDD] focus:outline-none focus:border-[#D8C5A3]"
              placeholder="e.g. structuring_burst_test, proxy_anomaly"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#403B32]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-[#AAA395] hover:text-[#F1EBDD] hover:bg-[#2B2822]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#D8C5A3] text-[#171715] hover:bg-[#E9DDC7] transition-colors"
            >
              Inject & Score Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
