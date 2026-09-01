import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, Clock, CheckCircle2, Headphones } from 'lucide-react';

export const PosoStatsBar: React.FC = () => {
  const navigate = useNavigate();
  const [quickTicketId, setQuickTicketId] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTicketId.trim()) {
      navigate(`/track?id=${encodeURIComponent(quickTicketId.trim())}`);
    } else {
      navigate('/track');
    }
  };

  const stats = [
    {
      id: 'resolved',
      value: '1,284+',
      label: 'TIKET TERSELESAIKAN',
      subtext: 'Bulan Ini',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />
    },
    {
      id: 'response',
      value: '< 15 Mnt',
      label: 'RATA-RATA RESPON SLA',
      subtext: 'Standar Layanan',
      icon: <Clock className="w-4 h-4 text-amber-400" />
    },
    {
      id: 'satisfaction',
      value: '99.4%',
      label: 'TINGKAT KEPUASAN',
      subtext: 'Survei Sivitas',
      icon: <ShieldCheck className="w-4 h-4 text-pink-400" />
    },
    {
      id: 'upt',
      value: '6 Unit',
      label: 'UPT TERINTEGRASI',
      subtext: 'Jaringan & Fisik',
      icon: <Headphones className="w-4 h-4 text-sky-400" />
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
      {/* Outer Card with Neon Multi-gradient Border */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative rounded-3xl p-[1.8px] bg-gradient-to-r from-[#F59E0B] via-[#EC4899] to-[#A855F7] shadow-[0_0_40px_rgba(236,72,153,0.3)] group"
      >
        {/* Glow backdrop */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#F59E0B] via-[#EC4899] to-[#A855F7] rounded-3xl blur-md opacity-40 group-hover:opacity-65 transition-opacity pointer-events-none" />

        {/* Card Body */}
        <div className="relative rounded-[22px] bg-[#12052b]/95 backdrop-blur-xl px-6 sm:px-10 py-6 sm:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {stats.map((stat, index) => (
              <div 
                key={stat.id} 
                className={`flex flex-col items-center justify-center text-center ${index > 0 ? 'pt-4 lg:pt-0 lg:pl-6' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl sm:text-2xl lg:text-3xl text-white tracking-tight font-sans">
                    {stat.value}
                  </span>
                  {stat.icon}
                </div>

                <div className="mt-2 flex items-center gap-1.5">
                  <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-purple-200/60">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Ticket Tracker Bar */}
          <form 
            onSubmit={handleQuickSearch}
            className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs"
          >
            <div className="flex items-center gap-2 text-purple-300/80 font-mono text-[11px] sm:text-xs w-full sm:w-auto flex-1 max-w-xl">
              <span className="text-pink-400 font-bold uppercase whitespace-nowrap">Lacak Tiket Instan:</span>
              <div className="relative w-full">
                <input
                  type="text"
                  value={quickTicketId}
                  onChange={(e) => setQuickTicketId(e.target.value)}
                  placeholder="Ketik ID Tiket, contoh: TICK-20260831-ABCD"
                  className="w-full bg-black/40 px-3.5 py-2 pl-9 rounded-xl border border-purple-500/30 text-white placeholder:text-purple-300/40 text-xs font-mono outline-none focus:border-pink-400 transition-colors"
                />
                <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap active:scale-95"
              >
                <span>Cek Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-semibold text-purple-300/60 ml-auto">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live Monitoring 24/7
              </span>
              <span>•</span>
              <span className="text-amber-300/90 font-mono">Google Workspace Encrypted</span>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
