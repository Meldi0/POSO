import React from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, ShieldCheck, Sparkles, Layers, RefreshCw, Send, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PosoAboutSection: React.FC = () => {
  return (
    <section id="about" className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-20">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />

      {/* Section Title */}
      <div className="text-center mb-14">
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wider uppercase font-sans"
        >
          ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-200 to-orange-300">PRISMA POS</span>
        </motion.h2>
        <p className="text-xs sm:text-sm font-bold text-sky-300/80 uppercase tracking-widest mt-2">
          Pos Resolution & Integrated Service Management Application
        </p>
      </div>

      {/* 3 Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center">
        {/* Card 1 - Single Point of Entry */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-[28px] bg-[#160636]/80 border border-purple-500/20 backdrop-blur-md p-8 sm:p-10 flex flex-col items-center text-center justify-center min-h-[320px] hover:border-purple-400/40 hover:bg-[#1c0844]/90 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.4)] group"
        >
          {/* Icon in Neon Orb */}
          <div className="relative w-20 h-20 rounded-full p-[2px] mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#EC4899] to-[#8B5CF6] opacity-70 group-hover:opacity-100 blur-[2px] transition-opacity" />
            <div className="relative w-full h-full rounded-full bg-[#1e0741] border border-white/30 flex items-center justify-center">
              <Layers className="w-9 h-9 text-pink-300 drop-shadow-[0_0_8px_#EC4899]" />
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-wider text-white font-sans group-hover:text-pink-300 transition-colors">
            LAYANAN SATU PINTU
          </h3>
          <p className="text-xs text-purple-200/60 mt-3 leading-relaxed">
            Seluruh keluhan fasilitas gedung, internet/LAN, PC & printer, akun SSO, hingga bug sistem informasi tercatat dalam satu gerbang resmi tanpa tercecer di chat pribadi.
          </p>
        </motion.div>

        {/* Card 2 - Center Featured Card: TRIASE & DISPOSISI OTOMATIS (Glowing Neon Border) */}
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
                <RefreshCw className="w-9 h-9 text-pink-400 drop-shadow-[0_0_10px_#EC4899]" />
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-wider text-white font-sans">
              TRIASE MULTI-UPT & SLA
            </h3>

            <p className="text-xs sm:text-sm text-purple-100/80 mt-4 leading-relaxed max-w-sm">
              Sistem PRISMA POS memadukan triase multi-UPT cerdas dengan pemantauan Service Level Agreement (SLA) otomatis yang mendelegasikan laporan langsung ke teknisi terkait secara transparan dan terukur.
            </p>

            <div className="mt-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-400/40 text-[11px] font-bold text-pink-300 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>SLA Terukur: 4 Jam Urgent</span>
            </div>
          </div>
        </motion.div>

        {/* Card 3 - Transparansi & Pelacakan Realtime */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative rounded-[28px] bg-[#160636]/80 border border-purple-500/20 backdrop-blur-md p-8 sm:p-10 flex flex-col items-center text-center justify-center min-h-[320px] hover:border-purple-400/40 hover:bg-[#1c0844]/90 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.4)] group"
        >
          {/* Icon in Neon Orb */}
          <div className="relative w-20 h-20 rounded-full p-[2px] mb-6 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#EC4899] to-[#8B5CF6] opacity-70 group-hover:opacity-100 blur-[2px] transition-opacity" />
            <div className="relative w-full h-full rounded-full bg-[#1e0741] border border-white/30 flex items-center justify-center">
              <ShieldCheck className="w-9 h-9 text-pink-300 drop-shadow-[0_0_8px_#EC4899]" />
            </div>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-wider text-white font-sans group-hover:text-pink-300 transition-colors">
            PELACAKAN TRANSPARAN
          </h3>
          <p className="text-xs text-purple-200/60 mt-3 leading-relaxed">
            Pengguna dapat memantau progres perbaikan melalui ID Tiket kapan saja, melihat riwayat percakapan staf, dan mengakses foto bukti pengerjaan resmi secara live.
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
        {/* Stat 1: Pengguna */}
        <div className="flex flex-col items-center text-center group">
          <div className="relative w-20 h-20 rounded-full p-[2px] mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#EC4899] to-[#8B5CF6] blur-[2px]" />
            <div className="relative w-full h-full rounded-full bg-[#180536] border border-white/30 flex items-center justify-center">
              <Users className="w-8 h-8 text-pink-300 drop-shadow-[0_0_8px_#EC4899]" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">5,400</span>
            <span className="text-sm font-bold text-pink-400 uppercase">+</span>
          </div>
          <span className="text-xs font-semibold text-purple-300/70 mt-1 uppercase tracking-wider">
            Pengguna Terlayani
          </span>
        </div>

        {/* Stat 2: Tiket Terselesaikan */}
        <div className="flex flex-col items-center text-center group">
          <div className="relative w-20 h-20 rounded-full p-[2px] mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F59E0B] via-[#EC4899] to-[#8B5CF6] blur-[2px]" />
            <div className="relative w-full h-full rounded-full bg-[#180536] border border-white/30 flex items-center justify-center">
              <Zap className="w-8 h-8 text-pink-400 drop-shadow-[0_0_8px_#F43F5E]" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">1,280</span>
            <span className="text-sm font-bold text-pink-400 uppercase">v2.0</span>
          </div>
          <span className="text-xs font-semibold text-purple-300/70 mt-1 uppercase tracking-wider">
            Tiket Sukses Tertangani
          </span>
        </div>

        {/* Stat 3: SLA Terpenuhi */}
        <div className="flex flex-col items-center text-center group">
          <div className="relative w-20 h-20 rounded-full p-[2px] mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#38BDF8] via-[#8B5CF6] to-[#EC4899] blur-[2px]" />
            <div className="relative w-full h-full rounded-full bg-[#180536] border border-white/30 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-sky-300 drop-shadow-[0_0_8px_#38BDF8]" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">99.8</span>
            <span className="text-sm font-bold text-pink-400 uppercase">%</span>
          </div>
          <span className="text-xs font-semibold text-purple-300/70 mt-1 uppercase tracking-wider">
            Kepatuhan SLA
          </span>
        </div>
      </motion.div>
    </section>
  );
};
