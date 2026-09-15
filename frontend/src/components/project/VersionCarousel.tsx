import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ProjectVersionSummary } from '../../types/version';
import { formatRelativeTime, truncateHash } from '../../utils/formatTime';

interface VersionCarouselProps {
  versions: ProjectVersionSummary[];
  selectedVersionId: string | null;
  onSelectVersion: (id: string) => void;
}

const MIN_SCALE = 0.82;
const NEAR_SCALE = 0.92;
const MAX_SCALE = 1.08;
const FALLOFF_PX = 220; // distance over which scale/opacity fall off from center

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  return reduced;
}

export function VersionCarousel({ versions, selectedVersionId, onSelectVersion }: VersionCarouselProps) {
  // newest at the top, matching the reference image's reading order
  const ordered = useMemo(() => [...versions].sort((a, b) => b.versionNumber - a.versionNumber), [versions]);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(new Map<string, HTMLButtonElement>());
  const rafRef = useRef<number | null>(null);

  const [centeredId, setCenteredId] = useState<string | null>(selectedVersionId);
  const reducedMotion = usePrefersReducedMotion();

  const registerCard = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) cardRefs.current.set(id, el);
    else cardRefs.current.delete(id);
  }, []);

  // Distance-based scale/opacity, applied straight to DOM via refs on every
  // frame — no React state touched here, so scrolling never triggers a
  // re-render. A re-render only happens when the *closest* card actually
  // changes (see the guarded setCenteredId below).
  const updateScales = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const centerY = containerRect.top + containerRect.height / 2;

    let closestId: string | null = null;
    let closestDist = Infinity;

    ordered.forEach((v) => {
      const card = cardRefs.current.get(v.id);
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const dist = Math.abs(cardCenter - centerY);

      if (dist < closestDist) {
        closestDist = dist;
        closestId = v.id;
      }

      if (reducedMotion) {
        card.style.transform = 'scale(1)';
        card.style.opacity = '1';
      } else {
        const t = Math.min(dist / FALLOFF_PX, 1);
        // scale eases from MAX_SCALE at center, through NEAR_SCALE, down to MIN_SCALE
        const scale = t < 0.5 ? MAX_SCALE - (MAX_SCALE - NEAR_SCALE) * (t / 0.5) : NEAR_SCALE - (NEAR_SCALE - MIN_SCALE) * ((t - 0.5) / 0.5);
        const opacity = 1 - t * 0.55;
        card.style.transform = `scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(3);
      }
    });

    setCenteredId((prev) => (prev === closestId ? prev : closestId));
  }, [ordered, reducedMotion]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        updateScales();
      });
    };

    updateScales();
    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [updateScales]);

  // Keep the externally-selected version centered (e.g. on first load).
  useEffect(() => {
    if (!selectedVersionId) return;
    const card = cardRefs.current.get(selectedVersionId);
    card?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  }, [selectedVersionId, reducedMotion]);

  const handleCardClick = (id: string) => {
    onSelectVersion(id);
    cardRefs.current.get(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = ordered[Math.min(index + 1, ordered.length - 1)];
      if (next) handleCardClick(next.id);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prev = ordered[Math.max(index - 1, 0)];
      if (prev) handleCardClick(prev.id);
    }
  };

  if (ordered.length === 0) {
    return (
      <div className="version-carousel version-carousel--empty">
        <p className="version-empty">No versions yet.</p>
      </div>
    );
  }

  return (
    <div className="version-carousel" ref={containerRef} role="listbox" aria-label="Project versions">
      <div className="version-carousel__spacer" aria-hidden="true" />

      {ordered.map((v, index) => {
        const isSelected = v.id === selectedVersionId;
        const isCentered = v.id === centeredId;
        const expanded = isSelected && isCentered;

        const prev = ordered[index + 1]; // next-older version (list is newest-first)
        const trend =
          v.accuracy != null && prev?.accuracy != null
            ? v.accuracy === prev.accuracy
              ? 'flat'
              : v.accuracy > prev.accuracy
                ? 'up'
                : 'down'
            : null;

        return (
          <button
            key={v.id}
            type="button"
            ref={(el) => registerCard(v.id, el)}
            role="option"
            aria-selected={isSelected}
            className={`version-carousel__card pixel-frame ${expanded ? 'version-carousel__card--expanded' : ''} ${isSelected ? 'version-carousel__card--selected' : ''}`}
            onClick={() => handleCardClick(v.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            <span className="version-carousel__label">version {v.versionNumber}</span>

            {expanded && (
              <div className="version-carousel__detail">
                <div className="version-carousel__rule" aria-hidden="true" />

                <div className="version-carousel__row">
                  <span className="version-carousel__field">
                    Accu :{' '}
                    {v.accuracy != null ? (
                      <span className="version-carousel__accuracy">
                        {v.accuracy.toFixed(2)}
                        {trend === 'up' && <span className="version-carousel__trend version-carousel__trend--up"> ▲</span>}
                        {trend === 'down' && <span className="version-carousel__trend version-carousel__trend--down"> ▼</span>}
                      </span>
                    ) : (
                      <span className="version-carousel__muted">no evaluation data yet</span>
                    )}
                  </span>

                  <span className="version-carousel__field">
                    {v.description ? v.description : <span className="version-carousel__muted">{'{ no description }'}</span>}
                  </span>
                </div>

                <div className="version-carousel__row">
                  <span className="version-carousel__field">
                    Created : <span className="version-carousel__value">{formatRelativeTime(v.createdAt)}</span>
                  </span>
                  <span className="version-carousel__field">
                    commit : <span className="version-carousel__value version-carousel__value--accent">{truncateHash(v.gitCommit)}</span>
                  </span>
                </div>
              </div>
            )}
          </button>
        );
      })}

      <div className="version-carousel__spacer" aria-hidden="true" />
    </div>
  );
}

export default VersionCarousel;
