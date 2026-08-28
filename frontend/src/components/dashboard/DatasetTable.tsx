import SectionLabel from '../common/SectionLabel';
import StatusBadge from '../common/StatusBadge';
import type { DatasetSummary } from '../../types/dataset';

interface DatasetTableProps {
  datasets: DatasetSummary[];
}

const TONE_BY_STATUS: Record<DatasetSummary['status'], 'positive' | 'neutral' | 'negative'> = {
  healthy: 'positive',
  warning: 'neutral',
  regression: 'negative',
};

export function DatasetTable({ datasets }: DatasetTableProps) {
  return (
    <section className="dataset-table-section">
      <SectionLabel>DATASET STATUS</SectionLabel>
      <div className="dataset-table-scroll">
        <table className="dataset-table">
          <thead>
            <tr>
              <th>DATASET</th>
              <th>TASK</th>
              <th>VERSION</th>
              <th>LAST EXPERIMENT</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {datasets.map((dataset) => (
              <tr key={dataset.id}>
                <td>{dataset.name}</td>
                <td>{dataset.task}</td>
                <td>{dataset.version}</td>
                <td>{dataset.lastExperiment}</td>
                <td>
                  <StatusBadge label={dataset.status} tone={TONE_BY_STATUS[dataset.status]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default DatasetTable;