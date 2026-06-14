import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, Settings, ArrowLeft } from 'lucide-react';

const navItems = [
  { label: 'Projects', path: '/admin', icon: Film },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#050505] text-lunar flex">
      {/* Sidebar */}
      <div className="w-56 min-h-screen border-r border-lunar/10 flex flex-col py-8 px-6 flex-shrink-0">
        <div className="mb-10">
          <p className="text-white text-base font-semibold">Jan Vališ</p>
          <p className="font-interface text-[10px] text-lunar/30 tracking-widest mt-1">ADMIN</p>
        </div>

        <div className="scan-line mb-8" />

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ label, path, icon: ItemIcon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors duration-200 font-interface text-[11px] tracking-widest no-underline ${
                location.pathname === path
                  ? 'text-lunar bg-lunar/10'
                  : 'text-lunar/40 hover:text-lunar hover:bg-lunar/5'
              }`}
            >
              <ItemIcon size={14} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="scan-line mb-6" />

        <Link
          to="/"
          className="flex items-center gap-2 font-interface text-[10px] text-lunar/30 hover:text-lunar transition-colors tracking-widest no-underline"
        >
          <ArrowLeft size={12} />
          VIEW SITE
        </Link>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}