import type { DatasetSummary } from '../types/dataset';

export const demoDatasets: DatasetSummary[] = [
  {
    id: 'ds-reviews',
    name: 'reviews_dataset',
    task: 'sentiment classification',
    version: 'V03',
    lastExperiment: 'EXP-018',
    status: 'healthy',
  },
  {
    id: 'ds-comments',
    name: 'comments_dataset',
    task: 'sentiment classification',
    version: 'V07',
    lastExperiment: 'EXP-017',
    status: 'warning',
  },
  {
    id: 'ds-news',
    name: 'news_dataset',
    task: 'text classification',
    version: 'V05',
    lastExperiment: 'EXP-016',
    status: 'regression',
  },
];