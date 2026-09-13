import { useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Project } from '../types/project';
import type { DatasetSummary } from '../types/dataset';
import type { ActivityItem, MetricsSummary } from '../types/dashboard';

export interface DashboardData {
  project: Project | null;
  datasets: DatasetSummary[];
  metrics: MetricsSummary | null;
  activity: ActivityItem[];
  isLoading: boolean;
}

export function useDashboardData(): DashboardData {
  const [project, setProject] = useState<Project | null>(null);
  const [datasets, setDatasets] = useState<DatasetSummary[]>([]);
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

Promise.all([
  api.getProject(),
  api.getDatasets(),
  api.getMetrics(),
  api.getActivity(),
])
  .then(([projectRes, datasetsRes, metricsRes, activityRes]) => {
    if (cancelled) return;

    setProject(projectRes);
    setDatasets(datasetsRes);
    setMetrics(metricsRes);
    setActivity(activityRes);
  })
  .catch((error) => {
    console.error('Failed to load dashboard data:', error);
  })
  .finally(() => {
    if (!cancelled) {
      setIsLoading(false);
    }
  });

    return () => {
      cancelled = true;
    };
  }, []);

  return { project, datasets, metrics, activity, isLoading };
}