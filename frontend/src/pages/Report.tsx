import { useVersionReport } from '../hooks/useVersionReport';
import Button from '../components/common/Button';
import { REPORT_SECTIONS, type ReportSectionId } from '../types/report';

export function Report() {
  const {
    projects,
    versions,
    selectedProject,
    selectedVersion,
    selectedProjectId,
    selectedVersionId,
    report,
    phase,
    statusMessage,
    error,
    setSelectedProjectId,
    setSelectedVersionId,
    retry,
    resetSelection,
  } = useVersionReport();

  return (
    <div className="report-page">
      <div className="report-page__header">
        <h1 className="report-page__title">reports</h1>
        <p className="report-page__subtitle">
          inspect a single version of a project: dataset state, provenance, and — when
          evidence exists — training results and AI-generated explanation.
        </p>
      </div>

      {/* ---------- SELECTORS ---------- */}
      <div className="report-page__selectors">
        <label className="report-page__field">
          <span>project</span>
          <select
            value={selectedProjectId ?? ''}
            onChange={(e) => {
              const v = e.target.value ? Number(e.target.value) : null;
              setSelectedProjectId(v);
            }}
          >
            <option value="">— select a project —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>

        <label className="report-page__field">
          <span>version</span>
          <select
            value={selectedVersionId ?? ''}
            onChange={(e) => {
              const v = e.target.value ? Number(e.target.value) : null;
              setSelectedVersionId(v);
            }}
            disabled={selectedProjectId == null || versions.length === 0}
          >
            <option value="">— select a version —</option>
            {versions.map((v) => (
              <option key={v.id} value={v.id}>
                V{String(v.version_number).padStart(2, '0')}
              </option>
            ))}
          </select>
        </label>

        <div className="report-page__selector-actions">
          {selectedVersion ? (
            <Button type="button" variant="secondary" onClick={resetSelection}>
              change version
            </Button>
          ) : null}
        </div>
      </div>

      {/* ---------- EMPTY / LOADING / ERROR ---------- */}
      {selectedProjectId == null ? (
        <div className="report-page__empty">
          <p className="report-page__empty-eyebrow">select a project</p>
          <p className="report-page__empty-message">
            reports are scoped to a single version. start by choosing a project.
          </p>
        </div>
      ) : versions.length === 0 && phase !== 'loading-versions' && phase !== 'error' ? (
        <div className="report-page__empty">
          <p className="report-page__empty-eyebrow">no versions available</p>
          <p className="report-page__empty-message">
            project <span className="report-page__mono">{selectedProject?.name}</span> has no
            versions registered yet. create a version via data preparation, then return here.
          </p>
        </div>
      ) : phase === 'loading-report' || phase === 'loading-versions' || phase === 'loading-projects' ? (
        <div className="report-page__loading">
          <p className="report-page__terminal-line">&gt; {statusMessage}</p>
          <p className="report-page__terminal-line">status : building report...</p>
        </div>
      ) : phase === 'error' ? (
        <div className="report-page__error">
          <p className="report-page__error-title">✕ report load failed</p>
          <p className="report-page__error-line">
            project : {selectedProject?.name ?? '—'}
          </p>
          <p className="report-page__error-line">
            version : {selectedVersion ? `V${selectedVersion.version_number}` : '—'}
          </p>
          <p className="report-page__error-line">reason : {error ?? 'unknown'}</p>
          <div className="report-page__actions">
            <Button type="button" onClick={retry}>
              retry
            </Button>
            <Button type="button" variant="secondary" onClick={resetSelection}>
              select version
            </Button>
          </div>
        </div>
      ) : report ? (
        <div className="report-page__body">
          {/* Section nav */}
          <nav className="report-page__nav">
            {REPORT_SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="report-page__nav-item">
                {s.label}
              </a>
            ))}
          </nav>

          {/* Document */}
          <div className="report-page__document">
            <ReportHeader report={report} />
            <Section id="executive-summary" label="executive summary">
              <ExecutiveSummary report={report} />
            </Section>
            <Section id="dataset-snapshot" label="dataset snapshot">
              <DatasetSnapshot report={report} />
            </Section>
            <Section id="data-quality" label="data quality">
              <Placeholder text="quality evidence not available in the current backend response." />
            </Section>
            <Section id="preparation-history" label="preparation history">
              <Placeholder text="preparation details not exposed by the current backend API." />
            </Section>
            {report.mlRun ? (
              <Section id="training-evaluation" label="training / evaluation">
                <TrainingEvaluation mlRun={report.mlRun} />
              </Section>
            ) : null}
            <Section id="provenance" label="git / dvc provenance">
              <Provenance report={report} />
            </Section>
            <Section id="ai-insights" label="ai insights">
              <Placeholder text="ai insights not generated for this version." />
            </Section>
            <Section id="recommendations" label="recommendations">
              <Placeholder text="recommendations not available." />
            </Section>
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ---------- small internal components ----------

function Section({
  id,
  label,
  children,
}: {
  id: ReportSectionId;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="report-section">
      <h2 className="report-section__title">{label}</h2>
      <div className="report-section__body">{children}</div>
    </section>
  );
}

function Placeholder({ text }: { text: string }) {
  return <p className="report-section__placeholder">{text}</p>;
}

function ReportHeader({ report }: { report: import('../types/report').VersionReportData }) {
  const { project, version } = report;
  const commit = version.git_commit ? version.git_commit.slice(0, 7) : '—';
  const dvcState = (() => {
    if (!version.dvc_state) return '—';
    const state = version.dvc_state as Record<string, unknown>;
    if (state.is_repository !== true) return 'not initialized';
    const tracked = state.tracked_files;
    if (Array.isArray(tracked) && tracked.length === 0) {
      return 'initialized (no tracked files)';
    }
    if (Array.isArray(tracked) && tracked.length > 0) {
      return `tracked (${tracked.length})`;
    }
    return 'initialized';
  })();

  return (
    <div className="report-context">
      <div className="report-context__left">
        <p className="report-context__line">
          PROJECT : <span className="report-page__mono">{project.name}</span>
        </p>
        <p className="report-context__line">
          VERSION :{' '}
          <span className="report-page__mono">
            V{String(version.version_number).padStart(2, '0')}
          </span>
        </p>
        {version.description ? (
          <p className="report-context__desc">{version.description}</p>
        ) : null}
      </div>
      <div className="report-context__right">
        <p className="report-context__line">
          Git :{' '}
          <span
            className="report-page__mono report-page__copyable"
            title={version.git_commit}
            onClick={() => {
              if (version.git_commit) {
                navigator.clipboard.writeText(version.git_commit);
              }
            }}
          >
            {commit}
          </span>
        </p>
        <p className="report-context__line">
          DVC : <span className="report-page__mono">{dvcState}</span>
        </p>
        <p className="report-context__line report-context__line--muted">
          created : {new Date(version.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

function ExecutiveSummary({ report }: { report: import('../types/report').VersionReportData }) {
  const { version, mlRun } = report;
  const dvcReady =
    !!version.dvc_state &&
    (version.dvc_state as Record<string, unknown>).is_repository === true;
  const status = mlRun
    ? 'evidence available'
    : dvcReady
      ? 'tracked — no ml run yet'
      : 'untracked';

  return (
    <div>
      <p className="report-summary__status">
        status : <span className="report-page__mono">{status}</span>
      </p>
      <p className="report-summary__text">
        version {version.version_number} of {report.project.name} recorded at{' '}
        {new Date(version.created_at).toLocaleString()}.
        {mlRun
          ? ` linked to ml run #${mlRun.id} (${mlRun.model_name}).`
          : ' no ml run is linked to this version.'}
      </p>
    </div>
  );
}

function DatasetSnapshot({ report }: { report: import('../types/report').VersionReportData }) {
  const { version } = report;
  return (
    <table className="report-table">
      <tbody>
        <tr>
          <td>version</td>
          <td className="report-page__mono">V{String(version.version_number).padStart(2, '0')}</td>
        </tr>
        <tr>
          <td>git commit</td>
          <td className="report-page__mono">{version.git_commit || '—'}</td>
        </tr>
        <tr>
          <td>dvc state</td>
          <td className="report-page__mono">
            {(() => {
              if (!version.dvc_state) return '—';
              const state = version.dvc_state as Record<string, unknown>;
              const status = typeof state.status === 'string' ? state.status : null;
              const isRepo = state.is_repository === true;
              if (status) return status.split('\n')[0];
              return isRepo ? 'repository' : '—';
            })()}
          </td>
        </tr>
        <tr>
          <td>description</td>
          <td>{version.description ?? '—'}</td>
        </tr>
        <tr>
          <td>created</td>
          <td>{new Date(version.created_at).toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
  );
}

function TrainingEvaluation({ mlRun }: { mlRun: import('../types/report').MLRunResponse }) {
  const metricsEntries = mlRun.metrics ? Object.entries(mlRun.metrics) : [];
  return (
    <div>
      <table className="report-table">
        <tbody>
          <tr>
            <td>model</td>
            <td className="report-page__mono">{mlRun.model_name}</td>
          </tr>
          <tr>
            <td>run id</td>
            <td className="report-page__mono">#{mlRun.id}</td>
          </tr>
          <tr>
            <td>created</td>
            <td>{new Date(mlRun.created_at).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      {metricsEntries.length > 0 ? (
        <table className="report-table report-table--metrics">
          <thead>
            <tr>
              <th>metric</th>
              <th>value</th>
            </tr>
          </thead>
          <tbody>
            {metricsEntries.map(([k, v]) => (
              <tr key={k}>
                <td>{k}</td>
                <td className="report-page__mono">{String(v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="report-section__placeholder">no metrics recorded.</p>
      )}
    </div>
  );
}

function Provenance({ report }: { report: import('../types/report').VersionReportData }) {
  const { project, version, mlRun } = report;
  return (
    <table className="report-table">
      <tbody>
        <tr>
          <td>project</td>
          <td className="report-page__mono">{project.name}</td>
        </tr>
        <tr>
          <td>version</td>
          <td className="report-page__mono">V{String(version.version_number).padStart(2, '0')}</td>
        </tr>
        <tr>
          <td>git commit</td>
          <td className="report-page__mono">{version.git_commit || '—'}</td>
        </tr>
        <tr>
        <td className="report-page__mono">
            {(() => {
              if (!version.dvc_state) return '—';
              const state = version.dvc_state as Record<string, unknown>;
              const status = typeof state.status === 'string' ? state.status : null;
              const isRepo = state.is_repository === true;
              if (status) return status.split('\n')[0];
              return isRepo ? 'repository' : '—';
            })()}
          </td>
        </tr>
        <tr>
          <td>ml run</td>
          <td className="report-page__mono">{mlRun ? `#${mlRun.id}` : '—'}</td>
        </tr>
        <tr>
          <td>created</td>
          <td>{new Date(version.created_at).toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default Report;