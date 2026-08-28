import { useEffect, useRef } from 'react';
import CommandHistory from './CommandHistory';
import type { HistoryEntry } from '../../types/terminal';

interface TerminalOutputProps {
  entries: HistoryEntry[];
  promptLabel: string;
}

export function TerminalOutput({ entries, promptLabel }: TerminalOutputProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [entries]);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="terminal-panel__output" ref={scrollRef}>
      <CommandHistory entries={entries} promptLabel={promptLabel} />
    </div>
  );
}

export default TerminalOutput;