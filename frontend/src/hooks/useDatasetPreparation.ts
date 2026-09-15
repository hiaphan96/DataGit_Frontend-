import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import type { ProjectSummary } from '../types/project';
import type { ProjectVersionSummary } from '../types/version';
import type { DatasetProfile } from '../types/preparation';
import type {
  PreparationConfigurationRequest,
  PreparationOperationsResponse,
  PreparationProcessRequest,
  PreparationReportRequest,
  PreparationSelectionResponse,
  PreparedDatasetsResponse,
  PreparationReportsResponse,
} from '../types/preparation';

interface OperationsResponse {
  status: string;
  categories: Record<string, Array<Record<string, unknown>>>;
}

interface SelectionResponse {
  filename: string;
  selected_operations: string[];
  operation_count: number;
  status: string;
  message: string;
}

interface ConfigurationResponse {
  filename: string;
  operations: Record<string, unknown>[];
  operation_count: number;
  status: string;
  message: string;
}


// ---------- workflow states ----------
export type PreparationPhase =
  | 'idle'
  | 'loading-operations'
  | 'ready'
  | 'saving-selection'
  | 'saving-configuration'
  | 'validating'
  | 'processing'
  | 'processed'
  | 'reporting'
  | 'reported'
  | 'creating-version'
  | 'versioned'
  | 'error';

export interface SelectedOperation {
  /** Category the operation belongs to (backend category key, not UI tab). */
  category: string;
  /** Raw operation object as returned by /operations. */
  raw: Record<string, unknown>;
}

