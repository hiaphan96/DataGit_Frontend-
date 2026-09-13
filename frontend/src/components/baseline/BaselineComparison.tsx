import type { Baseline } from '../../types/baseline';

interface BaselineComparisonProps {
  baselines: Baseline[];
  selectedId?: string | null;
}

const CHART_WIDTH = 420;
const CHART_HEIGHT = 240;
const PADDING_LEFT = 36;
const PADDING_RIGHT = 16;
const PADDING_TOP = 32;
const PADDING_BOTTOM = 28;
const Y_MAX = 1.0;

export function BaselineComparison({ baselines, selectedId }: BaselineComparisonProps) {
  const plotWidth = CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const plotHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const barSlot = plotWidth / baselines.length;
  const barWidth = barSlot * 0.46;

  const bestValue = baselines.reduce((max, b) => Math.max(max, b.metricValue), 0);
  const fallbackHighlightId = baselines.find((b) => b.metricValue === bestValue)?.id ?? null;
  const activeId = selectedId ?? fallbackHighlightId;

  const yTicks = [0, 0.5, 1.0];

  function toY(value: number): number {
    const ratio = Math.min(value, Y_MAX) / Y_MAX;
    return PADDING_TOP + plotHeight - ratio * plotHeight;
  }

  return (
    <div className="baseline-comparison">
      <p className="section-label">baseline comparison</p>

      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="baseline-comparison__svg"
        role="img"
        aria-label="Baseline metric comparison chart"
      >
        <defs>
          <linearGradient id="barGradientActive" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7cf0a8" />
            <stop offset="100%" stopColor="#2c8f5b" />
          </linearGradient>
          <linearGradient id="barGradientNormal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4a5850" />
            <stop offset="100%" stopColor="#232824" />
          </linearGradient>
          <filter id="barShadow" x="-40%" y="-20%" width="180%" height="150%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.45" />
          </filter>
        </defs>

        <line
          x1={PADDING_LEFT}
          x2={CHART_WIDTH - PADDING_RIGHT}
          y1={toY(0)}
          y2={toY(0)}
          className="baseline-comparison__floor"
        />

        {yTicks.map((tick) => (
          <g key={tick}>
            {tick > 0 ? (
              <line
                x1={PADDING_LEFT}
                x2={CHART_WIDTH - PADDING_RIGHT}
                y1={toY(tick)}
                y2={toY(tick)}
                className="baseline-comparison__gridline"
              />
            ) : null}
            <text
              x={PADDING_LEFT - 8}
              y={toY(tick) + 4}
              className="baseline-comparison__axis-label"
              textAnchor="end"
            >
              {tick.toFixed(2)}
            </text>
          </g>
        ))}

        {baselines.map((b, i) => {
          const isActive = b.id === activeId;
          const barHeight = plotHeight * (Math.min(b.metricValue, Y_MAX) / Y_MAX);
          const x = PADDING_LEFT + i * barSlot + (barSlot - barWidth) / 2;
          const y = PADDING_TOP + plotHeight - barHeight;
          const fill = isActive ? 'url(#barGradientActive)' : 'url(#barGradientNormal)';

          return (
            <g key={b.id} filter="url(#barShadow)">
              <rect x={x} y={y} width={barWidth} height={barHeight} rx={3} fill={fill} />
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.min(6, barHeight)}
                rx={3}
                className={isActive ? 'baseline-comparison__bar-highlight--active' : 'baseline-comparison__bar-highlight'}
              />
              <text
                x={x + barWidth / 2}
                y={y - 10}
                className={`baseline-comparison__value-label ${isActive ? 'baseline-comparison__value-label--active' : ''}`}
                textAnchor="middle"
              >
                {b.metricValue.toFixed(3)}
              </text>
              <text
                x={x + barWidth / 2}
                y={CHART_HEIGHT - 8}
                className={`baseline-comparison__axis-label ${isActive ? 'baseline-comparison__axis-label--active' : ''}`}
                textAnchor="middle"
              >
                {b.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default BaselineComparison;