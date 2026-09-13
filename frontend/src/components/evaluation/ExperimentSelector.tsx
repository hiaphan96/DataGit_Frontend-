import Select from '../common/Select';
import type { EvaluationData } from '../../types/evaluation';

interface ExperimentSelectorProps {
  evaluableIds: string[];
  selectedId: string;
  evaluation: EvaluationData;
  onSelect: (id: string) => void;
}

export function ExperimentSelector({ evaluableIds, selectedId, evaluation, onSelect }: ExperimentSelectorProps) {
  const options = evaluableIds.map((id) => ({ value: id, label: id }));

  return (
    <div className="experiment-selector">
      <div className="experiment-selector__control">
        <span className="experiment-selector__label">select experiment</span>
        <Select value={selectedId} onChange={(e) => onSelect(e.target.value)} options={options} />
      </div>

      <div className="experiment-selector__context">
        <div className="experiment-selector__context-item">
          <span className="experiment-selector__context-label">dataset</span>
          <span className="experiment-selector__context-value">{evaluation.datasetName}</span>
        </div>
        <div className="experiment-selector__context-item">
          <span className="experiment-selector__context-label">version</span>
          <span className="experiment-selector__context-value">{evaluation.datasetVersion}</span>
        </div>
        <div className="experiment-selector__context-item">
          <span className="experiment-selector__context-label">model</span>
          <span className="experiment-selector__context-value">{evaluation.model}</span>
        </div>
        <div className="experiment-selector__context-item">
          <span className="experiment-selector__context-label">status</span>
          <span className="experiment-selector__context-value experiment-selector__context-value--accent">
            {evaluation.status}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ExperimentSelector;