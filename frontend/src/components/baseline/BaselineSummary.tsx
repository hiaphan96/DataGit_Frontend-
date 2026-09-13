import type { Baseline } from '../../types/baseline';

interface BaselineSummaryProps {
  baselines: Baseline[];
}

export function BaselineSummary({ baselines }: BaselineSummaryProps) {
  const total = baselines.length;
  const bestF1 = baselines.reduce((max, b) => (b.metricValue > max ? b.metricValue : max), 0);
  const best = baselines.find((b) => b.metricValue === bestF1);
  const averageF1 = total === 0 ? 0 : baselines.reduce((sum, b) => sum + b.metricValue, 0) / total;

  return (
    <div className="baseline-summary">
      <p className="section-label">baseline summary</p>

      <div className="baseline-summary__hero">
        <span className="baseline-summary__hero-label">best f1 score</span>
        <span className="baseline-summary__hero-value">{bestF1.toFixed(3)}</span>
        {best ? <span className="baseline-summary__hero-tag">{best.id} · {best.model}</span> : null}
      </div>

      <div className="baseline-summary__footer">
        <div className="baseline-summary__footer-item">
          <span className="baseline-summary__footer-label">total baselines</span>
          <span className="baseline-summary__footer-value">{total}</span>
        </div>
        <div className="baseline-summary__footer-item">
          <span className="baseline-summary__footer-label">average f1</span>
          <span className="baseline-summary__footer-value">{averageF1.toFixed(3)}</span>
        </div>
      </div>
    </div>
  );
}

export default BaselineSummary;