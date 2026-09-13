import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { computeStatus } from '../types/evaluation';
import type { EvaluationData, EvaluationTabId, MetricComparisonRow } from '../types/evaluation';

const METRIC_LABELS: { key: keyof EvaluationData['metrics']; label: string }[] = [
  { key: 'accuracy', label: 'Accuracy' },
  { key: 'precision', label: 'Precision' },
  { key: 'recall', label: 'Recall' },
  { key: 'f1Score', label: 'F1 Score' },
  { key: 'aucRoc', label: 'AUC-ROC' },
];

export function useEvaluation() {
  const [evaluableIds, setEvaluableIds] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [activeTab, setActiveTab] = useState<EvaluationTabId>('performance');
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('loading evaluation data...');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const ids = await api.getEvaluableExperimentIds();
      if (cancelled) return;
      setEvaluableIds(ids);
      const defaultId = ids[0] ?? '';
      setSelectedId(defaultId);
      if (defaultId) {
        const data = await api.getEvaluationData(defaultId);
        if (cancelled) return;
        setEvaluation(data);
      }
      setLoading(false);
      setStatusMessage('evaluation ready.');
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelect = async (id: string) => {
    setSelectedId(id);
    setStatusMessage(`loading ${id}...`);
    const data = await api.getEvaluationData(id);
    setEvaluation(data);
    setStatusMessage('evaluation ready.');
  };

  const comparisonRows: MetricComparisonRow[] = useMemo(() => {
    if (!evaluation || !evaluation.previousMetrics) return [];
    return METRIC_LABELS.map(({ key, label }) => {
      const current = evaluation.metrics[key];
      const previous = evaluation.previousMetrics![key];
      const percentageChange = previous === 0 ? 0 : ((current - previous) / previous) * 100;
      return { key, label, current, previous, percentageChange };
    });
  }, [evaluation]);

  const f1Comparison = comparisonRows.find((r) => r.key === 'f1Score') ?? null;
  const evaluationStatus = f1Comparison ? computeStatus(f1Comparison.percentageChange) : 'no_change';

  return {
    evaluableIds,
    selectedId,
    evaluation,
    activeTab,
    setActiveTab,
    loading,
    statusMessage,
    handleSelect,
    comparisonRows,
    f1Comparison,
    evaluationStatus,
  };
}