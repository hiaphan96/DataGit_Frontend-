import { useCallback, useEffect, useState } from 'react';
import { api, deleteProjectRun } from '../services/api';
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

  const deleteExperiment = useCallback(
  async (experiment: ExperimentRun) => {
    try {
      setStatusMessage(`deleting ${experiment.id}...`);

      // EXP-010 → 10
      const runId = Number(
        experiment.id.replace('EXP-', '')
      );

      // Delete from backend
      await deleteProjectRun(2, runId);

      // Remove from frontend UI
      setExperiments((prev) =>
        prev.filter((exp) => exp.id !== experiment.id)
      );

      // Close details if the deleted experiment is selected
      setSelectedExperiment((current) =>
        current?.id === experiment.id
          ? null
          : current
      );

      setStatusMessage(
        `${experiment.id} deleted successfully.`
      );
    } catch (error) {
      console.error(error);

      setStatusMessage(
        `failed to delete ${experiment.id}.`
      );
    }
  },
  []
);
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
  deleteExperiment,
};
}