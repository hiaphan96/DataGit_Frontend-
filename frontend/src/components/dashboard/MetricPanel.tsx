import type { MetricTrendRow } from '../../types/dashboard';

interface MetricPanelProps {
  label: string;
  value?: string;
  sublabel?: string;
  rows?: MetricTrendRow[];
}

const DIRECTION_SYMBOL: Record<MetricTrendRow['direction'], string> = {
  up: '↑',
  down: '↓',
  flat: '−',
};

const DIRECTION_TONE: Record<MetricTrendRow['direction'], string> = {
  up: 'metric-panel__row--positive',
  down: 'metric-panel__row--negative',
  flat: 'metric-panel__row--neutral',
};

export function MetricPanel({ label, value, sublabel, rows }: MetricPanelProps) {
  return (
    <div className="metric-panel">
      <p className="metric-panel__label">{label}</p>
      {rows ? (
        <div className="metric-panel__rows">
          {rows.map((row) => (
            <p key={row.label} className={`metric-panel__row ${DIRECTION_TONE[row.direction]}`}>
              <span>
                {DIRECTION_SYMBOL[row.direction]} {row.count}
              </span>{' '}
              {row.label}
            </p>
          ))}
        </div>
      ) : (
        <>
          <p className="metric-panel__value">{value}</p>
          <p className="metric-panel__sublabel">{sublabel}</p>
        </>
      )}
    </div>
  );
}

export default MetricPanel;