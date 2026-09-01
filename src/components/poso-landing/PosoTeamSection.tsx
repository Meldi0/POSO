import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Mail, Phone, ShieldCheck } from 'lucide-react';

export const PosoTeamSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const teamMembers = [
    {
      id: 'david',
      name: 'David Lee',
      role: 'Koordinator Helpdesk',
      alias: 'Super Admin & Triase',
      bio: 'Memimpin operasional pusat bantuan, validasi tingkat urgensi kendala, dan pengawasan kepatuhan SLA layanan terpadu.',
      avatar: (
        <svg viewBox="0 0 160 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="80" cy="80" r="70" fill="#311059" />
          <rect x="68" y="80" width="24" height="30" rx="8" fill="#F8B195" />
          <ellipse cx="80" cy="65" rx="30" ry="34" fill="#F8B195" />
          <path d="M48 60 C48 35, 112 35, 112 60 C112 65, 108 55, 102 52 C96 50, 64 50, 58 52 C52 55, 48 65, 48 60 Z" fill="#F97316" />
          <path d="M50 68 C50 100, 60 115, 80 115 C100 115, 110 100, 110 68 C110 82, 104 98, 80 98 C56 98, 50 82, 50 68 Z" fill="#EA580C" />
          <path d="M64 88 C70 95, 90 95, 96 88 C94 92, 86 96, 80 96 C74 96, 66 92, 64 88 Z" fill="#C2410C" />
          <path d="M68 82 C74 85, 86 85, 92 82 C90 85, 84 87, 80 87 C76 87, 70 85, 68 82 Z" fill="#F8B195" />
          <rect x="54" y="58" width="22" height="15" rx="4" stroke="#FFFFFF" strokeWidth="2.5" fill="#1E1B4B" fillOpacity="0.4" />
          <rect x="84" y="58" width="22" height="15" rx="4" stroke="#FFFFFF" strokeWidth="2.5" fill="#1E1B4B" fillOpacity="0.4" />
          <path d="M76 64 L84 64" stroke="#FFFFFF" strokeWidth="2.5" />
          <circle cx="65" cy="65" r="2.5" fill="#FFFFFF" />
          <circle cx="95" cy="65" r="2.5" fill="#FFFFFF" />
          <path d="M40 120 C40 105, 120 105, 120 120 L126 150 L34 150 Z" fill="#7C3AED" />
          <path d="M72 110 L80 122 L88 110 Z" fill="#FFFFFF" />
        </svg>
      ),
    },
    {
      id: 'maya',
      name: 'Maya Chen',
      role: 'Lead Teknisi UPT TI',
      alias: 'Jaringan & Server',
      bio: 'Bertanggung jawab atas stabilitas infrastruktur jaringan internet, kelancaran server cloud Google Workspace, dan akun SSO.',
      avatar: (
        <svg viewBox="0 0 160 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="80" cy="80" r="70" fill="#311059" />
          <circle cx="80" cy="30" r="16" fill="#1F1528" />
          <ellipse cx="80" cy="68" rx="36" ry="38" fill="#1F1528" />
          <rect x="70" y="85" width="20" height="28" rx="6" fill="#D98A5B" />
          <ellipse cx="80" cy="72" rx="27" ry="29" fill="#E89F71" />
          <path d="M53 62 C58 50, 75 48, 80 54 C85 48, 102 50, 107 62 C100 55, 60 55, 53 62 Z" fill="#1F1528" />
          <ellipse cx="68" cy="70" rx="3.5" ry="4" fill="#1F1528" />
          <ellipse cx="92" cy="70" rx="3.5" ry="4" fill="#1F1528" />
          <circle cx="69.5" cy="69" r="1.5" fill="#FFFFFF" />
          <circle cx="93.5" cy="69" r="1.5" fill="#FFFFFF" />
          <path d="M63 63 C66 61, 72 62, 74 64" stroke="#1F1528" strokeWidth="2" strokeLinecap="round" />
          <path d="M86 64 C88 62, 94 61, 97 63" stroke="#1F1528" strokeWidth="2" strokeLinecap="round" />
          <path d="M68 82 C68 92, 92 92, 92 82 Z" fill="#FFFFFF" stroke="#882233" strokeWidth="1.5" />
          <path d="M66 82 C72 82, 88 82, 94 82" stroke="#882233" strokeWidth="1.5" />
          <circle cx="62" cy="76" r="5" fill="#F43F5E" opacity="0.35" />
          <circle cx="98" cy="76" r="5" fill="#F43F5E" opacity="0.35" />
          <path d="M42 120 C42 105, 118 105, 118 120 L126 150 L34 150 Z" fill="#F43F5E" />
          <ellipse cx="80" cy="116" rx="14" ry="7" fill="#E89F71" />
        </svg>
      ),
    },
    {
      id: 'alex',
      name: 'Alex Vance',
      role: 'Koordinator Sarpras',
      alias: 'Fasilitas & Hardware',
      bio: 'Mengkoordinasikan perbaikan fisik sarana gedung kantor, pendingin ruangan (AC), kelistrikan, dan inventaris perangkat keras.',
      avatar: (
        <svg viewBox="0 0 160 160" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="80" cy="80" r="70" fill="#311059" />
          <ellipse cx="80" cy="68" rx="34" ry="36" fill="#1E293B" />
          <rect x="70" y="85" width="20" height="28" rx="6" fill="#F8B195" />
          <ellipse cx="80" cy="72" rx="27" ry="29" fill="#F8B195" />
          <path d="M50 56 C55 42, 105 42, 110 56 C105 48, 55 48, 50 56 Z" fill="#0F172A" />
          <ellipse cx="68" cy="70" rx="3.5" ry="4" fill="#0F172A" />
          <ellipse cx="92" cy="70" rx="3.5" ry="4" fill="#0F172A" />
          <path d="M70 86 C75 90, 85 90, 90 86" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
          <path d="M42 120 C42 105, 118 105, 118 120 L126 150 L34 150 Z" fill="#0284C7" />
        </svg>
      ),
    },
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const visibleMembers = [
    teamMembers[currentIndex % teamMembers.length],
    teamMembers[(currentIndex + 1) % teamMembers.length],
  ];

  return (
    <section id="team" className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-20">
      {/* Section Header */}
      <div className="mb-14">
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-wider uppercase font-sans"
        >
          TIM & OPERATOR <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-pink-300">TEKNIS</span>
        </motion.h2>
        <p className="text-xs sm:text-sm font-bold text-purple-300/70 uppercase tracking-widest mt-2">
          Penanggung Jawab Layanan & Unit Pelaksana Teknis (UPT) POSO
        </p>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
        <AnimatePresence mode="wait">
          {visibleMembers.map((member, idx) => (
            <motion.div
              key={`${member.id}-${idx}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="relative rounded-[30px] bg-gradient-to-b from-[#1c0844]/90 to-[#120329]/95 border border-purple-500/30 backdrop-blur-xl p-8 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.5)] group hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all duration-300"
            >
              {/* Top Avatar Box */}
              <div className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-b from-[#2e0e6d] to-[#160533] border border-white/10 flex items-center justify-center p-6 mb-6 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(236,72,153,0.3),transparent_70%)]" />
                <div className="relative w-36 sm:w-44 h-36 sm:h-44 transition-transform duration-300 group-hover:scale-105">
                  {member.avatar}
                </div>
              </div>

              {/* Member Details */}
              <div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xl font-extrabold text-white uppercase tracking-wide font-sans group-hover:text-pink-300 transition-colors">
                    {member.name}
                  </h3>
                  <span className="text-xs font-bold font-mono text-pink-400 bg-pink-500/20 px-2.5 py-0.5 rounded-full border border-pink-400/30">
                    {member.role}
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs font-semibold text-purple-300/80">
                    {member.alias}
                  </span>
                  <span className="text-purple-400/40">•</span>
                  <span className="text-[11px] text-purple-300/60 font-mono">Verified Staff</span>
                </div>

                <p className="text-xs text-purple-200/60 mt-3 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Contact Icons */}
              <div className="mt-6 pt-4 border-t border-purple-500/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-900/50 border border-purple-400/30 flex items-center justify-center text-purple-200">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-mono text-purple-300/70">helpdesk@poso.local</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Carousel Navigation Buttons & Dots */}
      <div className="mt-12 flex items-center gap-5">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous Staff Member"
          className="w-12 h-12 rounded-full bg-[#180536] hover:bg-[#250854] border border-purple-500/30 text-white flex items-center justify-center shadow-lg transition-all active:scale-95"
        >
          <ChevronLeft className="w-6 h-6 text-purple-200" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next Staff Member"
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#EC4899] to-[#8B5CF6] hover:from-[#F43F5E] hover:to-[#A855F7] text-white flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all active:scale-95"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center gap-2 ml-3">
          {teamMembers.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === currentIndex % teamMembers.length
                  ? 'w-7 bg-gradient-to-r from-pink-400 to-purple-400 shadow-[0_0_8px_#EC4899]'
                  : 'w-2.5 bg-purple-600/40 hover:bg-purple-400/60'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
