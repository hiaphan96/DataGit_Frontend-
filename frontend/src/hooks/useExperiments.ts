import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import type { ExperimentRun, NewExperimentFormValues } from '../types/experimentRun';
import type { DatasetSummary } from '../types/dataset';

export function useExperiments() {
  const [experiments, setExperiments] = useState<ExperimentRun[]>([]);
  const [datasets, setDatasets] = useState<DatasetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentRun | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState('loading experiments...');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const [experimentsResult, datasetsResult] = await Promise.all([
        api.getExperimentRuns(),
        api.getDatasets(),
      ]);
      if (cancelled) return;
      setExperiments(experimentsResult);
      setDatasets(datasetsResult);
      setLoading(false);
      setStatusMessage('experiments loaded.');
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const runningExperiment = experiments.find((exp) => exp.status === 'running') ?? null;

  const openNewExperimentModal = useCallback(() => setShowNewModal(true), []);
  const closeNewExperimentModal = useCallback(() => setShowNewModal(false), []);

  const selectExperiment = useCallback((experiment: ExperimentRun) => setSelectedExperiment(experiment), []);
  const closeDetails = useCallback(() => setSelectedExperiment(null), []);

  const createExperiment = useCallback(async (values: NewExperimentFormValues) => {
    setStatusMessage('creating experiment...');
    const created = await api.createExperimentRun(values);
    setExperiments((prev) => [created, ...prev]);
    setShowNewModal(false);
    setStatusMessage(`${created.id} created. status: running.`);
  }, []);

  return {
    experiments,
    datasets,
    loading,
    statusMessage,
    runningExperiment,
    selectedExperiment,
    showNewModal,
    openNewExperimentModal,
    closeNewExperimentModal,
    selectExperiment,
    closeDetails,
    createExperiment,
  };
}