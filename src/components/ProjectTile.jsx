import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RATIO_MAP = {
  '16:9': '16/9',
  '4:3': '4/3',
  '2.35:1': '2.35/1',
  '1:1': '1/1',
  '9:16': '9/16',
};

const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export default function ProjectTile({
  project,
  index = 0,
  onClick,
  fillHeight = false,
  spotlightIndex,
  mobileIndex,
  onImageLoad,
}) {
  const videoRef = useRef(null);
  const tileRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const ratio = RATIO_MAP[project.aspectRatio] || '16/9';

  const isMobileSpotlight = isTouch && mobileIndex !== undefined && mobileIndex === spotlightIndex;
  const desktopActive = !isTouch && hovered;

  const handleMouseEnter = () => {
    if (isTouch) return;
    setHovered(true);
    if (videoRef.current && project.videoUrl) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (isTouch) return;
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      ref={tileRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
      className="relative w-full overflow-hidden bg-[#111] cursor-pointer group"
      style={fillHeight ? { height: '100%' } : { aspectRatio: ratio }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onClick?.(project)}
    >
      {/* Thumbnail */}
      {project.thumbnailUrl && (
        <img
          src={project.thumbnailUrl}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: desktopActive
              ? 'scale(1.07)'
              : isMobileSpotlight
              ? 'scale(1.04)'
              : 'scale(1)',
            transition: 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
          loading="lazy"
          onLoad={onImageLoad}
        />
      )}

      {/* Video hover preview */}
      {project.videoUrl && !project.videoUrl.includes('vimeo.com') && (
        <video
          ref={videoRef}
          src={project.videoUrl}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ opacity: desktopActive ? 1 : 0, transition: 'opacity 0.9s ease' }}
        />
      )}

      {/* Mobile: dark overlay on non-spotlight tiles */}
      {isTouch && mobileIndex !== undefined && (
        <div
          className="absolute inset-0 bg-black"
          style={{
            opacity: isMobileSpotlight ? 0 : 0.55,
            transition: 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      )}

      {/* Desktop: dark overlay on hover */}
      {!isTouch && (
        <div
          className="absolute inset-0 bg-black"
          style={{
            opacity: desktopActive ? 0.38 : 0,
            transition: 'opacity 0.9s ease',
          }}
        />
      )}

      {/* Mobile: title — only on spotlight */}
      {isTouch && mobileIndex !== undefined && (
        <div
          className="absolute inset-0 flex items-end justify-start p-5"
          style={{
            opacity: isMobileSpotlight ? 1 : 0,
            transform: isMobileSpotlight ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.6s ease 0.05s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.05s',
          }}
        >
          <div>
            {project.clientBrand && (
              <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1">
                {project.clientBrand}
              </p>
            )}
            <h3 className="text-white text-sm font-semibold drop-shadow-lg leading-tight">
              {project.title}
            </h3>
          </div>
        </div>
      )}

      {/* Desktop: title on hover */}
      {!isTouch && (
        <div
          className="absolute inset-0 flex items-end justify-start p-5 md:items-center md:justify-center md:p-4"
          style={{
            opacity: desktopActive ? 1 : 0,
            transform: desktopActive ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 0.7s ease 0.1s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s',
          }}
        >
          <div className="md:text-center">
            {project.clientBrand && (
              <p className="text-white/60 text-[10px] uppercase tracking-widest mb-1">
                {project.clientBrand}
              </p>
            )}
            <h3 className="text-white text-sm md:text-lg font-semibold drop-shadow-lg leading-tight">
              {project.title}
            </h3>
            {project.descriptor && (
              <p className="text-white/50 text-[11px] mt-1 hidden md:block">{project.descriptor}</p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
