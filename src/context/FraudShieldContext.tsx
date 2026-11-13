'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import {
  Transaction,
  Account,
  Alert,
  InvestigationCase,
  AMLPattern,
  DashboardMetrics,
  CasePriority,
  CaseStatus,
  AlertStatus
} from '../types';
import { INITIAL_ACCOUNTS, INITIAL_TRANSACTIONS, INITIAL_ALERTS } from '../data/initialData';
import { analyseTransaction } from '../engine/riskEngine';
import { detectAMLPatterns } from '../engine/amlDetector';

interface FraudShieldContextType {
  transactions: Transaction[];
  accounts: Account[];
  alerts: Alert[];
  cases: InvestigationCase[];
  amlPatterns: AMLPattern[];
  metrics: DashboardMetrics;
  isSimulating: boolean;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: (tx: Transaction | null) => void;
  // Core Actions
  analyseTx: (txId: string) => void;
  analyseAllTransactions: () => void;
  addTransaction: (data: Partial<Transaction>) => Transaction;
  runAMLAnalysis: () => AMLPattern[];
  simulateFraudAttack: () => void;
  resetDemo: () => void;
  // Alert Actions
  acknowledgeAlert: (alertId: string) => void;
  escalateAlert: (alertId: string) => void;
  resolveAlert: (alertId: string, resolutionNote?: string) => void;
  // Case Actions
  createCaseFromAlert: (alertId: string, title?: string, priority?: CasePriority) => InvestigationCase;
  addCaseNote: (caseId: string, body: string, author?: string) => void;
  updateCaseStatus: (caseId: string, status: CaseStatus, resolutionNote?: string) => void;
  // CSV Export
  exportTransactionsCSV: (txsToExport?: Transaction[]) => void;
}

const FraudShieldContext = createContext<FraudShieldContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TXS: 'fraudshield_txs_v1',
  ACCS: 'fraudshield_accs_v1',
  ALERTS: 'fraudshield_alerts_v1',
  CASES: 'fraudshield_cases_v1',
  PATTERNS: 'fraudshield_patterns_v1',
};

