import Button from '../common/Button';
import type { PreprocessingActionStatus } from '../../types/preprocessing';

interface PreprocessingActionBarProps {
  previewStatus: PreprocessingActionStatus;
  createStatus: PreprocessingActionStatus;
  nextVersionLabel: string;
  onPreview: () => void;
  onCreateVersion: () => void;
  createDisabled?: boolean;
}

export function PreprocessingActionBar({
  previewStatus,
  createStatus,
  nextVersionLabel,
  onPreview,
  onCreateVersion,
  createDisabled = false,
}: PreprocessingActionBarProps) {
  const previewLabel =
    previewStatus === 'loading' ? 'generating…' : previewStatus === 'success' ? 'preview ready ✓' : 'preview sample →';

  const createLabel =
    createStatus === 'loading'
      ? 'creating version…'
      : createStatus === 'success'
        ? 'version created ✓'
        : `create ${nextVersionLabel} →`;

  return (
    <div className="preprocessing-action-bar">
      <div className="preprocessing-action-bar__group">
        <div className="preprocessing-action-bar__text">
          <p className="preprocessing-action-bar__title">preview preprocessed data</p>
          <p className="preprocessing-action-bar__description">see how a sample of data will look after preprocessing</p>
        </div>
        <Button
          type="button"
          onClick={onPreview}
          disabled={previewStatus === 'loading'}
        >
          {previewLabel}
        </Button>
      </div>

      <div className="preprocessing-action-bar__group preprocessing-action-bar__group--primary">
        <div className="preprocessing-action-bar__text">
          <p className="preprocessing-action-bar__title">create new version</p>
          <p className="preprocessing-action-bar__description">save preprocessed data as a new version with configuration</p>
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={onCreateVersion}
          disabled={createStatus === 'loading' || createDisabled}
        >
          {createLabel}
        </Button>
      </div>
    </div>
  );
}

export default PreprocessingActionBar;