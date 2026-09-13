import { CheckCircle2, AlertTriangle, MinusCircle, type LucideIcon } from 'lucide-react';
import type { EvaluationStatusType } from '../../types/evaluation';

interface EvaluationStatusProps {
  status: EvaluationStatusType;
  percentageChange: number;
  previousExperimentId: string | null;
}

const STATUS_CONFIG: Record<EvaluationStatusType, { icon: LucideIcon; title: string; className: string }> = {
  improvement: {
    icon: CheckCircle2,
    title: 'IMPROVEMENT DETECTED',
    className: 'evaluation-status--improvement',
  },
  regression: {
    icon: AlertTriangle,
    title: 'PERFORMANCE REGRESSION',
    className: 'evaluation-status--regression',
  },
  no_change: {
    icon: MinusCircle,
    title: 'NO SIGNIFICANT CHANGE',
    className: 'evaluation-status--no-change',
  },
};

export function EvaluationStatus({ status, percentageChange, previousExperimentId }: EvaluationStatusProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  const sign = percentageChange > 0 ? '+' : '';

  const message =
    status === 'no_change'
      ? 'Performance difference is minimal.'
      : previousExperimentId
        ? `Model performance ${status === 'improvement' ? 'improved' : 'decreased'} by ${sign}${percentageChange.toFixed(1)}% F1 Score compared to ${previousExperimentId}.`
        : `Model performance ${status === 'improvement' ? 'improved' : 'decreased'} by ${sign}${percentageChange.toFixed(1)}% F1 Score compared to the previous experiment.`;

  return (
    <div className={`evaluation-status ${config.className}`}>
      <Icon size={22} className="evaluation-status__icon" />
      <div>
        <p className="evaluation-status__title">{config.title}</p>
        <p className="evaluation-status__message">{message}</p>
      </div>
    </div>
  );
}

export default EvaluationStatus;