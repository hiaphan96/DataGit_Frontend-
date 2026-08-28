import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import type {
  CleaningStepConfig,
  BeforeAfterMetric,
  DataWarning,
  AiSuggestion,
  DataPreview,
  ProcessedDataSample,
  PreprocessingActionStatus,
  PreprocessingTabId,
} from '../types/preprocessing';

export function useDatasetPreparation() {
  const [activeTab, setActiveTab] = useState<PreprocessingTabId>('cleaning');
  const [cleaningSteps, setCleaningSteps] = useState<CleaningStepConfig[]>([]);
  const [preview, setPreview] = useState<DataPreview | null>(null);
  const [metrics, setMetrics] = useState<BeforeAfterMetric[]>([]);
  const [warnings, setWarnings] = useState<DataWarning[]>([]);
  const [aiSuggestion, setAiSuggestion] = useState<AiSuggestion | null>(null);
  const [nextVersionLabel, setNextVersionLabel] = useState('V01');
  const [loading, setLoading] = useState(true);

  const [previewStatus, setPreviewStatus] = useState<PreprocessingActionStatus>('idle');
  const [processedSample, setProcessedSample] = useState<ProcessedDataSample | null>(null);
  const [createStatus, setCreateStatus] = useState<PreprocessingActionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('loading preprocessing configuration...');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const [stepsResult, previewResult, metricsResult, warningsResult, suggestionResult] = await Promise.all([
        api.getPreprocessingConfig(),
        api.getDataPreview(),
        api.getBeforeAfterSummary(),
        api.getWarnings(),
        api.getAiSuggestion(),
      ]);

      if (cancelled) return;

      setCleaningSteps(stepsResult);
      setPreview(previewResult);
      setMetrics(metricsResult);
      setWarnings(warningsResult);
      setAiSuggestion(suggestionResult);
      setNextVersionLabel(api.getNextVersionLabel());
      setLoading(false);
      setStatusMessage('preprocessing configured. review changes and create a new version.');
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleToggleStep = useCallback((id: CleaningStepConfig['id'], enabled: boolean) => {
    setCleaningSteps((prev) => prev.map((step) => (step.id === id ? { ...step, enabled } : step)));
    api.updateCleaningStep(id, { enabled });
  }, []);

  const handleSelectChange = useCallback((id: CleaningStepConfig['id'], value: string) => {
    setCleaningSteps((prev) => prev.map((step) => (step.id === id ? { ...step, selectValue: value } : step)));
    api.updateCleaningStep(id, { selectValue: value });
  }, []);

  const handlePreview = useCallback(async () => {
    setPreviewStatus('loading');
    setStatusMessage('generating preview of processed data...');
    try {
      const sample = await api.previewProcessedData();
      setProcessedSample(sample);
      setPreviewStatus('success');
      setStatusMessage('preview ready. sample reflects current preprocessing configuration.');
    } catch {
      setPreviewStatus('error');
      setStatusMessage('error: failed to generate preview.');
    }
  }, []);

  const handleCreateVersion = useCallback(async () => {
    setCreateStatus('loading');
    setStatusMessage(`creating ${nextVersionLabel}...`);
    try {
      const version = await api.createVersionFromPreprocessing();
      setCreateStatus('success');
      setStatusMessage(`${version.version} created. preprocessing configuration saved with this version.`);
    } catch {
      setCreateStatus('error');
      setStatusMessage('error: failed to create version.');
    }
  }, [nextVersionLabel]);

  const enabledStepCount = cleaningSteps.filter((s) => s.enabled).length;
  const createDisabled = enabledStepCount === 0;

  return {
    activeTab,
    setActiveTab,
    cleaningSteps,
    preview,
    metrics,
    warnings,
    aiSuggestion,
    nextVersionLabel,
    loading,
    previewStatus,
    processedSample,
    createStatus,
    statusMessage,
    createDisabled,
    handleToggleStep,
    handleSelectChange,
    handlePreview,
    handleCreateVersion,
  };
}