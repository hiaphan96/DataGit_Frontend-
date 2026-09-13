import type { Baseline } from '../types/baseline';

export const demoBaselines: Baseline[] = [
  {
    id: 'BASE-001',
    name: 'Majority Baseline',
    experimentId: 'EXP-001',
    model: 'Dummy Classifier',
    datasetVersion: 'V00',
    metricName: 'F1 Score',
    metricValue: 0.512,
    createdAt: '7 days ago',
  },
  {
    id: 'BASE-002',
    name: 'LR Baseline V01',
    experimentId: 'EXP-004',
    model: 'Logistic Regression',
    datasetVersion: 'V01',
    metricName: 'F1 Score',
    metricValue: 0.662,
    createdAt: '4 days ago',
  },
  {
    id: 'BASE-003',
    name: 'RF Baseline V02',
    experimentId: 'EXP-006',
    model: 'Random Forest',
    datasetVersion: 'V02',
    metricName: 'F1 Score',
    metricValue: 0.745,
    createdAt: '2 days ago',
  },
];