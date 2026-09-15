import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import type {
  ProjectResponse,
  VersionResponse,
  MLRunResponse,
  VersionReportData,
} from '../types/report';

export type ReportPhase =
  | 'idle'
  | 'loading-projects'
  | 'loading-versions'
  | 'loading-report'
  | 'ready'
  | 'error';

export function useVersionReport() {
  const [projects, setProjects] = useState<ProjectResponse[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);

  const [versions, setVersions] = useState<VersionResponse[]>([]);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);

  const [report, setReport] = useState<VersionReportData | null>(null);

  const [phase, setPhase] = useState<ReportPhase>('idle');
  const [statusMessage, setStatusMessage] = useState('loading projects...');
  const [error, setError] = useState<string | null>(null);

  // ---------- load projects once ----------
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
            : 'select a project to begin.',
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
      setSelectedVersionId(null);
      setReport(null);
      return;
    }

    let cancelled = false;
    setVersions([]);
    setSelectedVersionId(null);
    setReport(null);
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
          list.length === 0
            ? 'no versions registered for this project.'
            : 'select a version to view its report.',
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

  // ---------- load report when version changes ----------
  const loadReport = useCallback(
    async (projectId: number, versionId: number) => {
      setPhase('loading-report');
      setStatusMessage('building report...');
      setError(null);
      setReport(null);

      try {
        const version = await api.fetchReportVersion(projectId, versionId);
        const project = projects.find((p) => p.id === projectId) ?? null;

        if (!project) {
          throw new Error('project context lost while loading report.');
        }

        let mlRun: MLRunResponse | null = null;
        if (version.ml_run_id != null) {
          try {
            const runs = await api.fetchReportMlRuns(projectId);
            mlRun = runs.find((r) => r.id === version.ml_run_id) ?? null;
          } catch {
            mlRun = null;
          }
        }

        setReport({ project, version, mlRun });
        setPhase('ready');
        setStatusMessage('report ready.');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'failed to build report.');
        setPhase('error');
        setStatusMessage('error: could not load report evidence.');
      }
    },
    [projects],
  );

  useEffect(() => {
    if (selectedProjectId == null || selectedVersionId == null) return;
    loadReport(selectedProjectId, selectedVersionId);
  }, [selectedProjectId, selectedVersionId, loadReport]);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const selectedVersion = useMemo(
    () => versions.find((v) => v.id === selectedVersionId) ?? null,
    [versions, selectedVersionId],
  );

  const retry = useCallback(() => {
    if (selectedProjectId != null && selectedVersionId != null) {
      loadReport(selectedProjectId, selectedVersionId);
    }
  }, [selectedProjectId, selectedVersionId, loadReport]);

  const resetSelection = useCallback(() => {
    setSelectedVersionId(null);
    setReport(null);
    setPhase('idle');
    setStatusMessage('select a version to view its report.');
  }, []);

  return {
    // data
    projects,
    versions,
    selectedProject,
    selectedVersion,
    selectedProjectId,
    selectedVersionId,
    report,
    // state
    phase,
    statusMessage,
    error,
    // actions
    setSelectedProjectId,
    setSelectedVersionId,
    retry,
    resetSelection,
  };
}