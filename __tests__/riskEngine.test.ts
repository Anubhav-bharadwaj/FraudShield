import { analyseTransaction } from '../src/engine/riskEngine';
import { Transaction, Account } from '../src/types';

describe('Fraud Detection & Risk Engine', () => {
  const mockAccounts: Account[] = [
    {
      id: 'ACC-001',
      displayName: 'Legit Sender',
      accountType: 'individual',
      homeLocation: 'Mumbai, MH',
      riskRating: 'LOW',
      baselineAverageAmount: 5000,
      baselineMaxAmount: 30000,
      createdAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 'ACC-002',
      displayName: 'Legit Receiver',
      accountType: 'individual',
      homeLocation: 'Bengaluru, KA',
      riskRating: 'LOW',
      baselineAverageAmount: 4000,
      baselineMaxAmount: 25000,
      createdAt: '2023-01-01T00:00:00Z',
    },
    {
      id: 'ACC-MULE',
      displayName: 'Shadow Mule',
      accountType: 'mule',
      homeLocation: 'Noida, UP',
      riskRating: 'HIGH',
      baselineAverageAmount: 1000,
      baselineMaxAmount: 10000,
      createdAt: '2024-01-01T00:00:00Z',
    },
  ];

  const now = new Date('2026-11-13T12:00:00Z').getTime();

  test('approves routine transaction conforming to normal baseline', () => {
    const routineTx: Transaction = {
      id: 'TX-ROUTINE-1',
      timestamp: new Date(now).toISOString(),
      senderAccountId: 'ACC-001',
      senderName: 'Legit Sender',
      receiverAccountId: 'ACC-002',
      receiverName: 'Legit Receiver',
      amount: 2500,
      currency: 'INR',
      paymentMethod: 'UPI',
      channel: 'mobile',
      senderLocation: 'Mumbai, MH',
      receiverLocation: 'Bengaluru, KA',
      status: 'completed',
    };

    const priorTx: Transaction = {
      id: 'TX-PRIOR-1',
      timestamp: new Date(now - 86400000).toISOString(),
      senderAccountId: 'ACC-001',
      senderName: 'Legit Sender',
      receiverAccountId: 'ACC-002',
      receiverName: 'Legit Receiver',
      amount: 3000,
      currency: 'INR',
      paymentMethod: 'UPI',
      channel: 'mobile',
      status: 'completed',
    };

    const result = analyseTransaction(routineTx, [routineTx, priorTx], mockAccounts);

    expect(result.riskScore).toBeLessThan(30);
    expect(result.riskLevel).toBe('LOW');
    expect(result.recommendedAction).toBe('APPROVE');
    expect(result.triggeredSignals.length).toBe(0);
  });

  test('flags unusually high amount vs baseline', () => {
    const highAmountTx: Transaction = {
      id: 'TX-HIGH-1',
      timestamp: new Date(now).toISOString(),
      senderAccountId: 'ACC-001',
      senderName: 'Legit Sender',
      receiverAccountId: 'ACC-MULE',
      receiverName: 'Shadow Mule',
      amount: 450000, // 90x baseline average of 5,000
      currency: 'INR',
      paymentMethod: 'IMPS',
      channel: 'web',
      senderLocation: 'Mumbai, MH',
      receiverLocation: 'Noida, UP',
      status: 'completed',
    };

    const result = analyseTransaction(highAmountTx, [highAmountTx], mockAccounts);

    expect(result.riskScore).toBeGreaterThanOrEqual(25);
    const hasAmountSignal = result.triggeredSignals.some(s => s.category === 'AMOUNT');
    expect(hasAmountSignal).toBe(true);
  });

  test('flags high-frequency velocity bursts within 15 minutes', () => {
    const burstTxs: Transaction[] = [
      {
        id: 'TX-BURST-1',
        timestamp: new Date(now - 10 * 60 * 1000).toISOString(),
        senderAccountId: 'ACC-001',
        senderName: 'Legit Sender',
        receiverAccountId: 'ACC-002',
        receiverName: 'Legit Receiver',
        amount: 8000,
        currency: 'INR',
        paymentMethod: 'UPI',
        channel: 'mobile',
        status: 'completed',
      },
      {
        id: 'TX-BURST-2',
        timestamp: new Date(now - 7 * 60 * 1000).toISOString(),
        senderAccountId: 'ACC-001',
        senderName: 'Legit Sender',
        receiverAccountId: 'ACC-002',
        receiverName: 'Legit Receiver',
        amount: 8500,
        currency: 'INR',
        paymentMethod: 'UPI',
        channel: 'mobile',
        status: 'completed',
      },
      {
        id: 'TX-BURST-3',
        timestamp: new Date(now - 4 * 60 * 1000).toISOString(),
        senderAccountId: 'ACC-001',
        senderName: 'Legit Sender',
        receiverAccountId: 'ACC-002',
        receiverName: 'Legit Receiver',
        amount: 9000,
        currency: 'INR',
        paymentMethod: 'UPI',
        channel: 'mobile',
        status: 'completed',
      },
      {
        id: 'TX-BURST-TARGET',
        timestamp: new Date(now).toISOString(),
        senderAccountId: 'ACC-001',
        senderName: 'Legit Sender',
        receiverAccountId: 'ACC-002',
        receiverName: 'Legit Receiver',
        amount: 9500,
        currency: 'INR',
        paymentMethod: 'UPI',
        channel: 'mobile',
        status: 'completed',
      },
    ];

    const result = analyseTransaction(burstTxs[3], burstTxs, mockAccounts);

    const hasVelocitySignal = result.triggeredSignals.some(s => s.category === 'VELOCITY');
    expect(hasVelocitySignal).toBe(true);
    expect(result.riskScore).toBeGreaterThanOrEqual(20);
  });

  test('flags geographic proxy and TOR exit nodes', () => {
    const proxyTx: Transaction = {
      id: 'TX-PROXY-1',
      timestamp: new Date(now).toISOString(),
      senderAccountId: 'ACC-001',
      senderName: 'Legit Sender',
      receiverAccountId: 'ACC-002',
      receiverName: 'Legit Receiver',
      amount: 12000,
      currency: 'INR',
      paymentMethod: 'IMPS',
      channel: 'web',
      senderLocation: 'Kyiv, Ukraine (TOR Exit Node)',
      status: 'completed',
    };

    const result = analyseTransaction(proxyTx, [proxyTx], mockAccounts);

    const hasLocationSignal = result.triggeredSignals.some(s => s.category === 'LOCATION');
    expect(hasLocationSignal).toBe(true);
  });

  test('flags rapid onward pass-through / layering behavior', () => {
    const inflowTx: Transaction = {
      id: 'TX-INFLOW-1',
      timestamp: new Date(now - 12 * 60 * 1000).toISOString(), // 12 mins earlier
      senderAccountId: 'ACC-002',
      senderName: 'Legit Receiver',
      receiverAccountId: 'ACC-001', // Arrived into ACC-001
      receiverName: 'Legit Sender',
      amount: 150000,
      currency: 'INR',
      paymentMethod: 'IMPS',
      channel: 'web',
      status: 'completed',
    };

    const outflowTx: Transaction = {
      id: 'TX-OUTFLOW-1',
      timestamp: new Date(now).toISOString(),
      senderAccountId: 'ACC-001', // Immediately disbursed onward
      senderName: 'Legit Sender',
      receiverAccountId: 'ACC-MULE',
      receiverName: 'Shadow Mule',
      amount: 148000, // 98.6% forwarded
      currency: 'INR',
      paymentMethod: 'IMPS',
      channel: 'web',
      status: 'completed',
    };

    const result = analyseTransaction(outflowTx, [inflowTx, outflowTx], mockAccounts);

    const hasFlowSignal = result.triggeredSignals.some(s => s.category === 'FLOW');
    expect(hasFlowSignal).toBe(true);
  });

  test('clamps composite score between 0 and 100', () => {
    // Extreme composite threat with multiple signals
    const criticalTx: Transaction = {
      id: 'TX-CRITICAL-COMPOUND',
      timestamp: new Date(now).toISOString(),
      senderAccountId: 'ACC-001',
      senderName: 'Legit Sender',
      receiverAccountId: 'ACC-MULE',
      receiverName: 'Shadow Mule',
      amount: 900000,
      currency: 'INR',
      paymentMethod: 'RTGS',
      channel: 'web',
      senderLocation: 'Moscow, Russia (Proxy Node)',
      status: 'completed',
      scenarioTag: 'circular_hop_return',
    };

    const result = analyseTransaction(criticalTx, [criticalTx], mockAccounts);

    expect(result.riskScore).toBeLessThanOrEqual(100);
    expect(result.riskScore).toBeGreaterThanOrEqual(75);
    expect(result.riskLevel).toBe('CRITICAL');
    expect(result.recommendedAction).toBe('FREEZE');
  });
});
