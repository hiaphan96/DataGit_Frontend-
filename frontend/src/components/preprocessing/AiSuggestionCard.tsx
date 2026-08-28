import { Lightbulb } from 'lucide-react';
import type { AiSuggestion } from '../../types/preprocessing';

interface AiSuggestionCardProps {
  suggestion: AiSuggestion;
}

export function AiSuggestionCard({ suggestion }: AiSuggestionCardProps) {
  return (
    <div className="ai-suggestion">
      <Lightbulb size={16} className="ai-suggestion__icon" />
      <div className="ai-suggestion__text">
        <p className="ai-suggestion__label">AI suggestion</p>
        <p className="ai-suggestion__message">{suggestion.message}</p>
      </div>
    </div>
  );
}

export default AiSuggestionCard;