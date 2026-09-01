import React from 'react';
import { motion } from 'framer-motion';

export const HeroVisual3D: React.FC = () => {
  return (
    <div className="relative w-full max-w-[460px] lg:max-w-[520px] aspect-square mx-auto flex items-center justify-center select-none pointer-events-none sm:pointer-events-auto">
      {/* Deep Glowing Nebula Ambient Orbs */}
      <div className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-[#9333EA]/40 via-[#C026D3]/30 to-[#3B82F6]/20 blur-3xl -top-4 -right-4 animate-pulse pointer-events-none" />
      <div className="absolute w-64 h-64 rounded-full bg-[#EC4899]/25 blur-3xl bottom-2 left-6 pointer-events-none" />

      {/* Orbit Rings (Thin glowing ellipses with particle nodes) */}
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

            {/* Central Glowing Shield / Power Fist Emblem */}
            <div className="relative w-28 sm:w-32 h-28 sm:h-32 rounded-full p-[2px] flex items-center justify-center shadow-[0_0_35px_rgba(236,72,153,0.6)]">
              {/* Outer glowing gradient ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F43F5E] via-[#EC4899] to-[#8B5CF6] animate-spin" style={{ animationDuration: '16s' }} />
              
              {/* Inner dark circle with subtle grid */}
              <div className="relative w-full h-full rounded-full bg-[#1e0741] border border-white/40 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#ec4899_1px,transparent_1px)] [background-size:8px_8px] opacity-40" />
                
                {/* Emblem Graphic: Radiant Fist / Trust Symbol */}
                <svg viewBox="0 0 100 100" className="w-16 h-16 text-white drop-shadow-[0_0_10px_#EC4899]" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="emblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="60%" stopColor="#F472B6" />
                      <stop offset="100%" stopColor="#C084FC" />
                    </linearGradient>
                  </defs>
                  
                  {/* Outer geometric circular teeth */}
                  <circle cx="50" cy="50" r="42" stroke="url(#emblemGrad)" strokeWidth="2" strokeDasharray="6 4" opacity="0.8" />
                  <circle cx="50" cy="50" r="36" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                  
                  {/* Stylized Raised Power Fist / DeFi Solidarity Emblem */}
                  <g fill="url(#emblemGrad)">
                    {/* Fist knuckles and fingers */}
                    <path d="M42 35 C42 31, 45 28, 48 28 C51 28, 54 31, 54 35 L54 44 L42 44 Z" />
                    <path d="M54 33 C54 29, 57 26, 60 26 C63 26, 66 29, 66 33 L66 45 L54 45 Z" />
                    <path d="M66 36 C66 33, 69 30, 72 30 C75 30, 78 33, 78 36 L78 48 L66 48 Z" />
                    <path d="M30 38 C30 35, 33 32, 36 32 C39 32, 42 35, 42 38 L42 46 L30 46 Z" />
                    
                    {/* Main Palm and Clenched Thumb */}
                    <path d="M28 44 C28 44, 25 50, 26 56 C27 63, 33 68, 40 68 L66 68 C74 68, 80 62, 80 54 L80 44 L66 44 L54 43 L42 43 L32 44 Z" />
                    <path d="M25 48 C23 52, 24 57, 28 60 L36 56 C33 53, 31 49, 33 46 Z" opacity="0.9" />
                    
                    {/* Wrist / Arm base */}
                    <path d="M38 68 L36 78 C36 80, 38 82, 41 82 L65 82 C68 82, 70 80, 70 78 L68 68 Z" />
                  </g>

                  {/* Sparkle energy stars around emblem */}
                  <circle cx="28" cy="28" r="2" fill="#FFFFFF" className="animate-ping" />
                  <circle cx="74" cy="24" r="1.5" fill="#F472B6" />
                  <circle cx="76" cy="74" r="2" fill="#38BDF8" />
                </svg>
              </div>
            </div>

            {/* Subtle floating particles inside card */}
            <div className="absolute top-4 right-4 text-xs font-mono font-bold text-white/40 tracking-wider">
              STRATO
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
