import { ArrowRight } from 'lucide-react';
import type { ProjectSummary } from '../../types/project';
import { formatRelativeTime } from '../../utils/formatTime';

interface ProjectCardProps {
  project: ProjectSummary;
  onOpen: (id: string) => void;
}

function scriptName(name: string): string {
  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  return `${slug || 'project'}.sh`;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const handleOpen = () => onOpen(project.id);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpen();
    }
  };

  return (
    <div
      className="project-card pixel-frame"
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      aria-label={`Open project ${project.name}`}
    >
      <p className="project-card__title">{project.name}</p>

      <div className="project-card__window">
        <div className="project-card__window-header">
          <span className="project-card__dots" aria-hidden="true">
            <span className="project-card__dot project-card__dot--red" />
            <span className="project-card__dot project-card__dot--yellow" />
            <span className="project-card__dot project-card__dot--green" />
          </span>
          <span className="project-card__window-name">{scriptName(project.name)}</span>
          <span className="project-card__live">
            <span className="project-card__live-dot" /> LIVE
          </span>
        </div>

        <div className="project-card__window-body">
          <p className="project-card__prompt">&gt;</p>

          <div className="project-card__panel">
            <p className="project-card__desc">
              {project.description ? project.description : 'No description yet.'}
            </p>

            <dl className="project-card__meta">
              <div>
                <dt>path</dt>
                <dd>{project.path}</dd>
              </div>
              <div>
                <dt>created</dt>
                <dd>{formatRelativeTime(project.createdAt)}</dd>
              </div>
              <div>
                <dt>updated</dt>
                <dd>{formatRelativeTime(project.updatedAt)}</dd>
              </div>
            </dl>

            <span className="project-card__open">
              [ Open Project <ArrowRight size={12} strokeWidth={2} /> ]
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
