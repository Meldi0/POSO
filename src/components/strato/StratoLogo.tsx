import React from 'react';

interface StratoLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const StratoLogo: React.FC<StratoLogoProps> = ({ size = 42, className = '', showText = false }) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div 
        className="relative flex items-center justify-center rounded-full p-[2px] transition-transform duration-300 hover:scale-105"
        style={{ width: size, height: size }}
      >
        {/* Glow ambient layer */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#EC4899] via-[#8B5CF6] to-[#38BDF8] blur-[4px] opacity-70 animate-pulse" />
        
        {/* Outer dark base */}
        <div className="relative w-full h-full rounded-full bg-[#160636] border border-white/20 flex items-center justify-center overflow-hidden shadow-inner">
          <svg 
            viewBox="0 0 100 100" 
            className="w-4/5 h-4/5 text-white" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="stratoLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#E0E7FF" />
                <stop offset="100%" stopColor="#C084FC" />
              </linearGradient>
              <filter id="stratoGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            
            {/* Outer stylized orbit curves */}
            <circle cx="50" cy="50" r="44" stroke="url(#stratoLogoGrad)" strokeWidth="3.5" strokeDasharray="180 30" opacity="0.8" />
            <circle cx="50" cy="50" r="37" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
            
            {/* Stylized geometric 'S' */}
            <path 
              d="M66 32 C62 25, 48 24, 40 28 C30 33, 31 43, 44 47 C58 51, 64 57, 58 67 C52 75, 36 74, 32 67 M34 68 C38 75, 52 76, 60 72 C70 67, 69 57, 56 53 C42 49, 36 43, 42 33 C48 25, 64 26, 68 33" 
              stroke="url(#stratoLogoGrad)" 
              strokeWidth="5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              filter="url(#stratoGlow)"
            />
            
            {/* Center light core */}
            <circle cx="50" cy="50" r="3" fill="#FFFFFF" opacity="0.9" />
          </svg>
        </div>
      </div>

      {showText && (
        <span className="font-extrabold tracking-wider text-base sm:text-lg text-white uppercase font-sans">
          Strato <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C084FC] to-[#F472B6]">Protocol</span>
        </span>
      )}
    </div>
  );
};
