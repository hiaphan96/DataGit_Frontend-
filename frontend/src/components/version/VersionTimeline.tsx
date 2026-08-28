import SectionLabel from '../common/SectionLabel';
import type { VersionChangeSummary, VersionDetail } from '../../types/version';

interface VersionTimelineProps {
  versions: VersionDetail[];
  changeSummaries: Record<string, VersionChangeSummary>;
  selectedVersionId: string | null;
  onSelectVersion: (id: string) => void;
}

export function VersionTimeline({ versions, changeSummaries, selectedVersionId, onSelectVersion }: VersionTimelineProps) {
  // newest first, matching the "V02 above V01" reading order in the spec
  const ordered = [...versions].sort((a, b) => b.version.localeCompare(a.version));

  if (ordered.length === 0) {
    return (
      <section className="version-panel">
        <SectionLabel>version history</SectionLabel>
        <p className="version-empty">no version history available yet.</p>
      </section>
    );
  }

  return (
    <section className="version-panel">
      <SectionLabel>version history</SectionLabel>

      <ol className="version-timeline">
        {ordered.map((v, idx) => {
          const isLast = idx === ordered.length - 1;
          const isSelected = v.id === selectedVersionId;
          const summary = changeSummaries[v.id];
          const highlights = summary?.metrics.slice(0, 3) ?? [];

          return (
            <li key={v.id} className="version-timeline__item">
              <button
                type="button"
                className={`version-timeline__row ${isSelected ? 'version-timeline__row--selected' : ''}`}
                onClick={() => onSelectVersion(v.id)}
                aria-pressed={isSelected}
              >
                <span className="version-timeline__rail" aria-hidden="true">
                  <span className={`version-timeline__dot ${v.isCurrent ? 'version-timeline__dot--current' : ''}`} />
                  {!isLast && <span className="version-timeline__line" />}
                </span>

                <span className="version-timeline__body">
                  <span className="version-timeline__heading">
                    <span className="version-timeline__label">{v.version}</span>
                    {v.isCurrent && <span className="version-timeline__current-tag">current</span>}
                  </span>

                  {highlights.length > 0 ? (
                    <span className="version-timeline__highlights">
                      {highlights.map((m) => (
                        <span key={m.label} className={`version-timeline__highlight version-timeline__highlight--${m.direction}`}>
                          {m.value} {m.label}
                        </span>
                      ))}
                    </span>
                  ) : (
                    <span className="version-timeline__subtitle">initial dataset checkpoint</span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default VersionTimeline;