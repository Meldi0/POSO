import React from 'react';

export const PosoPartnersRow: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-6 sm:gap-10 pt-4 opacity-90 hover:opacity-100 transition-opacity">
      {/* POS Indonesia Official Badge */}
      <div className="flex items-center gap-2.5 group cursor-default">
        <div className="w-8 h-8 rounded-full bg-[#1e1533] border border-amber-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.25)] group-hover:scale-110 transition-transform">
          {/* POS Flying Dove / Letter Post SVG Icon */}
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-400" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zm0 2.24L18.6 8 12 11.76 5.4 8 12 4.24zM4.8 9.2l6.3 3.6v7.2L4.8 16.4V9.2zm8.1 10.8v-7.2l6.3-3.6v7.2l-6.3 3.6z" />
          </svg>
        </div>
        <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-amber-300 transition-colors">
          POS <span className="text-amber-400">Indonesia</span>
        </span>
      </div>

      {/* Google Workspace Cloud Badge */}
      <div className="flex items-center gap-2.5 group cursor-default">
        <div className="w-8 h-8 rounded-full bg-[#172038] border border-sky-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.25)] group-hover:scale-110 transition-transform">
          {/* Google Workspace cloud / drive icon */}
          <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-sky-400" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
          </svg>
        </div>
        <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-sky-300 transition-colors">
          Google <span className="text-sky-400">Workspace</span>
        </span>
      </div>

      {/* UPT Multi-Channel SLA */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-[11px] font-mono text-purple-200">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Multi-UPT Service Hub</span>
      </div>
    </div>
  );
};
