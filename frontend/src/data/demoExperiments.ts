import type { ExperimentEntry } from '../types/experiment';

export const demoExperiments: ExperimentEntry[] = [
  {
    id: 'EXP-018',
    dataset: 'reviews_dataset',
    metricLabel: 'F1',
    metricValue: '91.12%',
    result: 'improvement',
    timestamp: '13:38:04',
  },
  {
    id: 'EXP-017',
    dataset: 'comments_dataset',
    metricLabel: 'F1',
    metricValue: '78.40%',
    result: 'neutral',
    timestamp: '1 day ago',
  },
  {
    id: 'EXP-016',
    dataset: 'news_dataset',
    metricLabel: 'F1',
    metricValue: '62.45%',
    result: 'regression',
    timestamp: '3 days ago',
  },
];