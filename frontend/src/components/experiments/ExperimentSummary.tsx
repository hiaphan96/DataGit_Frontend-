import type { ExperimentRun } from '../../types/experimentRun';

interface ExperimentSummaryProps {
  experiments: ExperimentRun[];
}

export function ExperimentSummary({ experiments }: ExperimentSummaryProps) {
  const total = experiments.length;

  const bestF1 = experiments.reduce((max, exp) => {
    const f1 = exp.metrics.f1Score;
    return f1 != null && f1 > max ? f1 : max;
  }, 0);

  const active = experiments.filter((exp) => exp.status === 'running').length;
  const completed = experiments.filter((exp) => exp.status === 'completed').length;

  return (
    <div className="experiment-summary-grid">
      <div className="metric-panel">
        <p className="metric-panel__label">TOTAL</p>
        <p className="metric-panel__value">{total}</p>
        <p className="metric-panel__sublabel">total experiments</p>
      </div>
      <div className="metric-panel">
        <p className="metric-panel__label">BEST F1</p>
        <p className="metric-panel__value">{bestF1.toFixed(3)}</p>
        <p className="metric-panel__sublabel">best recorded score</p>
      </div>
      <div className="metric-panel">
        <p className="metric-panel__label">ACTIVE</p>
        <p className="metric-panel__value metric-panel__value--accent">{active}</p>
        <p className="metric-panel__sublabel">currently running</p>
      </div>
      <div className="metric-panel">
        <p className="metric-panel__label">COMPLETED</p>
        <p className="metric-panel__value">{completed}</p>
        <p className="metric-panel__sublabel">completed runs</p>
      </div>
    </div>
  );
}

export default ExperimentSummary;