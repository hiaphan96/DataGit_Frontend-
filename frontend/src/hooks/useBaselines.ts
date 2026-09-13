import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import type { Baseline, NewBaselineFormValues } from '../types/baseline';
import type { ExperimentRun } from '../types/experimentRun';

export function useBaselines() {
  const [baselines, setBaselines] = useState<Baseline[]>([]);
  const [experiments, setExperiments] = useState<ExperimentRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBaseline, setSelectedBaseline] = useState<Baseline | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState('loading baselines...');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const [baselinesResult, experimentsResult] = await Promise.all([
        api.getBaselines(),
        api.getExperimentRuns(),
      ]);
      if (cancelled) return;
      setBaselines(baselinesResult);
      setExperiments(experimentsResult);
      setLoading(false);
      setStatusMessage('baselines ready.');
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const openNewModal = useCallback(() => setShowNewModal(true), []);
  const closeNewModal = useCallback(() => setShowNewModal(false), []);

  const selectBaseline = useCallback((baseline: Baseline) => setSelectedBaseline(baseline), []);
  const closeDetails = useCallback(() => setSelectedBaseline(null), []);

  const createBaseline = useCallback(
    async (values: NewBaselineFormValues) => {
      setStatusMessage('creating baseline...');
      const created = await api.createBaseline(values, experiments);
      setBaselines((prev) => [...prev, created]);
      setShowNewModal(false);
      setStatusMessage(`${created.id} created.`);
    },
    [experiments],
  );

  return {
    baselines,
    experiments,
    loading,
    statusMessage,
    selectedBaseline,
    showNewModal,
    openNewModal,
    closeNewModal,
    selectBaseline,
    closeDetails,
    createBaseline,
  };
}