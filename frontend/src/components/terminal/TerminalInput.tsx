import { forwardRef, useState, type KeyboardEvent } from 'react';

interface TerminalInputProps {
  promptLabel: string;
  placeholder: string;
  onSubmit: (command: string) => void;
  onHistoryUp: () => string | null;
  onHistoryDown: () => string | null;
  onAutocomplete: (partial: string) => string | null;
  onClearShortcut: () => void;
}

export const TerminalInput = forwardRef<HTMLInputElement, TerminalInputProps>(
  (
    { promptLabel, placeholder, onSubmit, onHistoryUp, onHistoryDown, onAutocomplete, onClearShortcut },
    ref,
  ) => {
    const [value, setValue] = useState('');

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.ctrlKey && event.key.toLowerCase() === 'l') {
        event.preventDefault();
        onClearShortcut();
        return;
      }
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
        return;
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        const suggestion = onAutocomplete(value);
        if (suggestion) setValue(suggestion);
      }
    };

    return (
      <div className="terminal-panel__input-row">
        <span className="terminal-prompt">{promptLabel}</span>
        <input
          ref={ref}
          className="terminal-panel__input"
          type="text"
          value={value}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          aria-label="DATAGIT command input"
        />
        <span className="terminal-panel__cursor" aria-hidden="true" />
      </div>
    );
  },
);

TerminalInput.displayName = 'TerminalInput';

export default TerminalInput;