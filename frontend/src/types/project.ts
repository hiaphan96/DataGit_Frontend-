export type ProjectStatus = 'active' | 'paused';

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  baselineVersion: string;
  baselineExperiment: string;
  lastRunLabel: string;
}