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
        className="relative flex items-center justify-center rounded-xl p-1 bg-white/10 border border-white/20 shadow-sm transition-transform duration-300 hover:scale-105"
        style={{ width: size, height: size }}
      >
        <img 
          src="/prisma-pos-logo.png" 
          alt="PRISMA POS Logo" 
          className="w-full h-full object-contain" 
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold tracking-tight text-base sm:text-lg text-white uppercase font-sans leading-none">
            PRISMA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] to-[#FB923C]">POS</span>
          </span>
          <span className="text-[10px] text-sky-200/80 font-bold tracking-wider uppercase mt-0.5">
            Pos Resolution & Integrated Service
          </span>
        </div>
      )}
    </div>
  );
};
