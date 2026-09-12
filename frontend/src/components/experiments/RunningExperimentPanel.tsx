import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import { MODEL_LABELS, type ExperimentRun } from '../../types/experimentRun';

interface RunningExperimentPanelProps {
  experiment: ExperimentRun;
  onViewDetails: (experiment: ExperimentRun) => void;
}

export function RunningExperimentPanel({ experiment, onViewDetails }: RunningExperimentPanelProps) {
  const progress = experiment.progress ?? 0;

  return (
    <div className="running-experiment">
      <div className="running-experiment__header">
        <div className="running-experiment__title-group">
          <span className="running-experiment__id">{experiment.id}</span>
          <span className="running-experiment__desc">
            {MODEL_LABELS[experiment.model]} on {experiment.datasetVersion}
          </span>
          <StatusBadge tone="neutral" label="RUNNING" />
        </div>
        <Button type="button" variant="secondary" onClick={() => onViewDetails(experiment)}>
          view details
        </Button>
      </div>

      <div className="running-experiment__progress-row">
        <div className="running-experiment__progress-track">
          <div className="running-experiment__progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="running-experiment__progress-label">{progress}%</span>
        {experiment.eta ? <span className="running-experiment__eta">ETA: {experiment.eta}</span> : null}
      </div>
    </div>
  );
}

export default RunningExperimentPanel;