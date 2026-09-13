import type { EvaluationData } from '../types/evaluation';

// Continues the same demo lineage: EXP-006 (current) vs EXP-005 (previous),
// matching the experiment IDs already seeded in demoExperimentRuns.ts.
export const demoEvaluationData: Record<string, EvaluationData> = {
  'EXP-006': {
    experimentId: 'EXP-006',
    previousExperimentId: 'EXP-005',
    datasetName: 'reviews_dataset',
    datasetVersion: 'V02',
    model: 'Transformers',
    status: 'completed',
    metrics: {
      accuracy: 0.912,
      precision: 0.908,
      recall: 0.897,
      f1Score: 0.901,
      aucRoc: 0.945,
    },
    previousMetrics: {
      accuracy: 0.892,
      precision: 0.892,
      recall: 0.876,
      f1Score: 0.884,
      aucRoc: 0.934,
    },
    confusionMatrix: {
      truePositive: 450,
      falseNegative: 50,
      falsePositive: 40,
      trueNegative: 460,
    },
    rocPoints: [
      { fpr: 0, tpr: 0 },
      { fpr: 0.05, tpr: 0.42 },
      { fpr: 0.12, tpr: 0.68 },
      { fpr: 0.25, tpr: 0.85 },
      { fpr: 0.45, tpr: 0.93 },
      { fpr: 0.7, tpr: 0.97 },
      { fpr: 1, tpr: 1 },
    ],
    perClassMetrics: [
      { className: 'Positive', precision: 0.91, recall: 0.89, f1Score: 0.9 },
      { className: 'Negative', precision: 0.9, recall: 0.91, f1Score: 0.91 },
    ],
  },
  'EXP-005': {
    experimentId: 'EXP-005',
    previousExperimentId: 'EXP-004',
    datasetName: 'reviews_dataset',
    datasetVersion: 'V01',
    model: 'Random Forest',
    status: 'completed',
    metrics: {
      accuracy: 0.892,
      precision: 0.892,
      recall: 0.876,
      f1Score: 0.884,
      aucRoc: 0.934,
    },
    previousMetrics: {
      accuracy: 0.874,
      precision: 0.869,
      recall: 0.852,
      f1Score: 0.862,
      aucRoc: 0.912,
    },
    confusionMatrix: {
      truePositive: 435,
      falseNegative: 65,
      falsePositive: 52,
      trueNegative: 448,
    },
    rocPoints: [
      { fpr: 0, tpr: 0 },
      { fpr: 0.06, tpr: 0.38 },
      { fpr: 0.15, tpr: 0.6 },
      { fpr: 0.3, tpr: 0.8 },
      { fpr: 0.5, tpr: 0.9 },
      { fpr: 0.72, tpr: 0.96 },
      { fpr: 1, tpr: 1 },
    ],
    perClassMetrics: [
      { className: 'Positive', precision: 0.89, recall: 0.87, f1Score: 0.88 },
      { className: 'Negative', precision: 0.89, recall: 0.9, f1Score: 0.89 },
    ],
  },
};

// Only completed experiments are evaluable — matches EXP-006/005/004 from demoExperimentRuns.ts.
// EXP-007 (running) and any future in-progress runs are intentionally excluded.
export const EVALUABLE_EXPERIMENT_IDS = ['EXP-006', 'EXP-005'];