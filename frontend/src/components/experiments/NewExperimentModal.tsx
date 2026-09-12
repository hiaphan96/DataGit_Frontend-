import { useState } from 'react';
import Button from '../common/Button';
import Select from '../common/Select';
import Input from '../common/Input';
import SectionLabel from '../common/SectionLabel';
import { MODEL_OPTIONS, INITIAL_EXPERIMENT_FORM, type NewExperimentFormValues } from '../../types/experimentRun';
import type { DatasetSummary } from '../../types/dataset';

const VERSION_OPTIONS = [
  { value: 'V01', label: 'V01' },
  { value: 'V02', label: 'V02' },
  { value: 'V03', label: 'V03' },
];

interface NewExperimentModalProps {
  datasets: DatasetSummary[];
  onCancel: () => void;
  onCreate: (values: NewExperimentFormValues) => void;
}

export function NewExperimentModal({ datasets, onCancel, onCreate }: NewExperimentModalProps) {
  const [values, setValues] = useState<NewExperimentFormValues>({
    ...INITIAL_EXPERIMENT_FORM,
    datasetName: datasets[0]?.name ?? '',
  });
  const [error, setError] = useState<string | null>(null);

  const datasetOptions = datasets.map((ds) => ({ value: ds.name, label: ds.name }));

  const handleSubmit = () => {
    if (!values.datasetName) {
      setError('dataset is required');
      return;
    }
    if (!values.datasetVersion) {
      setError('dataset version is required');
      return;
    }
    if (!values.model) {
      setError('model is required');
      return;
    }
    setError(null);
    onCreate(values);
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <p className="modal__title">new experiment</p>

        <div className="modal__field">
          <SectionLabel>dataset</SectionLabel>
          <Select
            value={values.datasetName}
            onChange={(e) => setValues((prev) => ({ ...prev, datasetName: e.target.value }))}
            options={datasetOptions}
          />
        </div>

        <div className="modal__field">
          <SectionLabel>dataset version</SectionLabel>
          <Select
            value={values.datasetVersion}
            onChange={(e) => setValues((prev) => ({ ...prev, datasetVersion: e.target.value }))}
            options={VERSION_OPTIONS}
          />
        </div>

        <div className="modal__field">
          <SectionLabel>model</SectionLabel>
          <Select
            value={values.model}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, model: e.target.value as NewExperimentFormValues['model'] }))
            }
            options={MODEL_OPTIONS}
          />
        </div>

        <div className="modal__field">
          <SectionLabel>model parameters</SectionLabel>
          <div className="modal__param-grid">
            <div className="modal__param">
              <label className="modal__param-label">n_estimators</label>
              <Input
                type="number"
                value={values.parameters.n_estimators ?? ''}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    parameters: { ...prev.parameters, n_estimators: Number(e.target.value) },
                  }))
                }
              />
            </div>
            <div className="modal__param">
              <label className="modal__param-label">max_depth</label>
              <Input
                type="number"
                value={values.parameters.max_depth ?? ''}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    parameters: { ...prev.parameters, max_depth: Number(e.target.value) },
                  }))
                }
              />
            </div>
            <div className="modal__param">
              <label className="modal__param-label">random_state</label>
              <Input
                type="number"
                value={values.parameters.random_state ?? ''}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    parameters: { ...prev.parameters, random_state: Number(e.target.value) },
                  }))
                }
              />
            </div>
          </div>
        </div>

        {error ? <p className="modal__error">{error}</p> : null}

        <div className="modal__actions">
          <Button type="button" variant="secondary" onClick={onCancel}>
            cancel
          </Button>
          <Button type="button" variant="primary" onClick={handleSubmit}>
            create experiment
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NewExperimentModal;