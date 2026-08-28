import SectionLabel from '../common/SectionLabel';
import type { VersionDetail } from '../../types/version';

interface TraceabilityProps {
  version: VersionDetail | null;
  versions: VersionDetail[];
}

export function Traceability({ version, versions }: TraceabilityProps) {
  if (!version) {
    return (
      <section className="version-panel">
        <SectionLabel>traceability</SectionLabel>
        <p className="version-empty">select a version to view its lineage.</p>
      </section>
    );
  }

  const parent = versions.find((v) => v.id === version.parentVersionId);

  const rows: { label: string; value: string }[] = [
    { label: 'dataset version', value: version.version },
    { label: 'dataset hash', value: version.hash },
    { label: 'parent version', value: parent ? parent.version : 'none (initial checkpoint)' },
    { label: 'checkpoint', value: version.checkpointId },
    { label: 'dvc', value: version.dvcStatus === 'connected' ? 'ready / connected' : 'ready / mock status' },
    { label: 'git context', value: 'placeholder — not connected in this stage' },
  ];

  return (
    <section className="version-panel">
      <SectionLabel>traceability</SectionLabel>
      <dl className="version-details__list">
        {rows.map((row) => (
          <div className="version-details__row" key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default Traceability;