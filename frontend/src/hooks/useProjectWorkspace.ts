import { useEffect, useMemo, useState, useCallback } from 'react';
import { api } from '../services/api';
import type { ProjectSummary } from '../types/project';
import type { ProjectVersionSummary } from '../types/version';

export function useProjectWorkspace(projectId: string) {
  const [project, setProject] = useState<ProjectSummary | null>(null);
  const [versions, setVersions] = useState<ProjectVersionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);

    return Promise.all([api.getProjectSummary(projectId), api.getProjectVersionsList(projectId)])
      .then(([projectRes, versionsRes]) => {
        setProject(projectRes);

        const ordered = [...versionsRes].sort((a, b) => a.versionNumber - b.versionNumber);
        setVersions(ordered);

        const latest = ordered[ordered.length - 1] ?? null;
        setSelectedVersionId((prev) => prev ?? latest?.id ?? null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Unable to load project.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [projectId]);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);
    setSelectedVersionId(null);

    Promise.all([api.getProjectSummary(projectId), api.getProjectVersionsList(projectId)])
      .then(([projectRes, versionsRes]) => {
        if (cancelled) return;
        setProject(projectRes);

        const ordered = [...versionsRes].sort((a, b) => a.versionNumber - b.versionNumber);
        setVersions(ordered);

        const latest = ordered[ordered.length - 1] ?? null;
        setSelectedVersionId(latest?.id ?? null);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load project.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const selectedVersion = useMemo(
    () => versions.find((v) => v.id === selectedVersionId) ?? null,
    [versions, selectedVersionId],
  );

  return {
    project,
    versions,
    isLoading,
    error,
    reload: load,
    selectedVersionId,
    selectedVersion,
    selectVersion: setSelectedVersionId,
  };
}
