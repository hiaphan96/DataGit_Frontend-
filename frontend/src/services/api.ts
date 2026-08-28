import { demoProject } from '../data/demoProject';
import { demoDatasets } from '../data/demoDatasets';
import { demoActivity } from '../data/demoActivity';
import { demoMetrics } from '../data/demoMetrics';
import { demoVersions } from '../data/demoVersions';
import { demoExperiments } from '../data/demoExperiments';
import { demoDatasetColumns } from '../data/demoDatasetColumns';
import { demoVersionDetails, demoChangeSummaries, demoComparisonResults } from '../data/demoVersionDetails';
import {
  demoCleaningSteps,
  demoDataPreview,
  demoBeforeAfterMetrics,
  demoWarnings,
  demoAiSuggestion,
} from '../data/demoPreprocessing';
import type { Project } from '../types/project';
import type { DatasetSummary, DatasetFileKind, DatasetUploadForm } from '../types/dataset';
import type { ActivityItem, MetricsSummary } from '../types/dashboard';
import type { VersionEntry, VersionDetail, VersionChangeSummary, VersionComparisonResult } from '../types/version';
import type { ExperimentEntry } from '../types/experiment';
import type { ValidationCheckResult } from '../types/validation';
import type {
  CleaningStepConfig,
  BeforeAfterMetric,
  DataWarning,
  AiSuggestion,
  DataPreview,
  ProcessedDataSample,
} from '../types/preprocessing';

export interface DatasetFileInspection {
  rows: number;
  columns: number;
  detectedColumns: string[];
}

