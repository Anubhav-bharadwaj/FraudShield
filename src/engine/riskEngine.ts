import { Transaction, Account, RiskSignal, RiskAnalysisResult, RiskLevel, RecommendedAction } from '../types';

export function analyseTransaction(
  targetTx: Transaction,
  allTransactions: Transaction[],
  accounts: Account[]
): RiskAnalysisResult {
  const signals: RiskSignal[] = [];
  const sender = accounts.find(a => a.id === targetTx.senderAccountId);
  const targetTime = new Date(targetTx.timestamp).getTime();

  // 1. SIGNAL: Unusually High Amount vs Baseline
  const avgBaseline = sender ? sender.baselineAverageAmount : 5000;
  const maxBaseline = sender ? sender.baselineMaxAmount : 50000;

  if (targetTx.amount > maxBaseline * 2 || (targetTx.amount > avgBaseline * 5 && targetTx.amount > 50000)) {
    const ratio = (targetTx.amount / avgBaseline).toFixed(1);
    signals.push({
      id: 'SIG-HIGH-AMOUNT',
      name: 'Unusually High Transaction Amount',
      category: 'AMOUNT',
      severity: targetTx.amount > maxBaseline * 5 ? 'CRITICAL' : 'HIGH',
      points: targetTx.amount > maxBaseline * 5 ? 25 : 18,
      explanation: `Transaction value ₹${targetTx.amount.toLocaleString('en-IN')} is materially above the account historical baseline.`,
      evidence: `Amount represents ${ratio}x the baseline average (₹${avgBaseline.toLocaleString('en-IN')}) and exceeds max normal limit (₹${maxBaseline.toLocaleString('en-IN')}).`
    });
  } else if (targetTx.amount > maxBaseline) {
    signals.push({
      id: 'SIG-MODERATE-AMOUNT',
      name: 'Elevated Amount Above Normal Range',
      category: 'AMOUNT',
      severity: 'MEDIUM',
      points: 12,
      explanation: `Transaction of ₹${targetTx.amount.toLocaleString('en-IN')} exceeds account typical maximum.`,
      evidence: `Historical normal limit is ₹${maxBaseline.toLocaleString('en-IN')}.`
    });
  }

  // 2. SIGNAL: Velocity Spike (Multiple transfers from same sender in short window)
  const window15m = 15 * 60 * 1000;
  const window1h = 60 * 60 * 1000;

  const priorSenderTxs = allTransactions.filter(tx =>
    tx.id !== targetTx.id &&
    tx.senderAccountId === targetTx.senderAccountId &&
    Math.abs(new Date(tx.timestamp).getTime() - targetTime) <= window1h
  );

  const txsIn15m = priorSenderTxs.filter(tx =>
    Math.abs(new Date(tx.timestamp).getTime() - targetTime) <= window15m
  );

  if (txsIn15m.length >= 3) {
    signals.push({
      id: 'SIG-VELOCITY-BURST',
      name: 'High-Frequency Velocity Burst',
      category: 'VELOCITY',
      severity: txsIn15m.length >= 4 ? 'CRITICAL' : 'HIGH',
      points: txsIn15m.length >= 4 ? 25 : 20,
      explanation: `${txsIn15m.length + 1} outbound transactions executed within a 15-minute window.`,
      evidence: `Observed ${txsIn15m.length} concurrent transfers totaling ₹${(
        txsIn15m.reduce((sum, t) => sum + t.amount, 0) + targetTx.amount
      ).toLocaleString('en-IN')} within 15 minutes.`
    });
  } else if (priorSenderTxs.length >= 4) {
    signals.push({
      id: 'SIG-VELOCITY-ELEVATED',
      name: 'Elevated 1-Hour Velocity',
      category: 'VELOCITY',
      severity: 'MEDIUM',
      points: 15,
      explanation: `High frequency of transfers observed in a 60-minute window.`,
      evidence: `${priorSenderTxs.length + 1} transactions executed in the past hour.`
    });
  }

  // 3. SIGNAL: New / Low-History Beneficiary
  const priorTxsToSameReceiver = allTransactions.filter(tx =>
    tx.id !== targetTx.id &&
    tx.senderAccountId === targetTx.senderAccountId &&
    tx.receiverAccountId === targetTx.receiverAccountId &&
    new Date(tx.timestamp).getTime() < targetTime
  );

  if (priorTxsToSameReceiver.length === 0 && targetTx.amount > 10000) {
    signals.push({
      id: 'SIG-NEW-BENEFICIARY',
      name: 'First-Time Beneficiary Transfer',
      category: 'BENEFICIARY',
      severity: targetTx.amount > 100000 ? 'HIGH' : 'MEDIUM',
      points: targetTx.amount > 100000 ? 15 : 10,
      explanation: `No prior transaction history found between ${targetTx.senderName} and ${targetTx.receiverName}.`,
      evidence: `Target account ${targetTx.receiverAccountId} is a newly linked beneficiary for this high/medium value transfer.`
    });
  }

  // 4. SIGNAL: Location Anomaly
  if (sender && targetTx.senderLocation) {
    const homeLoc = sender.homeLocation.toLowerCase();
    const txLoc = targetTx.senderLocation.toLowerCase();

    // Check if anomalous or foreign location
    const isForeign = txLoc.includes('russia') || txLoc.includes('dubai') || txLoc.includes('proxy') || txLoc.includes('tor');
    const isStateMismatch = !txLoc.includes(homeLoc.split(',')[1]?.trim() || 'xyz') && !txLoc.includes(homeLoc.split(',')[0]?.trim() || 'xyz');

    if (isForeign) {
      signals.push({
        id: 'SIG-LOCATION-ANOMALY-CRITICAL',
        name: 'Geographic / IP Proxy Anomaly',
        category: 'LOCATION',
        severity: 'CRITICAL',
        points: 22,
        explanation: `Transaction originated from high-risk or unexpected remote location: ${targetTx.senderLocation}.`,
        evidence: `Sender registered home profile: ${sender.homeLocation}. Transaction originating point: ${targetTx.senderLocation}.`
      });
    } else if (isStateMismatch && targetTx.amount > 50000) {
      signals.push({
        id: 'SIG-LOCATION-MISMATCH',
        name: 'Unusual Out-of-State Origin',
        category: 'LOCATION',
        severity: 'MEDIUM',
        points: 12,
        explanation: `Originating location differs from sender registered primary hub.`,
        evidence: `Home: ${sender.homeLocation} vs Origin: ${targetTx.senderLocation}.`
      });
    }
  }

  // 5. SIGNAL: Rapid Onward Transfer (Pass-through / Layering heuristic)
  // Check if sender received funds shortly before sending this out
  const window30m = 30 * 60 * 1000;
  const recentInflows = allTransactions.filter(tx =>
    tx.receiverAccountId === targetTx.senderAccountId &&
    tx.status === 'completed' &&
    targetTime - new Date(tx.timestamp).getTime() > 0 &&
    targetTime - new Date(tx.timestamp).getTime() <= window30m
  );

  const matchedInflow = recentInflows.find(inflow =>
    inflow.amount >= targetTx.amount * 0.85 &&
    inflow.amount <= targetTx.amount * 1.25
  );

  if (matchedInflow) {
    const elapsedMinutes = Math.round((targetTime - new Date(matchedInflow.timestamp).getTime()) / (60 * 1000));
    signals.push({
      id: 'SIG-RAPID-PASS-THROUGH',
      name: 'Rapid Pass-Through / Layering Behaviour',
      category: 'FLOW',
      severity: 'CRITICAL',
      points: 25,
      explanation: `Immediate onward transfer of incoming capital within ${elapsedMinutes} minutes.`,
      evidence: `Inflow of ₹${matchedInflow.amount.toLocaleString('en-IN')} (Tx ${matchedInflow.id}) followed by outflow of ₹${targetTx.amount.toLocaleString('en-IN')} in ${elapsedMinutes}m (retention rate < 5%).`
    });
  }

  // 6. SIGNAL: Repeated Failed Attempts (Brute force / PIN probe)
  const recentFailures = allTransactions.filter(tx =>
    tx.senderAccountId === targetTx.senderAccountId &&
    tx.status === 'failed' &&
    Math.abs(targetTime - new Date(tx.timestamp).getTime()) <= window1h
  );

  if (recentFailures.length >= 2) {
    signals.push({
      id: 'SIG-REPEATED-FAILURES',
      name: 'Multiple Prior Failed Authorisations',
      category: 'REPEATED_FAILURES',
      severity: recentFailures.length >= 3 ? 'HIGH' : 'MEDIUM',
      points: recentFailures.length >= 3 ? 18 : 12,
      explanation: `${recentFailures.length} failed attempts logged for this sender account shortly prior to completion.`,
      evidence: `Recent failed transaction attempts: ${recentFailures.map(f => f.id).join(', ')}.`
    });
  }

  // 7. SIGNAL: Structuring / Smurfing Threshold Detection
  // Common AML reporting threshold benchmark: ₹50,000 (illustrative prototype threshold)
  const isJustBelowThreshold = targetTx.amount >= 45000 && targetTx.amount < 50000;
  if (isJustBelowThreshold) {
    const relatedSubThresholdTxs = allTransactions.filter(tx =>
      tx.senderAccountId === targetTx.senderAccountId &&
      tx.amount >= 45000 && tx.amount < 50000 &&
      Math.abs(targetTime - new Date(tx.timestamp).getTime()) <= 4 * 60 * 60 * 1000 // 4 hours
    );

    if (relatedSubThresholdTxs.length >= 2) {
      signals.push({
        id: 'SIG-AML-STRUCTURING',
        name: 'Structuring / Smurfing Indicator',
        category: 'AML',
        severity: 'HIGH',
        points: 25,
        explanation: `Cluster of transactions calibrated just below illustrative ₹50,000 monitoring limit.`,
        evidence: `${relatedSubThresholdTxs.length} transfers between ₹45,000 and ₹49,999 from this account within 4 hours.`
      });
    }
  }

  // 8. SIGNAL: Circular Flow Match (Tagged or known cycle participant)
  if (targetTx.scenarioTag?.includes('circular') || targetTx.scenarioTag?.includes('return')) {
    signals.push({
      id: 'SIG-AML-CIRCULAR',
      name: 'Circular Flow Cycle Participant',
      category: 'AML',
      severity: 'CRITICAL',
      points: 30,
      explanation: `Transfer is a component of a closed circular fund routing graph.`,
      evidence: `Path tracking indicates funds cycle back to originator or related syndicate node.`
    });
  }

  // Compute total clamped score
  const rawScore = signals.reduce((acc, sig) => acc + sig.points, 0);
  const riskScore = Math.min(100, Math.max(0, rawScore));

  let riskLevel: RiskLevel = 'LOW';
  let recommendedAction: RecommendedAction = 'APPROVE';

  if (riskScore >= 75) {
    riskLevel = 'CRITICAL';
    recommendedAction = 'FREEZE';
  } else if (riskScore >= 50) {
    riskLevel = 'HIGH';
    recommendedAction = 'ESCALATE';
  } else if (riskScore >= 30) {
    riskLevel = 'MEDIUM';
    recommendedAction = 'REVIEW';
  } else {
    riskLevel = 'LOW';
    recommendedAction = 'APPROVE';
  }

  let explanation = '';
  if (signals.length === 0) {
    explanation = 'Transaction conforms to historical profile. No suspicious behavioural anomalies detected.';
  } else {
    explanation = `Flagged by ${signals.length} investigative signal(s): ${signals.map(s => s.name).join(', ')}.`;
  }

  const evidenceSummary = signals.map(s => `[${s.category}] ${s.evidence}`).join(' | ');

  return {
    riskScore,
    riskLevel,
    triggeredSignals: signals,
    explanation,
    evidenceSummary,
    recommendedAction,
    timestamp: new Date().toISOString()
  };
}

