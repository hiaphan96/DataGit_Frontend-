// Source: openapi.json → components.schemas.VersionComparisonResponse,
// MLRunComparison, PerformanceComparison. Field names match the backend exactly.

export interface DVCState {
  is_repository?: boolean;
  status?: string;
  diff?: string;
  tracked_files?: string[];
  [key: string]: unknown;
}

export interface MLRunComparison {
  run_id_before: number | null;
  run_id_after: number | null;
  model_name_before: string | null;
  model_name_after: string | null;
  features_before: string[];
  features_after: string[];
  features_added: string[];
  features_removed: string[];
  parameters_before: Record<string, unknown>;
  parameters_after: Record<string, unknown>;
  parameter_changes: Record<string, unknown>;
  performance_before: Record<string, unknown>;
  performance_after: Record<string, unknown>;
  performance_changes: Record<string, unknown>;
  other_metrics_before: Record<string, unknown>;
  other_metrics_after: Record<string, unknown>;
  other_metric_changes: Record<string, unknown>;
  evaluation: Record<string, unknown> | null;
}

export interface PerformanceComparison {
  metrics_before: Record<string, unknown>;
  metrics_after: Record<string, unknown>;
  metric_changes: Record<string, unknown>;
  performance_changed: boolean;
}

export interface DatasetProfilesPair {
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
}

export interface VersionComparisonResponse {
  project_id: number;
  version_1: number;
  version_2: number;

  git_changed: boolean;
  dvc_changed: boolean;
  code_changed: boolean;

  git_commit_before: string;
  git_commit_after: string;

  dvc_state_before: DVCState | null;
  dvc_state_after: DVCState | null;

  changed_files: string[];
  code_changed_files: string[];
  code_patch: string;

  ml_run_before: Record<string, unknown> | null;
  ml_run_after: Record<string, unknown> | null;
  ml_comparison: MLRunComparison | null;
  performance: PerformanceComparison | null;

  dataset_diff: Record<string, unknown> | null;
  dataset_profiles: DatasetProfilesPair | null;
  dataset_analysis: Record<string, unknown> | null;

  evidence_chain: string[];
  changes: string[];
}

// ---------- Verdict computation ----------

export type CompareVerdict =
  | 'improved'
  | 'mixed'
  | 'regressed'
  | 'unchanged'
  | 'insufficient-evidence';

export const VERDICT_SYMBOLS: Record<CompareVerdict, string> = {
  improved: '✓',
  mixed: '!',
  regressed: '×',
  unchanged: '~',
  'insufficient-evidence': '?',
};

export const VERDICT_LABELS: Record<CompareVerdict, string> = {
  improved: 'IMPROVED',
  mixed: 'MIXED',
  regressed: 'REGRESSED',
  unchanged: 'UNCHANGED',
  'insufficient-evidence': 'INSUFFICIENT EVIDENCE',
};