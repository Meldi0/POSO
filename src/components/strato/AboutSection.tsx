import React from 'react';
import { motion } from 'framer-motion';
import { Users, Flame, Droplets, Sparkles, RefreshCw, ShieldCheck, HeartHandshake } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-20">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Section Title */}
      <div className="text-center mb-14">
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wider uppercase font-sans"
        >
          ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-300">PROJECT</span>
        </motion.h2>
      </div>

      {/* 3 Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center">
        {/* Card 1 - Community Oriented */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[28px] bg-[#160636]/80 border border-purple-500/20 backdrop-blur-md p-8 sm:p-10 flex flex-col items-center text-center justify-center min-h-[300px] hover:border-purple-400/40 hover:bg-[#1c0844]/90 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.4)] group"
        >
          {/* Icon in Neon Orb */}
          <div className="relative w-20 h-20 rounded-full p-[2px] mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#EC4899] to-[#8B5CF6] opacity-70 group-hover:opacity-100 blur-[2px] transition-opacity" />
            <div className="relative w-full h-full rounded-full bg-[#1e0741] border border-white/30 flex items-center justify-center">
              {/* Network nodes SVG icon */}
              <svg viewBox="0 0 24 24" className="w-9 h-9 text-pink-300 drop-shadow-[0_0_8px_#EC4899]" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="3" />
                <circle cx="4" cy="12" r="2" />
                <circle cx="20" cy="12" r="2" />
                <circle cx="12" cy="4" r="2" />
                <circle cx="12" cy="20" r="2" />
                <path d="M6 12h3m6 0h3m-6-6v3m0 6v3" />
                <path d="m6.5 6.5 2.5 2.5m6 6 2.5 2.5m-11 0 2.5-2.5m6-6 2.5-2.5" strokeOpacity="0.4" />
              </svg>
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-wider text-white font-sans group-hover:text-pink-300 transition-colors">
            COMMUNITY ORIENTED
          </h3>
          <p className="text-xs text-purple-200/60 mt-3 leading-relaxed">
            100% community powered governance. No dev wallet dumps, democratic voting on future protocol expansions.
          </p>
        </motion.div>

        {/* Card 2 - Center Featured Card: AUTOMATED LIQUIDITY (Prominent Glowing Border) */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[32px] p-[2px] bg-gradient-to-b from-[#EC4899] via-[#A855F7] to-[#3B82F6] shadow-[0_0_50px_rgba(236,72,153,0.45)] z-10 my-2 md:-my-4"
        >
          {/* Outer glow flare */}
          <div className="absolute -inset-1 bg-gradient-to-b from-[#EC4899] to-[#8B5CF6] rounded-[34px] blur-md opacity-50 pointer-events-none" />

          <div className="relative rounded-[30px] bg-gradient-to-b from-[#1f0949] to-[#14042f] px-6 sm:px-8 py-10 flex flex-col items-center text-center justify-center">
            {/* Center Icon */}
            <div className="relative w-20 h-20 rounded-full p-[2px] mb-5 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F59E0B] via-[#EC4899] to-[#8B5CF6] animate-spin" style={{ animationDuration: '12s' }} />
              <div className="relative w-full h-full rounded-full bg-[#180536] border border-white/40 flex items-center justify-center">
                {/* Circulating liquidity arrows */}
                <RefreshCw className="w-9 h-9 text-pink-400 drop-shadow-[0_0_10px_#EC4899]" />
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-wider text-white font-sans">
              AUTOMATED LIQUIDITY
            </h3>

            <p className="text-xs sm:text-sm text-purple-100/80 mt-4 leading-relaxed max-w-sm">
              Strato Protocol is a mixture of advanced and powerful tokenomics with the expanded functionality of an advanced protocol automatically generating liquidity with every transaction.
            </p>

            <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-[11px] font-bold text-pink-300 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>V2.0 Smart Routing</span>
            </div>
          </div>
        </motion.div>

        {/* Card 3 - Rewards For Adopters */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative rounded-[28px] bg-[#160636]/80 border border-purple-500/20 backdrop-blur-md p-8 sm:p-10 flex flex-col items-center text-center justify-center min-h-[300px] hover:border-purple-400/40 hover:bg-[#1c0844]/90 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.4)] group"
        >
          {/* Icon in Neon Orb */}
          <div className="relative w-20 h-20 rounded-full p-[2px] mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#EC4899] to-[#8B5CF6] opacity-70 group-hover:opacity-100 blur-[2px] transition-opacity" />
            <div className="relative w-full h-full rounded-full bg-[#1e0741] border border-white/30 flex items-center justify-center">
              {/* Star reward badge SVG */}
              <svg viewBox="0 0 24 24" className="w-9 h-9 text-pink-300 drop-shadow-[0_0_8px_#EC4899]" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                <circle cx="12" cy="12" r="8" strokeOpacity="0.4" strokeDasharray="3 3" />
              </svg>
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-wider text-white font-sans group-hover:text-pink-300 transition-colors">
            REWARDS FOR ADOPTERS
          </h3>
          <p className="text-xs text-purple-200/60 mt-3 leading-relaxed">
            Static RFI reflections distribute 5% of every transaction instantly to all diamond-hand token holders.
          </p>
        </motion.div>
      </div>

      {/* Bottom Statistics Row (Circular Neon Rings) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 max-w-4xl mx-auto"
      >
        {/* Stat 1: Holders */}
        <div className="flex flex-col items-center text-center group">
          <div className="relative w-20 h-20 rounded-full p-[2px] mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#EC4899] to-[#8B5CF6] blur-[2px]" />
            <div className="relative w-full h-full rounded-full bg-[#180536] border border-white/30 flex items-center justify-center">
              <Users className="w-8 h-8 text-pink-300 drop-shadow-[0_0_8px_#EC4899]" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">173</span>
            <span className="text-sm font-bold text-pink-400 uppercase">k+</span>
          </div>
          <span className="text-xs font-semibold text-purple-300/70 mt-1 uppercase tracking-wider">
            Holders
          </span>
        </div>

        {/* Stat 2: Tokens Burned */}
        <div className="flex flex-col items-center text-center group">
          <div className="relative w-20 h-20 rounded-full p-[2px] mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F59E0B] via-[#EC4899] to-[#8B5CF6] blur-[2px]" />
            <div className="relative w-full h-full rounded-full bg-[#180536] border border-white/30 flex items-center justify-center">
              <Flame className="w-8 h-8 text-pink-400 drop-shadow-[0_0_8px_#F43F5E]" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">4135</span>
            <span className="text-sm font-bold text-pink-400 uppercase">v2.0</span>
          </div>
          <span className="text-xs font-semibold text-purple-300/70 mt-1 uppercase tracking-wider">
            Tokens Burned
          </span>
        </div>

        {/* Stat 3: Liquidity */}
        <div className="flex flex-col items-center text-center group">
          <div className="relative w-20 h-20 rounded-full p-[2px] mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#38BDF8] via-[#8B5CF6] to-[#EC4899] blur-[2px]" />
            <div className="relative w-full h-full rounded-full bg-[#180536] border border-white/30 flex items-center justify-center">
              <Droplets className="w-8 h-8 text-sky-300 drop-shadow-[0_0_8px_#38BDF8]" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-pink-400">$</span>
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">3394</span>
            <span className="text-sm font-bold text-pink-400 uppercase">M+</span>
          </div>
          <span className="text-xs font-semibold text-purple-300/70 mt-1 uppercase tracking-wider">
            Liquidity
          </span>
        </div>
      </motion.div>
    </section>
  );
};
