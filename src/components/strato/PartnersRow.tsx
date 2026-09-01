import React from 'react';

export const PartnersRow: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center gap-8 sm:gap-12 pt-4 opacity-90 hover:opacity-100 transition-opacity">
      {/* BscScan Badge */}
      <a 
        href="https://bscscan.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 group cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-[#1e293b] border border-sky-400/30 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.2)] group-hover:scale-110 transition-transform">
          {/* BscScan block icon */}
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-400" fill="currentColor">
            <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.24L18.6 8 12 11.76 5.4 8 12 4.24zM4.8 9.2l6.3 3.6v7.2L4.8 16.4V9.2zm8.1 10.8v-7.2l6.3-3.6v7.2l-6.3 3.6z" />
          </svg>
        </div>
        <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-sky-300 transition-colors">
          Bsc<span className="text-sky-400">Scan</span>
        </span>
      </a>

      {/* PancakeSwap Badge */}
      <a 
        href="https://pancakeswap.finance" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 group cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-[#3d2b1f] border border-amber-400/40 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.25)] group-hover:scale-110 transition-transform">
          {/* Pancake bunny chef ears icon */}
          <svg viewBox="0 0 32 32" className="w-5 h-5 text-amber-400" fill="currentColor">
            <path d="M16 4C9.37 4 4 9.37 4 16c0 4.42 2.39 8.28 5.97 10.38.2.12.44.18.68.18h10.7c.24 0 .48-.06.68-.18C25.61 24.28 28 20.42 28 16c0-6.63-5.37-12-12-12zm-4 7c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm8 0c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-4 12c-2.5 0-4.71-1.28-6-3.22.42-.48.96-.86 1.58-1.08 1.18 1.41 2.68 2.3 4.42 2.3s3.24-.89 4.42-2.3c.62.22 1.16.6 1.58 1.08C20.71 21.72 18.5 23 16 23z" />
          </svg>
        </div>
        <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-amber-300 transition-colors">
          Pancake<span className="text-amber-400">Swap</span>
        </span>
      </a>
    </div>
  );
};
