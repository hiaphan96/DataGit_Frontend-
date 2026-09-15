// Source: components.schemas in openapi.json

export interface PreparationSelectionRequest {
  filename: string;
  operations?: string[];
}

export interface PreparationSelectionResponse {
  filename: string;
  selected_operations: string[];
  operation_count: number;
  status: string;
  message: string;
}

export interface PreparationConfigurationRequest {
  filename: string;
  operations: Record<string, unknown>[];
}

export interface PreparationConfigurationResponse {
  filename: string;
  operations: Record<string, unknown>[];
  operation_count: number;
  status: string;
  message: string;
}

export interface PreparationMissingValuesRequest {
  filename: string;
  columns: Record<string, string>;
  constant_values?: Record<string, unknown>;
}

export interface PreparationProceedRequest {
  filename: string;
  output_format?: string;
  operations: Record<string, unknown>[];
}

export interface PreparationProcessRequest {
  filename: string;
  output_format?: string;
  operations: Record<string, unknown>[];
}

export interface PreparationReportRequest {
  filename: string;
  output_file: string;
  operations: Record<string, unknown>[];
}

// Shape confirmed from live curl of /prepared and /reports
export interface PreparedDatasetsResponse {
  files: Record<string, unknown>;   // empty {} on a fresh backend
}

export interface PreparationReportsResponse {
  files: Record<string, unknown>;
}

// Shape confirmed from live curl of /operations (outer wrapper only)
export interface PreparationOperationsResponse {
  status: string;
  categories: Record<string, PreparationOperation[]>;
}

// NOTE: field names inside PreparationOperation are NOT yet confirmed.
// The PowerShell output collapsed them. See "What I still need" below.
export interface PreparationOperation {
  [key: string]: unknown;   // temporary index signature — see note
}

// Reuse existing VersionResponse from your version types
export interface VersionCreateRequest {
  description: string;
}

export interface DatasetProfileColumn {
  name: string;
  data_type: string;
  missing: number;
  unique: number;
}

export interface DatasetProfile {
  filename: string;
  file_type: string;
  rows: number;
  columns: number;
  column_names: string[];
  column_information: DatasetProfileColumn[];
  missing_values: Record<string, number>;
  missing_value_count: number;
  duplicate_rows: number;
  numeric_columns: string[];
  categorical_columns: string[];
}