import type { EvaluationMetrics, PerClassMetric } from '../../types/evaluation';

interface MetricsDetailsProps {
  metrics: EvaluationMetrics;
  perClassMetrics: PerClassMetric[];
}

const METRIC_ROWS: { key: keyof EvaluationMetrics; label: string }[] = [
  { key: 'accuracy', label: 'Accuracy' },
  { key: 'precision', label: 'Precision' },
  { key: 'recall', label: 'Recall' },
  { key: 'f1Score', label: 'F1 Score' },
  { key: 'aucRoc', label: 'AUC-ROC' },
];

export function MetricsDetails({ metrics, perClassMetrics }: MetricsDetailsProps) {
  return (
    <div className="metrics-details">
      <div className="metrics-details__overview">
        <p className="section-label">detailed metrics</p>
        <div className="metrics-details__list">
          {METRIC_ROWS.map((row) => (
            <div className="metrics-details__row" key={row.key}>
              <span className="metrics-details__label">{row.label}</span>
              <span className="metrics-details__value">{metrics[row.key].toFixed(3)}</span>
            </div>
          ))}
        </div>
      </div>

      {perClassMetrics.length > 0 ? (
        <div className="metrics-details__per-class">
          <p className="section-label">per-class metrics</p>
          <div className="dataset-table-scroll">
            <table className="dataset-table">
              <thead>
                <tr>
                  <th>CLASS</th>
                  <th>PRECISION</th>
                  <th>RECALL</th>
                  <th>F1 SCORE</th>
                </tr>
              </thead>
              <tbody>
                {perClassMetrics.map((row) => (
                  <tr key={row.className}>
                    <td>{row.className}</td>
                    <td>{row.precision.toFixed(2)}</td>
                    <td>{row.recall.toFixed(2)}</td>
                    <td>{row.f1Score.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default MetricsDetails;