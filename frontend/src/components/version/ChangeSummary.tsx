import SectionLabel from '../common/SectionLabel';
import type { VersionChangeSummary } from '../../types/version';

interface ChangeSummaryProps {
  summary: VersionChangeSummary | null;
  isInitialVersion: boolean;
}

export function ChangeSummary({ summary, isInitialVersion }: ChangeSummaryProps) {
  return (
    <section className="version-panel">
      <SectionLabel>change summary</SectionLabel>

      {isInitialVersion ? (
        <p className="version-empty">this is the initial checkpoint — no prior version to compare against.</p>
      ) : summary ? (
        <div className="version-change-grid">
          {summary.metrics.map((metric) => (
            <div key={metric.label} className="version-change-item">
              <span className="version-change-item__label">{metric.label}</span>
              <span className={`version-change-item__value version-change-item__value--${metric.direction}`}>
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="version-empty">no change data available for this version.</p>
      )}
    </section>
  );
}

export default ChangeSummary;