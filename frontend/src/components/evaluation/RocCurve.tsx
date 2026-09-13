import type { RocPoint } from '../../types/evaluation';

interface RocCurveProps {
  points: RocPoint[];
  auc: number;
}

const CHART_SIZE = 320;
const PADDING = 36;

function toX(fpr: number): number {
  return PADDING + fpr * (CHART_SIZE - PADDING * 2);
}

function toY(tpr: number): number {
  return CHART_SIZE - PADDING - tpr * (CHART_SIZE - PADDING * 2);
}

function buildPath(points: RocPoint[]): string {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toX(p.fpr)} ${toY(p.tpr)}`).join(' ');
}

export function RocCurve({ points, auc }: RocCurveProps) {
  const ticks = [0, 0.5, 1];

  return (
    <div className="roc-curve">
      <div className="roc-curve__header">
        <p className="section-label">roc curve</p>
        <span className="roc-curve__auc">AUC = {auc.toFixed(3)}</span>
      </div>

      <svg
        viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
        className="roc-curve__svg"
        role="img"
        aria-label="ROC curve"
      >
        {ticks.map((t) => (
          <g key={`grid-${t}`}>
            <line x1={toX(t)} x2={toX(t)} y1={PADDING} y2={CHART_SIZE - PADDING} className="roc-curve__gridline" />
            <line x1={PADDING} x2={CHART_SIZE - PADDING} y1={toY(t)} y2={toY(t)} className="roc-curve__gridline" />
          </g>
        ))}

        <line
          x1={toX(0)}
          y1={toY(0)}
          x2={toX(1)}
          y2={toY(1)}
          className="roc-curve__diagonal"
        />

        <path d={buildPath(points)} className="roc-curve__line" />

        {points.map((p, i) => (
          <circle key={i} cx={toX(p.fpr)} cy={toY(p.tpr)} r={3} className="roc-curve__dot" />
        ))}

        <text x={CHART_SIZE / 2} y={CHART_SIZE - 6} className="roc-curve__axis-label" textAnchor="middle">
          false positive rate
        </text>
        <text
          x={-CHART_SIZE / 2}
          y={12}
          className="roc-curve__axis-label"
          textAnchor="middle"
          transform="rotate(-90)"
        >
          true positive rate
        </text>
      </svg>
    </div>
  );
}

export default RocCurve;