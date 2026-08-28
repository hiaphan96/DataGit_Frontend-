import { AlertTriangle, Info } from 'lucide-react';
import type { DataWarning } from '../../types/preprocessing';

interface WarningsPanelProps {
  warnings: DataWarning[];
}

export function WarningsPanel({ warnings }: WarningsPanelProps) {
  if (warnings.length === 0) return null;

  return (
    <div className="warnings-panel">
      <p className="warnings-panel__label">warnings & recommendations</p>
      <ul className="warnings-panel__list">
        {warnings.map((warning) => (
          <li key={warning.id} className={`warnings-panel__item warnings-panel__item--${warning.severity}`}>
            {warning.severity === 'warning' ? <AlertTriangle size={14} /> : <Info size={14} />}
            <span>{warning.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default WarningsPanel;