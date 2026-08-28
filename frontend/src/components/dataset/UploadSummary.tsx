import SectionLabel from '../common/SectionLabel';
import { TASK_TYPE_OPTIONS, type DatasetUploadForm } from '../../types/dataset';

interface UploadSummaryProps {
  form: DatasetUploadForm;
  estimatedSize: string;
}

export function UploadSummary({ form, estimatedSize }: UploadSummaryProps) {
  const taskLabel = TASK_TYPE_OPTIONS.find((t) => t.value === form.taskType)?.label ?? form.taskType;
  const createdOn = new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

  const rows = [
    { label: 'dataset name', value: form.datasetName || '—' },
    { label: 'task type', value: taskLabel },
    { label: 'train file', value: form.trainFile.fileName || '—' },
    { label: 'test file', value: form.testFile.fileName || '—' },
    { label: 'created by', value: 'guest' },
    { label: 'created on', value: createdOn },
    { label: 'estimated size', value: estimatedSize },
  ];

  return (
    <section className="dataset-panel">
      <SectionLabel>upload summary</SectionLabel>
      <dl className="dataset-summary-list">
        {rows.map((row) => (
          <div className="dataset-summary-row" key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default UploadSummary;