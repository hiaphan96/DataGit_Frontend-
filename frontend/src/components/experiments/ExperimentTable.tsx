import StatusBadge from '../common/StatusBadge';
import { MODEL_LABELS, formatMetric, type ExperimentRun, type ExperimentStatus } from '../../types/experimentRun';

const STATUS_TONE: Record<ExperimentStatus, 'positive' | 'neutral' | 'negative'> = {
  running: 'neutral',
  completed: 'positive',
  failed: 'negative',
};

const STATUS_LABEL: Record<ExperimentStatus, string> = {
  running: 'Running',
  completed: 'Completed',
  failed: 'Failed',
};

interface ExperimentTableProps {
  experiments: ExperimentRun[];
  onSelect: (experiment: ExperimentRun) => void;
}

export function ExperimentTable({ experiments, onSelect }: ExperimentTableProps) {
  return (
    <div className="dataset-table-section">
      <p className="section-label">experiments</p>
      <div className="dataset-table-scroll">
        <table className="dataset-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>MODEL</th>
              <th>VERSION</th>
              <th>F1 SCORE</th>
              <th>STATUS</th>
              <th>CREATED</th>
            </tr>
          </thead>
          <tbody>
            {experiments.map((exp) => (
              <tr
                key={exp.id}
                className="experiment-table__row"
                onClick={() => onSelect(exp)}
              >
                <td className="experiment-table__id">{exp.id}</td>
                <td>{MODEL_LABELS[exp.model]}</td>
                <td>{exp.datasetVersion}</td>
                <td>{formatMetric(exp.metrics.f1Score)}</td>
                <td>
                  <StatusBadge tone={STATUS_TONE[exp.status]} label={STATUS_LABEL[exp.status]} />
                </td>
                <td>{exp.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExperimentTable;