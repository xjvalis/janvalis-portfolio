import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2, Image } from 'lucide-react';

const ASPECT_RATIOS = ['16:9', '4:3', '2.35:1', '1:1', '9:16'];

export default function ProjectForm({ project, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: project?.title || '',
    clientBrand: project?.clientBrand || '',
    category: project?.category || 'commercial',
    descriptor: project?.descriptor || '',
    aspectRatio: project?.aspectRatio || '16:9',
    sortOrder: project?.sortOrder ?? 0,
    isVisible: project?.isVisible !== false,
    featured: project?.featured || false,
    thumbnailUrl: project?.thumbnailUrl || '',
    videoUrl: project?.videoUrl || '',
    id: project?.id || '',
  });

  const [fetchingThumb, setFetchingThumb] = useState(false);

  const fetchVimeoThumbnail = async (url) => {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (!match) return;
    setFetchingThumb(true);
    try {
      const res = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.thumbnail_url) {
        // Get highest resolution thumbnail by replacing _640 with _1280
        const hiRes = data.thumbnail_url.replace(/_\d+$/, '_1280');
        set('thumbnailUrl', hiRes);
      }
    } catch (e) {
      console.error('Failed to fetch Vimeo thumbnail:', e);
    } finally {
      setFetchingThumb(false);
    }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = () => {
    if (!form.title) return;
    onSaved({ ...form });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-[#0a0a0a] border border-lunar/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-lunar/10">
          <h2 className="font-display text-2xl text-lunar">
            {project ? 'Edit Project' : 'New Project'}
          </h2>
          <button onClick={onClose} className="text-lunar/30 hover:text-lunar transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="px-8 py-8 space-y-8">

          {/* Title & Brand */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="font-interface text-[10px] text-lunar/40 tracking-widest block mb-2">TITLE *</label>
              <input
                className="admin-input"
                value={form.title}
                onChange={e => set('title', e.target.value)}
                placeholder="Project title"
              />
            </div>
            <div>
              <label className="font-interface text-[10px] text-lunar/40 tracking-widest block mb-2">CLIENT / BRAND</label>
              <input
                className="admin-input"
                value={form.clientBrand}
                onChange={e => set('clientBrand', e.target.value)}
                placeholder="Brand name"
              />
            </div>
          </div>

          {/* Category & Aspect */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="font-interface text-[10px] text-lunar/40 tracking-widest block mb-2">CATEGORY</label>
              <select
                className="admin-input"
                value={form.category}
                onChange={e => set('category', e.target.value)}
                style={{ background: 'transparent', color: '#F9F9F9' }}
              >
                <option value="commercial" style={{ background: '#0a0a0a' }}>Commercial</option>
                <option value="other" style={{ background: '#0a0a0a' }}>Other</option>
              </select>
            </div>
            <div>
              <label className="font-interface text-[10px] text-lunar/40 tracking-widest block mb-2">ASPECT RATIO</label>
              <select
                className="admin-input"
                value={form.aspectRatio}
                onChange={e => set('aspectRatio', e.target.value)}
                style={{ background: 'transparent', color: '#F9F9F9' }}
              >
                {ASPECT_RATIOS.map(r => (
                  <option key={r} value={r} style={{ background: '#0a0a0a' }}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Descriptor */}
          <div>
            <label className="font-interface text-[10px] text-lunar/40 tracking-widest block mb-2">DESCRIPTOR / TAGLINE</label>
            <input
              className="admin-input"
              value={form.descriptor}
              onChange={e => set('descriptor', e.target.value)}
              placeholder="Short description"
            />
          </div>

          {/* Vimeo URL — auto-fetches thumbnail */}
          <div>
            <label className="font-interface text-[10px] text-lunar/40 tracking-widest block mb-2">VIMEO URL</label>
            <input
              className="admin-input"
              value={form.videoUrl}
              onChange={e => {
                set('videoUrl', e.target.value);
                if (e.target.value.includes('vimeo.com')) {
                  fetchVimeoThumbnail(e.target.value);
                }
              }}
              placeholder="https://vimeo.com/123456789"
            />
            <p className="font-interface text-[9px] text-lunar/30 mt-2 tracking-wider">
              {fetchingThumb ? '⏳ Fetching thumbnail from Vimeo...' : 'Paste a Vimeo URL — thumbnail will be auto-fetched'}
            </p>
          </div>

          {/* Thumbnail URL — manual fallback */}
          <div>
            <label className="font-interface text-[10px] text-lunar/40 tracking-widest block mb-2">
              THUMBNAIL URL <span className="text-lunar/20">(auto-filled from Vimeo, or paste manually)</span>
            </label>
            <div className="flex items-center gap-4">
              {form.thumbnailUrl && (
                <div className="w-24 h-16 bg-lunar/10 flex-shrink-0 overflow-hidden">
                  <img src={form.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <input
                className="admin-input flex-1"
                value={form.thumbnailUrl}
                onChange={e => set('thumbnailUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Sort order */}
          <div>
            <label className="font-interface text-[10px] text-lunar/40 tracking-widest block mb-2">SORT ORDER</label>
            <input
              type="number"
              className="admin-input w-24"
              value={form.sortOrder}
              onChange={e => set('sortOrder', Number(e.target.value))}
            />
          </div>

          {/* Toggles */}
          <div className="flex gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => set('isVisible', !form.isVisible)}
                className={`w-8 h-4 rounded-full transition-colors duration-200 ${form.isVisible ? 'bg-cobalt' : 'bg-lunar/20'} relative`}
              >
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${form.isVisible ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              <span className="font-interface text-[11px] text-lunar/60 tracking-widest">VISIBLE</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => set('featured', !form.featured)}
                className={`w-8 h-4 rounded-full transition-colors duration-200 ${form.featured ? 'bg-cobalt' : 'bg-lunar/20'} relative`}
              >
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-200 ${form.featured ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
              <span className="font-interface text-[11px] text-lunar/60 tracking-widest">FEATURED (HOME)</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 px-8 py-6 border-t border-lunar/10">
          <button
            onClick={onClose}
            className="font-interface text-[11px] text-lunar/40 hover:text-lunar tracking-widest transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleSave}
            disabled={!form.title}
            className="flex items-center gap-2 bg-lunar text-obsidian px-6 py-2.5 font-interface text-[11px] tracking-widest hover:bg-cobalt hover:text-lunar transition-colors disabled:opacity-30"
          >
            {project ? 'SAVE CHANGES' : 'CREATE PROJECT'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
