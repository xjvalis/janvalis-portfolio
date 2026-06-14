import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

function getVimeoEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (!match) return null;
  const hashMatch = url.match(/vimeo\.com\/\d+\/([a-f0-9]+)/);
  const hashParam = hashMatch ? `&h=${hashMatch[1]}` : '';
  return `https://player.vimeo.com/video/${match[1]}?autoplay=1&color=ffffff&title=0&byline=0&portrait=0${hashParam}`;
}

const RATIO_CSS = {
  '16:9': '16/9',
  '4:3': '4/3',
  '2.35:1': '2.35/1',
  '1:1': '1/1',
  '9:16': '9/16',
};

export default function Lightbox({ project, onClose }) {
  const embedUrl = getVimeoEmbedUrl(project.videoUrl);
  const isVertical = project.aspectRatio === '9:16';
  const ratioCss = RATIO_CSS[project.aspectRatio] || '16/9';

  // Swipe-down to close
  const touchStartY = useRef(null);
  const touchStartTime = useRef(null);
  const [swipeDelta, setSwipeDelta] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    setIsSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (touchStartY.current === null) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) setSwipeDelta(delta);
  };

  const handleTouchEnd = () => {
    const elapsed = Date.now() - touchStartTime.current;
    const isQuickFlick = elapsed < 300 && swipeDelta > 60;
    const isLongDrag = swipeDelta > 140;
    if (isQuickFlick || isLongDrag) {
      onClose();
    } else {
      setSwipeDelta(0);
    }
    setIsSwiping(false);
    touchStartY.current = null;
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Opacity fades as you swipe down
  const swipeOpacity = Math.max(0.2, 1 - swipeDelta / 300);
  const swipeScale = Math.max(0.88, 1 - swipeDelta / 1200);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] bg-black/95 flex flex-col items-center justify-center p-0 md:p-4"
        style={{ opacity: isSwiping ? swipeOpacity : undefined }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-white/60 hover:text-white transition-colors bg-black/40 rounded-full p-1.5"
        >
          <X size={20} />
        </button>

        {/* Swipe hint — only on mobile, fades after mount */}
        <motion.p
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-6 left-0 right-0 text-center text-white/30 text-[11px] tracking-widest uppercase pointer-events-none md:hidden"
        >
          Swipe down to close
        </motion.p>

        {/* Title */}
        <div className={`absolute z-10 ${isVertical ? 'bottom-14 left-4' : 'top-4 left-4'}`}>
          <p className="text-white text-[13px] font-semibold drop-shadow-lg">{project.title}</p>
          {project.clientBrand && (
            <p className="text-white/40 text-[11px] mt-0.5">{project.clientBrand}</p>
          )}
        </div>

        {/* Media container — moves with swipe */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={
            isVertical
              ? 'h-[88vh] w-auto'
              : 'w-full max-w-[95vw] md:max-w-5xl mx-4'
          }
          style={{
            ...(isVertical ? { aspectRatio: '9/16' } : {}),
            transform: isSwiping ? `translateY(${swipeDelta * 0.6}px) scale(${swipeScale})` : undefined,
            transition: isSwiping ? 'none' : 'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <div
            className="relative w-full h-full bg-black"
            style={isVertical ? { height: '100%' } : { aspectRatio: ratioCss }}
          >
            {embedUrl ? (
              <iframe
                src={embedUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : project.thumbnailUrl ? (
              <img
                src={project.thumbnailUrl}
                alt={project.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white/20 text-sm">No media</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
