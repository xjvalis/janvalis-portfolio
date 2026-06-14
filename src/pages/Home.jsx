import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MasonryGrid from '@/components/MasonryGrid';
import Lightbox from '@/components/Lightbox';
import SocialFooter from '@/components/SocialFooter';
import { ProjectsAPI } from '@/api/dataClient';

export default function Home() {
  const gridRef = useRef(null);
  const [lightboxProject, setLightboxProject] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const displayProjects = ProjectsAPI.getFeatured();

  // Hide "SCROLL TO EXPLORE" after first scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) setScrolled(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-obsidian">
      {lightboxProject && (
        <Lightbox project={lightboxProject} onClose={() => setLightboxProject(null)} />
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.6 }}
        className="fixed bottom-8 left-8 z-40 pointer-events-none"
        style={{ willChange: 'opacity' }}
      >
        <p className="font-interface text-[10px] text-lunar/30 tracking-widest">© 2024</p>
      </motion.div>

      {/* SCROLL TO EXPLORE — fades out after first scroll */}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="fixed bottom-8 right-8 z-40 pointer-events-none"
            style={{ willChange: 'opacity' }}
          >
            <p className="font-interface text-[12px] text-lunar/50 tracking-widest">SCROLL TO EXPLORE</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-[52px]">
        {displayProjects.length > 0 && (
          <motion.div
            ref={gridRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <MasonryGrid projects={displayProjects} onProjectClick={setLightboxProject} />
          </motion.div>
        )}
        <SocialFooter />
      </div>
    </div>
  );
}
