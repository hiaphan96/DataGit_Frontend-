import type { Baseline } from '../../types/baseline';

interface BaselineTableProps {
  baselines: Baseline[];
  onSelect: (baseline: Baseline) => void;
}

export function BaselineTable({ baselines, onSelect }: BaselineTableProps) {
  if (baselines.length === 0) {
    return (
      <div className="module-placeholder module-placeholder--inline">
        <p className="module-placeholder__message">no baselines created yet.</p>
      </div>
    );
  }

  return (
    <div className="dataset-table-section">
      <p className="section-label">baselines</p>
      <div className="dataset-table-scroll">
        <table className="dataset-table">
          <thead>
            <tr>
              <th>BASELINE ID</th>
              <th>NAME</th>
              <th>MODEL</th>
              <th>DATA VERSION</th>
              <th>METRIC ({baselines[0]?.metricName ?? 'F1'})</th>
              <th>CREATED AT</th>
            </tr>
          </thead>
          <tbody>
            {baselines.map((baseline) => (
              <tr key={baseline.id} className="experiment-table__row" onClick={() => onSelect(baseline)}>
                <td className="experiment-table__id">{baseline.id}</td>
                <td>{baseline.name}</td>
                <td>{baseline.model}</td>
                <td>{baseline.datasetVersion}</td>
                <td>{baseline.metricValue.toFixed(3)}</td>
                <td>{baseline.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default BaselineTable;