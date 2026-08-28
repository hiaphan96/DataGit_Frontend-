export interface VersionEntry {
  id: string;
  dataset: string;
  version: string;
  createdAt: string;
}

// --- Stage 3: version management types (appended, VersionEntry above untouched) ---

export type SchemaStatus = 'stable' | 'unstable';
export type DataQualityStatus = 'healthy' | 'warning' | 'critical';
export type DvcStatus = 'connected' | 'mocked';

export interface VersionDetail {
  id: string;
  dataset: string;
  version: string;
  parentVersionId: string | null;
  checkpointId: string;
  createdAt: string;
  isCurrent: boolean;
  rows: number;
  columns: number;
  hash: string;
  missingValuesPct: number;
  duplicates: number;
  schemaStatus: SchemaStatus;
  dataQuality: DataQualityStatus;
  dvcStatus: DvcStatus;
}

export type ChangeDirection = 'positive' | 'negative' | 'neutral';

export interface VersionChangeMetric {
  label: string;
  value: string;
  direction: ChangeDirection;
}

export interface VersionChangeSummary {
  versionId: string;
  previousVersionId: string | null;
  metrics: VersionChangeMetric[];
}

export type ComparisonOverallStatus = 'safe' | 'warning' | 'unsafe';

export interface VersionComparisonResult {
  baselineId: string;
  currentId: string;
  rowsDelta: string;
  missingValuesDelta: string;
  duplicatesDelta: string;
  schemaNote: string;
  overallStatus: ComparisonOverallStatus;
}