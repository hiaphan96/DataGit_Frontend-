import { demoDatasets } from '../data/demoDatasets';
import { demoActivity } from '../data/demoActivity';
import { demoMetrics } from '../data/demoMetrics';
import { demoVersions } from '../data/demoVersions';
import { demoExperiments } from '../data/demoExperiments';
import { demoDatasetColumns } from '../data/demoDatasetColumns';
import { demoVersionDetails, demoChangeSummaries, demoComparisonResults } from '../data/demoVersionDetails';
import { demoBaselines } from '../data/demoBaselines';
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
import type { EvaluationData } from '../types/evaluation';
import type { Baseline, NewBaselineFormValues } from '../types/baseline';
import type {
  CleaningStepConfig,
  BeforeAfterMetric,
  DataWarning,
  AiSuggestion,
  DataPreview,
  ProcessedDataSample,
} from '../types/preprocessing';
import type { ExperimentRun, NewExperimentFormValues, ExperimentParameters} from '../types/experimentRun';

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
 * comparison flow, Stage 4's preprocessing flow, and Stage 5's experiment
 * runs). Nothing else in the app should import from `src/data/` directly —
 * swap the bodies of these functions for real fetch() calls to the
 * FastAPI backend later, and no UI component or hook needs to change.
 */

export const api = {
async getProject(): Promise<Project> {
  const response = await fetch(`${BASE_URL}/projects`);

  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }

  const projects = await response.json();

  if (!projects || projects.length === 0) {
    throw new Error('No projects found');
  }

  const project = projects[0];

  // Convert FastAPI response to the format expected by React
  return {
    id: String(project.id),
    name: project.name,
    status: 'active',

    // Temporary values until backend provides these APIs
    baselineVersion: 'V01',
    baselineExperiment: 'EXP-001',
    lastRunLabel: 'No runs yet',
  };
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

  // --- Stage 5: experiments / ML runs (mock) ---

async getExperimentRuns(): Promise<ExperimentRun[]> {
  const response = await fetchProjectRuns(2);

  if (!response || response.length === 0) {
    return [];
  }

  return response.map((run: any) => ({
    id: `EXP-${String(run.id).padStart(3, '0')}`,

    datasetName: 'Project Dataset',

    datasetVersion: 'V01',

    model: run.model_name,

    parameters: run.parameters,

    metrics: {
      accuracy: run.metrics?.accuracy ?? null,
      precision: run.metrics?.precision ?? null,
      recall: run.metrics?.recall ?? null,
      f1Score: run.metrics?.f1_score ?? null,
    },

    status: 'completed',

    createdAt: new Date(run.created_at).toLocaleString(),

    progress: 100,

    eta: 'Completed',
  }));
},

async createExperimentRun(
  values: NewExperimentFormValues
): Promise<ExperimentRun> {

  const run = await createProjectRun(2, {
    model_name: values.model,

    // Temporary mapping
    features: [values.datasetName],

    parameters: values.parameters,

    // Backend requires metrics
  metrics: {
  accuracy: 0.92,
  precision: 0.91,
  recall: 0.90,
  f1_score: 0.905,

  auc_roc: 0.94,

  true_positive: 450,
  false_negative: 30,
  false_positive: 40,
  true_negative: 480,

  roc_points: [
    { fpr: 0.0, tpr: 0.0 },
    { fpr: 0.1, tpr: 0.55 },
    { fpr: 0.2, tpr: 0.72 },
    { fpr: 0.4, tpr: 0.86 },
    { fpr: 0.6, tpr: 0.94 },
    { fpr: 1.0, tpr: 1.0 },
  ],

  per_class_metrics: [
    {
      className: 'Class 0',
      precision: 0.93,
      recall: 0.90,
      f1Score: 0.915,
    },
    {
      className: 'Class 1',
      precision: 0.89,
      recall: 0.92,
      f1Score: 0.905,
    },
  ],
},
  });

  return {
    id: `EXP-${String(run.id).padStart(3, '0')}`,

    datasetName: values.datasetName,

    datasetVersion: values.datasetVersion,

    model: run.model_name,

    parameters: run.parameters,

    metrics: {
      accuracy: run.metrics?.accuracy ?? null,
      precision: run.metrics?.precision ?? null,
      recall: run.metrics?.recall ?? null,
      f1Score: run.metrics?.f1_score ?? null,
    },

    status: 'completed',

    createdAt: new Date(run.created_at).toLocaleString(),

    progress: 100,

    eta: 'completed',
  };
},

    // --- Stage 6: model evaluation (mock) ---

// --- Stage 6: model evaluation ---

async getEvaluableExperimentIds(): Promise<string[]> {
  const runs = await fetchProjectRuns(2);

  return runs.map(
    (run: any) => `EXP-${String(run.id).padStart(3, '0')}`
  );
},

async getEvaluationData(
  experimentId: string
): Promise<EvaluationData> {

  const runs = await fetchProjectRuns(2);

  const runId = Number(
    experimentId.replace('EXP-', '')
  );

  const currentIndex = runs.findIndex(
    (run: any) => run.id === runId
  );

  if (currentIndex === -1) {
    throw new Error(
      `Experiment ${experimentId} not found`
    );
  }

  const run = runs[currentIndex];

  const previousRun =
    currentIndex < runs.length - 1
      ? runs[currentIndex + 1]
      : null;

  const metrics = {
    accuracy: run.metrics?.accuracy ?? 0,
    precision: run.metrics?.precision ?? 0,
    recall: run.metrics?.recall ?? 0,
    f1Score: run.metrics?.f1_score ?? 0,
    aucRoc: run.metrics?.auc_roc ?? 0,
  };

  const previousMetrics = previousRun
    ? {
        accuracy: previousRun.metrics?.accuracy ?? 0,
        precision: previousRun.metrics?.precision ?? 0,
        recall: previousRun.metrics?.recall ?? 0,
        f1Score: previousRun.metrics?.f1_score ?? 0,
        aucRoc: previousRun.metrics?.auc_roc ?? 0,
      }
    : null;

  return {
    experimentId,

    previousExperimentId: previousRun
      ? `EXP-${String(previousRun.id).padStart(3, '0')}`
      : null,

    datasetName: run.features?.[0] ?? 'Project Dataset',

    datasetVersion: 'V01',

    model: run.model_name,

    status: 'completed',

    metrics,

    previousMetrics,

    confusionMatrix: {
      truePositive: run.metrics?.true_positive ?? 0,
      falseNegative: run.metrics?.false_negative ?? 0,
      falsePositive: run.metrics?.false_positive ?? 0,
      trueNegative: run.metrics?.true_negative ?? 0,
    },

    rocPoints: run.metrics?.roc_points ?? [],

    perClassMetrics:
      run.metrics?.per_class_metrics ?? [],
  };
},

  // --- Stage 7: baselines (mock) ---

  async getBaselines(): Promise<Baseline[]> {
    await delay(200);
    return demoBaselines;
  },

  async createBaseline(values: NewBaselineFormValues, experiments: ExperimentRun[]): Promise<Baseline> {
    await delay(300);
    const sourceExperiment = experiments.find((exp) => exp.id === values.experimentId);
    const nextNumber = demoBaselines.length + 1;
    return {
      id: `BASE-${String(nextNumber).padStart(3, '0')}`,
      name: values.name,
      experimentId: values.experimentId,
      model: sourceExperiment?.model ?? 'unknown',
      datasetVersion: sourceExperiment?.datasetVersion ?? '—',
      metricName: 'F1 Score',
      metricValue: sourceExperiment?.metrics.f1Score ?? 0,
      createdAt: 'just now',
    };
  },
};


