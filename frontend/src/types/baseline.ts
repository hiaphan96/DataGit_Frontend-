// --- Stage 7: baselines ---

export interface Baseline {
  id: string;
  name: string;
  experimentId: string;
  model: string;
  datasetVersion: string;
  metricName: string;
  metricValue: number;
  createdAt: string;
}

export interface NewBaselineFormValues {
  experimentId: string;
  name: string;
}