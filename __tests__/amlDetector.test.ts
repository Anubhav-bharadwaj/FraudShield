import { detectAMLPatterns } from '../src/engine/amlDetector';
import { Transaction, Account } from '../src/types';

describe('AML Pattern Intelligence Detectors', () => {
  const mockAccounts: Account[] = [
    {
      id: 'ACC-101',
      displayName: 'Smurfing Origin',
      accountType: 'mule',
      homeLocation: 'Jaipur, RJ',
      riskRating: 'HIGH',
      baselineAverageAmount: 2000,
      baselineMaxAmount: 20000,
      createdAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 'ACC-102',
      displayName: 'Crypto Escrow',
      accountType: 'merchant',
      homeLocation: 'Bengaluru, KA',
      riskRating: 'MEDIUM',
      baselineAverageAmount: 80000,
      baselineMaxAmount: 500000,
      createdAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 'ACC-LOOP-A',
      displayName: 'Loop Node A',
      accountType: 'mule',
      homeLocation: 'Kolkata, WB',
      riskRating: 'HIGH',
      baselineAverageAmount: 1500,
      baselineMaxAmount: 15000,
      createdAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 'ACC-LOOP-B',
      displayName: 'Loop Node B',
      accountType: 'mule',
      homeLocation: 'Patna, BR',
      riskRating: 'HIGH',
      baselineAverageAmount: 1500,
      baselineMaxAmount: 15000,
      createdAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 'ACC-LOOP-C',
      displayName: 'Loop Node C',
      accountType: 'mule',
      homeLocation: 'Noida, UP',
      riskRating: 'HIGH',
      baselineAverageAmount: 1500,
      baselineMaxAmount: 15000,
      createdAt: '2023-01-01T00:00:00Z',
    },
  ];

  const now = new Date('2026-11-13T10:00:00Z').getTime();

  test('detects structuring / smurfing clusters staying under ₹50,000 threshold', () => {
    const structuringTxs: Transaction[] = [
      {
        id: 'TX-STR-1',
        timestamp: new Date(now - 120 * 60 * 1000).toISOString(),
        senderAccountId: 'ACC-101',
        senderName: 'Smurfing Origin',
        receiverAccountId: 'ACC-102',
        receiverName: 'Crypto Escrow',
        amount: 48900, // Sub-50k
        currency: 'INR',
        paymentMethod: 'UPI',
        channel: 'mobile',
        status: 'completed',
      },
      {
        id: 'TX-STR-2',
        timestamp: new Date(now - 90 * 60 * 1000).toISOString(),
        senderAccountId: 'ACC-101',
        senderName: 'Smurfing Origin',
        receiverAccountId: 'ACC-102',
        receiverName: 'Crypto Escrow',
        amount: 49200, // Sub-50k
        currency: 'INR',
        paymentMethod: 'UPI',
        channel: 'mobile',
        status: 'completed',
      },
      {
        id: 'TX-STR-3',
        timestamp: new Date(now - 45 * 60 * 1000).toISOString(),
        senderAccountId: 'ACC-101',
        senderName: 'Smurfing Origin',
        receiverAccountId: 'ACC-102',
        receiverName: 'Crypto Escrow',
        amount: 48500, // Sub-50k
        currency: 'INR',
        paymentMethod: 'IMPS',
        channel: 'web',
        status: 'completed',
      },
      {
        id: 'TX-STR-4',
        timestamp: new Date(now).toISOString(),
        senderAccountId: 'ACC-101',
        senderName: 'Smurfing Origin',
        receiverAccountId: 'ACC-102',
        receiverName: 'Crypto Escrow',
        amount: 49800, // Sub-50k
        currency: 'INR',
        paymentMethod: 'UPI',
        channel: 'mobile',
        status: 'completed',
      },
    ];

    const patterns = detectAMLPatterns(structuringTxs, mockAccounts);
    const structuringPattern = patterns.find(p => p.type === 'STRUCTURING');

    expect(structuringPattern).toBeDefined();
    expect(structuringPattern?.involvedAccounts).toContain('ACC-101');
    expect(structuringPattern?.involvedTransactions.length).toBe(4);
    expect(structuringPattern?.totalAmount).toBe(48900 + 49200 + 48500 + 49800);
    expect(structuringPattern?.confidenceScore).toBeGreaterThanOrEqual(90);
  });

  test('detects closed circular routing loops (A → B → C → A)', () => {
    const loopTxs: Transaction[] = [
      {
        id: 'TX-LOOP-1',
        timestamp: new Date(now - 60 * 60 * 1000).toISOString(),
        senderAccountId: 'ACC-LOOP-A',
        senderName: 'Loop Node A',
        receiverAccountId: 'ACC-LOOP-B',
        receiverName: 'Loop Node B',
        amount: 250000,
        currency: 'INR',
        paymentMethod: 'IMPS',
        channel: 'web',
        status: 'completed',
      },
      {
        id: 'TX-LOOP-2',
        timestamp: new Date(now - 40 * 60 * 1000).toISOString(),
        senderAccountId: 'ACC-LOOP-B',
        senderName: 'Loop Node B',
        receiverAccountId: 'ACC-LOOP-C',
        receiverName: 'Loop Node C',
        amount: 245000,
        currency: 'INR',
        paymentMethod: 'IMPS',
        channel: 'web',
        status: 'completed',
      },
      {
        id: 'TX-LOOP-3',
        timestamp: new Date(now - 15 * 60 * 1000).toISOString(),
        senderAccountId: 'ACC-LOOP-C',
        senderName: 'Loop Node C',
        receiverAccountId: 'ACC-LOOP-A', // Returns back to Origin!
        receiverName: 'Loop Node A',
        amount: 240000,
        currency: 'INR',
        paymentMethod: 'IMPS',
        channel: 'web',
        status: 'completed',
      },
    ];

    const patterns = detectAMLPatterns(loopTxs, mockAccounts);
    const circularPattern = patterns.find(p => p.type === 'CIRCULAR_FLOW');

    expect(circularPattern).toBeDefined();
    expect(circularPattern?.severity).toBe('CRITICAL');
    expect(circularPattern?.involvedAccounts).toContain('ACC-LOOP-A');
    expect(circularPattern?.involvedAccounts).toContain('ACC-LOOP-B');
    expect(circularPattern?.involvedAccounts).toContain('ACC-LOOP-C');
    expect(circularPattern?.confidenceScore).toBeGreaterThanOrEqual(95);
  });
});
