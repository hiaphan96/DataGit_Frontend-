import SectionLabel from '../common/SectionLabel';
import type { OverallValidationStatus, ValidationCheckResult } from '../../types/validation';

interface ValidationChecklistProps {
  checks: ValidationCheckResult[];
  overallStatus: OverallValidationStatus;
}

const ICONS: Record<ValidationCheckResult['status'], string> = {
  pending: '○',
  running: '●',
  success: '✓',
  warning: '⚠',
  error: '✕',
};

export function ValidationChecklist({ checks, overallStatus }: ValidationChecklistProps) {
  return (
    <section className="dataset-panel">
      <SectionLabel>validation status</SectionLabel>

      {overallStatus === 'running' && <p className="dataset-validation-banner dataset-validation-banner--running">running initial validation...</p>}
      {overallStatus === 'success' && <p className="dataset-validation-banner dataset-validation-banner--success">✓ dataset ready</p>}
      {overallStatus === 'warning' && <p className="dataset-validation-banner dataset-validation-banner--warning">⚠ completed with warnings</p>}
      {overallStatus === 'error' && <p className="dataset-validation-banner dataset-validation-banner--error">✕ validation failed</p>}

      <ul className="dataset-check-list" aria-live="polite">
        {checks.map((check) => (
          <li key={check.id} className={`dataset-check dataset-check--${check.status}`}>
            <span className={`dataset-check__icon ${check.status === 'running' ? 'dataset-check__icon--spin' : ''}`}>{ICONS[check.status]}</span>
            <span className="dataset-check__name">{check.name}</span>
            <span className="dataset-check__message">
              {check.status === 'pending' && 'pending'}
              {check.status === 'running' && 'in progress...'}
              {(check.status === 'success' || check.status === 'warning' || check.status === 'error') && (check.message ?? check.status)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ValidationChecklist;