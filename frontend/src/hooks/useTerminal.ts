import { useCallback, useRef, useState } from 'react';
import type { HistoryEntry, OutputLine } from '../types/terminal';
import { api } from '../services/api';
import {
  COMMAND_NAMES,
  buildDatasetsOutput,
  buildExperimentsOutput,
  buildHelpOutput,
  buildHistoryOutput,
  buildProjectOutput,
  buildStatusOutput,
  buildUnknownCommandOutput,
  buildVersionsOutput,
} from '../data/commands';

let counter = 0;
function generateId(): string {
  counter += 1;
  return `entry-${Date.now()}-${counter}`;
}

export function useTerminal() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const commandLogRef = useRef<string[]>([]);
  const pointerRef = useRef<number>(0);

  const runCommand = useCallback(
    async (rawInput: string) => {
      const command = rawInput.trim();
      if (command.length === 0 || isRunning) return;

      commandLogRef.current.push(command);
      pointerRef.current = commandLogRef.current.length;

      const key = command.toLowerCase();

      if (key === 'clear') {
        setHistory([]);
        return;
      }

      setIsRunning(true);
      try {
        const output = await resolveCommand(key, command);
        setHistory((prev) => [...prev, { id: generateId(), command, output }]);
      } finally {
        setIsRunning(false);
      }
    },
    [isRunning],
  );

  const clearTerminal = useCallback(() => {
    setHistory([]);
  }, []);

  const getPreviousCommand = useCallback((): string | null => {
    const log = commandLogRef.current;
    if (log.length === 0) return null;
    pointerRef.current = Math.max(0, pointerRef.current - 1);
    return log[pointerRef.current] ?? null;
  }, []);

  const getNextCommand = useCallback((): string | null => {
    const log = commandLogRef.current;
    if (log.length === 0) return null;
    pointerRef.current = Math.min(log.length, pointerRef.current + 1);
    return pointerRef.current >= log.length ? '' : log[pointerRef.current];
  }, []);

  const autocomplete = useCallback((partial: string): string | null => {
    const trimmed = partial.trim().toLowerCase();
    if (trimmed.length === 0) return null;
    const matches = COMMAND_NAMES.filter((name) => name.startsWith(trimmed));
    return matches.length === 1 ? matches[0] : null;
  }, []);

  return {
    history,
    isRunning,
    runCommand,
    clearTerminal,
    getPreviousCommand,
    getNextCommand,
    autocomplete,
  };
}

async function resolveCommand(key: string, rawCommand: string): Promise<OutputLine[]> {
  switch (key) {
    case 'help':
      return buildHelpOutput();
    case 'status': {
      const [project, metrics] = await Promise.all([api.getProject(), api.getMetrics()]);
      return buildStatusOutput(project, metrics);
    }
    case 'project': {
      const project = await api.getProject();
      return buildProjectOutput(project);
    }
    case 'datasets': {
      const datasets = await api.getDatasets();
      return buildDatasetsOutput(datasets);
    }
    case 'versions': {
      const versions = await api.getVersions();
      return buildVersionsOutput(versions);
    }
    case 'experiments': {
      const experiments = await api.getExperiments();
      return buildExperimentsOutput(experiments);
    }
    case 'history': {
      const activity = await api.getActivity();
      return buildHistoryOutput(activity);
    }
    default:
      return buildUnknownCommandOutput(rawCommand);
  }
}