export const FraudShieldProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [cases, setCases] = useState<InvestigationCase[]>([]);
  const [amlPatterns, setAmlPatterns] = useState<AMLPattern[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Initialize from LocalStorage or seed data
  useEffect(() => {
    try {
      const storedTxs = localStorage.getItem(STORAGE_KEYS.TXS);
      const storedAlerts = localStorage.getItem(STORAGE_KEYS.ALERTS);
      const storedCases = localStorage.getItem(STORAGE_KEYS.CASES);
      const storedPatterns = localStorage.getItem(STORAGE_KEYS.PATTERNS);

      if (storedTxs) {
        setTransactions(JSON.parse(storedTxs));
      } else {
        // Pre-analyse known suspicious seed transactions so initial dashboard is vibrant and informative
        const preAnalysedTxs = INITIAL_TRANSACTIONS.map(tx => {
          if (
            tx.scenarioTag?.includes('anomaly') ||
            tx.scenarioTag?.includes('structuring') ||
            tx.scenarioTag?.includes('velocity') ||
            tx.scenarioTag?.includes('circular') ||
            tx.scenarioTag?.includes('rapid_passthrough') ||
            tx.scenarioTag?.includes('failed')
          ) {
            const analysis = analyseTransaction(tx, INITIAL_TRANSACTIONS, INITIAL_ACCOUNTS);
            return {
              ...tx,
              riskScore: analysis.riskScore,
              riskLevel: analysis.riskLevel,
              analysisResult: analysis
            };
          }
          return tx;
        });
        setTransactions(preAnalysedTxs);
      }

      if (storedAlerts) {
        setAlerts(JSON.parse(storedAlerts));
      } else {
        setAlerts(INITIAL_ALERTS);
      }

      if (storedCases) {
        setCases(JSON.parse(storedCases));
      } else {
        // Seed 1 active case for investigation demo
        const initialCase: InvestigationCase = {
          id: 'CASE-202611-001',
          title: 'Suspicious Offshore Smurfing Syndicate (ACC-IN-1004)',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          updatedAt: new Date().toISOString(),
          priority: 'HIGH',
          status: 'INVESTIGATING',
          riskScore: 84,
          alertIds: ['ALT-202611-002', 'ALT-202611-004'],
          transactionIds: ['TXN-202611-0021', 'TXN-202611-0022', 'TXN-202611-0028', 'TXN-202611-0029'],
          accountIds: ['ACC-IN-1004', 'ACC-IN-1012', 'ACC-IN-1014'],
          summary: 'Multiple sub-threshold smurfing transfers detected followed by rapid fund movement to foreign shell entity.',
          notes: [
            {
              id: 'NOTE-1',
              caseId: 'CASE-202611-001',
              author: 'Lead AML Investigator',
              body: 'Account ACC-IN-1004 flagged for high-velocity transfers right below ₹50,000 threshold. Initiated enhanced due diligence.',
              createdAt: new Date(Date.now() - 1800000).toISOString()
            }
          ]
        };
        setCases([initialCase]);
      }

      if (storedPatterns) {
        setAmlPatterns(JSON.parse(storedPatterns));
      } else {
        const detected = detectAMLPatterns(INITIAL_TRANSACTIONS, INITIAL_ACCOUNTS);
        setAmlPatterns(detected);
      }
    } catch (e) {
      console.error('Error reading localStorage:', e);
      setTransactions(INITIAL_TRANSACTIONS);
      setAlerts(INITIAL_ALERTS);
    }
    setInitialized(true);
  }, []);

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    if (!initialized) return;
    try {
      localStorage.setItem(STORAGE_KEYS.TXS, JSON.stringify(transactions));
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases));
      localStorage.setItem(STORAGE_KEYS.PATTERNS, JSON.stringify(amlPatterns));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [transactions, alerts, cases, amlPatterns, initialized]);

  // Compute live dashboard metrics
  const metrics: DashboardMetrics = useMemo(() => {
    const totalTransactions = transactions.length;
    const flaggedTransactions = transactions.filter(t => (t.riskScore ?? 0) >= 30).length;
    const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL' && a.status !== 'RESOLVED' && a.status !== 'DISMISSED').length;
    const highAlerts = alerts.filter(a => a.severity === 'HIGH' && a.status !== 'RESOLVED' && a.status !== 'DISMISSED').length;

    const underReviewAccountIds = new Set<string>();
    cases.filter(c => c.status !== 'CLOSED').forEach(c => c.accountIds.forEach(id => underReviewAccountIds.add(id)));
    alerts.filter(a => a.status === 'INVESTIGATING').forEach(a => a.accountIds.forEach(id => underReviewAccountIds.add(id)));

    const flaggedValue = transactions
      .filter(t => (t.riskScore ?? 0) >= 50)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalVolumeValue = transactions.reduce((sum, t) => sum + t.amount, 0);

    const scoredTxs = transactions.filter(t => t.riskScore !== undefined);
    const avgRiskScore = scoredTxs.length > 0
      ? Math.round(scoredTxs.reduce((sum, t) => sum + (t.riskScore || 0), 0) / scoredTxs.length)
      : 0;

    return {
      totalTransactions,
      flaggedTransactions,
      criticalAlerts,
      highAlerts,
      accountsUnderReview: underReviewAccountIds.size,
      flaggedValue,
      totalVolumeValue,
      avgRiskScore,
      lastAnalysisTimestamp: new Date().toISOString()
    };
  }, [transactions, alerts, cases]);

  // Single transaction analysis
  const analyseTx = (txId: string) => {
    const target = transactions.find(t => t.id === txId);
    if (!target) return;

    const analysis = analyseTransaction(target, transactions, accounts);
    const updatedTx: Transaction = {
      ...target,
      riskScore: analysis.riskScore,
      riskLevel: analysis.riskLevel,
      analysisResult: analysis
    };

    setTransactions(prev => prev.map(t => t.id === txId ? updatedTx : t));
    if (selectedTransaction?.id === txId) {
      setSelectedTransaction(updatedTx);
    }

    // Auto-create alert if high or critical
    if (analysis.riskScore >= 50) {
      const existingAlert = alerts.find(a => a.transactionIds.includes(txId));
      if (!existingAlert) {
        const newAlert: Alert = {
          id: `ALT-${Date.now().toString().slice(-6)}`,
          createdAt: new Date().toISOString(),
          type: analysis.triggeredSignals[0]?.id || 'RULE_ANOMALY',
          severity: analysis.riskLevel,
          riskScore: analysis.riskScore,
          title: `Alert: ${analysis.triggeredSignals[0]?.name || 'Suspicious Activity'}`,
          explanation: analysis.explanation,
          transactionIds: [txId],
          accountIds: [target.senderAccountId, target.receiverAccountId],
          status: 'NEW'
        };
        setAlerts(prev => [newAlert, ...prev]);
      }
    }
  };

  // Bulk analyze all transactions
  const analyseAllTransactions = () => {
    const updated = transactions.map(tx => {
      const analysis = analyseTransaction(tx, transactions, accounts);
      return {
        ...tx,
        riskScore: analysis.riskScore,
        riskLevel: analysis.riskLevel,
        analysisResult: analysis
      };
    });
    setTransactions(updated);

    // Also run AML detectors
    const detectedPatterns = detectAMLPatterns(updated, accounts);
    setAmlPatterns(detectedPatterns);
  };

  // Add new synthetic transaction
  const addTransaction = (data: Partial<Transaction>): Transaction => {
    const id = `TXN-NEW-${Date.now().toString().slice(-5)}`;
    const newTx: Transaction = {
      id,
      timestamp: new Date().toISOString(),
      senderAccountId: data.senderAccountId || 'ACC-IN-1001',
      senderName: data.senderName || accounts.find(a => a.id === data.senderAccountId)?.displayName || 'Unknown Sender',
      receiverAccountId: data.receiverAccountId || 'ACC-IN-1002',
      receiverName: data.receiverName || accounts.find(a => a.id === data.receiverAccountId)?.displayName || 'Unknown Receiver',
      amount: Number(data.amount) || 1000,
      currency: 'INR',
      paymentMethod: data.paymentMethod || 'UPI',
      channel: data.channel || 'mobile',
      senderLocation: data.senderLocation || 'Mumbai, MH',
      receiverLocation: data.receiverLocation || 'Bengaluru, KA',
      status: data.status || 'completed',
      scenarioTag: data.scenarioTag || 'analyst_manual_test',
    };

    // Analyse immediately
    const analysis = analyseTransaction(newTx, [newTx, ...transactions], accounts);
    newTx.riskScore = analysis.riskScore;
    newTx.riskLevel = analysis.riskLevel;
    newTx.analysisResult = analysis;

    setTransactions(prev => [newTx, ...prev]);

    if (analysis.riskScore >= 50) {
      const newAlert: Alert = {
        id: `ALT-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        type: analysis.triggeredSignals[0]?.id || 'USER_SUBMITTED_ANOMALY',
        severity: analysis.riskLevel,
        riskScore: analysis.riskScore,
        title: `Manual Injection Alert: ${analysis.triggeredSignals[0]?.name || 'Suspicious Transaction'}`,
        explanation: analysis.explanation,
        transactionIds: [newTx.id],
        accountIds: [newTx.senderAccountId, newTx.receiverAccountId],
        status: 'NEW'
      };
      setAlerts(prev => [newAlert, ...prev]);
    }

    return newTx;
  };

  // Run AML scan
  const runAMLAnalysis = (): AMLPattern[] => {
    const patterns = detectAMLPatterns(transactions, accounts);
    setAmlPatterns(patterns);
    return patterns;
  };

  // Simulate complete coordinated fraud attack sequence
  const simulateFraudAttack = () => {
    setIsSimulating(true);

    const now = Date.now();
    const attackMuleId = 'ACC-IN-1015'; // Shadow Mule
    const victimId = 'ACC-IN-1001'; // Aarav Patel
    const offshoreId = 'ACC-IN-1014'; // Nexus Offshore
    const layerId = 'ACC-IN-1009'; // Deepak Joshi

    const simulatedSequence: Transaction[] = [
      {
        id: `SIM-ATK-${now}-01`,
        timestamp: new Date(now - 12 * 60 * 1000).toISOString(),
        senderAccountId: victimId,
        senderName: 'Aarav Patel',
        receiverAccountId: attackMuleId,
        receiverName: 'Shadow Mule ACC-999',
        amount: 350000,
        currency: 'INR',
        paymentMethod: 'IMPS',
        channel: 'web',
        senderLocation: 'Kyiv, Ukraine (TOR Exit Node)',
        receiverLocation: 'Noida, UP',
        status: 'completed',
        scenarioTag: 'simulated_credential_stuffing_drain'
      },
      {
        id: `SIM-ATK-${now}-02`,
        timestamp: new Date(now - 8 * 60 * 1000).toISOString(),
        senderAccountId: attackMuleId,
        senderName: 'Shadow Mule ACC-999',
        receiverAccountId: layerId,
        receiverName: 'Deepak Joshi (Layering Node B)',
        amount: 49500, // Structuring sub-threshold
        currency: 'INR',
        paymentMethod: 'UPI',
        channel: 'mobile',
        senderLocation: 'Noida, UP',
        receiverLocation: 'Patna, BR',
        status: 'completed',
        scenarioTag: 'simulated_structuring_burst_1'
      },
      {
        id: `SIM-ATK-${now}-03`,
        timestamp: new Date(now - 6 * 60 * 1000).toISOString(),
        senderAccountId: attackMuleId,
        senderName: 'Shadow Mule ACC-999',
        receiverAccountId: layerId,
        receiverName: 'Deepak Joshi (Layering Node B)',
        amount: 49200, // Structuring sub-threshold
        currency: 'INR',
        paymentMethod: 'UPI',
        channel: 'mobile',
        senderLocation: 'Noida, UP',
        receiverLocation: 'Patna, BR',
        status: 'completed',
        scenarioTag: 'simulated_structuring_burst_2'
      },
      {
        id: `SIM-ATK-${now}-04`,
        timestamp: new Date(now - 4 * 60 * 1000).toISOString(),
        senderAccountId: attackMuleId,
        senderName: 'Shadow Mule ACC-999',
        receiverAccountId: layerId,
        receiverName: 'Deepak Joshi (Layering Node B)',
        amount: 48900, // Structuring sub-threshold
        currency: 'INR',
        paymentMethod: 'UPI',
        channel: 'mobile',
        senderLocation: 'Noida, UP',
        receiverLocation: 'Patna, BR',
        status: 'completed',
        scenarioTag: 'simulated_structuring_burst_3'
      },
      {
        id: `SIM-ATK-${now}-05`,
        timestamp: new Date(now - 2 * 60 * 1000).toISOString(),
        senderAccountId: layerId,
        senderName: 'Deepak Joshi (Layering Node B)',
        receiverAccountId: offshoreId,
        receiverName: 'Nexus Offshore Consulting FZE',
        amount: 146000,
        currency: 'INR',
        paymentMethod: 'RTGS',
        channel: 'web',
        senderLocation: 'Patna, BR',
        receiverLocation: 'Dubai, UAE',
        status: 'completed',
        scenarioTag: 'simulated_rapid_passthrough_drain'
      }
    ];

    // Combine and analyse
    const combinedTxs = [...simulatedSequence, ...transactions];
    const analysedSimulated = simulatedSequence.map(tx => {
      const analysis = analyseTransaction(tx, combinedTxs, accounts);
      return {
        ...tx,
        riskScore: analysis.riskScore,
        riskLevel: analysis.riskLevel,
        analysisResult: analysis
      };
    });

    const updatedAllTxs = [...analysedSimulated, ...transactions];
    setTransactions(updatedAllTxs);

    // Create Critical Alert for attack simulation
    const attackAlert: Alert = {
      id: `ALT-SIM-${now.toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
      type: 'SIMULATED_ATTACK_CAMPAIGN',
      severity: 'CRITICAL',
      riskScore: 98,
      title: '🚨 Active Coordinated Attack: High-Velocity Account Drain & Smurfing',
      explanation: `Simulated attack successfully triggered. Account ${victimId} drained ₹3,50,000 via TOR exit node, structured into 3 sub-₹50k bursts via ${attackMuleId}, and funneled to offshore entity ${offshoreId}.`,
      transactionIds: simulatedSequence.map(t => t.id),
      accountIds: [victimId, attackMuleId, layerId, offshoreId],
      status: 'NEW'
    };

    setAlerts(prev => [attackAlert, ...prev]);

    // Re-run AML detection
    const freshAML = detectAMLPatterns(updatedAllTxs, accounts);
    setAmlPatterns(freshAML);

    setTimeout(() => {
      setIsSimulating(false);
    }, 400);
  };

  // Reset Demo to pristine state
  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEYS.TXS);
    localStorage.removeItem(STORAGE_KEYS.ALERTS);
    localStorage.removeItem(STORAGE_KEYS.CASES);
    localStorage.removeItem(STORAGE_KEYS.PATTERNS);

    const preAnalysedTxs = INITIAL_TRANSACTIONS.map(tx => {
      if (
        tx.scenarioTag?.includes('anomaly') ||
        tx.scenarioTag?.includes('structuring') ||
        tx.scenarioTag?.includes('velocity') ||
        tx.scenarioTag?.includes('circular') ||
        tx.scenarioTag?.includes('rapid_passthrough') ||
        tx.scenarioTag?.includes('failed')
      ) {
        const analysis = analyseTransaction(tx, INITIAL_TRANSACTIONS, INITIAL_ACCOUNTS);
        return {
          ...tx,
          riskScore: analysis.riskScore,
          riskLevel: analysis.riskLevel,
          analysisResult: analysis
        };
      }
      return tx;
    });

    setAccounts(INITIAL_ACCOUNTS);
    setTransactions(preAnalysedTxs);
    setAlerts(INITIAL_ALERTS);
    setCases([]);
    const detected = detectAMLPatterns(INITIAL_TRANSACTIONS, INITIAL_ACCOUNTS);
    setAmlPatterns(detected);
    setSelectedTransaction(null);
  };

  // Alert actions
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a));
  };

  const escalateAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'ESCALATED' } : a));
  };

  const resolveAlert = (alertId: string, resolutionNote?: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? {
      ...a,
      status: 'RESOLVED',
      resolutionNote: resolutionNote || 'Resolved by fraud analyst after verification.'
    } : a));
  };

  // Case actions
  const createCaseFromAlert = (alertId: string, title?: string, priority: CasePriority = 'HIGH'): InvestigationCase => {
    const alert = alerts.find(a => a.id === alertId);
    const caseId = `CASE-${Date.now().toString().slice(-6)}`;

    const newCase: InvestigationCase = {
      id: caseId,
      title: title || (alert ? `Case: ${alert.title}` : `Investigation ${caseId}`),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: priority,
      status: 'OPEN',
      riskScore: alert?.riskScore || 75,
      alertIds: alert ? [alert.id] : [],
      transactionIds: alert ? [...alert.transactionIds] : [],
      accountIds: alert ? [...alert.accountIds] : [],
      summary: alert ? alert.explanation : 'Analyst initiated investigation dossier.',
      notes: [
        {
          id: `NOTE-${Date.now()}`,
          caseId,
          author: 'Security Analyst',
          body: `Case opened from Alert ${alertId}. Commenced evidence compilation.`,
          createdAt: new Date().toISOString()
        }
      ]
    };

    setCases(prev => [newCase, ...prev]);

    // Update alert status to INVESTIGATING and attach caseId
    setAlerts(prev => prev.map(a => a.id === alertId ? {
      ...a,
      status: 'INVESTIGATING',
      caseId
    } : a));

    return newCase;
  };

  const addCaseNote = (caseId: string, body: string, author: string = 'Investigator') => {
    const newNote = {
      id: `NOTE-${Date.now()}`,
      caseId,
      author,
      body,
      createdAt: new Date().toISOString()
    };

    setCases(prev => prev.map(c => c.id === caseId ? {
      ...c,
      updatedAt: new Date().toISOString(),
      notes: [...c.notes, newNote]
    } : c));
  };

  const updateCaseStatus = (caseId: string, status: CaseStatus, resolutionNote?: string) => {
    setCases(prev => prev.map(c => c.id === caseId ? {
      ...c,
      status,
      resolutionNote: resolutionNote || c.resolutionNote,
      updatedAt: new Date().toISOString()
    } : c));
  };

  // CSV Export utility
  const exportTransactionsCSV = (txsToExport?: Transaction[]) => {
    const data = txsToExport || transactions;
    const headers = [
      'ID',
      'Timestamp',
      'Sender ID',
      'Sender Name',
      'Receiver ID',
      'Receiver Name',
      'Amount (INR)',
      'Method',
      'Channel',
      'Sender Location',
      'Receiver Location',
      'Status',
      'Risk Score',
      'Risk Level',
      'Scenario Tag'
    ];

    const rows = data.map(t => [
      `"${t.id}"`,
      `"${t.timestamp}"`,
      `"${t.senderAccountId}"`,
      `"${t.senderName.replace(/"/g, '""')}"`,
      `"${t.receiverAccountId}"`,
      `"${t.receiverName.replace(/"/g, '""')}"`,
      t.amount,
      `"${t.paymentMethod}"`,
      `"${t.channel}"`,
      `"${t.senderLocation || ''}"`,
      `"${t.receiverLocation || ''}"`,
      `"${t.status}"`,
      t.riskScore ?? '',
      `"${t.riskLevel || 'UNASSESSED'}"`,
      `"${t.scenarioTag || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FraudShield_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <FraudShieldContext.Provider
      value={{
        transactions,
        accounts,
        alerts,
        cases,
        amlPatterns,
        metrics,
        isSimulating,
        selectedTransaction,
        setSelectedTransaction,
        analyseTx,
        analyseAllTransactions,
        addTransaction,
        runAMLAnalysis,
        simulateFraudAttack,
        resetDemo,
        acknowledgeAlert,
        escalateAlert,
        resolveAlert,
        createCaseFromAlert,
        addCaseNote,
        updateCaseStatus,
        exportTransactionsCSV
      }}
    >
      {children}
    </FraudShieldContext.Provider>
  );
};

export const useFraudShield = (): FraudShieldContextType => {
  const context = useContext(FraudShieldContext);
  if (!context) {
    throw new Error('useFraudShield must be used within a FraudShieldProvider');
  }
  return context;
};

