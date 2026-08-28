import { useCallback, useMemo, useState } from 'react';
import { api } from '../services/api';
import {
  EMPTY_FILE_META,
  INITIAL_UPLOAD_FORM,
  formatFileSize,
  validateDatasetName,
  type DatasetFileKind,
  type DatasetUploadForm,
  type TaskType,
} from '../types/dataset';
import {
  INITIAL_VALIDATION_CHECKS,
  type OverallValidationStatus,
  type ValidationCheckResult,
} from '../types/validation';

export function useDatasetUpload() {
  const [form, setForm] = useState<DatasetUploadForm>(INITIAL_UPLOAD_FORM);
  const [checks, setChecks] = useState<ValidationCheckResult[]>(INITIAL_VALIDATION_CHECKS);
  const [overallStatus, setOverallStatus] = useState<OverallValidationStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('ready to upload and validate your data.');
  const [formError, setFormError] = useState<string | null>(null);

  const datasetNameError = useMemo(() => validateDatasetName(form.datasetName), [form.datasetName]);

  const setDatasetName = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, datasetName: value }));
  }, []);

  const setTaskType = useCallback((value: TaskType) => {
    setForm((prev) => ({ ...prev, taskType: value }));
  }, []);

  const setTextField = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, textField: value }));
  }, []);

  const setDescription = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, description: value }));
  }, []);

  const handleFileSelect = useCallback(async (kind: DatasetFileKind, file: File) => {
    const key = kind === 'train' ? 'trainFile' : 'testFile';

    setForm((prev) => ({
      ...prev,
      [key]: { ...EMPTY_FILE_META, file, fileName: file.name, sizeBytes: file.size, status: 'uploading' },
    }));

    try {
      const result = await api.inspectDatasetFile(file, kind, (pct) => {
        setForm((prev) => ({ ...prev, [key]: { ...prev[key], uploadProgress: pct } }));
      });
      setForm((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          status: 'uploaded',
          rows: result.rows,
          columns: result.columns,
          detectedColumns: result.detectedColumns,
          uploadProgress: 100,
        },
      }));
    } catch (err) {
      setForm((prev) => ({
        ...prev,
        [key]: { ...prev[key], status: 'error', errorMessage: err instanceof Error ? err.message : 'upload failed' },
      }));
    }
  }, []);

  const handleFileRemove = useCallback((kind: DatasetFileKind) => {
    const key = kind === 'train' ? 'trainFile' : 'testFile';
    setForm((prev) => ({
      ...prev,
      [key]: { ...EMPTY_FILE_META },
    }));
  }, []);

  const handleReset = useCallback(() => {
    setForm(INITIAL_UPLOAD_FORM);
    setChecks(INITIAL_VALIDATION_CHECKS);
    setOverallStatus('idle');
    setFormError(null);
    setStatusMessage('ready to upload and validate your data.');
  }, []);

  const handleStartValidation = useCallback(async () => {
    setFormError(null);

    if (datasetNameError) {
      setFormError(datasetNameError);
      setStatusMessage(`error: ${datasetNameError}`);
      return;
    }
    if (form.trainFile.status === 'idle' || !form.trainFile.file) {
      setFormError('training dataset is required');
      setStatusMessage('error: training dataset is required');
      return;
    }
    if (form.testFile.status === 'idle' || !form.testFile.file) {
      setStatusMessage('warning: no test dataset supplied');
    }

    setOverallStatus('running');
    setStatusMessage('validating dataset...');

    const pipeline: Array<(f: DatasetUploadForm) => Promise<ValidationCheckResult>> = [
      api.validateFileFormat,
      api.validateFileSize,
      api.validateSchema,
      api.validateDataQuality,
      api.checkDuplicates,
    ];

    const next = INITIAL_VALIDATION_CHECKS.map((c) => ({ ...c }));
    let sawWarning = false;
    let sawError = false;

    for (let i = 0; i < pipeline.length; i++) {
      next[i] = { ...next[i], status: 'running' };
      setChecks([...next]);

      const result = await pipeline[i](form);
      next[i] = result;
      setChecks([...next]);

      if (result.status === 'warning') sawWarning = true;
      if (result.status === 'error') {
        sawError = true;
        break;
      }
    }

    if (sawError) {
      setOverallStatus('error');
      const failing = next.find((c) => c.status === 'error');
      setStatusMessage(`error: ${failing?.message ?? 'validation failed'}`);
    } else if (sawWarning) {
      setOverallStatus('warning');
      setStatusMessage('validation complete with warnings. review before continuing.');
    } else {
      setOverallStatus('success');
      setStatusMessage('validation complete. dataset is ready for versioning.');
    }
  }, [form, datasetNameError]);

  const estimatedSize = useMemo(() => {
    const total = form.trainFile.sizeBytes + form.testFile.sizeBytes;
    return total > 0 ? `~ ${formatFileSize(total)}` : '—';
  }, [form.trainFile.sizeBytes, form.testFile.sizeBytes]);

  const canContinue = overallStatus === 'success' || overallStatus === 'warning';

  return {
    form,
    checks,
    overallStatus,
    statusMessage,
    formError,
    datasetNameError,
    estimatedSize,
    canContinue,
    setDatasetName,
    setTaskType,
    setTextField,
    setDescription,
    handleFileSelect,
    handleFileRemove,
    handleReset,
    handleStartValidation,
  };
}