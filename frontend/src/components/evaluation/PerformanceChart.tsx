import type { EvaluationMetrics } from '../../types/evaluation';

interface PerformanceChartProps {
  current: EvaluationMetrics;
  previous: EvaluationMetrics;
  currentLabel: string;
  previousLabel: string;
}

const METRIC_KEYS: { key: keyof EvaluationMetrics; label: string }[] = [
  { key: 'accuracy', label: 'Accuracy' },
  { key: 'precision', label: 'Precision' },
  { key: 'recall', label: 'Recall' },
  { key: 'f1Score', label: 'F1' },
  { key: 'aucRoc', label: 'AUC' },
];

const CHART_WIDTH = 460;
const CHART_HEIGHT = 220;
const PADDING_LEFT = 40;
const PADDING_RIGHT = 20;
const PADDING_TOP = 20;
const PADDING_BOTTOM = 30;
const Y_MIN = 0.6;
const Y_MAX = 1.0;

function toX(index: number, count: number): number {
  const plotWidth = CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT;
  return PADDING_LEFT + (index / (count - 1)) * plotWidth;
}

function toY(value: number): number {
  const plotHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const clamped = Math.min(Math.max(value, Y_MIN), Y_MAX);
  const ratio = (clamped - Y_MIN) / (Y_MAX - Y_MIN);
  return PADDING_TOP + plotHeight - ratio * plotHeight;
}

function buildPath(values: number[]): string {
  return values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${toX(i, values.length)} ${toY(v)}`).join(' ');
}

export function PerformanceChart({ current, previous, currentLabel, previousLabel }: PerformanceChartProps) {
  const currentValues = METRIC_KEYS.map((m) => current[m.key]);
  const previousValues = METRIC_KEYS.map((m) => previous[m.key]);

  const yTicks = [0.6, 0.8, 1.0];

  return (
    <div className="performance-chart">
      <p className="section-label">performance trend</p>

      <div className="performance-chart__legend">
        <span className="performance-chart__legend-item">
          <span className="performance-chart__legend-swatch performance-chart__legend-swatch--previous" />
          {previousLabel}
        </span>
        <span className="performance-chart__legend-item">
          <span className="performance-chart__legend-swatch performance-chart__legend-swatch--current" />
          {currentLabel}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="performance-chart__svg"
        role="img"
        aria-label="Performance comparison chart"
      >
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={PADDING_LEFT}
              x2={CHART_WIDTH - PADDING_RIGHT}
              y1={toY(tick)}
              y2={toY(tick)}
              className="performance-chart__gridline"
            />
            <text x={PADDING_LEFT - 8} y={toY(tick) + 4} className="performance-chart__axis-label" textAnchor="end">
              {tick.toFixed(2)}
            </text>
          </g>
        ))}

        <path d={buildPath(previousValues)} className="performance-chart__line performance-chart__line--previous" />
        <path d={buildPath(currentValues)} className="performance-chart__line performance-chart__line--current" />

        {previousValues.map((v, i) => (
          <circle
            key={`prev-${i}`}
            cx={toX(i, previousValues.length)}
            cy={toY(v)}
            r={3.5}
            className="performance-chart__dot performance-chart__dot--previous"
          />
        ))}
        {currentValues.map((v, i) => (
          <circle
            key={`curr-${i}`}
            cx={toX(i, currentValues.length)}
            cy={toY(v)}
            r={3.5}
            className="performance-chart__dot performance-chart__dot--current"
          />
        ))}

        {METRIC_KEYS.map((m, i) => (
          <text
            key={m.key}
            x={toX(i, METRIC_KEYS.length)}
            y={CHART_HEIGHT - 8}
            className="performance-chart__axis-label"
            textAnchor="middle"
          >
            {m.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default PerformanceChart;