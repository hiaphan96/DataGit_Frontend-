import type { ComparisonState } from '../types/comparison';

export const demoComparisonStates: Record<string, ComparisonState> = {
  'EXP-001': {
    experimentId: 'EXP-001',
    datasetVersion: 'V01',
    model: 'RandomForest',
    gitCommit: 'abc123f',
    preprocessing: 'P01',
    metrics: { accuracy: 0.912, precision: 0.908, recall: 0.897, f1: 0.901, auc: 0.945 },
  },
  'EXP-002': {
    experimentId: 'EXP-002',
    datasetVersion: 'V02',
    model: 'RandomForest',
    gitCommit: 'def456a',
    preprocessing: 'P02',
    metrics: { accuracy: 0.842, precision: 0.811, recall: 0.762, f1: 0.824, auc: 0.889 },
  },
};

export const COMPARABLE_STATE_IDS = ['EXP-001', 'EXP-002'];