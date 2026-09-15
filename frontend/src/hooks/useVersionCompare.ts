import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import type { ProjectResponse, VersionResponse } from '../types/report';
import type { VersionComparisonResponse, CompareVerdict } from '../types/compare';

export type ComparePhase =
  | 'idle'
  | 'loading-projects'
  | 'loading-versions'
  | 'loading-comparison'
  | 'ready'
  | 'error';

export function useVersionCompare() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const [versions, setVersions] = useState<VersionResponse[]>([]);
  const [versionAId, setVersionAId] = useState<number | null>(null);
  const [versionBId, setVersionBId] = useState<number | null>(null);

  const [comparison, setComparison] = useState<VersionComparisonResponse | null>(null);

  const [phase, setPhase] = useState<ComparePhase>('idle');
  const [statusMessage, setStatusMessage] = useState('loading projects...');
  const [error, setError] = useState<string | null>(null);

  // ---------- load projects ----------
  useEffect(() => {
    let cancelled = false;
    setPhase('loading-projects');
    setStatusMessage('loading projects...');

    api
      .fetchReportProjects()
      .then((list) => {
        if (cancelled) return;
        setProjects(list);
        setPhase('idle');
        setStatusMessage(
          list.length === 0
            ? 'no projects registered.'
            : 'select a project to begin comparison.',
        );
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'failed to load projects.');
        setPhase('error');
        setStatusMessage('error: could not load projects.');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ---------- load versions when project changes ----------
  useEffect(() => {
    if (selectedProjectId == null) {
      setVersions([]);
      setVersionAId(null);
      setVersionBId(null);
      setComparison(null);
      return;
    }

    let cancelled = false;
    setVersions([]);
    setVersionAId(null);
    setVersionBId(null);
    setComparison(null);
    setPhase('loading-versions');
    setStatusMessage('loading versions...');
    setError(null);

    api
      .fetchReportVersions(selectedProjectId)
      .then((list) => {
        if (cancelled) return;
        setVersions(list);
        setPhase('idle');
        setStatusMessage(
          list.length < 2
            ? `project has ${list.length} version(s). at least 2 needed to compare.`
            : 'select two versions to compare.',
        );
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'failed to load versions.');
        setPhase('error');
        setStatusMessage('error: could not load versions.');
      });

    return () => {
      cancelled = true;
    };
  }, [selectedProjectId]);

  const versionsById = useMemo(
    () => new Map(versions.map((v) => [v.id, v])),
    [versions],
  );

  const versionA = versionAId != null ? versionsById.get(versionAId) ?? null : null;
  const versionB = versionBId != null ? versionsById.get(versionBId) ?? null : null;

  const canCompare =
    selectedProjectId != null &&
    versionA != null &&
    versionB != null &&
    versionA.id !== versionB.id;

  const validationError = useMemo(() => {
    if (selectedProjectId == null) return null;
    if (versionA == null || versionB == null) return null;
    if (versionA.id === versionB.id) return 'select two different versions.';
    return null;
  }, [selectedProjectId, versionA, versionB]);

  const swap = useCallback(() => {
    setVersionAId(versionBId);
    setVersionBId(versionAId);
    setComparison(null);
    setStatusMessage('versions swapped. run comparison again.');
  }, [versionAId, versionBId]);

  const runComparison = useCallback(async () => {
    if (!canCompare || selectedProjectId == null || versionAId == null || versionBId == null) {
      return;
    }
    setPhase('loading-comparison');
    setStatusMessage('loading comparison evidence...');
    setError(null);
    try {
      const res = await api.fetchVersionComparison(
        selectedProjectId,
        versionAId,
        versionBId,
      );
      setComparison(res);
      setPhase('ready');
      setStatusMessage('comparison ready.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'comparison failed.');
      setPhase('error');
      setStatusMessage('error: could not load comparison.');
    }
  }, [canCompare, selectedProjectId, versionAId, versionBId]);

  const reset = useCallback(() => {
    setVersionAId(null);
    setVersionBId(null);
    setComparison(null);
    setPhase('idle');
    setStatusMessage('select two versions to compare.');
  }, []);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const verdict = useMemo<CompareVerdict>(() => {
    if (!comparison) return 'insufficient-evidence';
    // Rule-driven: only consider booleans and populated evidence.
    const positives: boolean[] = [];
    const negatives: boolean[] = [];

    if (comparison.performance?.performance_changed) positives.push(false);
    if (comparison.dataset_analysis) positives.push(true);

    // No metrics comparison available → insufficient evidence.
    if (
      !comparison.ml_comparison &&
      !comparison.performance &&
      !comparison.dataset_analysis &&
      !comparison.dataset_diff
    ) {
      return comparison.git_changed || comparison.dvc_changed || comparison.code_changed
        ? 'mixed'
        : 'unchanged';
    }

    // If we got here, some evidence exists.
    if (positives.length === 0 && negatives.length === 0) {
      return comparison.git_changed || comparison.dvc_changed || comparison.code_changed
        ? 'mixed'
        : 'unchanged';
    }
    if (negatives.length === 0 && positives.length > 0) return 'improved';
    if (positives.length === 0 && negatives.length > 0) return 'regressed';
    return 'mixed';
  }, [comparison]);

  return {
    projects,
    versions,
    selectedProject,
    versionA,
    versionB,
    selectedProjectId,
    versionAId,
    versionBId,
    comparison,
    verdict,
    phase,
    statusMessage,
    error,
    validationError,
    canCompare,
    setSelectedProjectId,
    setVersionAId,
    setVersionBId,
    swap,
    runComparison,
    reset,
  };
}