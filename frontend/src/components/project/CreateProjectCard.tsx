import { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../common/Button';
import type { NewProjectInput } from '../../types/project';

interface CreateProjectCardProps {
  onCreate: (input: NewProjectInput) => Promise<unknown>;
  isCreating: boolean;
  error: string | null;
  onDismissError: () => void;
}

export function CreateProjectCard({ onCreate, isCreating, error, onDismissError }: CreateProjectCardProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [path, setPath] = useState('');
  const [description, setDescription] = useState('');

  const canSubmit = name.trim().length > 0 && path.trim().length > 0 && !isCreating;

  const reset = () => {
    setName('');
    setPath('');
    setDescription('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    try {
      await onCreate({ name: name.trim(), path: path.trim(), description: description.trim() || undefined });
      reset();
      setOpen(false);
    } catch {
      // error surfaced via the `error` prop — keep the form open so the
      // person can fix and retry without retyping.
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        className="project-card project-card--create"
        onClick={() => setOpen(true)}
      >
        <Plus size={20} strokeWidth={1.75} />
        <span>
          CREATE
          <br />
          NEW
          <br />
          PROJECT
        </span>
      </button>
    );
  }

  return (
    <form className="project-card project-card--create-form" onSubmit={handleSubmit}>
      <p className="project-card__title project-card__title--sm">NEW PROJECT</p>

      <label className="project-create-field">
        <span>name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="churn_prediction" autoFocus />
      </label>

      <label className="project-create-field">
        <span>path</span>
        <input value={path} onChange={(e) => setPath(e.target.value)} placeholder="/data/projects/churn" />
      </label>

      <label className="project-create-field">
        <span>description</span>
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="optional" />
      </label>

      {error ? (
        <p className="project-create-error" role="alert">
          {error}
          <button type="button" onClick={onDismissError} aria-label="dismiss error">
            ×
          </button>
        </p>
      ) : null}

      <div className="project-create-actions">
        <Button type="button" onClick={() => { setOpen(false); reset(); onDismissError(); }}>
          cancel
        </Button>
        <Button type="submit" variant="primary" loading={isCreating} disabled={!canSubmit}>
          create
        </Button>
      </div>
    </form>
  );
}

export default CreateProjectCard;
