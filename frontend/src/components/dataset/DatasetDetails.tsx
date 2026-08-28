import SectionLabel from '../common/SectionLabel';
import Input from '../common/Input';
import Select from '../common/Select';
import { TASK_TYPE_OPTIONS, type DatasetUploadForm, type TaskType } from '../../types/dataset';

interface DatasetDetailsProps {
  form: DatasetUploadForm;
  datasetNameError: string | null;
  onDatasetNameChange: (v: string) => void;
  onTaskTypeChange: (v: TaskType) => void;
  onTextFieldChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
}

const DESCRIPTION_MAX = 280;

export function DatasetDetails({ form, datasetNameError, onDatasetNameChange, onTaskTypeChange, onTextFieldChange, onDescriptionChange }: DatasetDetailsProps) {
  const detectedColumns = form.trainFile.detectedColumns;

  return (
    <section className="dataset-panel">
      <SectionLabel>1. dataset details</SectionLabel>

      <div className="dataset-field">
        <label htmlFor="dataset-name">dataset name</label>
        <Input
          id="dataset-name"
          value={form.datasetName}
          onChange={(e) => onDatasetNameChange(e.target.value)}
          error={form.datasetName ? datasetNameError : null}
          valid={!!form.datasetName && !datasetNameError}
          placeholder="reviews_dataset"
        />
      </div>

      <div className="dataset-field-row">
        <div className="dataset-field">
          <label htmlFor="task-type">task type</label>
          <Select id="task-type" options={TASK_TYPE_OPTIONS} value={form.taskType} onChange={(e) => onTaskTypeChange(e.target.value as TaskType)} />
        </div>
        <div className="dataset-field">
          <label htmlFor="text-field">text field / target column</label>
          {detectedColumns.length > 0 ? (
            <Select
              id="text-field"
              options={[{ value: '', label: 'select a column...' }, ...detectedColumns.map((c) => ({ value: c, label: c }))]}
              value={form.textField}
              onChange={(e) => onTextFieldChange(e.target.value)}
            />
          ) : (
            <Input id="text-field" value={form.textField} onChange={(e) => onTextFieldChange(e.target.value)} placeholder="upload a training file to detect columns" />
          )}
        </div>
      </div>

      <div className="dataset-field">
        <label htmlFor="description">description (optional)</label>
        <textarea
          id="description"
          className="dataset-textarea"
          maxLength={DESCRIPTION_MAX}
          value={form.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Customer reviews dataset for sentiment classification."
          rows={3}
        />
        <p className="dataset-char-counter">{form.description.length} / {DESCRIPTION_MAX}</p>
      </div>
    </section>
  );
}

export default DatasetDetails;