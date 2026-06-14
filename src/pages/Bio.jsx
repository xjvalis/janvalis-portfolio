import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import SocialFooter from '@/components/SocialFooter';
import { SettingsAPI } from '@/api/dataClient';

function PortraitPanel({ src, alt }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="hidden md:block w-[38%] sticky top-0 h-screen flex-shrink-0 overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover grayscale transition-transform duration-700 ease-out"
        style={{ transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

const filmWorks = [
  { title: 'Kulturní Fronta (d. Jindřich Andrš)', note: 'Český Lev · Best short film nominee' },
  { title: 'Ještě nespíš? (d. David Payne)', note: 'Český Lev · Best short film nominee' },
  { title: 'ANIMOT (d. Juliana Moska)', note: 'MFDF Ji.Hlava · Best film nominee\nČeský Lev · Best short film nominee' },
  { title: 'Noro, přijde k tobě nečekaný host (d. T. Lvovská)', note: 'MFDF Ji.Hlava · Best experimental film nominee' },
  { title: 'Kamenolom (d. Josef Švejda)', note: 'MFDF Ji.Hlava · Best experimental film nominee' },
  { title: 'Rodný kraj (d. Širín Nafariehová)', note: 'Jeden Svět · Czech competition' },
  { title: 'Ramon (d. Michal Starý)', note: 'Vertifilms · Best film winner' },
  { title: 'Dusno (d. Michal Starý)', note: 'Presented at Queen Palm IFF' },
  { title: 'Trip (2023)', note: 'Kamera OKO · Best short film' },
  { title: 'Portrait of Jaroslaw Kamiński (2022)', note: 'MFDF Ji.Hlava' },
  { title: 'Seznámení (2022)', note: '' },
];

const commercialWorks = [
  { title: 'Médecins sans frontières (d. Michal Starý)', note: 'TV AD · Czech Republic · Canada · Austria' },
  { title: 'Radegast proti suchu (d. Oliver Beaujard)', note: 'Digital AD · Czech Republic' },
  { title: 'PixelGlow (2026)', note: 'Digital AD' },
  { title: 'Ze Mě Projekt (2026)', note: 'Digital AD' },
  { title: 'LASVIT Minerva (2025)', note: 'Digital AD' },
  { title: 'Ze Mě Projekt (2022)', note: 'Digital AD' },
];

const musicVideos = [
  { title: 'Bloome - Sleepless Nights (2026)', note: '' },
  { title: 'Sabina Olijve - Špatnej sen (2025)', note: '' },
  { title: 'Anna Vaverková - Polepšovna (2023)', note: '' },
  { title: 'Bob Bleedy - Insane (2024)', note: '' },
  { title: 'Yasha96 - Wet Speed (2024)', note: '' },
  { title: 'Bob Bleedy - Dreaming / Resource (2022)', note: '' },
  { title: 'Aldente - Miss You (2020)', note: '' },
  { title: 'Yasha96 - Empty Bottles of coke (2020)', note: '' },
  { title: 'DUBSTRACT - Never Stop (2019)', note: '' },
];

function WorkSection({ title, items }) {
  return (
    <div className="mb-8">
      <p className="text-white/50 text-[11px] tracking-widest uppercase underline underline-offset-4 mb-4">{title}</p>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i}>
            <p className="text-white/80 text-[13px] tracking-wider">{item.title}</p>
            {item.note && item.note.split('\n').map((n, j) => (
              <p key={j} className="text-white/30 text-[12px] tracking-wider mt-0.5">{n}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Bio() {
  const settings = SettingsAPI.get();
  const bioName = settings.bio_name || 'Jan Vališ';
  const bioPhoto = settings.bio_photo || '';

  const [spotY, setSpotY] = useState(30);
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

  useEffect(() => {
    if (!isMobile) return;
    const update = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      setSpotY(30 + progress * 40);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-obsidian flex flex-col md:flex-row">
      {/* Mobile spotlight overlay */}
      {isMobile && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            zIndex: 30,
            background: `linear-gradient(to bottom,
              rgba(5,5,5,0.55) 0%,
              rgba(5,5,5,0.55) ${Math.max(0, spotY - 22)}%,
              rgba(5,5,5,0) ${Math.max(0, spotY - 8)}%,
              rgba(5,5,5,0) ${Math.min(100, spotY + 8)}%,
              rgba(5,5,5,0.55) ${Math.min(100, spotY + 22)}%,
              rgba(5,5,5,0.55) 100%)`,
          }}
        />
      )}

      {/* Mobile portrait */}
      <div className="md:hidden w-full h-[45vw] overflow-hidden relative flex-shrink-0">
        <img
          src={bioPhoto}
          alt={bioName}
          className="w-full h-full object-cover object-top grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-obsidian pointer-events-none" />

      </div>

      {/* Desktop portrait */}
      <PortraitPanel src={bioPhoto} alt={bioName} />

      {/* CV content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex-1 px-6 md:px-14 pt-6 md:pt-24 pb-20 overflow-y-auto"

        style={{}}
      >
        <h1 className="text-white text-4xl md:text-5xl font-semibold tracking-tight mb-4">{bioName}</h1>
        <div className="w-12 h-px bg-white/30 mb-6" />

        <p className="text-white/70 text-[12px] tracking-[0.2em] uppercase mb-1">Cinematographer</p>
        <p className="text-white/30 text-[11px] tracking-[0.18em] uppercase mb-8">Commercial · Film · Documentary</p>

        <p className="text-white/60 text-[12px] tracking-widest uppercase mb-1">xjvalis@gmail.com</p>
        <p className="text-white/60 text-[12px] tracking-widest uppercase mb-10">+420 728 315 763</p>

        <div className="mb-10">
          <p className="text-white/70 text-[12px] tracking-[0.2em] uppercase mb-2">Education</p>
          <div className="h-px bg-white/15 mb-5" />
          <p className="text-white/80 text-[13px] tracking-wider mb-0.5">FAMU</p>
          <p className="text-white/30 text-[12px] tracking-wider">MgA. Dpt. of Cinematography · 2025</p>
        </div>

        <div className="mb-8">
          <p className="text-white/70 text-[12px] tracking-[0.2em] uppercase mb-2">Selected Works</p>
          <div className="h-px bg-white/15 mb-6" />
          <WorkSection title="Film" items={filmWorks} />
          <WorkSection title="Commercial" items={commercialWorks} />
          <WorkSection title="Music Video" items={musicVideos} />
        </div>
        <SocialFooter />
      </motion.div>
    </div>
  );
}
