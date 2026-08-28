interface TerminalHeaderProps {
  onClear: () => void;
  hasHistory: boolean;
}

export function TerminalHeader({ onClear, hasHistory }: TerminalHeaderProps) {
  return (
    <div className="terminal-panel__header">
      <span>TERMINAL</span>
      {hasHistory && (
        <button type="button" className="terminal-panel__clear" onClick={onClear}>
          clear
        </button>
      )}
    </div>
  );
}

export default TerminalHeader;