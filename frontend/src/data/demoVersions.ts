import type { VersionEntry } from '../types/version';

export const demoVersions: VersionEntry[] = [
  { id: 'v-1', dataset: 'reviews_dataset', version: 'V03', createdAt: '13:42:11' },
  { id: 'v-2', dataset: 'reviews_dataset', version: 'V02', createdAt: 'yesterday' },
  { id: 'v-3', dataset: 'comments_dataset', version: 'V07', createdAt: '1 day ago' },
  { id: 'v-4', dataset: 'news_dataset', version: 'V05', createdAt: '3 days ago' },
];