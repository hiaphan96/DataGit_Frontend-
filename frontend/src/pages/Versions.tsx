import { useRef } from 'react';
import CurrentVersionCard from '../components/version/CurrentVersionCard';
import VersionTimeline from '../components/version/VersionTimeline';
import VersionDetails from '../components/version/VersionDetails';
import ChangeSummary from '../components/version/ChangeSummary';
import CompareVersions from '../components/version/CompareVersions';
import Traceability from '../components/version/Traceability';
import { useVersionControl } from '../hooks/useVersionControl';
import { useDashboardData } from '../hooks/useDashboardData';

export function Versions() {
  const {
    versions,
    changeSummaries,
    isLoading,
    selectedVersion,
    currentVersion,
    changeSummary,
    selectVersion,
    baselineId,
    currentId,
    setBaselineId,
    setCurrentId,
    comparisonResult,
    isComparing,
    runComparison,
    isCreatingCheckpoint,
    createCheckpoint,
  } = useVersionControl();

  const { project } = useDashboardData();

  const detailsRef = useRef<HTMLDivElement>(null);
  const compareRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (isLoading) {
    return <p className="version-loading">loading version history...</p>;
  }

  return (
    <div className="versions-page">
      <p className="versions-page__breadcrumb">stage 3 / versions</p>
      <h1 className="versions-page__title">dataset version control</h1>
      <p className="versions-page__subtitle">manage and inspect dataset checkpoints and changes.</p>

      <div className="versions-page__context">
        <span><span className="versions-page__context-label">project</span> {project?.name ?? '—'}</span>
        <span><span className="versions-page__context-label">dataset</span> {currentVersion?.dataset ?? '—'}</span>
        <span><span className="versions-page__context-label">current</span> {currentVersion?.version ?? '—'}</span>
        <span><span className="versions-page__context-label">status</span> active / valid</span>
      </div>

      <div className="versions-page__grid">
        <div className="versions-page__main">
          <CurrentVersionCard
            currentVersion={currentVersion}
            onViewDetails={() => scrollTo(detailsRef)}
            onCompare={() => scrollTo(compareRef)}
            onCreateCheckpoint={createCheckpoint}
            isCreatingCheckpoint={isCreatingCheckpoint}
          />

          <div ref={detailsRef}>
            <VersionDetails version={selectedVersion} />
          </div>

          <ChangeSummary summary={changeSummary} isInitialVersion={selectedVersion?.parentVersionId === null} />

          <div ref={compareRef}>
            <CompareVersions
              versions={versions}
              baselineId={baselineId}
              currentId={currentId}
              onBaselineChange={setBaselineId}
              onCurrentChange={setCurrentId}
              onRunComparison={runComparison}
              result={comparisonResult}
              isComparing={isComparing}
            />
          </div>

          <Traceability version={selectedVersion} versions={versions} />
        </div>

        <div className="versions-page__side">
          <VersionTimeline
            versions={versions}
            changeSummaries={changeSummaries}
            selectedVersionId={selectedVersion?.id ?? null}
            onSelectVersion={selectVersion}
          />
        </div>
      </div>
    </div>
  );
}

export default Versions;