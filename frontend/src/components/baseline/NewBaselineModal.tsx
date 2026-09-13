import { useState } from 'react';
import Button from '../common/Button';
import Select from '../common/Select';
import Input from '../common/Input';
import SectionLabel from '../common/SectionLabel';
import type { ExperimentRun } from '../../types/experimentRun';
import type { NewBaselineFormValues } from '../../types/baseline';

interface NewBaselineModalProps {
  experiments: ExperimentRun[];
  onCancel: () => void;
  onCreate: (values: NewBaselineFormValues) => void;
}

export function NewBaselineModal({ experiments, onCancel, onCreate }: NewBaselineModalProps) {
  const completedExperiments = experiments.filter((exp) => exp.status === 'completed');
  const [experimentId, setExperimentId] = useState(completedExperiments[0]?.id ?? '');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const selectedExperiment = completedExperiments.find((exp) => exp.id === experimentId) ?? null;

  const handleSubmit = () => {
    if (!experimentId) {
      setError('source experiment is required');
      return;
    }
    if (!name.trim()) {
      setError('baseline name is required');
      return;
    }
    setError(null);
    onCreate({ experimentId, name: name.trim() });
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <p className="modal__title">new baseline</p>

        {completedExperiments.length === 0 ? (
          <p className="baseline-modal__empty">no completed experiments available to use as a baseline source.</p>
        ) : (
          <>
            <div className="modal__field">
              <SectionLabel>source experiment</SectionLabel>
              <Select
                value={experimentId}
                onChange={(e) => setExperimentId(e.target.value)}
                options={completedExperiments.map((exp) => ({ value: exp.id, label: exp.id }))}
              />
            </div>

            <div className="modal__field">
              <SectionLabel>baseline name</SectionLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. RF Baseline V02"
              />
            </div>

            {selectedExperiment ? (
              <div className="baseline-modal__preview">
                <div className="baseline-modal__preview-row">
                  <span className="baseline-modal__preview-label">model</span>
                  <span className="baseline-modal__preview-value">{selectedExperiment.model}</span>
                </div>
                <div className="baseline-modal__preview-row">
                  <span className="baseline-modal__preview-label">dataset version</span>
                  <span className="baseline-modal__preview-value">{selectedExperiment.datasetVersion}</span>
                </div>
                <div className="baseline-modal__preview-row">
                  <span className="baseline-modal__preview-label">f1 score</span>
                  <span className="baseline-modal__preview-value">
                    {selectedExperiment.metrics.f1Score?.toFixed(3) ?? '—'}
                  </span>
                </div>
              </div>
            ) : null}
          </>
        )}

        {error ? <p className="modal__error">{error}</p> : null}

        <div className="modal__actions">
          <Button type="button" variant="secondary" onClick={onCancel}>
            cancel
          </Button>
          <Button type="button" variant="primary" onClick={handleSubmit} disabled={completedExperiments.length === 0}>
            create baseline
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NewBaselineModal;