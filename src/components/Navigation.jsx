import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'HOME', path: '/' },
  { label: 'COMMERCIAL', path: '/commercial' },
  { label: 'OTHER', path: '/other' },
  { label: 'BIO', path: '/bio' },
  { label: 'CONTACT', path: '/contact' },
];

export default function Navigation() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isAdmin = location.pathname.startsWith('/admin');

  if (isAdmin) return null;

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 md:px-6 h-[52px]"
        style={{ background: 'rgba(20,20,20,0.92)', backdropFilter: 'blur(8px)' }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="font-sans text-white text-[13px] font-semibold tracking-wider uppercase no-underline"
          onClick={() => setOpen(false)}
        >
          Jan Vališ
          <span className="text-white/30 font-normal text-[11px] tracking-[0.2em] ml-3 uppercase">· Cinematographer</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-sans text-[13px] transition-colors duration-200 no-underline ${
                location.pathname === link.path ? 'text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger — extra-large hit area */}
        <button
          className="md:hidden text-white/70 hover:text-white transition-colors flex items-center justify-center"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '88px',
            height: '72px',
            paddingBottom: '20px',
            paddingRight: '4px',
            zIndex: 60,
            WebkitTapHighlightColor: 'transparent',
          }}
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: 'rgba(5,5,5,0.97)', backdropFilter: 'blur(16px)' }}
          >
            {/* Close tap anywhere — invisible full-screen target behind content */}
            <div className="absolute inset-0" onClick={() => setOpen(false)} />

            <div className="relative flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setOpen(false)}
                    className={`font-sans text-2xl font-semibold tracking-widest uppercase no-underline transition-colors ${
                      location.pathname === link.path ? 'text-white' : 'text-white/35 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.07 + 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-8 mt-4"
              >
                <a
                  href="https://www.instagram.com/janvalis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm tracking-widest uppercase text-white/30 hover:text-white/70 transition-colors no-underline"
                >
                  Instagram
                </a>
                <a
                  href="https://vimeo.com/janvalis"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm tracking-widest uppercase text-white/30 hover:text-white/70 transition-colors no-underline"
                >
                  Vimeo
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
