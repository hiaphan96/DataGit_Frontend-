import { ArrowLeft } from 'lucide-react';
import { useProjectWorkspace } from '../hooks/useProjectWorkspace';
import VersionCarousel from '../components/project/VersionCarousel';
import { formatRelativeTime } from '../utils/formatTime';

interface ProjectWorkspaceProps {
  projectId: string;
  onBack: () => void;
}

export function ProjectWorkspace({ projectId, onBack }: ProjectWorkspaceProps) {
  const { project, versions, isLoading, error, reload, selectedVersionId, selectVersion } =
    useProjectWorkspace(projectId);

  return (
    <div className="project-workspace">
      <button type="button" className="project-workspace__back" onClick={onBack}>
        <ArrowLeft size={13} strokeWidth={2} /> projects
      </button>

      {isLoading ? (
        <p className="projects-list__status">loading project...</p>
      ) : error ? (
        <div className="projects-list__status projects-list__status--error">
          <p>Unable to load project.</p>
          <button type="button" className="projects-list__retry" onClick={reload}>
            retry
          </button>
        </div>
      ) : (
        <>
          <h1 className="project-workspace__title">{`{ ${project?.name ?? 'PROJECT'} }`}</h1>

          <p className="project-workspace__subtitle">
            {project?.description ? project.description : 'No description yet.'}
          </p>

          <div className="project-workspace__meta">
            <span>
              <span className="project-workspace__meta-label">path</span>
              {project?.path ?? '—'}
            </span>
            <span>
              <span className="project-workspace__meta-label">updated</span>
              {formatRelativeTime(project?.updatedAt)}
            </span>
            <span>
              <span className="project-workspace__meta-label">versions</span>
              {versions.length}
            </span>
          </div>

          <VersionCarousel
            versions={versions}
            selectedVersionId={selectedVersionId}
            onSelectVersion={selectVersion}
          />
        </>
      )}
    </div>
  );
}

export default ProjectWorkspace;
