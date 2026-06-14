import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Send, Copy, Check } from 'lucide-react';
import Lightbox from '@/components/Lightbox';
import { ProjectsAPI } from '@/api/dataClient';

export default function Contact() {
  const [lightboxProject, setLightboxProject] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const allProjects = ProjectsAPI.getAll();

  const shuffled = useMemo(() => {
    return [...allProjects].sort(() => Math.random() - 0.5);
  }, [allProjects]);

  const half = Math.ceil(shuffled.length / 2);
  const leftProjects = shuffled.slice(0, half);
  const rightProjects = shuffled.slice(half);

  const copyEmail = () => {
    navigator.clipboard.writeText('xjvalis@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText('+420728315763');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  return (
    <div className="min-h-screen bg-obsidian flex">
      {lightboxProject && (
        <Lightbox project={lightboxProject} onClose={() => setLightboxProject(null)} />
      )}

      <SidePanel projects={leftProjects} onProjectClick={setLightboxProject} />

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-start pt-36 px-8 min-w-0">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <p className="font-interface text-[10px] text-white/30 tracking-widest mb-10">
            Contact
          </p>

          {/* Email */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <a
              href="mailto:xjvalis@gmail.com"
              className="font-interface text-[19px] text-white tracking-widest hover:text-white/50 transition-colors"
            >
              xjvalis@gmail.com
            </a>

            <button
              onClick={copyEmail}
              className="text-white/30 hover:text-white transition-colors p-2"
              title="Copy email"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>

          {/* Phone */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <a
              href="tel:+420728315763"
              className="font-interface text-[19px] text-white/50 tracking-widest hover:text-white/80 transition-colors"
            >
              +420 728 315 763
            </a>

            <button
              onClick={copyPhone}
              className="text-white/30 hover:text-white transition-colors p-2"
              title="Copy phone"
            >
              {copiedPhone ? <Check size={18} /> : <Copy size={18} />}
            </button>
          </div>

          {/* Social */}
          <div className="flex items-center justify-center gap-10">
            <a
              href="https://www.instagram.com/janvalis"
              target="_blank"
              rel="noopener noreferrer"
              className="font-interface text-[15px] text-white/25 tracking-widest hover:text-white/60 transition-colors"
            >
              Instagram
            </a>

            <a
              href="https://vimeo.com/janvalis"
              target="_blank"
              rel="noopener noreferrer"
              className="font-interface text-[15px] text-white/25 tracking-widest hover:text-white/60 transition-colors"
            >
              Vimeo
            </a>
          </div>
        </motion.div>
      </div>

      <SidePanel projects={rightProjects} onProjectClick={setLightboxProject} />
    </div>
  );
}

function SidePanel({ projects, onProjectClick }) {
  if (!projects.length) return null;

  return (
    <div className="hidden lg:flex flex-col w-[20vw] min-h-screen overflow-hidden flex-shrink-0">
      {projects.map((p) => (
        <button
          key={p.id}
          onClick={() => onProjectClick(p)}
          className="relative overflow-hidden group"
          style={{ flex: 1 }}
        >
          {p.thumbnailUrl ? (
            <img
              src={p.thumbnailUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[#111]" />
          )}

          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-all duration-500" />
        </button>
      ))}
    </div>
  );
}
