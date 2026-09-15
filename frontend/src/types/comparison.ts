// --- Compare: ML state comparison ---

export type ComparisonImpact = 'improvement' | 'regression' | 'no_change';
export type ComparisonValidity = 'high' | 'medium' | 'low';
export type RecommendationLevel = 'review' | 'approve' | 'investigate';
export type ChangeStatus = 'no_change' | 'changed' | 'warning';

export interface ComparisonState {
  experimentId: string;
  datasetVersion: string;
  model: string;
  gitCommit: string;
  preprocessing: string;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    auc: number;
  };
}

export interface ComparisonMetricRow {
  key: 'accuracy' | 'precision' | 'recall' | 'f1' | 'auc';
  label: string;
  baseline: number;
  current: number;
  delta: number;
  percentageChange: number;
  isPrimary?: boolean;
}

export interface DataChangeRow {
  label: string;
  baseline: string;
  current: string;
  delta: string;
  status: ComparisonImpact;
}

export interface ExperimentChangeRow {
  label: string;
  baseline: string;
  current: string;
  status: ChangeStatus;
}

export interface EvidenceItem {
  kind: 'observed' | 'likely' | 'unknown';
  text: string;
}

export interface EvidenceGroup {
  title: string;
  items: EvidenceItem[];
}

export interface RecommendationData {
  level: RecommendationLevel;
  title: string;
  reason: string;
  confidence: number;
  possibleActions: string[];
}

export interface ComparisonResult {
  baseline: ComparisonState;
  current: ComparisonState;
  overallImpact: ComparisonImpact;
  primaryMetricDeltaLabel: string;
  validity: ComparisonValidity;
  validityNote: string;
  metrics: ComparisonMetricRow[];
  dataChanges: DataChangeRow[];
  experimentChanges: ExperimentChangeRow[];
  evidence: EvidenceGroup[];
  recommendation: RecommendationData;
  changesDetectedCount: number;
}

export const COMPARE_TABS = [
  { id: 'overview', label: 'overview' },
  { id: 'data-changes', label: 'data changes' },
  { id: 'experiment-changes', label: 'experiment changes' },
  { id: 'metric-changes', label: 'metric changes' },
  { id: 'evidence', label: 'evidence' },
] as const;

export type CompareTabId = (typeof COMPARE_TABS)[number]['id'];