export type ValidationCheckStatus = 'pending' | 'running' | 'success' | 'warning' | 'error';

export interface ValidationCheckResult {
  id: string;
  name: string;
  status: ValidationCheckStatus;
  message?: string;
}

export type OverallValidationStatus = 'idle' | 'running' | 'success' | 'warning' | 'error';

export const INITIAL_VALIDATION_CHECKS: ValidationCheckResult[] = [
  { id: 'file_format', name: 'file format', status: 'pending' },
  { id: 'file_size', name: 'file size', status: 'pending' },
  { id: 'schema', name: 'basic schema check', status: 'pending' },
  { id: 'data_quality', name: 'data quality scan', status: 'pending' },
  { id: 'duplicates', name: 'duplicate check', status: 'pending' },
];