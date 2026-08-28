import {
  FileX,
  Copy,
  Trash2,
  Type,
  Code,
  List,
  type LucideIcon,
} from 'lucide-react';
import Toggle from '../common/Toggle';
import Select from '../common/Select';
import type { CleaningStepConfig } from '../../types/preprocessing';

const ICON_MAP: Record<string, LucideIcon> = {
  'file-x': FileX,
  copy: Copy,
  'trash-2': Trash2,
  type: Type,
  code: Code,
  list: List,
};

interface CleaningStepRowProps {
  step: CleaningStepConfig;
  onToggle: (id: CleaningStepConfig['id'], enabled: boolean) => void;
  onSelectChange: (id: CleaningStepConfig['id'], value: string) => void;
}

export function CleaningStepRow({ step, onToggle, onSelectChange }: CleaningStepRowProps) {
  const Icon = ICON_MAP[step.icon] ?? FileX;

  return (
    <div className="cleaning-step">
      <div className="cleaning-step__icon">
        <Icon size={18} />
      </div>
      <div className="cleaning-step__text">
        <p className="cleaning-step__title">{step.title}</p>
        <p className="cleaning-step__description">{step.description}</p>
      </div>
      <div className="cleaning-step__control">
        {step.controlType === 'select' && step.selectOptions ? (
          <Select
            value={step.selectValue ?? ''}
            onChange={(e) => onSelectChange(step.id, e.target.value)}
            options={step.selectOptions}
          />
        ) : (
          <Toggle
            checked={step.enabled}
            onChange={(checked) => onToggle(step.id, checked)}
            label={step.title}
          />
        )}
        <span className="cleaning-step__status">
          {step.enabled ? 'enabled' : 'disabled'}
        </span>
      </div>
    </div>
  );
}

export default CleaningStepRow;