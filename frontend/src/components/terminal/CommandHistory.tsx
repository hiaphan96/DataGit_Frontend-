import type { HistoryEntry } from '../../types/terminal';

interface CommandHistoryProps {
  entries: HistoryEntry[];
  promptLabel: string;
}

export function CommandHistory({ entries, promptLabel }: CommandHistoryProps) {
  return (
    <div className="command-history">
      {entries.map((entry) => (
        <div key={entry.id} className="command-history__entry">
          <div className="command-history__command-line">
            <span className="terminal-prompt">{promptLabel}</span>
            <span className="command-history__command">{entry.command}</span>
          </div>
          {entry.output.map((line, index) => (
            <div
              key={`${entry.id}-${index}`}
              className={`command-history__output-line command-history__output-line--${line.variant ?? 'body'}`}
            >
              {line.text || '\u00A0'}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default CommandHistory;