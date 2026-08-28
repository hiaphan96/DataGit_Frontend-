import type { OutputLine } from '../types/terminal';
import type { Project } from '../types/project';
import type { DatasetSummary } from '../types/dataset';
import type { ActivityItem, MetricsSummary } from '../types/dashboard';
import type { VersionEntry } from '../types/version';
import type { ExperimentEntry } from '../types/experiment';

export const COMMAND_NAMES = [
  'project',
  'datasets',
  'versions',
  'experiments',
  'history',
  'status',
  'clear',
  'help',
] as const;

export type CommandName = (typeof COMMAND_NAMES)[number];

const COMMAND_DESCRIPTIONS: Record<CommandName, string> = {
  project: 'project information',
  datasets: 'list datasets',
  versions: 'list dataset versions',
  experiments: 'list experiments',
  history: 'show recent activity',
  status: 'project health',
  clear: 'clear terminal',
  help: 'show commands',
};

export function buildHelpOutput(): OutputLine[] {
  return [
    { text: 'DATAGIT COMMANDS', variant: 'heading' },
    ...COMMAND_NAMES.map((name) => ({
      text: `${name.padEnd(14, ' ')}${COMMAND_DESCRIPTIONS[name]}`,
      variant: 'body' as const,
    })),
  ];
}

export function buildStatusOutput(project: Project, metrics: MetricsSummary): OutputLine[] {
  return [
    { text: 'PROJECT STATUS', variant: 'heading' },
    { text: `project: ${project.name}`, variant: 'body' },
    { text: '', variant: 'body' },
    { text: `datasets:    ${metrics.totalDatasets}`, variant: 'body' },
    { text: `versions:   ${metrics.totalVersions}`, variant: 'body' },
    { text: `experiments:${metrics.totalExperiments}`, variant: 'body' },
    { text: '', variant: 'body' },
    { text: `baseline: ${project.baselineVersion} / ${project.baselineExperiment}`, variant: 'body' },
    { text: '', variant: 'body' },
    {
      text: `status: ${project.status === 'active' ? '● HEALTHY' : '● PAUSED'}`,
      variant: project.status === 'active' ? 'positive' : 'muted',
    },
  ];
}

export function buildProjectOutput(project: Project): OutputLine[] {
  return [
    { text: 'CURRENT PROJECT', variant: 'heading' },
    { text: project.name, variant: 'body' },
    { text: '', variant: 'body' },
    {
      text: `status:   ${project.status}`,
      variant: project.status === 'active' ? 'positive' : 'muted',
    },
    { text: `baseline: ${project.baselineVersion} / ${project.baselineExperiment}`, variant: 'body' },
    { text: `last run: ${project.lastRunLabel}`, variant: 'muted' },
  ];
}

export function buildDatasetsOutput(datasets: DatasetSummary[]): OutputLine[] {
  if (datasets.length === 0) {
    return [{ text: 'No datasets found.', variant: 'muted' }];
  }
  return [
    { text: 'DATASETS', variant: 'heading' },
    ...datasets.map((dataset) => ({
      text: `${dataset.name.padEnd(20, ' ')}${dataset.task.padEnd(26, ' ')}${dataset.version.padEnd(
        8,
        ' ',
      )}${statusLabel(dataset.status)}`,
      variant: statusVariant(dataset.status),
    })),
  ];
}

export function buildVersionsOutput(versions: VersionEntry[]): OutputLine[] {
  if (versions.length === 0) {
    return [{ text: 'No versions found.', variant: 'muted' }];
  }
  return [
    { text: 'VERSIONS', variant: 'heading' },
    ...versions.map((entry) => ({
      text: `${entry.version.padEnd(6, ' ')}${entry.dataset.padEnd(22, ' ')}${entry.createdAt}`,
      variant: 'body' as const,
    })),
  ];
}

export function buildExperimentsOutput(experiments: ExperimentEntry[]): OutputLine[] {
  if (experiments.length === 0) {
    return [{ text: 'No experiments found.', variant: 'muted' }];
  }
  return [
    { text: 'EXPERIMENTS', variant: 'heading' },
    ...experiments.map((entry) => ({
      text: `${entry.id.padEnd(10, ' ')}${entry.dataset.padEnd(22, ' ')}${entry.metricLabel}: ${entry.metricValue}`,
      variant: experimentVariant(entry.result),
    })),
  ];
}

export function buildHistoryOutput(activity: ActivityItem[]): OutputLine[] {
  if (activity.length === 0) {
    return [{ text: 'No recent activity.', variant: 'muted' }];
  }
  return [
    { text: 'RECENT ACTIVITY', variant: 'heading' },
    ...activity.map((item) => ({
      text: `[${item.timestamp}]  ${item.message}`,
      variant: 'body' as const,
    })),
  ];
}

export function buildUnknownCommandOutput(rawCommand: string): OutputLine[] {
  return [
    { text: `command not found: ${rawCommand.trim()}`, variant: 'error' },
    { text: "type 'help' to view available commands.", variant: 'muted' },
  ];
}

function statusLabel(status: DatasetSummary['status']): string {
  switch (status) {
    case 'healthy':
      return '● healthy';
    case 'warning':
      return '● warning';
    case 'regression':
      return '● regression';
  }
}

function statusVariant(status: DatasetSummary['status']): OutputLine['variant'] {
  switch (status) {
    case 'healthy':
      return 'positive';
    case 'warning':
      return 'warning';
    case 'regression':
      return 'negative';
  }
}

function experimentVariant(result: ExperimentEntry['result']): OutputLine['variant'] {
  switch (result) {
    case 'improvement':
      return 'positive';
    case 'regression':
      return 'negative';
    default:
      return 'muted';
  }
}