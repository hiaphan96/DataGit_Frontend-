import { useState } from 'react';
import SectionLabel from '../common/SectionLabel';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import type { VersionDetail } from '../../types/version';

interface CurrentVersionCardProps {
  currentVersion: VersionDetail | null;
  onViewDetails?: () => void;
  onCompare?: () => void;
  onCreateCheckpoint: () => void;
  isCreatingCheckpoint: boolean;
}

function truncateHash(hash: string): string {
  if (hash.length <= 10) return hash;
  return `${hash.slice(0, 4)}...${hash.slice(-4)}`;
}

export function CurrentVersionCard({
  currentVersion,
  onViewDetails,
  onCompare,
  onCreateCheckpoint,
  isCreatingCheckpoint,
}: CurrentVersionCardProps) {
  const [copied, setCopied] = useState(false);

  if (!currentVersion) {
    return (
      <section className="version-panel version-current">
        <SectionLabel>current checkpoint</SectionLabel>
        <p className="version-empty">no versions available yet.</p>
      </section>
    );
  }

  const handleCopyHash = async () => {
    try {
      await navigator.clipboard.writeText(currentVersion.hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard access denied — silently ignore, non-critical interaction
    }
  };

  return (
    <section className="version-panel version-current">
      <SectionLabel>current checkpoint</SectionLabel>

      <div className="version-current__headline">
        <span className="version-current__number">{currentVersion.version}</span>
        <StatusBadge label="active" tone="positive" />
      </div>

      <dl className="version-current__meta">
        <div>
          <dt>dataset</dt>
          <dd>{currentVersion.dataset}</dd>
        </div>
        <div>
          <dt>created</dt>
          <dd>{currentVersion.createdAt}</dd>
        </div>
        <div>
          <dt>rows</dt>
          <dd>{currentVersion.rows.toLocaleString()}</dd>
        </div>
        <div>
          <dt>columns</dt>
          <dd>{currentVersion.columns}</dd>
        </div>
        <div>
          <dt>hash</dt>
          <dd className="version-current__hash">
            <span>{truncateHash(currentVersion.hash)}</span>
            <button type="button" className="version-copy-btn" onClick={handleCopyHash} aria-label="copy full hash">
              {copied ? 'copied' : 'copy'}
            </button>
          </dd>
        </div>
      </dl>

      <div className="version-current__actions">
        <Button type="button" onClick={onViewDetails}>view details</Button>
        <Button type="button" onClick={onCompare}>compare</Button>
        <Button variant="primary" type="button" onClick={onCreateCheckpoint} loading={isCreatingCheckpoint}>
          create checkpoint
        </Button>
      </div>
    </section>
  );
}

export default CurrentVersionCard;