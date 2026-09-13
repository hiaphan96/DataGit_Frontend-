// --- Stage 6: model evaluation ---

export interface EvaluationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  aucRoc: number;
}

export interface MetricComparisonRow {
  key: keyof EvaluationMetrics;
  label: string;
  current: number;
  previous: number;
  percentageChange: number;
}

export type EvaluationStatusType = 'improvement' | 'regression' | 'no_change';

export interface ConfusionMatrixData {
  truePositive: number;
  falseNegative: number;
  falsePositive: number;
  trueNegative: number;
}

export interface RocPoint {
  fpr: number;
  tpr: number;
}

export interface PerClassMetric {
  className: string;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface EvaluationData {
  experimentId: string;
  previousExperimentId: string | null;
  datasetName: string;
  datasetVersion: string;
  model: string;
  status: 'running' | 'completed' | 'failed';
  metrics: EvaluationMetrics;
  previousMetrics: EvaluationMetrics | null;
  confusionMatrix: ConfusionMatrixData;
  rocPoints: RocPoint[];
  perClassMetrics: PerClassMetric[];
}

export const EVALUATION_TABS = [
  { id: 'performance', label: 'performance' },
  { id: 'confusion-matrix', label: 'confusion matrix' },
  { id: 'metrics', label: 'metrics' },
  { id: 'roc-curve', label: 'roc curve' },
] as const;

export type EvaluationTabId = (typeof EVALUATION_TABS)[number]['id'];

export function computeStatus(percentageChange: number): EvaluationStatusType {
  if (percentageChange > 0.5) return 'improvement';
  if (percentageChange < -0.5) return 'regression';
  return 'no_change';
}