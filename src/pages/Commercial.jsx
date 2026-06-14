import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MasonryGrid from '@/components/MasonryGrid';
import Lightbox from '@/components/Lightbox';
import SocialFooter from '@/components/SocialFooter';
import { ProjectsAPI } from '@/api/dataClient';

export default function Commercial() {
  const projects = ProjectsAPI.getByCategory('commercial');
  return <ProjectGrid projects={projects} />;
}

export function Other() {
  const projects = ProjectsAPI.getByCategory('other');
  return <ProjectGrid projects={projects} />;
}

function ProjectGrid({ projects }) {
  const [lightboxProject, setLightboxProject] = useState(null);

  return (
    <div className="min-h-screen bg-obsidian pt-[52px] pb-20">
      {lightboxProject && (
        <Lightbox project={lightboxProject} onClose={() => setLightboxProject(null)} />
      )}
      {projects && projects.length > 0 && (
        <MasonryGrid projects={projects} onProjectClick={setLightboxProject} />
      )}
      <SocialFooter />
    </div>
  );
}
