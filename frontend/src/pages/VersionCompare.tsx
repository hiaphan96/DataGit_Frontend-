import { useVersionCompare } from '../hooks/useVersionCompare';
import Button from '../components/common/Button';
import type { VersionResponse } from '../types/report';
import type { DVCState } from '../types/compare';
import { VERDICT_LABELS, VERDICT_SYMBOLS } from '../types/compare';

export function VersionCompare() {
  const {
    projects,
    versions,
    selectedProject,
    versionA,
    versionB,
    selectedProjectId,
    versionAId,
    versionBId,
    comparison,
    verdict,
    phase,
    statusMessage,
    error,
    validationError,
    canCompare,
    setSelectedProjectId,
    setVersionAId,
    setVersionBId,
    swap,
    runComparison,
    reset,
  } = useVersionCompare();

  return (
    <div className="compare-page">
      <div className="compare-page__header">
        <h1 className="compare-page__title">compare</h1>
        <p className="compare-page__subtitle">
          compare two versions of the same project: dataset state, code, provenance,
          training evidence, and — when available — ai explanation.
        </p>
      </div>

      {selectedProjectId == null ? (
        <div className="compare-project-grid">
          {projects.length === 0 ? (
            <div className="compare-empty">
              <p className="compare-empty__eyebrow">no projects</p>
              <p className="compare-empty__message">no projects registered yet.</p>
            </div>
          ) : (
            projects.map((p) => (
              <button
                key={p.id}
                type="button"
                className="compare-project-card"
                onClick={() => setSelectedProjectId(p.id)}
              >
                <div className="compare-project-card__chrome">
                  <span className="compare-project-card__dot compare-project-card__dot--red" />
                  <span className="compare-project-card__dot compare-project-card__dot--yellow" />
                  <span className="compare-project-card__dot compare-project-card__dot--green" />
                  <span className="compare-project-card__chrome-title">{p.name}</span>
                </div>
                <div className="compare-project-card__body">
                  {p.description ? (
                    <p className="compare-project-card__desc">{p.description}</p>
                  ) : null}
                  <div className="compare-project-card__row">
                    <span>path</span>
                    <span className="compare-page__mono">{p.path}</span>
                  </div>
                  <div className="compare-project-card__row">
                    <span>updated</span>
                    <span>{new Date(p.updated_at).toLocaleString()}</span>
                  </div>
                  <div className="compare-project-card__action">[ select project &gt; ]</div>
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        <>
          <div className="compare-context">
            <p className="compare-context__line">
              PROJECT : <span className="compare-page__mono">{selectedProject?.name}</span>
            </p>
            <Button type="button" variant="secondary" onClick={() => setSelectedProjectId(null)}>
              change project
            </Button>
          </div>

          {versions.length < 2 ? (
            <div className="compare-empty">
              <p className="compare-empty__eyebrow">not enough versions</p>
              <p className="compare-empty__message">
                project <span className="compare-page__mono">{selectedProject?.name}</span> has{' '}
                {versions.length} version(s). at least two are required to compare.
              </p>
            </div>
          ) : (
            <div className="compare-pair">
              <VersionPicker
                label="Baseline (A)"
                versions={versions}
                selectedId={versionAId}
                disabledId={versionBId}
                onSelect={setVersionAId}
              />

              <div className="compare-pair__controls">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={swap}
                  disabled={versionAId == null || versionBId == null}
                >
                  swap A ↔ B
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  onClick={runComparison}
                  disabled={!canCompare || phase === 'loading-comparison'}
                >
                  {phase === 'loading-comparison' ? 'comparing…' : 'compare >'}
                </Button>
              </div>

              <VersionPicker
                label="Target (B)"
                versions={versions}
                selectedId={versionBId}
                disabledId={versionAId}
                onSelect={setVersionBId}
              />

              {validationError ? (
                <p className="compare-pair__error">{validationError}</p>
              ) : null}
            </div>
          )}
        </>
      )}

      {phase === 'loading-comparison' ? (
        <div className="compare-loading">
          <p className="compare-terminal-line">&gt; {statusMessage}</p>
          <p className="compare-terminal-line">status : loading evidence...</p>
        </div>
      ) : null}

      {phase === 'error' && error ? (
        <div className="compare-error">
          <p className="compare-error__title">✕ comparison failed</p>
          <p className="compare-error__line">reason : {error}</p>
          <div className="compare-error__actions">
            <Button type="button" onClick={runComparison}>
              retry
            </Button>
            <Button type="button" variant="secondary" onClick={reset}>
              clear selection
            </Button>
          </div>
        </div>
      ) : null}

      {comparison && versionA && versionB ? (
        <div className="compare-result">
          <div className="compare-context-header">
            <span className="compare-context-header__versions">
              V{String(versionA.version_number).padStart(2, '0')} → V
              {String(versionB.version_number).padStart(2, '0')}
            </span>
            <span className="compare-context-header__labels">
              baseline = V{versionA.version_number}, target = V{versionB.version_number}
            </span>
          </div>

          <div className={`compare-verdict compare-verdict--${verdict}`}>
            <span className="compare-verdict__symbol">{VERDICT_SYMBOLS[verdict]}</span>
            <span className="compare-verdict__label">{VERDICT_LABELS[verdict]}</span>
          </div>

          <section className="compare-section">
            <h2 className="compare-section__title">changes</h2>
            {comparison.changes.length > 0 ? (
              <ul className="compare-list">
                {comparison.changes.map((c: string, i: number) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            ) : (
              <EvidenceUnavailable text="no changes recorded." />
            )}
          </section>

          <section className="compare-section">
            <h2 className="compare-section__title">evidence chain</h2>
            {comparison.evidence_chain.length > 0 ? (
              <ul className="compare-list">
                {comparison.evidence_chain.map((c: string, i: number) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            ) : (
              <EvidenceUnavailable text="no evidence chain recorded." />
            )}
          </section>

          <section className="compare-section">
            <h2 className="compare-section__title">git / dvc provenance</h2>
            <div className="compare-provenance">
              <div className="compare-provenance__side">
                <p className="compare-provenance__heading">
                  baseline (V{versionA.version_number})
                </p>
                <ProvenanceBlock
                  git={comparison.git_commit_before}
                  dvc={comparison.dvc_state_before}
                />
              </div>
              <div className="compare-provenance__side">
                <p className="compare-provenance__heading">
                  target (V{versionB.version_number})
                </p>
                <ProvenanceBlock
                  git={comparison.git_commit_after}
                  dvc={comparison.dvc_state_after}
                />
              </div>
            </div>
            <table className="compare-table">
              <tbody>
                <tr>
                  <td>git changed</td>
                  <td className="compare-page__mono">
                    {comparison.git_changed ? '✓ yes' : '– no'}
                  </td>
                </tr>
                <tr>
                  <td>dvc changed</td>
                  <td className="compare-page__mono">
                    {comparison.dvc_changed ? '✓ yes' : '– no'}
                  </td>
                </tr>
                <tr>
                  <td>code changed</td>
                  <td className="compare-page__mono">
                    {comparison.code_changed ? '✓ yes' : '– no'}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          {comparison.changed_files.length > 0 ||
          comparison.code_changed_files.length > 0 ? (
            <section className="compare-section">
              <h2 className="compare-section__title">changed files</h2>
              {comparison.changed_files.length > 0 ? (
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th>file</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.changed_files.map((f: string) => (
                      <tr key={f}>
                        <td className="compare-page__mono">{f}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}
              {comparison.code_changed_files.length > 0 ? (
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th>code file</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.code_changed_files.map((f: string) => (
                      <tr key={f}>
                        <td className="compare-page__mono">{f}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}
            </section>
          ) : null}

          <section className="compare-section">
            <h2 className="compare-section__title">dataset &amp; quality</h2>
            {comparison.dataset_analysis || comparison.dataset_diff ? (
              <pre className="compare-raw">
                {JSON.stringify(
                  comparison.dataset_analysis ?? comparison.dataset_diff,
                  null,
                  2,
                )}
              </pre>
            ) : (
              <EvidenceUnavailable text="dataset / quality evidence unavailable for this comparison." />
            )}
          </section>

          <section className="compare-section">
            <h2 className="compare-section__title">preparation history</h2>
            <EvidenceUnavailable text="preparation comparison not exposed by the backend yet." />
          </section>

          {comparison.ml_comparison || comparison.performance ? (
            <section className="compare-section">
              <h2 className="compare-section__title">training / evaluation</h2>
              <pre className="compare-raw">
                {JSON.stringify(comparison.ml_comparison ?? comparison.performance, null, 2)}
              </pre>
            </section>
          ) : null}

          <section className="compare-section">
            <h2 className="compare-section__title">ai summary</h2>
            <EvidenceUnavailable text="ai comparison summary not generated by the backend for this pair." />
          </section>

          <section className="compare-section">
            <h2 className="compare-section__title">recommendations</h2>
            <EvidenceUnavailable text="recommendations not available." />
          </section>
        </div>
      ) : null}
    </div>
  );
}

function VersionPicker({
  label,
  versions,
  selectedId,
  disabledId,
  onSelect,
}: {
  label: string;
  versions: VersionResponse[];
  selectedId: number | null;
  disabledId: number | null;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="compare-picker">
      <p className="compare-picker__label">{label}</p>
      <div className="compare-picker__list">
        {versions.map((v) => {
          const disabled = v.id === disabledId;
          const selected = v.id === selectedId;
          return (
            <button
              key={v.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(v.id)}
              className={`compare-picker__row${
                selected ? ' compare-picker__row--selected' : ''
              }${disabled ? ' compare-picker__row--disabled' : ''}`}
            >
              <span className="compare-picker__row-version">
                V{String(v.version_number).padStart(2, '0')}
              </span>
              <span className="compare-picker__row-desc">
                {v.description ?? 'no description'}
              </span>
              <span className="compare-picker__row-meta">
                {v.git_commit ? v.git_commit.slice(0, 7) : '—'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProvenanceBlock({ git, dvc }: { git: string; dvc: DVCState | null }) {
  const dvcStatus =
    dvc && typeof dvc.status === 'string' ? dvc.status.split('\n')[0] : '—';
  return (
    <table className="compare-table compare-table--compact">
      <tbody>
        <tr>
          <td>git</td>
          <td className="compare-page__mono">{git ? git.slice(0, 12) : '—'}</td>
        </tr>
        <tr>
          <td>dvc</td>
          <td className="compare-page__mono">{dvcStatus}</td>
        </tr>
      </tbody>
    </table>
  );
}

function EvidenceUnavailable({ text }: { text: string }) {
  return <p className="compare-evidence-unavailable">{text}</p>;
}

export default VersionCompare;