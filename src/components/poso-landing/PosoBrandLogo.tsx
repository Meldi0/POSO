import React from 'react';

interface PosoBrandLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const PosoBrandLogo: React.FC<PosoBrandLogoProps> = ({ size = 42, className = '', showText = false }) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div 
        className="relative flex items-center justify-center rounded-full p-[2px] transition-transform duration-300 hover:scale-105"
        style={{ width: size, height: size }}
      >
        {/* Ambient neon glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#EC4899] via-[#8B5CF6] to-[#38BDF8] blur-[4px] opacity-75 animate-pulse" />
        
        {/* Outer dark core badge */}
        <div className="relative w-full h-full rounded-full bg-[#160636] border border-white/25 flex items-center justify-center overflow-hidden shadow-inner">
          <svg 
            viewBox="0 0 100 100" 
            className="w-4/5 h-4/5 text-white" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="posoLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#E0E7FF" />
                <stop offset="100%" stopColor="#C084FC" />
              </linearGradient>
              <filter id="posoGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            
            {/* Outer orbit rings */}
            <circle cx="50" cy="50" r="44" stroke="url(#posoLogoGrad)" strokeWidth="3" strokeDasharray="160 25" opacity="0.85" />
            <circle cx="50" cy="50" r="37" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            
            {/* Stylized geometric 'P' & 'S' monogram (POSO System Symbol) */}
            <path 
              d="M34 26 L56 26 C68 26, 76 34, 76 44 C76 54, 68 60, 56 60 L46 60 L46 76 M46 36 L56 36 C62 36, 66 40, 66 44 C66 48, 62 52, 56 52 L46 52 Z" 
              stroke="url(#posoLogoGrad)" 
              strokeWidth="4.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              filter="url(#posoGlow)"
            />

            {/* Sparkle energy dots */}
            <circle cx="68" cy="68" r="3" fill="#EC4899" className="animate-ping" />
            <circle cx="50" cy="50" r="2.5" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold tracking-wider text-base sm:text-lg text-white uppercase font-sans leading-none">
            POSO <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C084FC] to-[#F472B6]">Helpdesk</span>
          </span>
          <span className="text-[10px] text-purple-300/60 font-semibold tracking-wider uppercase mt-0.5">
            Pusat Layanan Terpadu
          </span>
        </div>
      )}
    </div>
  );
};