export function useDatasetPreparation() {
  // ---------- project / version context ----------
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [versions, setVersions] = useState<ProjectVersionSummary[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  // ---------- dataset / filename ----------
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'error' | 'success'>(
    'idle',
  );

  // ---------- operations from backend ----------
  const [operations, setOperations] = useState<PreparationOperationsResponse | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [selectedOperations, setSelectedOperations] = useState<SelectedOperation[]>([]);

  // ---------- per-operation configuration (kept as free-form dict) ----------
  const [operationConfig, setOperationConfig] = useState<Record<string, Record<string, unknown>>>(
    {},
  );

  // ---------- profile / prepared / reports ----------
  const [profile, setProfile] = useState<DatasetProfile | null>(null);
  const [preparedDatasets, setPreparedDatasets] = useState<PreparedDatasetsResponse | null>(null);
  const [preparationReports, setPreparationReports] = useState<PreparationReportsResponse | null>(
    null,
  );

  // ---------- server-side responses ----------
  const [selectionResponse, setSelectionResponse] = useState<PreparationSelectionResponse | null>(
    null,
  );
  const [configurationResponse, setConfigurationResponse] = useState<unknown | null>(null);
  const [validationResponse, setValidationResponse] = useState<unknown | null>(null);
  const [processResponse, setProcessResponse] = useState<unknown | null>(null);
  const [reportResponse, setReportResponse] = useState<unknown | null>(null);
  const [versionResponse, setVersionResponse] = useState<unknown | null>(null);

  // ---------- ui state ----------
  const [phase, setPhase] = useState<PreparationPhase>('idle');
  const [statusMessage, setStatusMessage] = useState('loading preparation operations...');
  const [error, setError] = useState<string | null>(null);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );
  const selectedVersion = useMemo(
    () => versions.find((v) => v.id === selectedVersionId) ?? null,
    [versions, selectedVersionId],
  );

  // ---------- initial load: projects + operations ----------
  useEffect(() => {
    let cancelled = false;
    setPhase('loading-operations');
    setStatusMessage('loading preparation operations...');

    Promise.all([api.getProjectsList(), api.fetchPreparationOperations()])
      .then(([projectList, operationsRes]) => {
        if (cancelled) return;
        setProjects(projectList);
        const ops = operationsRes as OperationsResponse;
        setOperations(ops);
        const firstCategory = Object.keys(ops.categories ?? {})[0] ?? '';
        setActiveCategory(firstCategory);

        setPhase('ready');
        setStatusMessage('select a project and version, then choose operations.');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'failed to load preparation operations.');
        setPhase('error');
        setStatusMessage('error: could not load preparation operations.');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ---------- reload versions when project changes ----------
  useEffect(() => {
    if (!selectedProjectId) {
      setVersions([]);
      setSelectedVersionId(null);
      return;
    }
    let cancelled = false;

    api
      .getProjectVersionsList(selectedProjectId)
      .then((list) => {
        if (cancelled) return;
        setVersions(list);
        setSelectedVersionId(list[list.length - 1]?.id ?? null);
      })
      .catch(() => {
        if (!cancelled) setVersions([]);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedProjectId]);

  // ---------- upload ----------
  const handleUpload = useCallback(async (file: File) => {
    setUploadStatus('uploading');
    setError(null);
    try {
      const res = (await api.uploadPreparationDataset(file)) as Record<string, unknown>;
      const filename =
        (res?.filename as string | undefined) ??
        (res?.saved_as as string | undefined) ??
        (res?.file as string | undefined) ??
        file.name;
      setUploadedFilename(filename);
      setUploadStatus('success');
      setStatusMessage(`uploaded ${filename}.`);
      return filename;
    } catch (err) {
      setUploadStatus('error');
      setError(err instanceof Error ? err.message : 'upload failed.');
      setStatusMessage('error: dataset upload failed.');
      return null;
    }
  }, []);

  // ---------- profile ----------
  const handleLoadProfile = useCallback(async () => {
    if (!uploadedFilename) {
      setError('no dataset uploaded.');
      return;
    }
    try {
      const res = (await api.fetchDatasetProfile(uploadedFilename)) as DatasetProfile;
      setProfile(res);
      setStatusMessage(`profile loaded for ${uploadedFilename}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'profile failed.');
    }
  }, [uploadedFilename]);

  // ---------- selection ----------
  const toggleOperation = useCallback(
    (category: string, raw: Record<string, unknown>) => {
      setSelectedOperations((prev) => {
        const exists = prev.some((o) => o.raw === raw && o.category === category);
        if (exists) {
          return prev.filter((o) => !(o.raw === raw && o.category === category));
        }
        return [...prev, { category, raw }];
      });
    },
    [],
  );

  const isOperationSelected = useCallback(
    (category: string, raw: Record<string, unknown>) =>
      selectedOperations.some((o) => o.raw === raw && o.category === category),
    [selectedOperations],
  );

  const handleSaveSelection = useCallback(async () => {
    if (!uploadedFilename) {
      setError('no dataset uploaded.');
      return;
    }
    if (selectedOperations.length === 0) {
      setError('select at least one operation.');
      return;
    }
    setPhase('saving-selection');
    setStatusMessage('saving operation selection...');
    setError(null);
    try {
      // The request body accepts operations as string[]; we extract a stable id if present,
      // otherwise fall back to the operation's "name"/"id"/"title" field.
      const ids = selectedOperations.map((o) => {
        const r = o.raw;
        return (r.operation as string) ?? JSON.stringify(r);
      });

      const res = (await api.selectPreparationOperations({
        filename: uploadedFilename,
        operations: ids,
      })) as SelectionResponse;
      setSelectionResponse(res);
      setPhase('ready');
      setStatusMessage(`selected ${res.operation_count} operation(s).`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'select failed.');
      setPhase('error');
      setStatusMessage('error: failed to save selection.');
    }
  }, [uploadedFilename, selectedOperations]);

  // ---------- configuration ----------
  const setOperationField = useCallback(
    (operationKey: string, field: string, value: unknown) => {
      setOperationConfig((prev) => ({
        ...prev,
        [operationKey]: { ...(prev[operationKey] ?? {}), [field]: value },
      }));
    },
    [],
  );

  const buildOperationPayload = useCallback(() => {
    return selectedOperations.map((o, idx) => {
      const key = String(idx);
      return {
        ...o.raw,
        ...(operationConfig[key] ?? {}),
      } as Record<string, unknown>;
    });
  }, [selectedOperations, operationConfig]);

  const handleSaveConfiguration = useCallback(async () => {
    if (!uploadedFilename) {
      setError('no dataset uploaded.');
      return;
    }
    if (selectedOperations.length === 0) {
      setError('select at least one operation first.');
      return;
    }
    setPhase('saving-configuration');
    setStatusMessage('saving configuration...');
    setError(null);
    try {
      const payload: PreparationConfigurationRequest = {
        filename: uploadedFilename,
        operations: buildOperationPayload(),
      };
      const res = (await api.configurePreparation(payload)) as ConfigurationResponse;
      setConfigurationResponse(res);
      setPhase('ready');
      setStatusMessage(`configuration saved (${res.operation_count} operation(s)).`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'configure failed.');
      setPhase('error');
      setStatusMessage('error: failed to save configuration.');
    }
  }, [uploadedFilename, selectedOperations, buildOperationPayload]);

  // ---------- validation ----------
  const handleValidate = useCallback(async () => {
    if (!uploadedFilename) {
      setError('no dataset uploaded.');
      return;
    }
    setPhase('validating');
    setStatusMessage('validating configuration...');
    setError(null);
    try {
      const res = await api.validatePreparation({
        filename: uploadedFilename,
        operations: buildOperationPayload(),
      });
      setValidationResponse(res);
      setPhase('ready');
      setStatusMessage('validation complete.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'validation failed.');
      setPhase('error');
      setStatusMessage('error: configuration is invalid.');
    }
  }, [uploadedFilename, buildOperationPayload]);

  // ---------- process ----------
  const handleProcess = useCallback(async () => {
    if (!uploadedFilename) {
      setError('no dataset uploaded.');
      return;
    }
    setPhase('processing');
    setStatusMessage('processing dataset...');
    setError(null);
    try {
      const payload: PreparationProcessRequest = {
        filename: uploadedFilename,
        operations: buildOperationPayload(),
      };
      const res = await api.processDatasetPreparation(payload);
      setProcessResponse(res);
      setPhase('processed');
      setStatusMessage('dataset processed.');
      // refresh prepared list
      api
        .fetchPreparedDatasets()
        .then(setPreparedDatasets)
        .catch(() => undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'process failed.');
      setPhase('error');
      setStatusMessage('error: dataset processing failed.');
    }
  }, [uploadedFilename, buildOperationPayload]);

  // ---------- report ----------
  const handleGenerateReport = useCallback(async () => {
    if (!uploadedFilename) {
      setError('no dataset uploaded.');
      return;
    }
    setPhase('reporting');
    setStatusMessage('generating report...');
    setError(null);
    try {
      // The report endpoint requires the prepared output filename.
      // We attempt to read it from the process response; otherwise fall back to
      // the uploaded filename (backend will validate).
      const processAny = processResponse as Record<string, unknown> | null;
      const outputFile =
        (processAny?.output_file as string | undefined) ??
        (processAny?.prepared_filename as string | undefined) ??
        (processAny?.filename as string | undefined) ??
        uploadedFilename;

      const payload: PreparationReportRequest = {
        filename: uploadedFilename,
        output_file: outputFile,
        operations: buildOperationPayload(),
      };
      const res = await api.generatePreparationReport(payload);
      setReportResponse(res);
      setPhase('reported');
      setStatusMessage('report generated.');

      api
        .fetchPreparationReports()
        .then(setPreparationReports)
        .catch(() => undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'report failed.');
      setPhase('error');
      setStatusMessage('error: failed to generate report.');
    }
  }, [uploadedFilename, processResponse, buildOperationPayload]);

  // ---------- version finalize ----------
  const handleCreateVersion = useCallback(
    async (description: string) => {
      if (!selectedProjectId) {
        setError('select a project first.');
        return;
      }
      setPhase('creating-version');
      setStatusMessage('creating new version...');
      setError(null);
      try {
        const res = await api.finalizeVersion(Number(selectedProjectId), description);
        setVersionResponse(res);
        setPhase('versioned');
        setStatusMessage('new version created.');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'version creation failed.');
        setPhase('error');
        setStatusMessage('error: failed to create version.');
      }
    },
    [selectedProjectId],
  );

  // ---------- derived ----------
  const categories = useMemo(
    () => Object.keys(operations?.categories ?? {}),
    [operations],
  );

  const activeOperations = useMemo(() => {
    if (!operations || !activeCategory) return [];
    return operations.categories[activeCategory] ?? [];
  }, [operations, activeCategory]);

  // ---------- compatibility shims for the existing page ----------
  // The current DatasetPreparation.tsx expects `activeTab` / `setActiveTab`.
  // We map those onto `activeCategory` so the page compiles unchanged.
  const activeTab = activeCategory;
  const setActiveTab = useCallback(
    (value: string) => {
      setActiveCategory(value);
    },
    [],
  );

  return {
    // compatibility shims
    activeTab,
    setActiveTab,
    loading: phase === 'loading-operations' || phase === 'idle',
    statusMessage,
    // real workflow data
    projects,
    selectedProjectId,
    setSelectedProjectId,
    selectedProject,
    versions,
    selectedVersionId,
    setSelectedVersionId,
    selectedVersion,
    categories,
    activeOperations,
    selectedOperations,
    isOperationSelected,
    toggleOperation,
    uploadedFilename,
    uploadStatus,
    handleUpload,
    profile,
    handleLoadProfile,
    preparedDatasets,
    preparationReports,
    selectionResponse,
    configurationResponse,
    validationResponse,
    processResponse,
    reportResponse,
    versionResponse,
    phase,
    error,
    // actions
    handleSaveSelection,
    handleSaveConfiguration,
    handleValidate,
    handleProcess,
    handleGenerateReport,
    handleCreateVersion,
    setOperationField,
    operationConfig,
  };
}