//<-------------------------------------<api>---------------------------------->
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// Server Health Check
export async function fetchHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error('Backend server is offline');
  return res.json();
}

// Projects
export async function fetchProjects() {
  const res = await fetch(`${BASE_URL}/projects`);
  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

// Project ML Runs
export async function fetchProjectRuns(projectId: number) {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/runs`);
  if (!res.ok) throw new Error('Failed to fetch project runs');
  return res.json();
}

// Create ML Run
export async function createProjectRun(
  projectId: number,
  data: {
    model_name: string;
    features: string[];
    parameters: ExperimentParameters;
    metrics: Record<string, unknown>;
  }
) {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/runs`, {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
    },

    body: JSON.stringify({
      project_id: projectId,
      ...data,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to create ML run');
  }

  return res.json();
}

// Delete ML Run
export async function deleteProjectRun(
  projectId: number,
  runId: number
) {
  const res = await fetch(
    `${BASE_URL}/projects/${projectId}/runs/${runId}`,
    {
      method: 'DELETE',
      headers: {
        accept: 'application/json',
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to delete experiment');
  }

  return res.json();
}

// Compare Experiments (Core Evidence Endpoint)
export async function fetchRunComparison(projectId: number, run1Id: number, run2Id: number) {
  const res = await fetch(
    `${BASE_URL}/projects/${projectId}/runs/compare?run_1=${run1Id}&run_2=${run2Id}`
  );
  if (!res.ok) throw new Error('Failed to compute run comparison');
  return res.json();
}

export function formatMetric(value: number | null): string {
  return value == null ? '—' : value.toFixed(3);
}