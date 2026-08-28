import type { MetricsSummary } from '../types/dashboard';

export const demoMetrics: MetricsSummary = {
  totalDatasets: 3,
  totalVersions: 24,
  totalExperiments: 18,
  last7Days: [
    { label: 'improved', count: 2, direction: 'up' },
    { label: 'no change', count: 1, direction: 'flat' },
    { label: 'regressed', count: 1, direction: 'down' },
  ],
};