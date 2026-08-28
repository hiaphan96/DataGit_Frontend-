export type ExperimentResult = 'improvement' | 'regression' | 'neutral';

export interface ExperimentEntry {
  id: string;
  dataset: string;
  metricLabel: string;
  metricValue: string;
  result: ExperimentResult;
  timestamp: string;
}