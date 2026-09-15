import { useProjectsList } from '../hooks/useProjectsList';
import ProjectCard from '../components/project/ProjectCard';
import CreateProjectCard from '../components/project/CreateProjectCard';

interface ProjectsListProps {
  onOpenProject: (id: string) => void;
}

export function ProjectsList({ onOpenProject }: ProjectsListProps) {
  const { projects, isLoading, error, reload, createProject, isCreating, createError, clearCreateError } =
    useProjectsList();

  return (
    <div className="projects-list">
      <h1 className="projects-list__title">PROJECTS</h1>

      {isLoading ? (
        <p className="projects-list__status">loading projects...</p>
      ) : error ? (
        <div className="projects-list__status projects-list__status--error">
          <p>Unable to load projects.</p>
          <button type="button" className="projects-list__retry" onClick={reload}>
            retry
          </button>
        </div>
      ) : (
        <div className="projects-list__grid">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={onOpenProject} />
          ))}

          <CreateProjectCard
            onCreate={createProject}
            isCreating={isCreating}
            error={createError}
            onDismissError={clearCreateError}
          />

          {projects.length === 0 && (
            <p className="projects-list__empty">No projects yet — create your first one.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectsList;
