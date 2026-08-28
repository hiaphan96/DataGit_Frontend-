import { useRef } from 'react';
import { useTerminal } from '../../hooks/useTerminal';
import TerminalHeader from './TerminalHeader';
import TerminalOutput from './TerminalOutput';
import TerminalInput from './TerminalInput';

interface TerminalProps {
  projectName: string;
}

export function Terminal({ projectName }: TerminalProps) {
  const { history, runCommand, clearTerminal, getPreviousCommand, getNextCommand, autocomplete } =
    useTerminal();
  const inputRef = useRef<HTMLInputElement>(null);

  const promptLabel = `> datagit@local:~/${projectName}$`;

  const focusInput = () => inputRef.current?.focus();

  return (
    <div className="terminal-panel" onClick={focusInput}>
      {history.length > 0 && <TerminalHeader onClear={clearTerminal} hasHistory />}
      <TerminalOutput entries={history} promptLabel={promptLabel} />
      <TerminalInput
        ref={inputRef}
        promptLabel={promptLabel}
        placeholder="ready to version your data."
        onSubmit={runCommand}
        onHistoryUp={getPreviousCommand}
        onHistoryDown={getNextCommand}
        onAutocomplete={autocomplete}
        onClearShortcut={clearTerminal}
      />
    </div>
  );
}

export default Terminal;