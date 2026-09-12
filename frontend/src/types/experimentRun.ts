// --- Stage 5: experiments / ML runs ---
// Kept separate from types/experiment.ts (ExperimentEntry) which is a thinner
// type possibly used elsewhere. This is the richer shape for the Experiments page.

export type ExperimentStatus = 'running' | 'completed' | 'failed';

export type ModelType = 'logistic_regression' | 'random_forest' | 'decision_tree' | 'transformers';

export const MODEL_OPTIONS: { value: ModelType; label: string }[] = [
  { value: 'logistic_regression', label: 'Logistic Regression' },
  { value: 'random_forest', label: 'Random Forest' },
  { value: 'decision_tree', label: 'Decision Tree' },
];

export const MODEL_LABELS: Record<ModelType, string> = {
  logistic_regression: 'Logistic Regression',
  random_forest: 'Random Forest',
  decision_tree: 'Decision Tree',
  transformers: 'Transformers',
};

export interface ExperimentParameters {
  n_estimators?: number;
  max_depth?: number;
  random_state?: number;
}

export interface ExperimentMetrics {
  accuracy: number | null;
  precision: number | null;
  recall: number | null;
  f1Score: number | null;
}

export interface ExperimentRun {
  id: string;
  datasetName: string;
  datasetVersion: string;
  model: ModelType;
  parameters: ExperimentParameters;
  metrics: ExperimentMetrics;
  status: ExperimentStatus;
  createdAt: string;
  progress?: number;
  eta?: string;
}

export interface NewExperimentFormValues {
  datasetName: string;
  datasetVersion: string;
  model: ModelType;
  parameters: ExperimentParameters;
}

export const INITIAL_EXPERIMENT_FORM: NewExperimentFormValues = {
  datasetName: '',
  datasetVersion: 'V03',
  model: 'random_forest',
  parameters: {
    n_estimators: 100,
    max_depth: 10,
    random_state: 42,
  },
};

export function formatMetric(value: number | null): string {
  return value == null ? '—' : value.toFixed(3);
}