// Source: openapi.json → components.schemas
// Project, Version, MLRun types. Field names match the FastAPI schema exactly.

export interface ProjectResponse {
  id: number;
  name: string;
  path: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface VersionResponse {
  id: number;
  project_id: number;
  version_number: number;
  git_commit: string;
  dvc_state: Record<string, unknown> | null;
  description: string | null;
  ml_run_id: number | null;
  created_at: string;
}

export interface MLRunResponse {
  id: number;
  project_id: number;
  git_commit: string;
  dvc_state: Record<string, unknown> | null;
  model_name: string;
  features: string[] | null;
  parameters: Record<string, unknown> | null;
  metrics: Record<string, unknown> | null;
  evaluation: Record<string, unknown> | null;
  created_at: string;
}

// Aggregate view model passed to the report sections.
// Every field is either backend-provided or explicitly null — never fabricated.
export interface VersionReportData {
  project: ProjectResponse;
  version: VersionResponse;
  mlRun: MLRunResponse | null;
}

// The report document's logical sections, in display order.
// Used for the in-page section navigation.
export type ReportSectionId =
  | 'executive-summary'
  | 'dataset-snapshot'
  | 'data-quality'
  | 'preparation-history'
  | 'training-evaluation'
  | 'provenance'
  | 'ai-insights'
  | 'recommendations';

export interface ReportSectionDef {
  id: ReportSectionId;
  label: string;
  /** whether to render this section when no supporting evidence exists */
  renderWhenEmpty: boolean;
}

export const REPORT_SECTIONS: ReportSectionDef[] = [
  { id: 'executive-summary', label: 'executive summary', renderWhenEmpty: true },
  { id: 'dataset-snapshot', label: 'dataset snapshot', renderWhenEmpty: true },
  { id: 'data-quality', label: 'data quality', renderWhenEmpty: true },
  { id: 'preparation-history', label: 'preparation history', renderWhenEmpty: true },
  { id: 'training-evaluation', label: 'training / evaluation', renderWhenEmpty: false },
  { id: 'provenance', label: 'git / dvc provenance', renderWhenEmpty: true },
  { id: 'ai-insights', label: 'ai insights', renderWhenEmpty: true },
  { id: 'recommendations', label: 'recommendations', renderWhenEmpty: true },
];