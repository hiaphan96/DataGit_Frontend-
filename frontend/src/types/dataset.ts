export type DatasetHealth = 'healthy' | 'warning' | 'regression';

export interface DatasetSummary {
  id: string;
  name: string;
  task: string;
  version: string;
  lastExperiment: string;
  status: DatasetHealth;
}

// --- Stage 2: dataset upload form types (appended, existing types above untouched) ---

export type TaskType =
  | 'text_classification'
  | 'sentiment_analysis'
  | 'regression'
  | 'binary_classification'
  | 'multiclass_classification'
  | 'custom';

export const TASK_TYPE_OPTIONS: { value: TaskType; label: string }[] = [
  { value: 'text_classification', label: 'text classification' },
  { value: 'sentiment_analysis', label: 'sentiment analysis' },
  { value: 'regression', label: 'regression' },
  { value: 'binary_classification', label: 'binary classification' },
  { value: 'multiclass_classification', label: 'multiclass classification' },
  { value: 'custom', label: 'custom' },
];

export type DatasetFileKind = 'train' | 'test';

export type FileStatus =
  | 'idle'
  | 'uploading'
  | 'uploaded'
  | 'validating'
  | 'valid'
  | 'warning'
  | 'error';

export interface DatasetFileMeta {
  file: File | null;
  fileName: string;
  sizeBytes: number;
  rows: number | null;
  columns: number | null;
  detectedColumns: string[];
  status: FileStatus;
  uploadProgress: number;
  errorMessage: string | null;
}

export const EMPTY_FILE_META: DatasetFileMeta = {
  file: null,
  fileName: '',
  sizeBytes: 0,
  rows: null,
  columns: null,
  detectedColumns: [],
  status: 'idle',
  uploadProgress: 0,
  errorMessage: null,
};

export interface DatasetUploadForm {
  datasetName: string;
  taskType: TaskType;
  textField: string;
  description: string;
  trainFile: DatasetFileMeta;
  testFile: DatasetFileMeta;
}

export const INITIAL_UPLOAD_FORM: DatasetUploadForm = {
  datasetName: '',
  taskType: 'sentiment_analysis',
  textField: '',
  description: '',
  trainFile: { ...EMPTY_FILE_META },
  testFile: { ...EMPTY_FILE_META },
};

export const SUPPORTED_EXTENSIONS = ['.csv', '.json', '.txt', '.parquet'];

export function formatFileSize(bytes: number): string {
  if (!bytes) return '0 MB';
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateDatasetName(name: string): string | null {
  if (!name.trim()) return 'dataset name is required';
  if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    return "dataset name may only contain letters, numbers, '-' and '_'";
  }
  return null;
}