// --- Stage 4: dataset preparation / preprocessing types ---

export type PreprocessingTabId = 'cleaning' | 'transformations' | 'encoding' | 'scaling' | 'advanced';

export interface PreprocessingTabConfig {
  id: PreprocessingTabId;
  label: string;
}

export const PREPROCESSING_TABS: PreprocessingTabConfig[] = [
  { id: 'cleaning', label: 'cleaning' },
  { id: 'transformations', label: 'transformations' },
  { id: 'encoding', label: 'encoding' },
  { id: 'scaling', label: 'scaling' },
  { id: 'advanced', label: 'advanced' },
];

export type CleaningStepId =
  | 'handle_missing_values'
  | 'remove_duplicates'
  | 'remove_empty_rows'
  | 'lowercase_text'
  | 'remove_special_characters'
  | 'trim_white_spaces';

export type CleaningControlType = 'toggle' | 'select';

export interface CleaningStepOption {
  value: string;
  label: string;
}

export interface CleaningStepConfig {
  id: CleaningStepId;
  icon: string;
  title: string;
  description: string;
  controlType: CleaningControlType;
  enabled: boolean;
  selectValue?: string;
  selectOptions?: CleaningStepOption[];
}

export type MetricChangeDirection = 'positive' | 'negative' | 'neutral';

export interface BeforeAfterMetric {
  id: string;
  label: string;
  before: string;
  after: string;
  changeLabel: string;
  direction: MetricChangeDirection;
}

export type WarningSeverity = 'warning' | 'info';

export interface DataWarning {
  id: string;
  message: string;
  severity: WarningSeverity;
}

export interface AiSuggestion {
  message: string;
}

export interface DataPreviewColumn {
  key: string;
  label: string;
}

export type DataPreviewRow = Record<string, string | number>;

export interface DataPreview {
  columns: DataPreviewColumn[];
  rows: DataPreviewRow[];
  totalRows: number;
}

export type ExpandableSectionId = 'feature_preparation' | 'output_options';

export interface ExpandableSectionConfig {
  id: ExpandableSectionId;
  title: string;
  description: string;
}

export type PreprocessingActionStatus = 'idle' | 'loading' | 'success' | 'error';

export interface PreprocessingConfig {
  datasetId: string;
  sourceVersionId: string;
  cleaningSteps: CleaningStepConfig[];
}

export interface ProcessedDataSample {
  columns: DataPreviewColumn[];
  rows: DataPreviewRow[];
}