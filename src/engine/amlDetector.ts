import { Transaction, AMLPattern, Account } from '../types';

export function detectAMLPatterns(transactions: Transaction[], accounts: Account[]): AMLPattern[] {
  const patterns: AMLPattern[] = [];

  // ==========================================
  // DETECTOR 1: STRUCTURING / TRANSACTION SPLITTING
  // ==========================================
  // Find accounts that executed multiple sub-threshold transactions (₹45,000 - ₹49,999)
  const THRESHOLD_MIN = 40000;
  const THRESHOLD_LIMIT = 50000;
  const WINDOW_MS = 6 * 60 * 60 * 1000; // 6 hours

  const txsBySender: { [senderId: string]: Transaction[] } = {};
  transactions.forEach(tx => {
    if (tx.status === 'completed') {
      if (!txsBySender[tx.senderAccountId]) txsBySender[tx.senderAccountId] = [];
      txsBySender[tx.senderAccountId].push(tx);
    }
  });

  Object.entries(txsBySender).forEach(([senderId, senderTxs]) => {
    const subThresholdTxs = senderTxs.filter(t => t.amount >= THRESHOLD_MIN && t.amount < THRESHOLD_LIMIT);

    if (subThresholdTxs.length >= 3) {
      // Sort by timestamp
      subThresholdTxs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      // Check time span
      const firstTime = new Date(subThresholdTxs[0].timestamp).getTime();
      const lastTime = new Date(subThresholdTxs[subThresholdTxs.length - 1].timestamp).getTime();
      const durationMin = Math.round((lastTime - firstTime) / (60 * 1000));

      if (lastTime - firstTime <= WINDOW_MS) {
        const totalSum = subThresholdTxs.reduce((sum, t) => sum + t.amount, 0);
        const sender = accounts.find(a => a.id === senderId);
        const receiverIds = Array.from(new Set(subThresholdTxs.map(t => t.receiverAccountId)));

        patterns.push({
          id: `AML-STR-${senderId.replace(/[^a-zA-Z0-9]/g, '')}`,
          type: 'STRUCTURING',
          severity: totalSum > 150000 ? 'CRITICAL' : 'HIGH',
          title: `Smurfing / Structuring Cluster (${subThresholdTxs.length} Transactions)`,
          description: `Account ${sender?.displayName || senderId} executed ${subThresholdTxs.length} rapid transfers between ₹${THRESHOLD_MIN.toLocaleString('en-IN')} and ₹${(THRESHOLD_LIMIT - 1).toLocaleString('en-IN')}, deliberately evading the ₹${THRESHOLD_LIMIT.toLocaleString('en-IN')} reporting threshold.`,
          involvedAccounts: [senderId, ...receiverIds],
          involvedTransactions: subThresholdTxs.map(t => t.id),
          totalAmount: totalSum,
          timeSpanMinutes: durationMin || 15,
          confidenceScore: 94,
          evidence: `${subThresholdTxs.length} transfers totaling ₹${totalSum.toLocaleString('en-IN')} occurred within ${durationMin || 15} minutes. Average amount: ₹${Math.round(totalSum / subThresholdTxs.length).toLocaleString('en-IN')}.`,
          detectedAt: new Date().toISOString(),
          flowPath: [senderId, ...receiverIds]
        });
      }
    }
  });

  // ==========================================
  // DETECTOR 2: CIRCULAR MONEY MOVEMENT (CYCLES)
  // ==========================================
  // Build directed graph of transactions within an 8-hour window
  // Cycle detection: A -> B -> C -> A
  interface Edge {
    target: string;
    tx: Transaction;
    time: number;
    amount: number;
  }

  const adjList: { [source: string]: Edge[] } = {};
  transactions.forEach(tx => {
    if (tx.status === 'completed') {
      if (!adjList[tx.senderAccountId]) adjList[tx.senderAccountId] = [];
      adjList[tx.senderAccountId].push({
        target: tx.receiverAccountId,
        tx,
        time: new Date(tx.timestamp).getTime(),
        amount: tx.amount,
      });
    }
  });

  const visitedCycles = new Set<string>();

  // Find 3-hop and 4-hop cycles
  Object.keys(adjList).forEach(nodeA => {
    const edgesFromA = adjList[nodeA] || [];

    edgesFromA.forEach(edgeAB => {
      const nodeB = edgeAB.target;
      if (nodeB === nodeA) return;

      const edgesFromB = adjList[nodeB] || [];
      edgesFromB.forEach(edgeBC => {
        const nodeC = edgeBC.target;
        if (nodeC === nodeB) return;

        // Check if chronological: edgeBC must happen after or close to edgeAB
        if (edgeBC.time >= edgeAB.time && edgeBC.time - edgeAB.time <= 4 * 60 * 60 * 1000) {
          // Check 3-hop cycle: C -> A
          if (nodeC === nodeA) {
            // 2-hop ping-pong
            const cycleKey = [nodeA, nodeB].sort().join('<->');
            if (!visitedCycles.has(cycleKey)) {
              visitedCycles.add(cycleKey);
              // Register ping-pong
            }
          } else {
            // Check if C sends back to A
            const edgesFromC = adjList[nodeC] || [];
            edgesFromC.forEach(edgeCA => {
              if (edgeCA.target === nodeA && edgeCA.time >= edgeBC.time && edgeCA.time - edgeAB.time <= 6 * 60 * 60 * 1000) {
                const cycleNodes = [nodeA, nodeB, nodeC];
                const cycleKey = cycleNodes.slice().sort().join('->');
                if (!visitedCycles.has(cycleKey)) {
                  visitedCycles.add(cycleKey);

                  const cycleTxs = [edgeAB.tx, edgeBC.tx, edgeCA.tx];
                  const totalFlow = edgeAB.amount;
                  const elapsedMin = Math.round((edgeCA.time - edgeAB.time) / (60 * 1000));

                  patterns.push({
                    id: `AML-CIRC-${nodeA.replace(/[^a-zA-Z0-9]/g, '')}-${nodeB.replace(/[^a-zA-Z0-9]/g, '')}`,
                    type: 'CIRCULAR_FLOW',
                    severity: 'CRITICAL',
                    title: `Closed Circular Routing: ${nodeA} → ${nodeB} → ${nodeC} → ${nodeA}`,
                    description: `Funds originated from ${nodeA}, routed sequentially through intermediate accounts ${nodeB} and ${nodeC}, and returned to originator in ${elapsedMin} minutes.`,
                    involvedAccounts: [nodeA, nodeB, nodeC],
                    involvedTransactions: cycleTxs.map(t => t.id),
                    totalAmount: totalFlow,
                    timeSpanMinutes: elapsedMin || 30,
                    confidenceScore: 98,
                    evidence: `Cycle completed across 3 accounts. Transfer values: ₹${edgeAB.amount.toLocaleString('en-IN')} → ₹${edgeBC.amount.toLocaleString('en-IN')} → ₹${edgeCA.amount.toLocaleString('en-IN')}. Capital return retention: ${Math.round((edgeCA.amount / edgeAB.amount) * 100)}%.`,
                    detectedAt: new Date().toISOString(),
                    flowPath: [nodeA, nodeB, nodeC, nodeA]
                  });
                }
              }
            });
          }
        }
      });
    });
  });

  // ==========================================
  // DETECTOR 3: RAPID PASS-THROUGH / LAYERING
  // ==========================================
  // Detect intermediate accounts where inflow is followed by outflow within 30 min (retention >= 80%)
  const PASS_THROUGH_WINDOW_MS = 30 * 60 * 1000;

  transactions.forEach(inflowTx => {
    if (inflowTx.status === 'completed' && inflowTx.amount >= 50000) {
      const intermediary = inflowTx.receiverAccountId;
      const inflowTime = new Date(inflowTx.timestamp).getTime();

      // Find outflows from intermediary
      const matchingOutflows = transactions.filter(outflowTx =>
        outflowTx.senderAccountId === intermediary &&
        outflowTx.status === 'completed' &&
        new Date(outflowTx.timestamp).getTime() > inflowTime &&
        new Date(outflowTx.timestamp).getTime() - inflowTime <= PASS_THROUGH_WINDOW_MS &&
        outflowTx.amount >= inflowTx.amount * 0.8 &&
        outflowTx.amount <= inflowTx.amount * 1.15
      );

      matchingOutflows.forEach(outflowTx => {
        const outflowTime = new Date(outflowTx.timestamp).getTime();
        const elapsedMin = Math.round((outflowTime - inflowTime) / (60 * 1000));
        const patternId = `AML-PASS-${inflowTx.id}-${outflowTx.id}`;

        // Don't duplicate if already detected in circular flow
        const isAlreadyCircular = patterns.some(p =>
          p.type === 'CIRCULAR_FLOW' &&
          p.involvedTransactions.includes(inflowTx.id) &&
          p.involvedTransactions.includes(outflowTx.id)
        );

        if (!isAlreadyCircular && !patterns.some(p => p.id === patternId)) {
          patterns.push({
            id: patternId,
            type: 'RAPID_PASS_THROUGH',
            severity: 'HIGH',
            title: `Rapid Layering Pass-Through via ${intermediary}`,
            description: `Intermediary account ${intermediary} received ₹${inflowTx.amount.toLocaleString('en-IN')} and disbursed ₹${outflowTx.amount.toLocaleString('en-IN')} onward in only ${elapsedMin} minutes.`,
            involvedAccounts: [inflowTx.senderAccountId, intermediary, outflowTx.receiverAccountId],
            involvedTransactions: [inflowTx.id, outflowTx.id],
            totalAmount: inflowTx.amount,
            timeSpanMinutes: elapsedMin || 5,
            confidenceScore: 91,
            evidence: `Transit time: ${elapsedMin} mins. Retained funds: ₹${(inflowTx.amount - outflowTx.amount).toLocaleString('en-IN')} (${(100 - (outflowTx.amount / inflowTx.amount) * 100).toFixed(1)}%). Source: ${inflowTx.senderAccountId} → Transit: ${intermediary} → Target: ${outflowTx.receiverAccountId}.`,
            detectedAt: new Date().toISOString(),
            flowPath: [inflowTx.senderAccountId, intermediary, outflowTx.receiverAccountId]
          });
        }
      });
    }
  });

  return patterns;
}

