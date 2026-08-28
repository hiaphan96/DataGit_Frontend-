import { useState } from 'react';
import Header from './Header';
import Sidebar, { type NavSection } from './Sidebar';
import Terminal from '../terminal/Terminal';
import Home from '../../pages/Home';
import Datasets from '../../pages/Datasets';
import Versions from '../../pages/Versions';
import { useDashboardData } from '../../hooks/useDashboardData';

const PLACEHOLDER_LABELS: Record<Exclude<NavSection, 'home'>, string> = {
  projects: 'PROJECTS',
  datasets: 'DATASETS',
  versions: 'VERSIONS',
  compare: 'COMPARE',
  experiments: 'EXPERIMENTS',
  investigate: 'INVESTIGATE',
  history: 'HISTORY',
  settings: 'SETTINGS',
};

export function AppShell() {
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const dashboard = useDashboardData();

  return (
    <div className="app-shell">
      <Header />
      <div className="app-shell__body">
        <Sidebar active={activeSection} onSelect={setActiveSection} />
        <main className="app-shell__content">
          {activeSection === 'home' ? (
            <Home data={dashboard} />
          ) : activeSection === 'datasets' ? (
            <Datasets />
          ) : activeSection === 'versions' ? (
            <Versions />
          ) : (
            <ModulePlaceholder label={PLACEHOLDER_LABELS[activeSection]} />
          )}
        </main>
      </div>
      <Terminal projectName={dashboard.project?.name ?? 'local'} />
    </div>
  );
}

function ModulePlaceholder({ label }: { label: string }) {
  return (
    <div className="module-placeholder">
      <p className="module-placeholder__eyebrow">{label}</p>
      <p className="module-placeholder__message">MODULE NOT IMPLEMENTED YET</p>
    </div>
  );
}

export default AppShell;