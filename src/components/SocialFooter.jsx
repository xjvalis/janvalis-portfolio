export default function SocialFooter() {
  return (
    <div className="flex items-center justify-center gap-10 md:gap-14 py-12 border-t border-white/10">
      <a
        href="https://www.instagram.com/janvalis"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 font-interface text-[16px] text-lunar/30 tracking-widest hover:text-lunar transition-colors duration-300"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
        </svg>
        INSTAGRAM
      </a>
      <a
        href="https://vimeo.com/janvalis"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 font-interface text-[16px] text-lunar/30 tracking-widest hover:text-lunar transition-colors duration-300"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 7.42c-.09 2.01-1.49 4.76-4.21 8.25C15.03 19.26 12.67 21 10.67 21c-1.27 0-2.35-1.18-3.22-3.53L5.9 11.97C5.27 9.62 4.6 8.45 3.88 8.45c-.16 0-.71.33-1.64.99L1 8.17c1.03-.9 2.04-1.8 3.03-2.7 1.37-1.18 2.4-1.8 3.08-1.86 1.62-.15 2.62.95 3 3.3.41 2.53.69 4.1.84 4.72.47 2.12.98 3.18 1.55 3.18.44 0 1.1-.69 1.97-2.08.87-1.39 1.34-2.45 1.39-3.18.12-1.2-.35-1.81-1.39-1.81-.5 0-1.01.11-1.54.34.51-1.68 1.5-2.5 2.95-2.46 1.08.03 1.58.73 1.52 2.1z"/>
        </svg>
        VIMEO
      </a>
    </div>
  );
}