function isSupportedExtension(fileName: string): boolean {
  const ext = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
  return ['.csv', '.json', '.txt', '.parquet'].includes(ext);
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Data-access facade for the DATAGIT frontend.
 *
 * Every function here currently resolves mock data instantly (or with a
 * short simulated delay for Stage 2's upload/validation flow, Stage 3's
 * comparison flow, and Stage 4's preprocessing flow). Nothing else in
 * the app should import from `src/data/` directly — swap the bodies of
 * these functions for real fetch() calls to the FastAPI backend later,
 * and no UI component or hook needs to change.
 */
export const api = {
  getProject(): Promise<Project> {
    return Promise.resolve(demoProject);
  },
  getDatasets(): Promise<DatasetSummary[]> {
    return Promise.resolve(demoDatasets);
  },
  getMetrics(): Promise<MetricsSummary> {
    return Promise.resolve(demoMetrics);
  },
  getActivity(): Promise<ActivityItem[]> {
    return Promise.resolve(demoActivity);
  },
  getVersions(): Promise<VersionEntry[]> {
    return Promise.resolve(demoVersions);
  },
  getExperiments(): Promise<ExperimentEntry[]> {
    return Promise.resolve(demoExperiments);
  },

  // --- Stage 2: dataset upload + validation (mock) ---

  async inspectDatasetFile(
    file: File,
    _kind: DatasetFileKind,
    onProgress?: (pct: number) => void,
  ): Promise<DatasetFileInspection> {
    if (!isSupportedExtension(file.name)) {
      throw new Error('unsupported file format');
    }
    for (const pct of [20, 45, 70, 90, 100]) {
      await delay(80);
      onProgress?.(pct);
    }
    const seed = file.size % 5000;
    const rows = 8000 + seed;
    const columns = 4 + (file.size % 20);
    return {
      rows,
      columns,
      detectedColumns: demoDatasetColumns.slice(0, Math.min(columns, demoDatasetColumns.length)),
    };
  },

  async validateFileFormat(form: DatasetUploadForm): Promise<ValidationCheckResult> {
    await delay(300);
    const ok = form.trainFile.status !== 'error' && form.testFile.status !== 'error';
    return {
      id: 'file_format',
      name: 'file format',
      status: ok ? 'success' : 'error',
      message: ok ? 'ok' : 'unsupported file format',
    };
  },

  async validateFileSize(form: DatasetUploadForm): Promise<ValidationCheckResult> {
    await delay(250);
    const tooLarge = form.trainFile.sizeBytes > 500 * 1024 * 1024;
    return {
      id: 'file_size',
      name: 'file size',
      status: tooLarge ? 'error' : 'success',
      message: tooLarge ? 'file exceeds 500 MB limit' : 'ok',
    };
  },

  async validateSchema(form: DatasetUploadForm): Promise<ValidationCheckResult> {
    await delay(500);
    const hasTarget = form.textField.length > 0 && form.trainFile.detectedColumns.includes(form.textField);
    return {
      id: 'schema',
      name: 'basic schema check',
      status: hasTarget ? 'success' : 'error',
      message: hasTarget ? 'ok' : 'required target column not found',
    };
  },

  async validateDataQuality(form: DatasetUploadForm): Promise<ValidationCheckResult> {
    await delay(600);
    const rows = form.trainFile.rows ?? 0;
    const flagged = rows % 7 === 0;
    return {
      id: 'data_quality',
      name: 'data quality scan',
      status: flagged ? 'warning' : 'success',
      message: flagged ? 'missing values detected' : 'ok',
    };
  },

  async checkDuplicates(form: DatasetUploadForm): Promise<ValidationCheckResult> {
    await delay(400);
    const rows = form.trainFile.rows ?? 0;
    const flagged = rows % 11 === 0;
    return {
      id: 'duplicates',
      name: 'duplicate check',
      status: flagged ? 'warning' : 'success',
      message: flagged ? 'duplicate rows detected' : 'ok',
    };
  },

  // --- Stage 3: version management (mock) ---

  async getVersionDetails(): Promise<VersionDetail[]> {
    await delay(200);
    return demoVersionDetails;
  },

  async getChangeSummary(versionId: string): Promise<VersionChangeSummary | null> {
    await delay(150);
    return demoChangeSummaries.find((c) => c.versionId === versionId) ?? null;
  },

  async runVersionComparison(baselineId: string, currentId: string): Promise<VersionComparisonResult> {
    await delay(600);
    const key = `${baselineId}_${currentId}`;
    const result = demoComparisonResults[key];
    if (result) return result;
    // fallback for any pairing not pre-seeded in demoComparisonResults
    return {
      baselineId,
      currentId,
      rowsDelta: '—',
      missingValuesDelta: '—',
      duplicatesDelta: '—',
      schemaNote: 'no comparison data available',
      overallStatus: 'warning',
    };
  },

  async createCheckpoint(): Promise<VersionDetail> {
    await delay(500);
    const latest = demoVersionDetails[demoVersionDetails.length - 1];
    return {
      ...latest,
      id: `v-mock-${Date.now()}`,
      version: 'V04',
      parentVersionId: latest.id,
      checkpointId: 'DG-CHK-004',
      createdAt: 'just now',
      isCurrent: true,
    };
  },

  // --- Stage 4: dataset preparation / preprocessing (mock) ---

  async getPreprocessingConfig(): Promise<CleaningStepConfig[]> {
    await delay(200);
    return demoCleaningSteps.map((step) => ({ ...step }));
  },

  async updateCleaningStep(
    _stepId: CleaningStepConfig['id'],
    _patch: Partial<Pick<CleaningStepConfig, 'enabled' | 'selectValue'>>,
  ): Promise<{ success: boolean }> {
    await delay(100);
    return { success: true };
  },

  async getDataPreview(): Promise<DataPreview> {
    await delay(250);
    return demoDataPreview;
  },

  async getBeforeAfterSummary(): Promise<BeforeAfterMetric[]> {
    await delay(300);
    return demoBeforeAfterMetrics;
  },

  async getWarnings(): Promise<DataWarning[]> {
    await delay(200);
    return demoWarnings;
  },

  async getAiSuggestion(): Promise<AiSuggestion> {
    await delay(200);
    return demoAiSuggestion;
  },

  async previewProcessedData(): Promise<ProcessedDataSample> {
    await delay(600);
    return {
      columns: demoDataPreview.columns,
      rows: demoDataPreview.rows.map((row) => ({
        ...row,
        review_text: String(row.review_text).toLowerCase().trim(),
      })),
    };
  },

  async createVersionFromPreprocessing(): Promise<VersionDetail> {
    await delay(700);
    const latest = demoVersionDetails[demoVersionDetails.length - 1];
    const nextNumber = demoVersionDetails.length + 1;
    return {
      ...latest,
      id: `v-mock-${Date.now()}`,
      version: `V0${nextNumber}`,
      parentVersionId: latest.id,
      checkpointId: `DG-CHK-00${nextNumber}`,
      createdAt: 'just now',
      isCurrent: true,
    };
  },

  getNextVersionLabel(): string {
    const nextNumber = demoVersionDetails.length + 1;
    return `V0${nextNumber}`;
  },
};