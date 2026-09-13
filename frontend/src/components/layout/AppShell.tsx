import { useState } from 'react';
import Header from './Header';
import Sidebar, { type NavSection } from './Sidebar';
import Terminal from '../terminal/Terminal';
import Home from '../../pages/Home';
import Datasets from '../../pages/Datasets';
import Versions from '../../pages/Versions';
import DatasetPreparation from '../../pages/DatasetPreparation';
import Experiments from '../../pages/Experiments';
import Evaluation from '../../pages/Evaluation';
import Baselines from '../../pages/Baselines';
import { useDashboardData } from '../../hooks/useDashboardData';

const PLACEHOLDER_LABELS: Record<Exclude<NavSection, 'home' | 'datasets' | 'versions' | 'dataset-preparation' | 'experiments' | 'evaluation' | 'baselines'>, string> = {
  reports: 'REPORTS',
  compare: 'COMPARE',
  copilot: 'COPILOT',
  lineage: 'LINEAGE',
  settings: 'SETTINGS',
  upgrade: 'UPGRADE',
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
          ) : activeSection === 'dataset-preparation' ? (
            <DatasetPreparation />
          ) : activeSection === 'experiments' ? (
            <Experiments />
          ) : activeSection === 'evaluation' ? (
            <Evaluation />
          ) : activeSection === 'baselines' ? (
            <Baselines />
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