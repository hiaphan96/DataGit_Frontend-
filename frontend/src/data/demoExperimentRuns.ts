import type { ExperimentRun } from '../types/experimentRun';

// Same demo dataset lineage as Stages 3 & 4 (reviews_dataset, V01 → V02 → V03).
export const demoExperimentRuns: ExperimentRun[] = [
  {
    id: 'EXP-007',
    datasetName: 'reviews_dataset',
    datasetVersion: 'V02',
    model: 'random_forest',
    parameters: { n_estimators: 100, max_depth: 10, random_state: 42 },
    metrics: { accuracy: null, precision: null, recall: null, f1Score: 0.912 },
    status: 'running',
    createdAt: '1h ago',
    progress: 78,
    eta: '12 min',
  },
  {
    id: 'EXP-006',
    datasetName: 'reviews_dataset',
    datasetVersion: 'V02',
    model: 'transformers',
    parameters: {},
    metrics: { accuracy: 0.918, precision: 0.902, recall: 0.897, f1Score: 0.905 },
    status: 'completed',
    createdAt: '2d ago',
  },
  {
    id: 'EXP-005',
    datasetName: 'reviews_dataset',
    datasetVersion: 'V01',
    model: 'random_forest',
    parameters: { n_estimators: 100, max_depth: 8, random_state: 42 },
    metrics: { accuracy: 0.891, precision: 0.878, recall: 0.869, f1Score: 0.884 },
    status: 'completed',
    createdAt: '3d ago',
  },
  {
    id: 'EXP-004',
    datasetName: 'reviews_dataset',
    datasetVersion: 'V01',
    model: 'logistic_regression',
    parameters: { random_state: 42 },
    metrics: { accuracy: 0.87, precision: 0.858, recall: 0.849, f1Score: 0.862 },
    status: 'completed',
    createdAt: '3d ago',
  },
];