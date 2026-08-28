import SectionLabel from '../common/SectionLabel';
import Select from '../common/Select';
import Button from '../common/Button';
import type { VersionComparisonResult, VersionDetail } from '../../types/version';

interface CompareVersionsProps {
  versions: VersionDetail[];
  baselineId: string;
  currentId: string;
  onBaselineChange: (id: string) => void;
  onCurrentChange: (id: string) => void;
  onRunComparison: () => void;
  result: VersionComparisonResult | null;
  isComparing: boolean;
}

const STATUS_LABEL: Record<VersionComparisonResult['overallStatus'], string> = {
  safe: 'safe to continue',
  warning: 'review before continuing',
  unsafe: 'not safe to continue',
};

export function CompareVersions({
  versions,
  baselineId,
  currentId,
  onBaselineChange,
  onCurrentChange,
  onRunComparison,
  result,
  isComparing,
}: CompareVersionsProps) {
  const options = versions
    .slice()
    .sort((a, b) => b.version.localeCompare(a.version))
    .map((v) => ({ value: v.id, label: v.version }));

  const canRun = baselineId.length > 0 && currentId.length > 0 && baselineId !== currentId && !isComparing;

  return (
    <section className="version-panel">
      <SectionLabel>compare</SectionLabel>

      <div className="version-compare__selectors">
        <div className="version-compare__field">
          <label htmlFor="compare-baseline">baseline</label>
          <Select id="compare-baseline" options={options} value={baselineId} onChange={(e) => onBaselineChange(e.target.value)} />
        </div>
        <div className="version-compare__field">
          <label htmlFor="compare-current">current</label>
          <Select id="compare-current" options={options} value={currentId} onChange={(e) => onCurrentChange(e.target.value)} />
        </div>
        <Button variant="primary" type="button" onClick={onRunComparison} disabled={!canRun} loading={isComparing}>
          run comparison
        </Button>
      </div>

      {baselineId === currentId && baselineId.length > 0 && (
        <p className="version-compare__hint">select two different versions to compare.</p>
      )}

      {result && (
        <div className="version-compare__result">
          <p className="version-compare__result-title">comparison complete</p>

          <dl className="version-compare__result-grid">
            <div>
              <dt>rows</dt>
              <dd>{result.rowsDelta}</dd>
            </div>
            <div>
              <dt>missing values</dt>
              <dd>{result.missingValuesDelta}</dd>
            </div>
            <div>
              <dt>duplicates</dt>
              <dd>{result.duplicatesDelta}</dd>
            </div>
            <div>
              <dt>schema</dt>
              <dd>{result.schemaNote}</dd>
            </div>
          </dl>

          <p className={`version-compare__status version-compare__status--${result.overallStatus}`}>
            status: {STATUS_LABEL[result.overallStatus]}
          </p>
        </div>
      )}
    </section>
  );
}

export default CompareVersions;