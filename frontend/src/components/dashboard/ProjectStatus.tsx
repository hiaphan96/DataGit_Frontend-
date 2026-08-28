import SectionLabel from '../common/SectionLabel';
import StatusBadge from '../common/StatusBadge';
import type { Project } from '../../types/project';

interface ProjectStatusProps {
  project: Project;
}

export function ProjectStatus({ project }: ProjectStatusProps) {
  return (
    <section className="project-status">
      <SectionLabel>CURRENT PROJECT</SectionLabel>
      <p className="project-status__name">{project.name}</p>
      <dl className="project-status__meta">
        <div>
          <dt>STATUS</dt>
          <dd>
            <StatusBadge
              label={project.status.toUpperCase()}
              tone={project.status === 'active' ? 'positive' : 'neutral'}
            />
          </dd>
        </div>
        <div>
          <dt>BASELINE</dt>
          <dd>
            {project.baselineVersion} / {project.baselineExperiment}
          </dd>
        </div>
        <div>
          <dt>LAST RUN</dt>
          <dd>{project.lastRunLabel}</dd>
        </div>
      </dl>
    </section>
  );
}

export default ProjectStatus;