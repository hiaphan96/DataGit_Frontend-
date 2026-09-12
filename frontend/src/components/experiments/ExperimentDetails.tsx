import Button from '../common/Button';
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

interface ExperimentDetailsProps {
  experiment: ExperimentRun;
  onClose: () => void;
}

export function ExperimentDetails({ experiment, onClose }: ExperimentDetailsProps) {
  const { parameters, metrics } = experiment;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <p className="modal__title">experiment details</p>

        <div className="experiment-details__row">
          <span className="experiment-details__label">experiment ID</span>
          <span className="experiment-details__value">{experiment.id}</span>
        </div>
        <div className="experiment-details__row">
          <span className="experiment-details__label">status</span>
          <StatusBadge tone={STATUS_TONE[experiment.status]} label={STATUS_LABEL[experiment.status]} />
        </div>
        <div className="experiment-details__row">
          <span className="experiment-details__label">dataset</span>
          <span className="experiment-details__value">{experiment.datasetName}</span>
        </div>
        <div className="experiment-details__row">
          <span className="experiment-details__label">dataset version</span>
          <span className="experiment-details__value">{experiment.datasetVersion}</span>
        </div>
        <div className="experiment-details__row">
          <span className="experiment-details__label">model</span>
          <span className="experiment-details__value">{MODEL_LABELS[experiment.model]}</span>
        </div>

        <p className="experiment-details__subheading">parameters</p>
        {Object.entries(parameters).length === 0 ? (
          <p className="experiment-details__empty">no parameters recorded</p>
        ) : (
          Object.entries(parameters).map(([key, value]) => (
            <div className="experiment-details__row" key={key}>
              <span className="experiment-details__label">{key}</span>
              <span className="experiment-details__value">{value}</span>
            </div>
          ))
        )}

        <p className="experiment-details__subheading">metrics</p>
        <div className="experiment-details__row">
          <span className="experiment-details__label">accuracy</span>
          <span className="experiment-details__value">{formatMetric(metrics.accuracy)}</span>
        </div>
        <div className="experiment-details__row">
          <span className="experiment-details__label">precision</span>
          <span className="experiment-details__value">{formatMetric(metrics.precision)}</span>
        </div>
        <div className="experiment-details__row">
          <span className="experiment-details__label">recall</span>
          <span className="experiment-details__value">{formatMetric(metrics.recall)}</span>
        </div>
        <div className="experiment-details__row">
          <span className="experiment-details__label">f1 score</span>
          <span className="experiment-details__value">{formatMetric(metrics.f1Score)}</span>
        </div>

        <div className="experiment-details__row">
          <span className="experiment-details__label">created</span>
          <span className="experiment-details__value">{experiment.createdAt}</span>
        </div>

        <div className="modal__actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ExperimentDetails;