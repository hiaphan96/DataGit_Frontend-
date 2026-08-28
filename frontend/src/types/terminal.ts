export type OutputVariant =
  | 'heading'
  | 'body'
  | 'muted'
  | 'error'
  | 'positive'
  | 'warning'
  | 'negative';

export interface OutputLine {
  text: string;
  variant?: OutputVariant;
}

export interface HistoryEntry {
  id: string;
  command: string;
  output: OutputLine[];
}