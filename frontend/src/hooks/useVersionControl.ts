import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import type { VersionChangeSummary, VersionComparisonResult, VersionDetail } from '../types/version';

export function useVersionControl() {
  const [versions, setVersions] = useState<VersionDetail[]>([]);
  const [changeSummaries, setChangeSummaries] = useState<Record<string, VersionChangeSummary>>({});
  const [isLoading, setIsLoading] = useState(true);

  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  const [baselineId, setBaselineId] = useState<string>('');
  const [currentId, setCurrentId] = useState<string>('');
  const [comparisonResult, setComparisonResult] = useState<VersionComparisonResult | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const [isCreatingCheckpoint, setIsCreatingCheckpoint] = useState(false);

  // initial load — versions + every version's change summary, so the
  // timeline can show inline deltas for each entry, not just the
  // currently-selected one
  useEffect(() => {
    let cancelled = false;

    api.getVersionDetails().then(async (data) => {
      if (cancelled) return;
      setVersions(data);

      const summaryEntries = await Promise.all(
        data.map(async (v) => [v.id, await api.getChangeSummary(v.id)] as const),
      );
      if (cancelled) return;

      const summaryMap: Record<string, VersionChangeSummary> = {};
      for (const [id, summary] of summaryEntries) {
        if (summary) summaryMap[id] = summary;
      }
      setChangeSummaries(summaryMap);

      const current = data.find((v) => v.isCurrent) ?? data[data.length - 1] ?? null;
      if (current) {
        setSelectedVersionId(current.id);
        setCurrentId(current.id);
        const parent = data.find((v) => v.id === current.parentVersionId);
        setBaselineId(parent ? parent.id : data[0]?.id ?? '');
      }
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectVersion = useCallback((id: string) => {
    setSelectedVersionId(id);
  }, []);

  const selectedVersion = useMemo(
    () => versions.find((v) => v.id === selectedVersionId) ?? null,
    [versions, selectedVersionId],
  );

  const currentVersion = useMemo(() => versions.find((v) => v.isCurrent) ?? null, [versions]);

  const changeSummary = useMemo(
    () => (selectedVersionId ? changeSummaries[selectedVersionId] ?? null : null),
    [changeSummaries, selectedVersionId],
  );

  const runComparison = useCallback(async () => {
    if (!baselineId || !currentId) return;
    setIsComparing(true);
    setComparisonResult(null);
    try {
      const result = await api.runVersionComparison(baselineId, currentId);
      setComparisonResult(result);
    } finally {
      setIsComparing(false);
    }
  }, [baselineId, currentId]);

  const createCheckpoint = useCallback(async () => {
    setIsCreatingCheckpoint(true);
    try {
      const newVersion = await api.createCheckpoint();
      setVersions((prev) => [...prev.map((v) => ({ ...v, isCurrent: false })), newVersion]);
      setSelectedVersionId(newVersion.id);
      setCurrentId(newVersion.id);
    } finally {
      setIsCreatingCheckpoint(false);
    }
  }, []);

  return {
    versions,
    changeSummaries,
    isLoading,
    selectedVersion,
    currentVersion,
    changeSummary,
    selectVersion,
    baselineId,
    currentId,
    setBaselineId,
    setCurrentId,
    comparisonResult,
    isComparing,
    runComparison,
    isCreatingCheckpoint,
    createCheckpoint,
  };
}