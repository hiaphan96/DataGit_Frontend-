import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';
import type { NewProjectInput, ProjectSummary } from '../types/project';

export function useProjectsList() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    setError(null);

    return api
      .getProjectsList()
      .then((data) => {
        setProjects(data);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Unable to load projects.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    let cancelled = false;

    setIsLoading(true);
    setError(null);

    api
      .getProjectsList()
      .then((data) => {
        if (!cancelled) setProjects(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Unable to load projects.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const createProject = useCallback(async (input: NewProjectInput) => {
    setIsCreating(true);
    setCreateError(null);
    try {
      const created = await api.createNewProject(input);
      setProjects((prev) => [...prev, created]);
      return created;
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Unable to create project.');
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  return {
    projects,
    isLoading,
    error,
    reload: load,
    createProject,
    isCreating,
    createError,
    clearCreateError: () => setCreateError(null),
  };
}
