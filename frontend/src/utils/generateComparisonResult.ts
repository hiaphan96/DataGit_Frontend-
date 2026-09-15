import type {
  ComparisonState,
  ComparisonResult,
  ComparisonMetricRow,
  ComparisonImpact,
} from '../types/comparison';

const METRIC_LABELS: {
  key: ComparisonMetricRow['key'];
  label: string;
}[] = [
  { key: 'accuracy', label: 'Accuracy' },
  { key: 'precision', label: 'Precision' },
  { key: 'recall', label: 'Recall' },
  { key: 'f1', label: 'F1 Score' },
  { key: 'auc', label: 'AUC-ROC' },
];

function computeImpact(pctChange: number): ComparisonImpact {
  if (pctChange > 0.5) return 'improvement';
  if (pctChange < -0.5) return 'regression';
  return 'no_change';
}

type DataChangeRowShape = {
  label: string;
  baseline: string;
  current: string;
  delta: string;
  status: ComparisonImpact;
};

export function generateComparisonResult(
  baseline: ComparisonState,
  current: ComparisonState
): ComparisonResult {
  const metrics: ComparisonMetricRow[] = METRIC_LABELS.map((m) => {
    const baselineValue = baseline.metrics[m.key];
    const currentValue = current.metrics[m.key];

    const delta = currentValue - baselineValue;

    const percentageChange =
      baselineValue !== 0
        ? (delta / baselineValue) * 100
        : 0;

    return {
      key: m.key,
      label: m.label,
      baseline: baselineValue,
      current: currentValue,
      delta,
      percentageChange,
      isPrimary: m.key === 'f1',
    };
  });

  const f1Row = metrics.find((m) => m.key === 'f1')!;

  const overallImpact = computeImpact(
    f1Row.percentageChange
  );

  const primaryMetricDeltaLabel =
    `${f1Row.percentageChange > 0 ? '+' : ''}` +
    `${f1Row.percentageChange.toFixed(2)}% F1 Score`;

  const sameVersion =
    baseline.datasetVersion === current.datasetVersion;

  const sameModel =
    baseline.model === current.model;

  const sameCommit =
    baseline.gitCommit === current.gitCommit;

  const samePreprocessing =
    baseline.preprocessing === current.preprocessing;

  const changedFlags = [
    !sameVersion,
    !sameModel,
    !sameCommit,
    !samePreprocessing,
  ];

  const changeCount =
    changedFlags.filter(Boolean).length;

  const validity =
    changeCount <= 1
      ? 'high'
      : changeCount === 2
        ? 'medium'
        : 'low';

  const validityNote =
    validity === 'high'
      ? 'compatible evaluation conditions'
      : validity === 'medium'
        ? 'some configurations changed'
        : 'too many variables changed to isolate the source';

  const dataChanges: DataChangeRowShape[] = [
    {
      label: 'Dataset Version',
      baseline: baseline.datasetVersion,
      current: current.datasetVersion,
      delta: sameVersion ? 'no change' : 'changed',
      status: sameVersion
        ? 'no_change'
        : 'regression',
    },
  ];

  const experimentChanges: ComparisonResult['experimentChanges'] = [
  {
    label: 'Model Type',
    baseline: baseline.model,
    current: current.model,
    status: sameModel ? 'no_change' : 'changed',
  },
  {
    label: 'Git Commit',
    baseline: baseline.gitCommit,
    current: current.gitCommit,
    status: sameCommit ? 'no_change' : 'changed',
  },
  {
    label: 'Preprocessing Config',
    baseline: baseline.preprocessing,
    current: current.preprocessing,
    status: samePreprocessing ? 'no_change' : 'changed',
  },
  {
    label: 'Dataset Version',
    baseline: baseline.datasetVersion,
    current: current.datasetVersion,
    status: sameVersion ? 'no_change' : 'changed',
  },
];

  const evidence = [
    {
      title: 'metric evidence',
      items: [
        {
          kind: 'observed' as const,
          text: `F1 Score ${
            overallImpact === 'regression'
              ? 'decreased'
              : overallImpact === 'improvement'
                ? 'increased'
                : 'changed negligibly'
          } from ${f1Row.baseline.toFixed(
            3
          )} to ${f1Row.current.toFixed(3)}.`,
        },
        {
          kind: 'observed' as const,
          text: `Recall changed from ${metrics[2].baseline.toFixed(
            3
          )} to ${metrics[2].current.toFixed(3)}.`,
        },
      ],
    },

    {
      title: 'experiment evidence',
      items: [
        {
          kind: 'observed' as const,
          text: sameModel
            ? 'Model type did not change.'
            : `Model type changed from ${baseline.model} to ${current.model}.`,
        },
        {
          kind: 'observed' as const,
          text: sameCommit
            ? 'Git commit did not change.'
            : `Git commit changed from ${baseline.gitCommit} to ${current.gitCommit}.`,
        },
        {
          kind: 'observed' as const,
          text: samePreprocessing
            ? 'Preprocessing configuration did not change.'
            : `Preprocessing configuration changed from ${baseline.preprocessing} to ${current.preprocessing}.`,
        },
      ],
    },

    {
      title: 'interpretation',
      items: [
        {
          kind: 'likely' as const,

          text:
            overallImpact === 'regression'
              ? `${
                  !sameVersion
                    ? 'The dataset version change'
                    : !samePreprocessing
                      ? 'The preprocessing change'
                      : 'Configuration differences'
                } may have contributed to the observed regression.`
              : overallImpact === 'improvement'
                ? 'The changes made may have contributed to the observed improvement.'
                : 'No configuration change appears strongly linked to a metric shift.',
        },

        {
          kind: 'unknown' as const,
          text: 'Causation cannot be confirmed from this comparison alone.',
        },
      ],
    },
  ];

  const recommendation = {
    level:
      overallImpact === 'regression'
        ? ('review' as const)
        : overallImpact === 'improvement'
          ? ('approve' as const)
          : ('investigate' as const),

    title:
      overallImpact === 'regression'
        ? 'REVIEW'
        : overallImpact === 'improvement'
          ? 'APPROVE'
          : 'INVESTIGATE',

    reason:
      overallImpact === 'regression'
        ? `${
            !sameVersion
              ? 'Dataset version change and '
              : ''
          }configuration differences coincide with reduced model performance. This may have contributed, but requires further investigation.`

        : overallImpact === 'improvement'
          ? 'The current state shows improved metrics compared to baseline. Consider validating on a held-out set before adoption.'

          : 'No significant performance difference detected between these two states.',

    confidence:
      validity === 'high'
        ? 78
        : validity === 'medium'
          ? 55
          : 35,

    possibleActions:
      overallImpact === 'regression'
        ? [
            'Review data collection process.',
            'Check class imbalance.',
            'Compare preprocessing configurations.',
            'Retrain using controlled data.',
          ]
        : [
            'Validate on a held-out set.',
            'Consider saving as a new baseline.',
          ],
  };

  return {
    baseline,
    current,
    overallImpact,
    primaryMetricDeltaLabel,
    validity,
    validityNote,
    metrics,
    dataChanges,
    experimentChanges,
    evidence,
    recommendation,

    changesDetectedCount:
      changeCount +
      (overallImpact !== 'no_change' ? 1 : 0),
  };
}