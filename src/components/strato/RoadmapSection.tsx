import React from 'react';
import { motion } from 'framer-motion';
import { StratoLogo } from './StratoLogo';

export const RoadmapSection: React.FC = () => {
  return (
    <section id="roadmap" className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-20">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-2 mb-14">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wider uppercase font-sans"
        >
          ROADMAP
        </motion.h2>

        <motion.span 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-xs sm:text-sm font-bold text-purple-300/70 uppercase tracking-widest"
        >
          Our Plans For 2021 & Beyond
        </motion.span>
      </div>

      {/* 4 Horizontal Phase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
        {/* PHASE I */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[26px] bg-[#160636]/70 border border-purple-500/20 backdrop-blur-md p-6 h-[340px] flex flex-col justify-between overflow-hidden group hover:border-purple-400/40 hover:bg-[#1a0740] transition-all"
        >
          {/* Watermark Strato S */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <StratoLogo size={150} />
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-white uppercase tracking-wider font-sans">
              PHASE I
            </h3>
            <span className="text-[11px] font-bold text-purple-400/80 font-mono">
              2021 • COMPLETED
            </span>
          </div>

          <div className="relative z-10">
            <span className="text-xs font-bold text-purple-200/90 tracking-wide">
              Initiation
            </span>
            <p className="text-[11px] text-purple-300/50 mt-1 leading-relaxed">
              Protocol contract audit, initial DEX listing, Whitepaper v1 release, and Genesis burn.
            </p>
          </div>
        </motion.div>

        {/* PHASE II - Highlighted Active Card with Neon Gradient Glow Border */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[30px] p-[2px] bg-gradient-to-b from-[#F59E0B] via-[#EC4899] to-[#8B5CF6] shadow-[0_0_45px_rgba(236,72,153,0.45)] lg:-my-4 z-10"
        >
          {/* Outer glow aura */}
          <div className="absolute -inset-1 bg-gradient-to-b from-[#F59E0B] via-[#EC4899] to-[#8B5CF6] rounded-[32px] blur-md opacity-50 pointer-events-none" />

          <div className="relative rounded-[28px] bg-gradient-to-b from-[#1e0743] to-[#120329] p-6 sm:p-7 min-h-[380px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider font-sans">
                  PHASE II
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-pink-500/30 border border-pink-400/50 text-[10px] font-extrabold text-pink-300 uppercase tracking-wider animate-pulse">
                  IN PROGRESS
                </span>
              </div>
              <span className="text-xs font-bold text-pink-400 font-mono">
                2021
              </span>

              <h4 className="text-sm font-extrabold text-white mt-4 uppercase tracking-wider">
                EARLY ADOPTION
              </h4>

              <p className="text-xs text-purple-100/80 mt-3 leading-relaxed">
                Securing tokenomics of Strato Protocol are used to massively enhance the rate of development of the Strato ecosystem. Liquidity is being sent victoriously and the presents of Strato Platform on various exchanges is improved. Transaction fees are being used as incentives for technological development and community driven marketing campaigns.
              </p>
            </div>

            <div className="pt-4 border-t border-purple-500/20 flex items-center justify-between text-[11px] text-pink-300 font-mono">
              <span>Milestone 4/5 Complete</span>
              <span className="text-emerald-400 font-bold">80%</span>
            </div>
          </div>
        </motion.div>

        {/* PHASE III */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative rounded-[26px] bg-[#160636]/70 border border-purple-500/20 backdrop-blur-md p-6 h-[340px] flex flex-col justify-between overflow-hidden group hover:border-purple-400/40 hover:bg-[#1a0740] transition-all"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <StratoLogo size={150} />
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-white uppercase tracking-wider font-sans">
              PHASE III
            </h3>
            <span className="text-[11px] font-bold text-purple-400/80 font-mono">
              2021 • UPCOMING
            </span>
          </div>

          <div className="relative z-10">
            <span className="text-xs font-bold text-purple-200/90 tracking-wide">
              Market Expansion
            </span>
            <p className="text-[11px] text-purple-300/50 mt-1 leading-relaxed">
              Tier-1 CEX listing, Cross-chain bridge to Ethereum & Solana, and Strato Mobile Wallet dApp beta.
            </p>
          </div>
        </motion.div>

        {/* PHASE IV */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative rounded-[26px] bg-[#160636]/70 border border-purple-500/20 backdrop-blur-md p-6 h-[340px] flex flex-col justify-between overflow-hidden group hover:border-purple-400/40 hover:bg-[#1a0740] transition-all"
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
            <StratoLogo size={150} />
          </div>

          <div>
            <h3 className="text-lg font-extrabold text-white uppercase tracking-wider font-sans">
              PHASE IV
            </h3>
            <span className="text-[11px] font-bold text-purple-400/80 font-mono">
              2021 • FUTURE
            </span>
          </div>

          <div className="relative z-10">
            <span className="text-xs font-bold text-purple-200/90 tracking-wide">
              Full Adoption
            </span>
            <p className="text-[11px] text-purple-300/50 mt-1 leading-relaxed">
              Decentralized governance DAO launch, Strato NFT staking pool, and institutional liquidity aggregator.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
