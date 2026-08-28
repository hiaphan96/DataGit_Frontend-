export type ActivityType = 'dataset' | 'checkpoint' | 'experiment' | 'git' | 'analysis';

export interface ActivityItem {
  id: string;
  timestamp: string;
  message: string;
  type: ActivityType;
}

export interface MetricTrendRow {
  label: string;
  count: number;
  direction: 'up' | 'down' | 'flat';
}

export interface MetricsSummary {
  totalDatasets: number;
  totalVersions: number;
  totalExperiments: number;
  last7Days: MetricTrendRow[];
}