import Button from '../common/Button';
import type { OverallValidationStatus } from '../../types/validation';

interface UploadActionsProps {
  overallStatus: OverallValidationStatus;
  formError: string | null;
  canContinue: boolean;
  onStartValidation: () => void;
  onReset: () => void;
  onContinue: () => void;
}

export function UploadActions({ overallStatus, formError, canContinue, onStartValidation, onReset, onContinue }: UploadActionsProps) {
  const isRunning = overallStatus === 'running';

  return (
    <section className="dataset-panel">
      <h2 className="section-label">3. actions</h2>

      {formError && <p className="dataset-form-error" role="alert">&gt; error: {formError}</p>}

      <div className="dataset-actions-row">
        {canContinue ? (
          <Button variant="primary" onClick={onContinue}>continue &gt;</Button>
        ) : (
          <Button variant="primary" onClick={onStartValidation} loading={isRunning}>start validation &gt;</Button>
        )}
        <Button type="button" onClick={onReset} disabled={isRunning}>reset</Button>
      </div>
    </section>
  );
}

export default UploadActions;