export type PaymentMethod = 'UPI' | 'NEFT' | 'IMPS' | 'RTGS' | 'WALLET' | 'CARD';
export type Channel = 'mobile' | 'web' | 'api' | 'branch';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'reversed';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RecommendedAction = 'APPROVE' | 'MONITOR' | 'REVIEW' | 'ESCALATE' | 'FREEZE';

export interface RiskSignal {
  id: string;
  name: string;
  category: 'AMOUNT' | 'VELOCITY' | 'BENEFICIARY' | 'LOCATION' | 'FLOW' | 'REPEATED_FAILURES' | 'AML';
  severity: RiskLevel;
  points: number;
  explanation: string;
  evidence: string;
}

export interface RiskAnalysisResult {
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  triggeredSignals: RiskSignal[];
  explanation: string;
  evidenceSummary: string;
  recommendedAction: RecommendedAction;
  timestamp: string;
}

export interface Transaction {
  id: string;
  timestamp: string; // ISO string
  senderAccountId: string;
  senderName: string;
  receiverAccountId: string;
  receiverName: string;
  amount: number;
  currency: string; // e.g. "INR"
  paymentMethod: PaymentMethod;
  channel: Channel;
  senderLocation?: string;
  receiverLocation?: string;
  deviceId?: string;
  status: TransactionStatus;
  scenarioTag?: string;
  riskScore?: number;
  riskLevel?: RiskLevel;
  analysisResult?: RiskAnalysisResult;
}

export interface Account {
  id: string;
  displayName: string;
  accountType: 'individual' | 'business' | 'merchant' | 'mule' | 'foreign';
  homeLocation: string;
  riskRating: 'LOW' | 'MEDIUM' | 'HIGH';
  baselineAverageAmount: number;
  baselineMaxAmount: number;
  createdAt: string;
  isDemo?: boolean;
}

export type AMLPatternType = 'STRUCTURING' | 'CIRCULAR_FLOW' | 'RAPID_PASS_THROUGH';

export interface AMLPattern {
  id: string;
  type: AMLPatternType;
  severity: RiskLevel;
  title: string;
  description: string;
  involvedAccounts: string[];
  involvedTransactions: string[];
  totalAmount: number;
  timeSpanMinutes: number;
  confidenceScore: number;
  evidence: string;
  detectedAt: string;
  flowPath?: string[]; // e.g. ['ACC-101', 'ACC-108', 'ACC-109', 'ACC-101']
}

export type AlertStatus = 'NEW' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'ESCALATED' | 'RESOLVED' | 'DISMISSED';

export interface Alert {
  id: string;
  createdAt: string;
  type: string;
  severity: RiskLevel;
  riskScore: number;
  title: string;
  explanation: string;
  transactionIds: string[];
  accountIds: string[];
  status: AlertStatus;
  caseId?: string;
  resolutionNote?: string;
}

export type CaseStatus = 'OPEN' | 'INVESTIGATING' | 'ESCALATED' | 'CLOSED';
export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CaseNote {
  id: string;
  caseId: string;
  author: string;
  body: string;
  createdAt: string;
}

export interface InvestigationCase {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  priority: CasePriority;
  status: CaseStatus;
  riskScore: number;
  alertIds: string[];
  transactionIds: string[];
  accountIds: string[];
  summary: string;
  notes: CaseNote[];
  resolutionNote?: string;
}

export interface DashboardMetrics {
  totalTransactions: number;
  flaggedTransactions: number;
  criticalAlerts: number;
  highAlerts: number;
  accountsUnderReview: number;
  flaggedValue: number;
  totalVolumeValue: number;
  avgRiskScore: number;
  lastAnalysisTimestamp: string;
}

