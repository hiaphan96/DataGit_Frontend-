import type { MetricComparisonRow } from '../../types/evaluation';

interface PrimaryMetricsProps {
  rows: MetricComparisonRow[];
}

export function PrimaryMetrics({ rows }: PrimaryMetricsProps) {
  return (
    <div className="primary-metrics">
      <p className="section-label">primary metrics</p>
      <div className="primary-metrics__list">
        {rows.map((row) => {
          const isPositive = row.percentageChange > 0;
          const isNegative = row.percentageChange < 0;
          const arrow = isPositive ? '▲' : isNegative ? '▼' : '●';
          const changeClass = isPositive
            ? 'primary-metrics__change--positive'
            : isNegative
              ? 'primary-metrics__change--negative'
              : 'primary-metrics__change--neutral';

          return (
            <div className="primary-metrics__row" key={row.key}>
              <span className="primary-metrics__label">{row.label}</span>
              <span className="primary-metrics__value">{row.current.toFixed(3)}</span>
              <span className={`primary-metrics__change ${changeClass}`}>
                {arrow} {isPositive ? '+' : ''}
                {row.percentageChange.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PrimaryMetrics;