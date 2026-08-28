import type { ActivityItem } from '../types/dashboard';

export const demoActivity: ActivityItem[] = [
  { id: 'act-1', timestamp: '13:42:11', message: 'checkpoint V03 created', type: 'checkpoint' },
  { id: 'act-2', timestamp: '13:38:04', message: 'experiment EXP-018 completed', type: 'experiment' },
  { id: 'act-3', timestamp: '13:35:29', message: 'dataset analysis completed', type: 'analysis' },
  { id: 'act-4', timestamp: '12:58:44', message: 'Git commit detected', type: 'git' },
  { id: 'act-5', timestamp: '12:54:12', message: 'dataset V02 updated', type: 'dataset' },
];