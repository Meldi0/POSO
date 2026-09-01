import React from 'react';
import { motion } from 'framer-motion';

export const PosoHeroVisual3D: React.FC = () => {
  return (
    <div className="relative w-full max-w-[460px] lg:max-w-[520px] aspect-square mx-auto flex items-center justify-center select-none pointer-events-none sm:pointer-events-auto">
      {/* Deep Glowing Nebula Ambient Orbs */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#9333EA]/40 via-[#C026D3]/30 to-[#3B82F6]/20 blur-3xl -top-4 -right-4 animate-pulse pointer-events-none" />
      <div className="absolute w-64 h-64 rounded-full bg-[#EC4899]/25 blur-3xl bottom-2 left-6 pointer-events-none" />

      {/* Orbit Rings with glowing particle nodes */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {/* Large Outer Orbit 1 */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[440px] h-[190px] rounded-[100%] border border-white/20 -rotate-[28deg] flex items-center justify-between"
          style={{
            boxShadow: '0 0 15px rgba(192, 132, 252, 0.25)',
          }}
        >
          {/* Orbiting Particle 1 */}
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#F472B6] to-[#C084FC] shadow-[0_0_12px_#EC4899] -ml-1.5 animate-pulse" />
          {/* Orbiting Particle 2 */}
          <div className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8] -mr-1" />
        </motion.div>

        {/* Orbit Ring 2 */}
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[360px] h-[160px] rounded-[100%] border border-[#EC4899]/30 rotate-[35deg]"
          style={{
            boxShadow: '0 0 20px rgba(236, 72, 153, 0.2)',
          }}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shadow-[0_0_10px_#F59E0B] ml-8 mt-2" />
        </motion.div>
      </div>

      {/* 3D Isometric Floating Card Stack */}
      <motion.div
        animate={{
          y: [-8, 8, -8],
          rotateZ: [-12, -10, -12],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-[280px] sm:w-[320px] h-[280px] sm:h-[320px] flex items-center justify-center"
        style={{
          transformStyle: 'preserve-3d',
          perspective: 1000,
        }}
      >
        {/* Layer 3 - Back Bottom Card */}
        <div 
          className="absolute w-[220px] sm:w-[260px] h-[220px] sm:h-[260px] rounded-[36px] bg-gradient-to-br from-[#4C1D95]/80 via-[#2E1065]/90 to-[#1E1B4B] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
          style={{
            transform: 'translate(45px, -35px) rotate(14deg)',
            filter: 'blur(0.5px)',
          }}
        />

        {/* Layer 2 - Middle Card */}
        <div 
          className="absolute w-[220px] sm:w-[260px] h-[220px] sm:h-[260px] rounded-[36px] bg-gradient-to-br from-[#7C3AED]/90 via-[#4C1D95]/95 to-[#2E1065] border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.7)]"
          style={{
            transform: 'translate(22px, -18px) rotate(7deg)',
          }}
        />

        {/* Layer 1 - Front Top Hero Card */}
        <div 
          className="relative w-[220px] sm:w-[260px] h-[220px] sm:h-[260px] rounded-[36px] bg-gradient-to-br from-[#A855F7] via-[#7E22CE] to-[#581C87] p-[1.5px] shadow-[0_30px_70px_rgba(124,58,237,0.45)] group cursor-pointer"
        >
          {/* Card Border Glow */}
          <div className="w-full h-full rounded-[34px] bg-gradient-to-br from-[#8B5CF6] via-[#6B21A8] to-[#3B0764] flex items-center justify-center p-6 relative overflow-hidden border border-white/30 backdrop-blur-md">
            {/* Glossy Reflection Highlight */}
            <div className="absolute -top-12 -left-12 w-48 h-32 bg-white/20 rounded-full blur-xl rotate-45 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#EC4899]/30 rounded-full blur-2xl pointer-events-none" />

            {/* Central Glowing Shield / Service Trust Emblem */}
            <div className="relative w-28 sm:w-32 h-28 sm:h-32 rounded-full p-[2px] flex items-center justify-center shadow-[0_0_35px_rgba(236,72,153,0.6)]">
              {/* Outer glowing gradient ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F43F5E] via-[#EC4899] to-[#8B5CF6] animate-spin" style={{ animationDuration: '16s' }} />
              
              {/* Inner dark circle with subtle grid */}
              <div className="relative w-full h-full rounded-full bg-[#1e0741] border border-white/40 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:8px_8px] opacity-40" />
                
                {/* Emblem Graphic: Support & Solidarity Service Handshake / Shield */}
                <svg viewBox="0 0 100 100" className="w-16 h-16 text-white drop-shadow-[0_0_10px_#EC4899]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="posoEmblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="60%" stopColor="#F472B6" />
                      <stop offset="100%" stopColor="#C084FC" />
                    </linearGradient>
                  </defs>
                  
                  {/* Outer geometric circular teeth */}
                  <circle cx="50" cy="50" r="42" stroke="url(#posoEmblemGrad)" strokeWidth="2" strokeDasharray="6 4" opacity="0.8" />
                  <circle cx="50" cy="50" r="36" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  
                  {/* Stylized Handshake & Shield of Service */}
                  <g fill="url(#posoEmblemGrad)">
                    {/* Hand 1 Left */}
                    <path d="M26 46 L38 38 C41 36, 46 37, 49 40 L54 45 L46 53 L38 46 L26 50 Z" />
                    {/* Hand 2 Right clasping */}
                    <path d="M74 46 L62 38 C59 36, 54 37, 51 40 L46 45 L54 53 L62 46 L74 50 Z" />
                    {/* Interlocking fingers */}
                    <rect x="44" y="44" width="12" height="18" rx="4" transform="rotate(45 50 53)" />
                    {/* Center Trust Shield Node */}
                    <path d="M50 58 L42 66 C46 74, 54 74, 58 66 Z" />
                  </g>

                  {/* Sparkle energy stars */}
                  <circle cx="28" cy="28" r="2" fill="#FFFFFF" className="animate-ping" />
                  <circle cx="74" cy="24" r="1.5" fill="#F472B6" />
                  <circle cx="76" cy="74" r="2" fill="#38BDF8" />
                </svg>
              </div>
            </div>

            {/* Corner watermarks */}
            <div className="absolute top-4 right-4 text-[10px] font-mono font-bold text-white/40 tracking-wider">
              POSO 2.0
            </div>
            <div className="absolute bottom-4 left-4 text-[10px] font-mono font-bold text-pink-300/40 tracking-wider">
              SLA READY
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
