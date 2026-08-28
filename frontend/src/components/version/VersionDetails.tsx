import SectionLabel from '../common/SectionLabel';
import StatusBadge from '../common/StatusBadge';
import type { VersionDetail } from '../../types/version';

interface VersionDetailsProps {
  version: VersionDetail | null;
}

export function VersionDetails({ version }: VersionDetailsProps) {
  if (!version) {
    return (
      <section className="version-panel">
        <SectionLabel>version details</SectionLabel>
        <p className="version-empty">select a version from the history to inspect it.</p>
      </section>
    );
  }

  const rows: { label: string; value: string }[] = [
    { label: 'version', value: version.version },
    { label: 'status', value: version.isCurrent ? 'active' : 'archived' },
    { label: 'created', value: version.createdAt },
    { label: 'dataset hash', value: version.hash },
    { label: 'rows', value: version.rows.toLocaleString() },
    { label: 'columns', value: String(version.columns) },
    { label: 'missing values', value: `${version.missingValuesPct}%` },
    { label: 'duplicates', value: String(version.duplicates) },
  ];

  return (
    <section className="version-panel">
      <SectionLabel>version details</SectionLabel>

      <dl className="version-details__list">
        {rows.map((row) => (
          <div className="version-details__row" key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="version-status-grid">
        <div className="version-status-item">
          <span className="version-status-item__label">schema status</span>
          <StatusBadge
            label={version.schemaStatus === 'stable' ? 'stable' : 'unstable'}
            tone={version.schemaStatus === 'stable' ? 'positive' : 'negative'}
          />
        </div>

        <div className="version-status-item">
          <span className="version-status-item__label">data quality</span>
          <StatusBadge
            label={version.dataQuality}
            tone={
              version.dataQuality === 'healthy'
                ? 'positive'
                : version.dataQuality === 'warning'
                  ? 'neutral'
                  : 'negative'
            }
          />
        </div>

        <div className="version-status-item">
          <span className="version-status-item__label">dvc status</span>
          <StatusBadge
            label={version.dvcStatus === 'connected' ? 'connected' : 'mocked'}
            tone={version.dvcStatus === 'connected' ? 'positive' : 'neutral'}
          />
        </div>
      </div>
    </section>
  );
}

export default VersionDetails;