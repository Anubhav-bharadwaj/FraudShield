'use client';

import React, { useState, useMemo } from 'react';
import { AMLPattern, Transaction, Account } from '../types';
import { Network, AlertTriangle, ArrowRight, Layers, RefreshCw, ZoomIn, Info } from 'lucide-react';

interface AMLNetworkGraphProps {
  patterns: AMLPattern[];
  transactions: Transaction[];
  accounts: Account[];
  onSelectTransaction?: (tx: Transaction) => void;
}

export const AMLNetworkGraph: React.FC<AMLNetworkGraphProps> = ({
  patterns,
  transactions,
  accounts,
  onSelectTransaction
}) => {
  const [selectedPatternId, setSelectedPatternId] = useState<string>(patterns[0]?.id || '');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Active pattern
  const activePattern = patterns.find(p => p.id === selectedPatternId) || patterns[0];

  // Get nodes and links for the selected pattern
  const graphData = useMemo(() => {
    if (!activePattern) return { nodes: [], links: [] };

    const involvedAccIds = activePattern.involvedAccounts;
    const relevantTxs = transactions.filter(t => activePattern.involvedTransactions.includes(t.id));

    // Place nodes in a clean circular layout
    const width = 640;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 130;

    const nodes = involvedAccIds.map((accId, index) => {
      const angle = (index / involvedAccIds.length) * 2 * Math.PI - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const account = accounts.find(a => a.id === accId);

      return {
        id: accId,
        x,
        y,
        name: account?.displayName || accId,
        type: account?.accountType || 'individual',
        risk: account?.riskRating || 'HIGH',
        homeLocation: account?.homeLocation || 'Unknown',
      };
    });

    const links = relevantTxs.map(tx => {
      const sourceNode = nodes.find(n => n.id === tx.senderAccountId);
      const targetNode = nodes.find(n => n.id === tx.receiverAccountId);

      return {
        id: tx.id,
        source: sourceNode,
        target: targetNode,
        amount: tx.amount,
        tx,
      };
    }).filter(l => l.source && l.target);

    return { nodes, links };
  }, [activePattern, transactions, accounts]);

  return (
    <div className="bg-[#211F1B] border border-[#403B32] rounded-xl overflow-hidden shadow-lg">
      {/* Pattern Selector Tabs */}
      <div className="px-6 py-3 border-b border-[#403B32] bg-[#171715] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-[#D8C5A3]" />
          <span className="font-semibold text-sm text-[#F1EBDD]">AML Flow Graph & Topology</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#2B2822] text-[#D8C5A3] border border-[#403B32]">
            {patterns.length} Detected Syndicates
          </span>
        </div>

        {/* Patterns pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          {patterns.map(p => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPatternId(p.id);
                setSelectedNode(null);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors shrink-0 ${
                activePattern?.id === p.id
                  ? 'bg-[#2B2822] border border-[#D8C5A3] text-[#D8C5A3]'
                  : 'bg-[#171715] border border-[#403B32] text-[#AAA395] hover:text-[#F1EBDD]'
              }`}
            >
              {p.type === 'CIRCULAR_FLOW' ? '🔄 Circular Cycle' : p.type === 'STRUCTURING' ? '⚡ Structuring' : '⏩ Rapid Layering'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Graph Area */}
      {activePattern ? (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* SVG Diagram (7 cols) */}
          <div className="lg:col-span-7 bg-[#171715] border border-[#403B32] rounded-xl p-4 relative flex flex-col items-center justify-center min-h-[420px] overflow-hidden">
            <div className="absolute top-3 left-3 text-[11px] font-mono text-[#AAA395] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D46D68] animate-ping" />
              <span>ACTIVE FLOW: {activePattern.type}</span>
            </div>

            <svg
              viewBox="0 0 640 400"
              className="w-full h-auto max-h-[380px] select-none"
            >
              <defs>
                {/* Arrow markers */}
                <marker
                  id="arrow-red"
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#D46D68" />
                </marker>
                <marker
                  id="arrow-sand"
                  viewBox="0 0 10 10"
                  refX="22"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#D8C5A3" />
                </marker>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Links */}
              {graphData.links.map(link => {
                if (!link.source || !link.target) return null;
                const isCycle = activePattern.type === 'CIRCULAR_FLOW';
                const strokeColor = isCycle ? '#D46D68' : '#D8C5A3';
                const marker = isCycle ? 'url(#arrow-red)' : 'url(#arrow-sand)';

                // Calculate midpoint with slight curve
                const dx = link.target.x - link.source.x;
                const dy = link.target.y - link.source.y;
                const midX = (link.source.x + link.target.x) / 2 - dy * 0.15;
                const midY = (link.source.y + link.target.y) / 2 + dx * 0.15;

                const pathData = `M ${link.source.x} ${link.source.y} Q ${midX} ${midY} ${link.target.x} ${link.target.y}`;

                return (
                  <g key={link.id} className="cursor-pointer group" onClick={() => onSelectTransaction?.(link.tx)}>
                    <path
                      d={pathData}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={isCycle ? '2.5' : '2'}
                      strokeDasharray={isCycle ? '6,4' : undefined}
                      markerEnd={marker}
                      className="transition-all hover:stroke-width-3"
                    />
                    {/* Amount badge on path */}
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-45"
                        y="-10"
                        width="90"
                        height="20"
                        rx="4"
                        fill="#211F1B"
                        stroke={strokeColor}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="4"
                        fill="#F1EBDD"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        ₹{(link.amount / 1000).toFixed(0)}k
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Nodes */}
              {graphData.nodes.map(node => {
                const isSelected = selectedNode === node.id;
                const isMule = node.type === 'mule' || node.name.toLowerCase().includes('mule');
                const isForeign = node.type === 'foreign';
                const nodeColor = isMule ? '#D46D68' : isForeign ? '#D98558' : '#D8C5A3';

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer group"
                    onClick={() => setSelectedNode(node.id === selectedNode ? null : node.id)}
                  >
                    {/* Pulsing halo if selected or mule */}
                    <circle
                      r={isSelected ? '28' : '22'}
                      fill={nodeColor}
                      fillOpacity={isMule ? '0.2' : '0.1'}
                      stroke={nodeColor}
                      strokeWidth={isSelected ? '2' : '1'}
                      className="transition-all"
                    />
                    <circle
                      r="16"
                      fill="#211F1B"
                      stroke={nodeColor}
                      strokeWidth="2"
                    />
                    <text
                      y="4"
                      textAnchor="middle"
                      fill="#F1EBDD"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {node.id.split('-').slice(-1)[0]}
                    </text>
                    {/* Label below */}
                    <text
                      y="32"
                      textAnchor="middle"
                      fill="#F1EBDD"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {node.name.length > 16 ? node.name.slice(0, 15) + '…' : node.name}
                    </text>
                    <text
                      y="44"
                      textAnchor="middle"
                      fill="#AAA395"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {node.type.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="text-[10px] text-[#AAA395] font-mono mt-2">
              Click any node to inspect account details • Click transfer amounts to inspect transaction
            </div>
          </div>

          {/* Details Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-4 rounded-xl bg-[#2B2822] border border-[#403B32] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#D46D68]/20 border border-[#D46D68]/40 text-[#D46D68] font-bold">
                  {activePattern.severity} SEVERITY
                </span>
                <span className="text-xs font-mono text-[#D8C5A3]">
                  Confidence: {activePattern.confidenceScore}%
                </span>
              </div>

              <h4 className="text-base font-bold text-[#F1EBDD] leading-snug">
                {activePattern.title}
              </h4>

              <p className="text-xs text-[#AAA395] leading-relaxed">
                {activePattern.description}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#403B32]">
                <div className="p-2.5 rounded bg-[#211F1B] border border-[#403B32]/60">
                  <div className="text-[10px] font-mono text-[#AAA395]">TOTAL CAPITAL FLOW</div>
                  <div className="text-sm font-bold font-mono text-[#F1EBDD] mt-0.5">
                    ₹{activePattern.totalAmount.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="p-2.5 rounded bg-[#211F1B] border border-[#403B32]/60">
                  <div className="text-[10px] font-mono text-[#AAA395]">ELAPSED TRANSIT</div>
                  <div className="text-sm font-bold font-mono text-[#D8C5A3] mt-0.5">
                    {activePattern.timeSpanMinutes} Minutes
                  </div>
                </div>
              </div>

              {/* Evidence Pill */}
              <div className="p-3 rounded bg-[#171715] border border-[#403B32] text-xs text-[#AAA395] space-y-1">
                <div className="font-semibold text-[#F1EBDD] text-[11px] font-mono uppercase text-[#D8C5A3]">
                  Detection Evidence:
                </div>
                <p className="text-[11px] font-mono leading-relaxed">{activePattern.evidence}</p>
              </div>

              {/* Node Inspector if clicked */}
              {selectedNode && (
                <div className="p-3 rounded-lg bg-[#353128] border border-[#D8C5A3]/50 text-xs text-[#F1EBDD] animate-in fade-in">
                  <div className="font-bold text-[#D8C5A3]">Selected Account: {selectedNode}</div>
                  <div className="text-[11px] text-[#AAA395] mt-1">
                    {accounts.find(a => a.id === selectedNode)?.displayName} • Registered Hub: {accounts.find(a => a.id === selectedNode)?.homeLocation}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center text-[#AAA395] text-sm">
          No AML patterns detected yet. Click "Run AML Scan" above to scan dataset.
        </div>
      )}
    </div>
  );
};

