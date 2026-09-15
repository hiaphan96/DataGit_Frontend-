export type ProjectStatus = 'active' | 'paused';

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  baselineVersion: string;
  baselineExperiment: string;
  lastRunLabel: string;
}

// ---------- Added: required by api.ts, useProjectsList, useProjectWorkspace, ProjectCard, CreateProjectCard ----------

export interface ProjectSummary {
  id: string;
  name: string;
  path: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewProjectInput {
  name: string;
  path: string;
  description?: string;
}