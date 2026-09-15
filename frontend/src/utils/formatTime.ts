/**
 * Formats a real ISO timestamp from the backend into a short relative
 * label ("2h ago", "3d ago"), falling back to a locale date string for
 * anything older than a week. Never invents a value — returns '—' only
 * when the input itself is missing.
 */
export function formatRelativeTime(isoString: string | null | undefined): string {
  if (!isoString) return '—';

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);

  if (diffSec < 60) return 'just now';

  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function truncateHash(hash: string, lead = 4, tail = 4): string {
  if (!hash || hash.length <= lead + tail + 3) return hash;
  return `${hash.slice(0, lead)}...${hash.slice(-tail)}`;
}
