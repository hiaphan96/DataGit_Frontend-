import { forwardRef, useState, type KeyboardEvent } from 'react';

interface CommandInputProps {
  onSubmit: (command: string) => void;
  onHistoryUp: () => string | null;
  onHistoryDown: () => string | null;
}

export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(
  ({ onSubmit, onHistoryUp, onHistoryDown }, ref) => {
    const [value, setValue] = useState('');

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        onSubmit(value);
        setValue('');
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        const previous = onHistoryUp();
        if (previous !== null) setValue(previous);
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const next = onHistoryDown();
        if (next !== null) setValue(next);
      }
    };

    return (
      <div className="terminal-input-row">
        <span className="terminal-prompt">datagit@local:~$</span>
        <input
          ref={ref}
          className="terminal-input"
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          aria-label="DATAGIT command input"
        />
        <span className="terminal-cursor" aria-hidden="true" />
      </div>
    );
  },
);

CommandInput.displayName = 'CommandInput';

export default CommandInput;