import type { VersionChangeSummary, VersionComparisonResult, VersionDetail } from '../types/version';

/**
 * Mock per-dataset version history for Stage 3.
 *
 * This is deliberately separate from data/demoVersions.ts (which only
 * feeds the Home dashboard's "latest checkpoint per dataset" table).
 * Here we model a full V01 -> V02 -> V03 lineage for one dataset so the
 * timeline, details panel, and comparison UI have something real to
 * walk through. Replace with real DVC/core-engine data later; keep the
 * VersionDetail/VersionChangeSummary/VersionComparisonResult shapes the
 * same so the UI doesn't need to change.
 */

export const demoVersionDetails: VersionDetail[] = [
  {
    id: 'v-1',
    dataset: 'reviews_dataset',
    version: 'V01',
    parentVersionId: null,
    checkpointId: 'DG-CHK-001',
    createdAt: '3 days ago',
    isCurrent: false,
    rows: 11800,
    columns: 24,
    hash: 'f3a1c9e0b7d2',
    missingValuesPct: 6.4,
    duplicates: 340,
    schemaStatus: 'stable',
    dataQuality: 'warning',
    dvcStatus: 'mocked',
  },
  {
    id: 'v-2',
    dataset: 'reviews_dataset',
    version: 'V02',
    parentVersionId: 'v-1',
    checkpointId: 'DG-CHK-002',
    createdAt: 'yesterday',
    isCurrent: false,
    rows: 12000,
    columns: 24,
    hash: '9c2e71a4f80d',
    missingValuesPct: 3.6,
    duplicates: 220,
    schemaStatus: 'stable',
    dataQuality: 'healthy',
    dvcStatus: 'mocked',
  },
  {
    id: 'v-3',
    dataset: 'reviews_dataset',
    version: 'V03',
    parentVersionId: 'v-2',
    checkpointId: 'DG-CHK-003',
    createdAt: 'today, 14:32',
    isCurrent: true,
    rows: 12450,
    columns: 24,
    hash: 'a91f8c2d5e72c',
    missingValuesPct: 0.4,
    duplicates: 100,
    schemaStatus: 'stable',
    dataQuality: 'healthy',
    dvcStatus: 'connected',
  },
];

export const demoChangeSummaries: VersionChangeSummary[] = [
  {
    versionId: 'v-2',
    previousVersionId: 'v-1',
    metrics: [
      { label: 'rows', value: '+200', direction: 'positive' },
      { label: 'columns', value: 'no change', direction: 'neutral' },
      { label: 'missing values', value: '-2.8%', direction: 'positive' },
      { label: 'duplicates', value: '-120', direction: 'positive' },
      { label: 'class distribution', value: 'changed', direction: 'neutral' },
      { label: 'schema', value: 'stable', direction: 'positive' },
    ],
  },
  {
    versionId: 'v-3',
    previousVersionId: 'v-2',
    metrics: [
      { label: 'rows', value: '+450', direction: 'positive' },
      { label: 'columns', value: 'no change', direction: 'neutral' },
      { label: 'missing values', value: '-3.2%', direction: 'positive' },
      { label: 'duplicates', value: '-120', direction: 'positive' },
      { label: 'class distribution', value: 'changed', direction: 'neutral' },
      { label: 'schema', value: 'stable', direction: 'positive' },
    ],
  },
];

export const demoComparisonResults: Record<string, VersionComparisonResult> = {
  'v-1_v-2': {
    baselineId: 'v-1',
    currentId: 'v-2',
    rowsDelta: '+200',
    missingValuesDelta: '-2.8%',
    duplicatesDelta: '-120',
    schemaNote: 'no breaking changes',
    overallStatus: 'safe',
  },
  'v-1_v-3': {
    baselineId: 'v-1',
    currentId: 'v-3',
    rowsDelta: '+650',
    missingValuesDelta: '-6.0%',
    duplicatesDelta: '-240',
    schemaNote: 'no breaking changes',
    overallStatus: 'safe',
  },
  'v-2_v-3': {
    baselineId: 'v-2',
    currentId: 'v-3',
    rowsDelta: '+450',
    missingValuesDelta: '-3.2%',
    duplicatesDelta: '-120',
    schemaNote: 'no breaking changes',
    overallStatus: 'safe',
  },
};