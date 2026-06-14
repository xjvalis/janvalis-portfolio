import { useMemo, useRef, useState, useEffect } from 'react';
import ProjectTile from '@/components/ProjectTile';

const isVertical = (p) => p.aspectRatio === '9:16';

const ROW_HEIGHT_WIDE = '32vw';
const ROW_HEIGHT_VERT = '56vw';

// Skeleton placeholder for a single tile
function SkeletonTile({ height }) {
  return (
    <div
      style={{ height, width: '100%' }}
      className="bg-[#111] relative overflow-hidden"
    >
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 2s infinite',
        }}
      />
    </div>
  );
}

export default function MasonryGrid({ projects, onProjectClick }) {
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const tileRefs = useRef([]);

  const allLoaded = loadedCount >= projects.length;

  const rows = useMemo(() => {
    const rows = [];
    const items = [...projects];
    let i = 0;

    while (i < items.length) {
      const curr = items[i];

      if (isVertical(curr)) {
        const next = items[i + 1];
        if (next && isVertical(next)) {
          rows.push({ items: [{ project: curr, flex: '1 1 50%' }, { project: next, flex: '1 1 50%' }], height: ROW_HEIGHT_VERT });
          i += 2;
        } else if (next) {
          rows.push({ items: [{ project: curr, flex: '0 0 30%' }, { project: next, flex: '1 1 70%' }], height: ROW_HEIGHT_VERT });
          i += 2;
        } else {
          rows.push({ items: [{ project: curr, flex: '0 0 40%' }], height: ROW_HEIGHT_VERT });
          i += 1;
        }
      } else {
        const next = items[i + 1];
        if (next && !isVertical(next)) {
          rows.push({ items: [{ project: curr, flex: '1 1 50%' }, { project: next, flex: '1 1 50%' }], height: ROW_HEIGHT_WIDE });
          i += 2;
        } else if (next && isVertical(next)) {
          rows.push({ items: [{ project: curr, flex: '1 1 70%' }, { project: next, flex: '0 0 30%' }], height: ROW_HEIGHT_VERT });
          i += 2;
        } else {
          rows.push({ items: [{ project: curr, flex: '1 1 100%' }], height: ROW_HEIGHT_WIDE });
          i += 1;
        }
      }
    }

    return rows;
  }, [projects]);

  // Mobile spotlight tracking
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (!isMobile) return;

    const updateSpotlight = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      // At the very top → always first tile
      if (scrollY < 10) {
        setSpotlightIndex(0);
        return;
      }
      // At the very bottom → always last tile
      if (maxScroll > 0 && scrollY >= maxScroll - 10) {
        setSpotlightIndex(projects.length - 1);
        return;
      }

      // Otherwise: tile whose center is closest to 40% from top of screen
      const refPoint = window.innerHeight * 0.4;
      let bestIdx = 0;
      let bestDist = Infinity;

      tileRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;
        const tileMid = (rect.top + rect.bottom) / 2;
        const dist = Math.abs(tileMid - refPoint);
        if (dist < bestDist) {
          bestDist = dist;
          bestIdx = i;
        }
      });

      setSpotlightIndex(bestIdx);
    };

    updateSpotlight();
    window.addEventListener('scroll', updateSpotlight, { passive: true });
    return () => window.removeEventListener('scroll', updateSpotlight);
  }, [projects]);

  return (
    <>
      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Mobile: single column */}
      <div className="flex flex-col md:hidden">
        {projects.map((project, i) => {
          const tileHeight = isVertical(project) ? '100vw' : '56vw';
          return (
            <div
              key={project.id}
              ref={(el) => { tileRefs.current[i] = el; }}
              style={{ height: tileHeight, position: 'relative' }}
            >
              {/* Skeleton shown until image loads */}
              {!allLoaded && (
                <div className="absolute inset-0 z-10">
                  <SkeletonTile height="100%" />
                </div>
              )}
              <ProjectTile
                project={project}
                index={i}
                onClick={onProjectClick}
                fillHeight
                spotlightIndex={spotlightIndex}
                mobileIndex={i}
                onImageLoad={() => setLoadedCount(c => c + 1)}
              />
            </div>
          );
        })}
      </div>

      {/* Desktop: rows */}
      <div className="hidden md:flex flex-col" style={{ width: '100%' }}>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{ display: 'flex', width: '100%', height: row.height }}
          >
            {row.items.map(({ project, flex }, itemIndex) => (
              <div key={project.id} style={{ flex, minWidth: 0, overflow: 'hidden' }}>
                <ProjectTile
                  project={project}
                  index={rowIndex * 10 + itemIndex}
                  onClick={onProjectClick}
                  fillHeight
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
