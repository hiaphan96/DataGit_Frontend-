import { useState } from 'react';
import Header from './Header';
import Sidebar, { type NavSection } from './Sidebar';
import Terminal from '../terminal/Terminal';

import Home from '../../pages/Home';
import Datasets from '../../pages/Datasets';
import DatasetPreparation from '../../pages/DatasetPreparation';
import Evaluation from '../../pages/Evaluation';
import Report from '../../pages/Report';
import VersionCompare from '../../pages/VersionCompare';
import Baselines from '../../pages/Baselines';
import ProjectsList from '../../pages/ProjectsList';
import ProjectWorkspace from '../../pages/ProjectWorkspace';

import { useDashboardData } from '../../hooks/useDashboardData';


const PLACEHOLDER_LABELS: Record<
  Exclude<
    NavSection,
    | 'home'
    | 'datasets'
    | 'dataset-preparation'
    | 'evaluation'
    | 'baselines'
    | 'reports'
    | 'compare'
  >,
  string
> = {
  projects: 'PROJECTS',
  settings: 'SETTINGS',
  upgrade: 'UPGRADE',
};


export function AppShell() {
  const [activeSection, setActiveSection] =
    useState<NavSection>('home');

  // Projects owns Versions: this is the one selected-project source for
  // the whole app (README §26 / the mega-prompt's "no hardcoded project id"
  // rule). Cleared whenever the person leaves PROJECTS via the sidebar so
  // returning to it always starts back at the grid.
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleSelectSection = (section: NavSection) => {
    if (section !== 'projects') setSelectedProjectId(null);
    setActiveSection(section);
  };

  const dashboard = useDashboardData();


  return (
    <div className="app-shell">

      <Header />

      <div className="app-shell__body">

        <Sidebar
          active={activeSection}
          onSelect={handleSelectSection}
        />

        <main className="app-shell__content">

          {activeSection === 'home' ? (

            <Home data={dashboard} />

          ) : activeSection === 'datasets' ? (

            <Datasets />

          ) : activeSection === 'projects' ? (

            selectedProjectId ? (
              <ProjectWorkspace
                projectId={selectedProjectId}
                onBack={() => setSelectedProjectId(null)}
              />
            ) : (
              <ProjectsList onOpenProject={setSelectedProjectId} />
            )

          ) : activeSection === 'dataset-preparation' ? (

            <DatasetPreparation />

          ) : activeSection === 'reports' ? (

            <Report />

            ) : activeSection === 'compare' ? (

            <VersionCompare />

          ) : activeSection === 'evaluation' ? (

            <Evaluation />

          ) : activeSection === 'baselines' ? (

            <Baselines />

          ) : (

            <ModulePlaceholder
              label={PLACEHOLDER_LABELS[activeSection]}
            />

          )}

        </main>

      </div>

      <Terminal
        projectName={dashboard.project?.name ?? 'local'}
      />

    </div>
  );
}


function ModulePlaceholder({ label }: { label: string }) {

  return (

    <div className="module-placeholder">

      <p className="module-placeholder__eyebrow">
        {label}
      </p>

      <p className="module-placeholder__message">
        MODULE NOT IMPLEMENTED YET
      </p>

    </div>

  );

}


export default AppShell;