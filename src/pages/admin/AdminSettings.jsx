import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';
import settingsDataRaw from '@/data/settings.json';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    ...settingsDataRaw,
    social_links: Array.isArray(settingsDataRaw.social_links)
      ? JSON.stringify(settingsDataRaw.social_links, null, 2)
      : settingsDataRaw.social_links || '[]',
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key, val) => {
    setSettings(s => ({ ...s, [key]: val }));
    setHasChanges(true);
  };

  const downloadJSON = () => {
    // Parse social_links back to array before saving
    let parsed;
    try {
      parsed = { ...settings, social_links: JSON.parse(settings.social_links) };
    } catch {
      alert('Social links JSON is invalid. Please fix it before downloading.');
      return;
    }
    const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'settings.json';
    a.click();
    URL.revokeObjectURL(url);
    setHasChanges(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-8 md:p-10 max-w-2xl">
      <div className="mb-10">
        <h1 className="font-display text-4xl text-lunar">Settings</h1>
        <p className="font-interface text-[10px] text-lunar/30 tracking-widest mt-1">SITE CONFIGURATION</p>
      </div>

      <div className="scan-line mb-10" />

      {hasChanges && (
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 px-5 py-4 mb-8">
          <AlertCircle size={15} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-300 text-[12px] font-medium tracking-wider">Neuložené změny</p>
            <p className="text-yellow-300/60 text-[11px] tracking-wider mt-1">
              Klikni "Download settings.json" a nahraj do GitHubu do <code className="text-yellow-300/80">src/data/settings.json</code>
            </p>
          </div>
        </div>
      )}

      <div className="space-y-10">

        <div>
          <label className="font-interface text-[10px] text-cobalt tracking-widest block mb-3">CONTACT EMAIL</label>
          <input
            className="admin-input text-lg"
            value={settings.contact_email}
            onChange={e => set('contact_email', e.target.value)}
            placeholder="your@gmail.com"
            type="email"
          />
        </div>

        <div className="scan-line" />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="font-interface text-[10px] text-cobalt tracking-widest block mb-3">NAME</label>
            <input className="admin-input" value={settings.bio_name} onChange={e => set('bio_name', e.target.value)} placeholder="Jan Vališ" />
          </div>
          <div>
            <label className="font-interface text-[10px] text-cobalt tracking-widest block mb-3">SUBTITLE</label>
            <input className="admin-input" value={settings.bio_subtitle} onChange={e => set('bio_subtitle', e.target.value)} placeholder="Cinematographer — Prague" />
          </div>
        </div>

        <div className="scan-line" />

        <div>
          <label className="font-interface text-[10px] text-cobalt tracking-widest block mb-3">BIO TEXT</label>
          <textarea
            className="admin-input resize-none"
            value={settings.bio_text}
            onChange={e => set('bio_text', e.target.value)}
            rows={8}
            placeholder="Write your bio here..."
            style={{
              background: 'transparent',
              border: '0.5px solid rgba(249,249,249,0.1)',
              padding: '12px',
              borderRadius: '2px',
              lineHeight: '1.8',
              color: '#F9F9F9',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              width: '100%',
              outline: 'none',
            }}
          />
          <p className="font-interface text-[10px] text-lunar/20 mt-2 tracking-wider">
            Separate paragraphs with a blank line.
          </p>
        </div>

        <div className="scan-line" />

        <div>
          <label className="font-interface text-[10px] text-cobalt tracking-widest block mb-3">BIO PHOTO URL</label>
          <input
            className="admin-input"
            value={settings.bio_photo}
            onChange={e => set('bio_photo', e.target.value)}
            placeholder="https://..."
          />
          <p className="font-interface text-[10px] text-lunar/20 mt-2 tracking-wider">
            Upload your photo to a free image host (např. <a href="https://imgur.com" target="_blank" rel="noopener" className="text-cobalt hover:text-white">imgur.com</a>) a vlož URL sem.
          </p>
          {settings.bio_photo && (
            <div className="mt-3 w-20 h-28 overflow-hidden bg-lunar/10">
              <img src={settings.bio_photo} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="scan-line" />

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="font-interface text-[10px] text-cobalt tracking-widest block mb-3">CONTACT SUBHEADING</label>
            <input className="admin-input" value={settings.contact_subheading} onChange={e => set('contact_subheading', e.target.value)} placeholder="Contact" />
          </div>
          <div>
            <label className="font-interface text-[10px] text-cobalt tracking-widest block mb-3">CONTACT HEADING</label>
            <input className="admin-input" value={settings.contact_heading} onChange={e => set('contact_heading', e.target.value)} placeholder="Get in touch" />
          </div>
        </div>

        <div className="scan-line" />

        <div>
          <label className="font-interface text-[10px] text-cobalt tracking-widest block mb-3">SOCIAL LINKS (JSON)</label>
          <textarea
            className="admin-input resize-none"
            value={settings.social_links}
            onChange={e => set('social_links', e.target.value)}
            rows={5}
            style={{
              background: 'transparent',
              border: '0.5px solid rgba(249,249,249,0.1)',
              padding: '12px',
              borderRadius: '2px',
              lineHeight: '1.8',
              color: '#F9F9F9',
              fontFamily: 'monospace',
              fontSize: '13px',
              width: '100%',
              outline: 'none',
            }}
          />
          <p className="font-interface text-[10px] text-lunar/20 mt-2 tracking-wider">
            Format: {`[{"label":"INSTAGRAM","url":"https://..."}]`}
          </p>
        </div>

      </div>

      <div className="scan-line my-10" />

      <button
        onClick={downloadJSON}
        className="flex items-center gap-2 bg-lunar text-obsidian px-8 py-3 font-interface text-[11px] tracking-widest hover:bg-cobalt hover:text-lunar transition-all duration-300"
      >
        {saved ? <Check size={13} /> : null}
        {saved ? 'STAŽENO!' : '↓ DOWNLOAD SETTINGS.JSON'}
      </button>
      <p className="font-interface text-[10px] text-lunar/20 mt-3 tracking-wider">
        Po stažení nahraj soubor na GitHub do <code className="text-lunar/40">src/data/settings.json</code>
      </p>
    </div>
  );
}
